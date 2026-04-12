
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * @fileOverview مراقب الإيداع الآلي السيادي v12.0 - Outcome Price Logic
 * تم تحديث المنطق ليعتمد على المبلغ النهائي (outcome_amount) كما طلب المستخدم لضمان عدالة الرصيد.
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
      return NextResponse.json({ ok: true });
    }

    const { 
      payment_id, 
      payment_status, 
      pay_amount, 
      actually_paid, 
      price_amount, 
      outcome_amount, // المبلغ النهائي الناتج في الفاتورة
      pay_currency, 
      purchase_id 
    } = data;

    // 2. البحث عن طلب الإيداع المسجل
    const depQuery = query(collection(firestore, "deposit_requests"), where("paymentId", "==", payment_id.toString()), limit(1));
    const depSnap = await getDocs(depQuery);

    if (depSnap.empty) return NextResponse.json({ ok: true });

    const depositDoc = depSnap.docs[0];
    const depositData = depositDoc.data();
    const userId = depositData.userId;

    let newStatus = "pending";
    if (['finished', 'confirmed'].includes(payment_status)) newStatus = "approved";
    if (payment_status === 'failed' || payment_status === 'expired') newStatus = "rejected";
    if (payment_status === 'confirming') newStatus = "confirming";

    // إذا كانت الحالة "approved" ولم يتم معالجتها مسبقاً -> إضافة الرصيد بناءً على Outcome Price
    if (newStatus === "approved" && depositData.status !== "approved") {
      
      // الاعتماد الكلي على Outcome Amount (سعر المخرج) لضمان الدقة كما طلب المستخدم
      // في حال عدم توفره يتم العودة للسعر الأصلي كاحتياط تقني
      const finalAmountUSD = Number(outcome_amount || price_amount);

      // جلب إعدادات مكافآت الإيداع من الخزنة
      const vaultSnap = await getDoc(doc(firestore, "system_settings", "vault_bonus"));
      let bonus = 0;
      let bonusPercent = 0;
      if (vaultSnap.exists()) {
        const bonuses = vaultSnap.data().depositBonuses || [];
        const tier = bonuses.find((t: any) => finalAmountUSD >= t.min && finalAmountUSD <= (t.max || Infinity));
        if (tier) {
          bonusPercent = tier.percent;
          bonus = (finalAmountUSD * bonusPercent) / 100;
        }
      }

      // تحديث رصيد المستخدم بالمبلغ النهائي (Outcome) + المكافأة إن وجدت
      await updateDoc(doc(firestore, "users", userId), {
        totalBalance: increment(finalAmountUSD + bonus),
        updatedAt: timestamp
      });

      // توثيق المعاملة في سجل الإيداعات
      await updateDoc(depositDoc.ref, {
        status: "approved",
        amount: finalAmountUSD,
        approvedAmount: finalAmountUSD,
        bonusApplied: bonus,
        bonusPercent: bonusPercent,
        transactionId: purchase_id || data.payment_id.toString(),
        updatedAt: timestamp
      });

      // إرسال تنبيه تأكيد الإيداع اللحظي
      await addDoc(collection(firestore, "notifications"), {
        userId,
        title: "تم تأكيد الإيداع الآلي ✅",
        message: `تمت مزامنة مبلغ $${finalAmountUSD.toFixed(2)} مع محفظتك بنجاح وفقاً لقيمة الفاتورة النهائية. القناة: ${pay_currency.toUpperCase()}.`,
        type: "success",
        isRead: false,
        createdAt: timestamp
      });
    } else {
      // تحديث الحالة فقط للطلبات غير المكتملة (معلقة، ملغاة، إلخ)
      await updateDoc(depositDoc.ref, { status: newStatus, updatedAt: timestamp });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
