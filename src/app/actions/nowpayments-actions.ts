
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';

/**
 * @fileOverview NOWPayments Multi-Currency Identity Protocol v7.0
 * تم إصلاح مشكلة الدومين (undefined) لضمان دقة رابط الـ IPN Callback.
 */

async function getNPConfig() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return null;
  return configSnap.data();
}

/**
 * جلب أو إنشاء عنوان محفظة دائم للمستخدم لعملة وشبكة محددة
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

    let address = assignedWallets[currencyId];

    if (!address) {
      // اكتشاف الدومين الحالي لضمان عمل الـ IPN
      const domain = process.env.NEXT_PUBLIC_DOMAIN || (typeof window !== 'undefined' ? window.location.host : '');
      const callbackUrl = `https://${domain}/api/webhooks/nowpayments`;

      const response = await axios.post(
        'https://api.nowpayments.io/v1/payment',
        {
          price_amount: 1, 
          price_currency: 'usd',
          pay_currency: currencyId,
          order_id: `ADDR_GEN_${userId}_${currencyId}`,
          ipn_callback_url: callbackUrl
        },
        {
          headers: {
            'x-api-key': config.nowPaymentsApiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      address = response.data.pay_address;
      
      // تحديث ملف المستخدم
      await updateDoc(userRef, {
        [`assignedWallets.${currencyId}`]: address,
        updatedAt: new Date().toISOString()
      });
    }

    // تسجيل أو تحديث المحفظة في مخطط الربط العالمي لضمان المزامنة الآلية اللحظية
    await setDoc(doc(firestore, "wallet_mappings", address.toLowerCase()), {
      userId,
      userName: userData.displayName || "مستثمر",
      currencyId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true, address };
  } catch (e: any) {
    const errorMsg = e.response?.data?.message || e.message;
    console.error("NOWPayments Sync Error:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * توليد حزمة المحافظ السيادية الشاملة (15 عملة رئيسية)
 */
export async function generateBaseUserWallets(userId: string) {
  const baseCurrencies = [
    'usdttrc20', 'usdtbsc', 'usdteth', 'btc', 'eth', 'sol', 
    'trx', 'ltc', 'doge', 'shib', 'matic', 'bnbbsc', 'xrp', 'ada', 'dot'
  ];
  
  const results = [];
  for (const curr of baseCurrencies) {
    try {
      const res = await getOrCreateUserWallet(userId, curr);
      results.push({ currency: curr, ...res });
    } catch (e) {
      results.push({ currency: curr, success: false });
    }
  }
  return results;
}
