
'use client';
import axios from "axios";

/**
 * @fileOverview Volume Agent v1.0
 * Analyzes market liquidity and trading volume.
 */

export async function volumeAgent(symbol: string) {
  try {
    const cleanSymbol = symbol.replace('/', '').toUpperCase();
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${cleanSymbol}`
    );

    const volume = parseFloat(res.data.quoteVolume); // Using quote volume (USDT volume)
    let score = 0.5;

    // Thresholds based on typical high-liquidity assets
    if (volume > 100000000) score = 0.9; // Very High
    else if (volume > 10000000) score = 0.7; // High
    else if (volume < 1000000) score = 0.3; // Low

    return {
      name: "Volume",
      score,
      volume,
    };
  } catch (error) {
    return { name: "Volume", score: 0.5, volume: 0 };
  }
}
