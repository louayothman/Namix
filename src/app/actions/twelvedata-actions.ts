
'use server';

/**
 * @fileOverview TWELVE DATA SYMBOL SYNC PROTOCOL v1.0
 * محرك جلب الرموز العالمية للأصول التقليدية (ذهب، نفط، أسهم).
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function getTwelveDataSymbols() {
  try {
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const configData = configSnap.exists() ? configSnap.data() : null;
    
    const apiKey = configData?.twelveDataApiKey;

    if (!apiKey) {
      return { success: false, error: "مفتاح API الخاص بـ Twelve Data غير متوفر في الإعدادات." };
    }

    // جلب قائمة الأصول المتاحة (نركز على الأسهم والعملات الأجنبية والمؤشرات)
    // ملاحظة: Twelve Data لديه عدة نقاط نهاية، سنستخدم /symbols للحصول على القائمة الكاملة
    const response = await fetch(`https://api.twelvedata.com/symbols?apikey=${apiKey}`);
    const data = await response.json();
    
    if (data.status === 'error') {
      return { success: false, error: data.message };
    }

    if (!data.data || !Array.isArray(data.data)) {
      return { success: false, symbols: [] };
    }

    // تصفية الرموز لضمان جودة البيانات (التركيز على الأصول العالمية الشائعة)
    const filtered = data.data
      .filter((s: any) => 
        ['Common Stock', 'Physical', 'Index', 'Forex'].includes(s.type)
      )
      .map((s: any) => ({
        symbol: s.symbol,
        name: s.name,
        currency: s.currency,
        type: s.type,
        exchange: s.exchange
      }));

    return { success: true, symbols: filtered };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
