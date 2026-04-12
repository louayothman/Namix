
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import { headers } from 'next/headers';

/**
 * @fileOverview NOWPayments Multi-Currency Identity Protocol v8.0
 * تم تحديث محرك توليد الروابط ليستخدم المضيف الفعلي من الـ Headers لضمان دقة الـ IPN.
 */

async function getNPConfig() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return null;
  return configSnap.data();
}

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
      // اكتشاف المضيف الحقيقي لضمان عمل الـ IPN Callback بدقة 100%
      const headersList = await headers();
      const host = headersList.get('host');
      const protocol = host?.includes('localhost') ? 'http' : 'https';
      const callbackUrl = `${protocol}://${host}/api/webhooks/nowpayments`;

      const response = await axios.post(
        'https://api.nowpayments.io/v1/payment',
        {
          price_amount: 1, 
          price_currency: 'usd',
          pay_currency: currencyId,
          order_id: `DEPOSIT_${userId}_${Date.now()}`, // بصمة فريدة للربط الاحتياطي
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
      
      await updateDoc(userRef, {
        [`assignedWallets.${currencyId}`]: address,
        updatedAt: new Date().toISOString()
      });
    }

    // تسجيل في مخطط الربط العالمي لضمان المزامنة اللحظية
    await setDoc(doc(firestore, "wallet_mappings", address.toLowerCase()), {
      userId,
      userName: userData.displayName || "مستثمر",
      currencyId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true, address };
  } catch (e: any) {
    const errorMsg = e.response?.data?.message || e.message;
    return { success: false, error: errorMsg };
  }
}

export async function generateBaseUserWallets(userId: string) {
  const baseCurrencies = ['usdttrc20', 'usdtbsc', 'btc', 'eth', 'sol', 'trx', 'ltc', 'doge'];
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
