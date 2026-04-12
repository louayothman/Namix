
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * @fileOverview مراقب الإيداع الآلي السيادي v10.0 - Official IPN Protocol
 * تم تحديث المنطق ليدعم الربط عبر payment_id ومنع التكرار الجذري.
 */

export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  const timestamp = new Date().toISOString();
  
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('x-nowpayments-sig');
    const data = JSON.parse(rawBody);

    // 1. بروتوكول التحقق من التوقيع (Strict Key Sorting)
    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const ipnSecret = configSnap?.data()?.nowPaymentsIpnSecret;

    if (ipnSecret && sig) {
      const sortedKeys = Object.keys(data).sort();
      const sortedData: Record<string, any> = {};
      sortedKeys.forEach(key => {
        sortedData[key] = data[key];
      });

      const hmac = crypto.createHmac('sha512', ipnSecret);
      hmac.update(JSON.stringify(sortedData));
      const signature = hmac.digest('hex');
      
      if (signature !== sig) {
        return NextResponse.json({ error: 'Unauthorized Signature' }, { status: 401 });
      }
    }

    // معالجة طلبات الاختبار
    if (data.payment_status === 'test') {
      await addDoc(collection(firestore, "system_logs"), { type: "ipn_test_success", message: "Test IPN Received and Verified", createdAt: timestamp });
      return NextResponse.json({ ok: true });
    }

    const { payment_id, payment_status, pay_address, price_amount, pay_currency, purchase_id } = data;

    // 2. البحث عن طلب الإيداع المسجل في النظام
    const depQuery = query(collection(firestore, "deposit_requests"), where("paymentId", "==", payment_id.toString()), limit(1));
    const depSnap = await getDocs(depQuery);

    if (depSnap.empty) {
      await addDoc(collection(firestore, "system_logs"), { type: "ipn_orphan_error", message: `Unmapped payment ID: ${payment_id}`, payload: data, createdAt: timestamp });
      return NextResponse.json({ ok: true });
    }

    const depositDoc = depSnap.docs[0];
    const depositData = depositDoc.data();
    const userId = depositData.userId;

    // 3. تحديث الحالة بناءً على تدفق NowPayments
    // الحالات: waiting, confirming, confirmed, finished, failed, expired, partially_paid
    
    let newStatus = "pending";
    if (['finished', 'confirmed'].includes(payment_status)) newStatus = "approved";
    if (payment_status === 'failed' || payment_status === 'expired') newStatus = "rejected";
    if (payment_status === 'confirming') newStatus = "confirming";

    // إذا كانت الحالة "approved" ولم يتم معالجتها مسبقاً -> إضافة الرصيد
    if (newStatus === "approved" && depositData.status !== "approved") {
      const amount = Number(price_amount);

      // جلب مكافآت الإيداع
      const vaultSnap = await getDoc(doc(firestore, "system_settings", "vault_bonus"));
      let bonus = 0;
      if (vaultSnap.exists()) {
        const bonuses = vaultSnap.data().depositBonuses || [];
        const tier = bonuses.find((t: any) => amount >= t.min && amount <= (t.max || Infinity));
        if (tier) bonus = (amount * tier.percent) / 100;
      }

      // تحديث الرصيد السيادي
      await updateDoc(doc(firestore, "users", userId), {
        totalBalance: increment(amount + bonus),
        updatedAt: timestamp
      });

      // توثيق المعاملة كـ "مكتملة"
      await updateDoc(depositDoc.ref, {
        status: "approved",
        approvedAmount: amount,
        bonusApplied: bonus,
        transactionId: purchase_id || data.payment_id.toString(),
        updatedAt: timestamp
      });

      await addDoc(collection(firestore, "notifications"), {
        userId,
        title: "تم تأكيد الإيداع الآلي ✅",
        message: `تمت مزامنة مبلغ $${amount} مع محفظتك بنجاح. القناة: ${pay_currency.toUpperCase()}.`,
        type: "success",
        isRead: false,
        createdAt: timestamp
      });
    } else {
      // تحديث الحالة فقط (مثل confirming أو rejected)
      await updateDoc(depositDoc.ref, {
        status: newStatus,
        updatedAt: timestamp
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
