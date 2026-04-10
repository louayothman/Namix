
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

/**
 * @fileOverview NOWPayments Multi-Currency Identity Protocol v2.0
 * يدعم توليد عناوين فريدة لمختلف العملات والشبكات (USDT-TRC20, USDT-BSC, BTC, ETH).
 */

async function getNPConfig() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return null;
  return configSnap.data();
}

/**
 * جلب أو إنشاء عنوان محفظة دائم للمستخدم لعملة وشبكة محددة
 * @param currencyId المعرف الخاص بـ NOWPayments (مثل: usdttrc20, usdtbsc, btc)
 */
export async function getOrCreateUserWallet(userId: string, currencyId: string) {
  try {
    const { firestore } = initializeFirebase();
    const config = await getNPConfig();
    if (!config?.nowPaymentsApiKey) throw new Error("API Key missing");

    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    const userData = userSnap.data();
    const assignedWallets = userData.assignedWallets || {};

    // إذا كان العنوان موجوداً مسبقاً لهذه العملة تحديداً، أرجعه فوراً
    if (assignedWallets[currencyId]) {
      return { success: true, address: assignedWallets[currencyId] };
    }

    // طلب إنشاء عنوان دفع جديد من البوابة
    const response = await axios.post(
      'https://api.nowpayments.io/v1/payment',
      {
        price_amount: 10, 
        price_currency: 'usd',
        pay_currency: currencyId,
        order_id: `DEP_${userId}_${currencyId}_${Date.now()}`,
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
    
    // حفظ العنوان في مصفوفة محافظ المستخدم
    await updateDoc(userRef, {
      [`assignedWallets.${currencyId}`]: address,
      updatedAt: new Date().toISOString()
    });

    return { success: true, address };
  } catch (e: any) {
    console.error("NOWPayments Multi-Sync Error:", e.response?.data || e.message);
    return { success: false, error: e.message };
  }
}

/**
 * توليد حزمة المحافظ الأساسية للمستخدم بضغطة واحدة
 */
export async function generateBaseUserWallets(userId: string) {
  const baseCurrencies = ['usdttrc20', 'usdtbsc', 'btc', 'eth'];
  const results = [];
  for (const curr of baseCurrencies) {
    results.push(await getOrCreateUserWallet(userId, curr));
  }
  return results;
}
