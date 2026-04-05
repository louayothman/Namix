import axios from "axios";

/**
 * @fileOverview Volume Agent v3.0 - Final Structure
 * يحلل سيولة الأصل المالي بناءً على حجم التداول الفعلي.
 */

export async function volumeAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const volume = parseFloat(res.data.volume);
    let score = volume > 1000 ? 0.7 : 0.4;

    return {
      name: "Volume",
      score,
      volume,
    };
  } catch (error) {
    return { name: "Volume", score: 0.5, volume: 0 };
  }
}
