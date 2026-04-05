
'use client';
import axios from "axios";

/**
 * @fileOverview Technical Agent v1.0
 * Analyzes price change percentages from Binance 24hr ticker.
 */

export async function technicalAgent(symbol: string) {
  try {
    const cleanSymbol = symbol.replace('/', '').toUpperCase();
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${cleanSymbol}`
    );

    const change = parseFloat(res.data.priceChangePercent);
    let score = 0.5;

    if (change > 2) score = 0.8;
    else if (change > 0) score = 0.6;
    else if (change < -2) score = 0.2;
    else if (change < 0) score = 0.4;

    return {
      name: "Technical",
      score,
      change,
    };
  } catch (error) {
    return { name: "Technical", score: 0.5, change: 0 };
  }
}
