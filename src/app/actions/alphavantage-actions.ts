
'use server';

/**
 * @fileOverview ALPHA VANTAGE MARKET SYNC v1.2
 * بروتوكول جلب الرموز والأسعار اللحظية للأسواق العالمية.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getApiKey() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  return configSnap.exists() ? configSnap.data().alphaVantageApiKey : null;
}

export async function searchAlphaVantageSymbols(keywords: string) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return { success: false, error: "مفتاح Alpha Vantage غير متوفر." };
    if (!keywords || keywords.length < 2) return { success: true, symbols: [] };

    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();
    if (data.Note || data.Information) return { success: false, error: "تجاوز حد الطلبات (5/دقيقة)." };
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

/**
 * جلب السعر اللحظي لرمز معين من Alpha Vantage
 */
export async function getAlphaVantagePrice(symbol: string) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return { success: false, error: "مفتاح API مفقود." };

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();
    const quote = data["Global Quote"];

    if (!quote || !quote["05. price"]) {
      return { success: false, error: "لم يتم العثور على بيانات السعر حالياً." };
    }

    return {
      success: true,
      price: parseFloat(quote["05. price"]),
      changePercent: parseFloat(quote["10. change percent"].replace('%', '')),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      volume: parseFloat(quote["06. volume"])
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
