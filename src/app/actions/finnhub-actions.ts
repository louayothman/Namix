
'use server';

/**
 * @fileOverview FINNHUB GLOBAL MARKET CONNECTOR v1.0
 * بروتوكول جلب الرموز والأسعار اللحظية للأسواق العالمية (أسهم، سلع، فوركس).
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getApiKey() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  return configSnap.exists() ? configSnap.data().finnhubApiKey : null;
}

/**
 * البحث عن الرموز في Finnhub (Stocks, Forex, Crypto)
 */
export async function searchFinnhubSymbols(query: string) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return { success: false, error: "مفتاح Finnhub غير متوفر في الإعدادات." };
    if (!query || query.length < 2) return { success: true, symbols: [] };

    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();
    if (!data.result) return { success: true, symbols: [] };

    const symbols = data.result.map((m: any) => ({
      symbol: m.symbol,
      name: m.description,
      type: m.type,
      displaySymbol: m.displaySymbol
    }));

    return { success: true, symbols };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * جلب السعر اللحظي لرمز معين من Finnhub
 */
export async function getFinnhubPrice(symbol: string) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return { success: false, error: "مفتاح API مفقود." };

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();

    // Finnhub returns 'c' for current price
    if (!data.c) {
      return { success: false, error: "لم يتم العثور على بيانات السعر حالياً." };
    }

    return {
      success: true,
      price: data.c,
      changePercent: data.dp, // daily percent change
      high: data.h,
      low: data.l,
      volume: 0 // Finnhub quote doesn't always have volume
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
