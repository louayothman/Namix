import axios from "axios";

/**
 * @fileOverview Technical Agent v6.0 - Nano-Range Reactive Engine
 * تم تحويل المحرك ليحلل آخر 10 شمعات فقط (10 Minutes) لضمان استجابة وميضية لتغيرات السعر.
 */

export async function technicalAgent(symbol: string) {
  try {
    // جلب آخر 10 شمعات بدقة دقيقة واحدة
    const res = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=10`
    );

    const klines = res.data;
    if (!klines || klines.length < 10) throw new Error("بيانات غير كافية");

    const firstCandle = klines[0];
    const lastCandle = klines[klines.length - 1];

    const open = parseFloat(firstCandle[1]);
    const last = parseFloat(lastCandle[4]);
    
    const highs = klines.map((k: any) => parseFloat(k[2]));
    const lows = klines.map((k: any) => parseFloat(k[3]));
    
    const high = Math.max(...highs);
    const low = Math.min(...lows);

    // حساب التغير اللحظي الصافي لآخر 10 دقائق
    const change = ((last - open) / open) * 100;

    // حساب درجة الانحياز بناءً على موقع السعر في النطاق النانوي
    const range = high - low;
    const position = (last - low) / (range || 1);

    // سكور حساس جداً: 0.5 هو التعادل
    let score = 0.5;
    score += (change / 2); // كل 1% تغير لحظي يغير السكور بمقدار 0.5
    score += (0.5 - position) * 0.2; // تصحيح طفيف بناءً على القمة والقاع

    return {
      name: "Technical",
      score: Math.max(0.01, Math.min(0.99, score)),
      change,
      last,
      high,
      low,
      weightedAvg: (high + low + last) / 3
    };
  } catch (error) {
    console.error("Tech Agent Error:", error);
    return { name: "Technical", score: 0.5, change: 0, last: 0, high: 0, low: 0, weightedAvg: 0 };
  }
}
