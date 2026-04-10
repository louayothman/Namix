
'use server';

/**
 * @fileOverview TWELVE DATA SYMBOL SYNC PROTOCOL v2.3
 * محرك جلب الرموز والأسعار اللحظية مع معالجة متقدمة للأخطاء.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getApiKey() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  return configSnap.exists() ? configSnap.data().twelveDataApiKey : null;
}

export async function getTwelveDataSymbols() {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) {
      return { success: false, error: "مفتاح API الخاص بـ Twelve Data غير متوفر." };
    }

    const response = await fetch(`https://api.twelvedata.com/symbols?apikey=${apiKey}`, {
      cache: 'no-store'
    });
    
    if (response.status === 429) {
      return { success: false, error: "تجاوز حد الطلبات المسموح به (8 طلبات/دقيقة)." };
    }

    const text = await response.text();
    if (!text || (!text.startsWith('{') && !text.startsWith('['))) {
      return { success: false, error: "استجابة غير متوقعة من المزود." };
    }

    let data = JSON.parse(text);
    if (data.status === 'error') return { success: false, error: data.message };
    if (!data.data || !Array.isArray(data.data)) return { success: false, symbols: [] };

    const filtered = data.data
      .filter((s: any) => ['Common Stock', 'Physical', 'Index', 'Forex', 'ETF'].includes(s.type))
      .slice(0, 2000)
      .map((s: any) => ({
        symbol: s.symbol,
        name: s.name,
        currency: s.currency,
        type: s.type,
        exchange: s.exchange
      }));

    return { success: true, symbols: filtered };
  } catch (e: any) {
    return { success: false, error: "عطل في بروتوكول المزامنة." };
  }
}

/**
 * جلب السعر اللحظي من Twelve Data
 */
export async function getTwelveDataPrice(symbol: string) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return { success: false, error: "مفتاح API مفقود." };

    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`,
      { cache: 'no-store' }
    );

    const data = await response.json();
    if (data.status === 'error') return { success: false, error: data.message };

    return {
      success: true,
      price: parseFloat(data.close || data.price),
      changePercent: parseFloat(data.percent_change || 0),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      volume: parseFloat(data.volume || 0)
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
