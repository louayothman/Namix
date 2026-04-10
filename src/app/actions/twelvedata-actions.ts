
'use server';

/**
 * @fileOverview TWELVE DATA SYMBOL SYNC PROTOCOL v2.1
 * محرك جلب الرموز العالمية مع معالجة متقدمة للأخطاء والمحدودية والتحقق من صحة الاستجابة.
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
      return { success: false, error: "مفتاح API الخاص بـ Twelve Data غير متوفر في الإعدادات الإدارية." };
    }

    // جلب قائمة الأصول مع معالجة النصوص قبل التحويل لـ JSON
    const response = await fetch(`https://api.twelvedata.com/symbols?apikey=${apiKey}`, {
      cache: 'no-store'
    });
    
    if (response.status === 429) {
      return { success: false, error: "لقد تجاوزت حد الطلبات المسموح به لخطة Twelve Data الحالية (8 طلبات/دقيقة)." };
    }

    const text = await response.text();
    
    // التحقق من أن الاستجابة هي JSON صالح وليست نص خطأ
    if (!text || (!text.startsWith('{') && !text.startsWith('['))) {
      return { success: false, error: "استجابة غير متوقعة من المزود. يرجى التأكد من صلاحية مفتاح الـ API وتجربة رمز مختلف." };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      return { success: false, error: "فشل تحليل البيانات المستلمة من Twelve Data. يرجى الانتظار دقيقة والمحاولة مجدداً." };
    }
    
    if (data.status === 'error') {
      // معالجة الأخطاء المحددة من المزود (مثل عدم توفر اشتراك لأسواق معينة)
      if (data.code === 403) {
        return { success: false, error: "مفتاح الـ API الخاص بك لا يملك صلاحية الوصول لهذه البيانات (يتطلب اشتراكاً مدفوعاً أو تفعيل للخدمة)." };
      }
      return { success: false, error: data.message || "حدث خطأ غير معروف في مزود البيانات." };
    }

    if (!data.data || !Array.isArray(data.data)) {
      return { success: false, symbols: [] };
    }

    // تصفية الرموز وتحديدها بـ 2000 رمز لضمان سرعة الواجهة
    const filtered = data.data
      .filter((s: any) => 
        ['Common Stock', 'Physical', 'Index', 'Forex'].includes(s.type)
      )
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
    console.error("Twelve Data Sync Critical Error:", e);
    return { success: false, error: "حدث عطل في بروتوكول المزامنة: " + (e.message || "خطأ غير متوقع") };
  }
}
