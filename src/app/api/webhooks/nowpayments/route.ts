
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc } from 'firebase/firestore';

/**
 * @fileOverview NOWPayments IPN Webhook Handler
 * يستقبل إشعارات الدفع ويقوم بحقن الرصيد في حساب المستثمر آلياً.
 */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('x-nowpayments-sig');
    
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const ipnSecret = configSnap.data()?.nowPaymentsIpnSecret;

    // 1. التحقق من صحة التوقيع لضمان أن الطلب قادم من NOWPayments حصراً
    if (ipnSecret && sig) {
      const hmac = crypto.createHmac('sha512', ipnSecret);
      hmac.update(JSON.stringify(JSON.parse(body), Object.keys(JSON.parse(body)).sort()));
      const signature = hmac.digest('hex');
      
      if (signature !== sig) {
        return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    const { payment_status, pay_address, actually_paid, order_id, pay_currency } = data;

    // 2. معالجة العمليات الناجحة فقط (finished)
    if (payment_status === 'finished') {
      // البحث عن المستخدم صاحب هذا العنوان
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("assignedWallets." + pay_currency, "==", pay_address));
      const userSnap = await getDocs(q);

      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const userId = userDoc.id;
        const amount = Number(actually_paid);

        // أ. تحديث رصيد المستخدم فوراً
        await updateDoc(doc(firestore, "users", userId), {
          totalBalance: increment(amount)
        });

        // ب. توثيق عملية الإيداع في السجل التاريخي
        await addDoc(collection(firestore, "deposit_requests"), {
          userId,
          userName: userDoc.data().displayName,
          amount,
          approvedAmount: amount,
          methodName: `Auto-Deposit (${pay_currency.toUpperCase()})`,
          transactionId: data.payment_id || order_id,
          status: "approved",
          isAutoAudited: true,
          createdAt: new Date().toISOString()
        });

        // ج. إرسال تنبيه للمستثمر
        await addDoc(collection(firestore, "notifications"), {
          userId,
          title: "تم استلام الإيداع آلياً ⚡",
          message: `تم التحقق من وصول مبلغ $${amount} إلى محفظتك الخاصة بنجاح. تم تحديث رصيدك الآن.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// دالة مساعدة لـ getDoc داخل الـ Route
async function getDoc(ref: any) {
  const { firestore } = initializeFirebase();
  const snap = await require('firebase/firestore').getDoc(ref);
  return snap;
}
