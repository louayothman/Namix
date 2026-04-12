
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection, setDoc } from 'firebase/firestore';

/**
 * @fileOverview مراقب الإيداع الآلي المطور v5.0 - Robust Multi-Status Sync
 * تم تحسين المنطق لضمان التعرف الفوري والمعالجة الدقيقة لكافة حالات النجاح.
 */

export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  const timestamp = new Date().toISOString();
  
  try {
    const body = await req.text();
    const sig = req.headers.get('x-nowpayments-sig');
    
    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const ipnSecret = configSnap?.data()?.nowPaymentsIpnSecret;

    // 1. بروتوكول التحقق من التوقيع (Signature Validation)
    if (ipnSecret && sig) {
      const hmac = crypto.createHmac('sha512', ipnSecret);
      const parsedBody = JSON.parse(body);
      const sortedBody = JSON.stringify(parsedBody, Object.keys(parsedBody).sort());
      hmac.update(sortedBody);
      const signature = hmac.digest('hex');
      
      if (signature !== sig) {
        // تسجيل محاولة وصول غير مصرح بها للتدقيق الأمني
        await addDoc(collection(firestore, "system_logs"), {
          type: "webhook_security_alert",
          message: "Invalid Webhook Signature detected.",
          payload: body,
          createdAt: timestamp
        });
        return NextResponse.json({ error: 'Unauthorized Signature' }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    const { payment_status, pay_address, actually_paid, pay_currency, payment_id } = data;

    // 2. تصفية الحالات التشغيلية المعتمدة
    const VALID_STATUSES = ['finished', 'confirmed', 'partially_paid'];
    
    if (VALID_STATUSES.includes(payment_status)) {
      
      // البحث في مخطط الربط العالمي (Case-insensitive check)
      const mappingRef = doc(firestore, "wallet_mappings", pay_address.toLowerCase());
      const mappingSnap = await getDoc(mappingRef);
      
      if (mappingSnap.exists()) {
        const { userId, userName } = mappingSnap.data();
        const amount = Number(actually_paid);

        // منع تكرار معالجة نفس العملية (Idempotency Check)
        const processRef = doc(firestore, "processed_payments", payment_id.toString());
        const processSnap = await getDoc(processRef);
        
        if (processSnap.exists()) {
          return NextResponse.json({ ok: true, message: "Payment already processed." });
        }

        // جلب إعدادات مكافآت الإيداع
        const vaultSnap = await getDoc(doc(firestore, "system_settings", "vault_bonus"));
        let bonus = 0;
        let bonusPercent = 0;
        if (vaultSnap.exists()) {
          const bonuses = vaultSnap.data().depositBonuses || [];
          const tier = bonuses.find((t: any) => amount >= t.min && amount <= (t.max || Infinity));
          if (tier) {
            bonusPercent = tier.percent;
            bonus = (amount * bonusPercent) / 100;
          }
        }

        // تنفيذ الإضافة المالية السيادية
        await updateDoc(doc(firestore, "users", userId), {
          totalBalance: increment(amount + bonus),
          updatedAt: timestamp
        });

        // توثيق العملية في سجل الإيداعات
        await addDoc(collection(firestore, "deposit_requests"), {
          userId,
          userName,
          amount,
          approvedAmount: amount,
          bonusApplied: bonus,
          bonusPercent,
          transactionId: payment_id.toString(),
          methodName: `NowPayments (${pay_currency.toUpperCase()})`,
          status: "approved",
          isAutoAudited: true,
          createdAt: timestamp
        });

        // تسجيل العملية كـ "مكتملة" لمنع التكرار
        await setDoc(processRef, {
          userId,
          amount,
          status: payment_status,
          processedAt: timestamp
        });

        // إرسال التنبيه اللحظي للمستثمر
        await addDoc(collection(firestore, "notifications"), {
          userId,
          title: "تم تأكيد الإيداع الآلي ✅",
          message: `تمت مزامنة مبلغ $${amount} مع محفظتك بنجاح ${bonus > 0 ? `بالإضافة لمكافأة $${bonus}` : ''}. القناة: ${pay_currency.toUpperCase()}.`,
          type: "success",
          isRead: false,
          createdAt: timestamp
        });

      } else {
        // تسجيل خطأ: عنوان محفظة غير مرتبط بأي مستخدم
        await addDoc(collection(firestore, "system_logs"), {
          type: "webhook_mapping_error",
          message: `Received payment for unmapped address: ${pay_address}`,
          payload: data,
          createdAt: timestamp
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // تسجيل أي خطأ فني غير متوقع في قاعدة البيانات للمراجعة الإدارية
    await addDoc(collection(firestore, "system_logs"), {
      type: "webhook_runtime_crash",
      error: e.message,
      createdAt: timestamp
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
