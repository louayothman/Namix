import axios from "axios";

/**
 * @fileOverview Technical Agent v5.0 - Professional Range & Mean Engine
 * يحلل موقع السعر الحالي بالنسبة للنطاق اليومي والمتوسط المرجح لتحديد الانحياز.
 */

export async function technicalAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const last = parseFloat(res.data.lastPrice);
    const high = parseFloat(res.data.highPrice);
    const low = parseFloat(res.data.lowPrice);
    const change = parseFloat(res.data.priceChangePercent);
    const weightedAvg = parseFloat(res.data.weightedAvgPrice);

    // حساب موقع السعر داخل النطاق اليومي (0 = Low, 1 = High)
    const range = high - low;
    const position = (last - low) / (range || 1);

    // حساب درجة الانحياز الفني:
    // 1. التغير السعري (Momentum)
    // 2. الموقع من النطاق (Overbought/Oversold logic)
    let score = 0.5;
    
    // إذا كان السعر قريباً من القمة (Position > 0.8) -> انحياز للهبوط (Score يقل)
    // إذا كان السعر قريباً من القاع (Position < 0.2) -> انحياز للصعود (Score يزيد)
    score += (0.5 - position) * 0.4; 
    
    // دمج زخم التغير السعري
    score += (change / 20); // كل 5% تغير يضيف 0.25

    return {
      name: "Technical",
      score: Math.max(0.05, Math.min(0.95, score)),
      change,
      last,
      high,
      low,
      weightedAvg
    };
  } catch (error) {
    return { name: "Technical", score: 0.5, change: 0, last: 0, high: 0, low: 0, weightedAvg: 0 };
  }
}
