
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import axios from 'axios';
import { headers } from 'next/headers';

/**
 * @fileOverview NOWPayments Unified Protocol v11.0
 * تم تحديث المنطق ليدعم الإيداع المفتوح (Dynamic Amount) عبر نظام المزامنة النسبية.
 */

async function getNPConfig() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return null;
  return configSnap.data();
}

/**
 * إنشاء طلب دفع جديد فريد لهذه المعاملة
 * يستخدم مبلغاً افتراضياً للتوليد، والـ IPN سيعتمد المبلغ الحقيقي المدفوع بالدولار.
 */
export async function createNowPayment(userId: string, currencyId: string, amountUSD: number = 10) {
  try {
    const { firestore } = initializeFirebase();
    const config = await getNPConfig();
    if (!config?.nowPaymentsApiKey) throw new Error("API Key missing");

    const userSnap = await getDoc(doc(firestore, "users", userId));
    if (!userSnap.exists()) throw new Error("User not found");
    const userData = userSnap.data();

    // اكتشاف المضيف الحقيقي للـ Webhook لضمان عدم وجود undefined
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const callbackUrl = `${protocol}://${host}/api/webhooks/nowpayments`;

    const response = await axios.post(
      'https://api.nowpayments.io/v1/payment',
      {
        price_amount: amountUSD,
        price_currency: 'usd',
        pay_currency: currencyId,
        ipn_callback_url: callbackUrl,
        order_id: `DEP_${userId}_${Date.now()}`
      },
      {
        headers: {
          'x-api-key': config.nowPaymentsApiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const paymentData = response.data;

    // تسجيل الطلب في سجل الإيداعات المعلقة فوراً
    const depositRef = await addDoc(collection(firestore, "deposit_requests"), {
      userId,
      userName: userData.displayName || "مستثمر",
      amount: amountUSD,
      requestedAmount: amountUSD,
      paymentId: paymentData.payment_id.toString(),
      transactionId: "WAITING_FOR_PAYMENT",
      payAddress: paymentData.pay_address,
      methodName: `NowPayments (${currencyId.toUpperCase()})`,
      status: "pending",
      isAutoAudited: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { 
      success: true, 
      paymentId: paymentData.payment_id,
      address: paymentData.pay_address,
      amount: paymentData.pay_amount,
      currency: paymentData.pay_currency,
      depositId: depositRef.id
    };
  } catch (e: any) {
    const errorMsg = e.response?.data?.message || e.message;
    return { success: false, error: errorMsg };
  }
}
