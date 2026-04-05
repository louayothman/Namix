import axios from "axios";

/**
 * @fileOverview Volume Agent v2.0
 * يحلل سيولة الأصل المالي بناءً على حجم التداول الفعلي.
 */

export async function volumeAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const volume = parseFloat(res.data.quoteVolume); // استخدام حجم USDT (السيولة الفعلية)
    let score = 0.5;

    // معايير تقييم السيولة (عالية، متوسطة، ضعيفة)
    if (volume > 100000000) score = 0.9; 
    else if (volume > 10000000) score = 0.7;
    else if (volume < 1000000) score = 0.3;

    return {
      name: "Volume",
      score,
      volume,
    };
  } catch (error) {
    return { name: "Volume", score: 0.5, volume: 0 };
  }
}
