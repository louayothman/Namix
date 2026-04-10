
'use server';

/**
 * @fileOverview ALPHA VANTAGE MARKET SYNC v1.1
 * بروتوكول جلب الرموز والبحث المتقدم للأسواق العالمية.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function searchAlphaVantageSymbols(keywords: string) {
  try {
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const apiKey = configSnap.exists() ? configSnap.data().alphaVantageApiKey : null;

    if (!apiKey) {
      return { success: false, error: "مفتاح Alpha Vantage غير متوفر في الإعدادات." };
    }

    if (!keywords || keywords.length < 2) return { success: true, symbols: [] };

    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();

    if (data.Note || data.Information) {
      return { success: false, error: "لقد تجاوزت حد الطلبات المسموح به لـ Alpha Vantage (5 طلبات/دقيقة)." };
    }

    if (!data.bestMatches) return { success: true, symbols: [] };

    const symbols = data.bestMatches.map((m: any) => ({
      symbol: m["1. symbol"],
      name: m["2. name"],
      type: m["3. type"],
      region: m["4. region"],
      currency: m["8. currency"]
    }));

    return { success: true, symbols };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
