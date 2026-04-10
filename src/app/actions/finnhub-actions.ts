
'use server';

/**
 * @fileOverview FINNHUB GLOBAL MARKET CONNECTOR v2.0
 * Enhanced to support dynamic multi-node API registry.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getActiveApiKey() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return null;
  
  const data = configSnap.data();
  // Try new dynamic node structure
  if (data.nodes && Array.isArray(data.nodes)) {
    const active = data.nodes.find((n: any) => n.provider === 'finnhub' && n.isActive);
    if (active) return active.apiKey;
  }
  
  // Legacy fallback
  return data.finnhubApiKey || null;
}

/**
 * البحث عن الرموز في Finnhub (Stocks, Forex, Crypto)
 */
export async function searchFinnhubSymbols(query: string) {
  try {
    const apiKey = await getActiveApiKey();
    if (!apiKey) return { success: false, error: "مفتاح Finnhub النشط غير متوفر." };
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
    const apiKey = await getActiveApiKey();
    if (!apiKey) return { success: false, error: "مفتاح API النشط مفقود." };

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();

    if (!data.c) {
      return { success: false, error: "لم يتم العثور على بيانات السعر حالياً." };
    }

    return {
      success: true,
      price: data.c,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      volume: 0 
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
