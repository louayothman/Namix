
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

/**
 * @fileOverview NOWPayments Sovereign Integration Protocol v1.0
 * يدير توليد العناوين الدائمة للمستخدمين والتحقق من الملاءة المالية عبر البوابة.
 */

async function getNPConfig() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return null;
  return configSnap.data();
}

/**
 * جلب أو إنشاء عنوان محفظة دائم للمستخدم لعملة معينة
 */
export async function getOrCreateUserWallet(userId: string, currency: string) {
  try {
    const { firestore } = initializeFirebase();
    const config = await getNPConfig();
    if (!config?.nowPaymentsApiKey) throw new Error("API Key missing");

    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const userData = userSnap.data();
    const assignedWallets = userData.assignedWallets || {};

    // إذا كان العنوان موجوداً مسبقاً، أرجعه فوراً
    if (assignedWallets[currency]) {
      return { success: true, address: assignedWallets[currency] };
    }

    // طلب إنشاء عنوان دفع جديد (Permanent Payment Address)
    // ملاحظة: NOWPayments تتطلب إنشاء "Payment" لجلب عنوان، أو استخدام Custodial API
    // سنستخدم محرك الدفع القياسي الذي يولد عنواناً لكل عملية إيداع لضمان الدقة
    const response = await axios.post(
      'https://api.nowpayments.io/v1/payment',
      {
        price_amount: 10, // مبلغ افتراضي للبدء، سيتحدث آلياً عند الاستلام
        price_currency: 'usd',
        pay_currency: currency,
        order_id: `DEP_${userId}_${Date.now()}`,
        order_description: `Deposit for User ${userId}`,
        ipn_callback_url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/api/webhooks/nowpayments`
      },
      {
        headers: {
          'x-api-key': config.nowPaymentsApiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const address = response.data.pay_address;
    
    // حفظ العنوان في ملف المستخدم للاستخدام المستقبلي
    await updateDoc(userRef, {
      [`assignedWallets.${currency}`]: address,
      updatedAt: new Date().toISOString()
    });

    return { success: true, address };
  } catch (e: any) {
    console.error("NOWPayments Error:", e.response?.data || e.message);
    return { success: false, error: e.message };
  }
}

/**
 * الحصول على قائمة العملات المدعومة من البوابة
 */
export async function getSupportedCurrencies() {
  try {
    const config = await getNPConfig();
    if (!config?.nowPaymentsApiKey) return [];

    const res = await axios.get('https://api.nowpayments.io/v1/currencies?fixed_rate=true', {
      headers: { 'x-api-key': config.nowPaymentsApiKey }
    });
    return res.data.currencies || [];
  } catch (e) {
    return ["usdttrc20", "btc", "eth", "trx"];
  }
}
