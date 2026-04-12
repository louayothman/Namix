
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection, setDoc } from 'firebase/firestore';

/**
 * @fileOverview مراقب الإيداع الآلي المطور v8.0 - Official IPN Protocol
 * تم تحديث المنطق ليتوافق تماماً مع متطلبات التوقيع (Sorting) والتحقق الواردة في وثائق NowPayments.
 */

export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  const timestamp = new Date().toISOString();
  
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('x-nowpayments-sig');
    
    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const ipnSecret = configSnap?.data()?.nowPaymentsIpnSecret;

    // 1. بروتوكول التحقق من التوقيع (Official Sorting Logic)
    if (ipnSecret && sig) {
      const data = JSON.parse(rawBody);
      // الفرز الأبجدي للمفاتيح هو متطلب إلزامي في الوثائق لنجاح الـ HMAC
      const sortedKeys = Object.keys(data).sort();
      const sortedData: Record<string, any> = {};
      sortedKeys.forEach(key => {
        sortedData[key] = data[key];
      });

      const hmac = crypto.createHmac('sha512', ipnSecret);
      hmac.update(JSON.stringify(sortedData));
      const signature = hmac.digest('hex');
      
      if (signature !== sig) {
        await addDoc(collection(firestore, "system_logs"), {
          type: "webhook_security_alert",
          message: "Invalid Webhook Signature. Sorting mismatch or wrong secret.",
          createdAt: timestamp
        });
        return NextResponse.json({ error: 'Unauthorized Signature' }, { status: 401 });
      }
    }

    const data = JSON.parse(rawBody);

    // معالجة طلبات الاختبار
    if (data.payment_status === 'test') {
      return NextResponse.json({ ok: true, message: "Test IPN Received" });
    }

    const { payment_status, pay_address, price_amount, pay_currency, payment_id, order_id } = data;

    // 2. الحالات التشغيلية المعتمدة (finished = مكتمل، confirmed = مؤكد، partially_paid = مدفوع جزئياً)
    const VALID_STATUSES = ['finished', 'confirmed', 'partially_paid'];
    
    if (VALID_STATUSES.includes(payment_status)) {
      
      // محاولة التعرف على المستخدم عبر المحفظة أو الـ Order ID (Double Match)
      let userId = null;
      let userName = "مستثمر";

      // البحث عبر العنوان
      const mappingRef = doc(firestore, "wallet_mappings", pay_address.toLowerCase());
      const mappingSnap = await getDoc(mappingRef);
      
      if (mappingSnap.exists()) {
        userId = mappingSnap.data().userId;
        userName = mappingSnap.data().userName;
      } else if (order_id && order_id.startsWith('DEPOSIT_')) {
        // Fallback: استخراج المعرف من الـ Order ID
        userId = order_id.split('_')[1];
      }

      if (userId) {
        const amount = Number(price_amount); // استخدام القيمة بالدولار لضمان دقة الرصيد

        // منع تكرار المعالجة
        const processRef = doc(firestore, "processed_payments", payment_id.toString());
        const processSnap = await getDoc(processRef);
        
        if (processSnap.exists()) {
          return NextResponse.json({ ok: true, message: "Duplicate payment ignored." });
        }

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

        // توثيق المعاملة
        await addDoc(collection(firestore, "deposit_requests"), {
          userId,
          userName,
          amount,
          approvedAmount: amount,
          bonusApplied: bonus,
          transactionId: payment_id.toString(),
          methodName: `NowPayments (${pay_currency.toUpperCase()})`,
          status: "approved",
          isAutoAudited: true,
          createdAt: timestamp
        });

        await setDoc(processRef, { userId, amount, processedAt: timestamp });

        await addDoc(collection(firestore, "notifications"), {
          userId,
          title: "تم تأكيد الإيداع الآلي ✅",
          message: `تمت مزامنة مبلغ $${amount} مع محفظتك بنجاح. القناة: ${pay_currency.toUpperCase()}.`,
          type: "success",
          isRead: false,
          createdAt: timestamp
        });

      } else {
        await addDoc(collection(firestore, "system_logs"), {
          type: "webhook_mapping_error",
          message: `Unmapped payment received for address: ${pay_address}`,
          payload: data,
          createdAt: timestamp
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
