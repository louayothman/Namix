import axios from "axios";

/**
 * @fileOverview Technical Agent v3.0 - Final Structure
 * يحلل التغير السعري خلال 24 ساعة من Binance API.
 */

export async function technicalAgent(symbol: string) {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    );

    const change = parseFloat(res.data.priceChangePercent);
    let score = 0.5;

    if (change > 2) score = 0.8;
    else if (change < -2) score = 0.2;

    return {
      name: "Technical",
      score,
      change,
    };
  } catch (error) {
    return { name: "Technical", score: 0.5, change: 0 };
  }
}
