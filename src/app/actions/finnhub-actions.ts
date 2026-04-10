
'use server';

/**
 * @fileOverview FINNHUB GLOBAL MARKET CONNECTOR v3.0 - Load Balanced Edition
 * يدعم الآن تدوير مفاتيح الـ API تلقائياً لتجاوز قيود الطلبات (Rate Limits).
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
 * البحث عن الرموز مع دعم التدوير الآلي عند استنفاد الحد
 */
export async function searchFinnhubSymbols(query: string) {
  try {
    const nodes = await getActiveNodes('finnhub');
    if (nodes.length === 0) return { success: false, error: "لا يوجد مفاتيح Finnhub نشطة." };
    if (!query || query.length < 2) return { success: true, symbols: [] };

    // محاولة الطلب عبر العقد المتاحة بالتوالي في حال الفشل بـ 429
    for (const node of nodes) {
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${node.apiKey}`,
        { cache: 'no-store' }
      );

      if (response.status === 429) {
        console.warn(`Node ${node.label || 'Unknown'} hit rate limit, rotating...`);
        continue; // جرب المفتاح التالي
      }

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

    return { success: false, error: "تم استنفاد حد الطلبات لكافة مفاتيح الـ API المتوفرة." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * جلب السعر اللحظي مع دعم التدوير والتبديل الآلي (Failover)
 */
export async function getFinnhubPrice(symbol: string) {
  try {
    const nodes = await getActiveNodes('finnhub');
    if (nodes.length === 0) return { success: false, error: "مفاتيح API مفقودة." };

    // تدوير عشوائي لتوزيع الحمل (Load Balancing)
    const shuffledNodes = [...nodes].sort(() => Math.random() - 0.5);

    for (const node of shuffledNodes) {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${node.apiKey}`,
        { cache: 'no-store' }
      );

      if (response.status === 429) {
        continue; // التبديل للعقدة التالية فوراً
      }

      const data = await response.json();

      if (!data.c) {
        // إذا كان الرمز غير مدعوم في هذه العقدة أو انتهت البيانات
        continue;
      }

      return {
        success: true,
        price: data.c,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        volume: 0 
      };
    }

    return { success: false, error: "كافة القنوات السعرية مشغولة حالياً (Rate Limit)." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
