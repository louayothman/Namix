
'use server';

/**
 * @fileOverview FINNHUB GLOBAL MARKET CONNECTOR v6.0 - WebSocket & Rotation Optimized
 * تم إضافة دعم لجلب التوكنز للمزامنة اللحظية وتحصين طلبات البيانات التاريخية.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * جلب كافة العقد النشطة لمزود معين
 */
async function getActiveNodes(provider: 'finnhub' | 'binance') {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return [];
  
  const data = configSnap.data();
  if (data.nodes && Array.isArray(data.nodes)) {
    return data.nodes.filter((n: any) => n.provider === provider && n.isActive && n.apiKey);
  }
  
  // Fallback for legacy
  if (provider === 'finnhub' && data.finnhubApiKey) {
    return [{ apiKey: data.finnhubApiKey }];
  }
  
  return [];
}

/**
 * جلب قائمة التوكنز النشطة لفتح قنوات الـ WebSocket
 */
export async function getFinnhubTokens() {
  try {
    const nodes = await getActiveNodes('finnhub');
    return { success: true, tokens: nodes.map(n => n.apiKey) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * البحث عن الرموز مع دعم التدوير الآلي عند استنفاد الحد
 */
export async function searchFinnhubSymbols(query: string) {
  try {
    const nodes = await getActiveNodes('finnhub');
    if (nodes.length === 0) return { success: false, error: "لا يوجد مفاتيح Finnhub نشطة." };
    if (!query || query.length < 2) return { success: true, symbols: [] };

    for (const node of nodes) {
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${node.apiKey}`,
        { cache: 'no-store' }
      );

      if (response.status === 429) continue;

      const data = await response.json();
      if (!data.result) return { success: true, symbols: [] };

      const symbols = data.result.map((m: any) => ({
        symbol: m.symbol,
        name: m.description,
        type: m.type,
        displaySymbol: m.displaySymbol
      }));

      return { success: true, symbols };
    }

    return { success: false, error: "تم استنفاد حد الطلبات لكافة المفاتيح." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * جلب السعر اللحظي والإحصائيات الأساسية
 */
export async function getFinnhubPrice(symbol: string) {
  try {
    const nodes = await getActiveNodes('finnhub');
    if (nodes.length === 0) return { success: false, error: "مفاتيح API مفقودة." };

    const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);

    for (const node of shuffledNodes) {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${node.apiKey}`,
        { cache: 'no-store' }
      );

      if (response.status === 429) continue;

      const data = await response.json();
      if (!data.c) continue;

      return {
        success: true,
        price: data.c,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        volume: 0 
      };
    }

    return { success: false, error: "كافة القنوات السعرية مشغولة حالياً." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * جلب البيانات التاريخية (الشموع) من Finnhub مع دعم التدوير والترميز
 */
export async function getFinnhubCandles(symbol: string, resolution: string = '1', from: number, to: number) {
  try {
    const nodes = await getActiveNodes('finnhub');
    if (nodes.length === 0) return { success: false, error: "مفاتيح API مفقودة." };

    // تأمين ترميز الرمز لضمان قبول الرموز المعقدة (مثل الفوركس والذهب)
    const encodedSymbol = encodeURIComponent(symbol);

    for (const node of nodes) {
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodedSymbol}&resolution=${resolution}&from=${from}&to=${to}&token=${node.apiKey}`;
      const response = await fetch(url, { cache: 'no-store' });

      if (response.status === 429) continue;

      const data = await response.json();
      
      if (data.s === 'no_data' || !data.t) {
        // محاولة جلب دقة يومية في حال فشل الدقيقة الواحدة (توفيراً للبيانات)
        if (resolution === '1') {
           const retryRes = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${encodedSymbol}&resolution=D&from=${from}&to=${to}&token=${node.apiKey}`, { cache: 'no-store' });
           const retryData = await retryRes.json();
           if (retryData.s === 'ok') return { success: true, data: formatCandles(retryData) };
        }
        continue;
      }

      if (data.s !== 'ok') continue;

      return { success: true, data: formatCandles(data) };
    }

    return { success: false, error: "تعذر جلب البيانات التاريخية من كافة العقد." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

function formatCandles(data: any) {
  return data.t.map((time: number, i: number) => ({
    time: time,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v[i]
  }));
}
