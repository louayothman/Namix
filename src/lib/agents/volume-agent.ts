import axios from "axios";

/**
 * @fileOverview Volume Agent v4.0 - Liquidity Density Engine
 * يقيس قوة السيولة بناءً على حجم التداول الفعلي مقارنة بعتبات السوق العالية.
 */

export async function volumeAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const volume = parseFloat(res.data.volume);
    
    // معادلة كثافة السيولة: كلما اقترب الحجم من 5000 وحدة، اقترب السكور من 1.
    const score = Math.max(0.1, Math.min(1, volume / 5000));

    return {
      name: "Volume",
      score,
      volume,
    };
  } catch (error) {
    return { name: "Volume", score: 0.5, volume: 0 };
  }
}
