/**
 * @fileOverview BINANCE REAL-TIME DATAFEED & SOCKET PROVIDER
 * Sovereign connection to global liquidity nodes with support for deep history paging.
 */

import axios from "axios";

export interface BinanceKline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Fetches historical OHLC data (Klines)
 * Enhanced to support deep history paging via startTime.
 */
export async function getHistoricalKlines(
  symbol: string, 
  interval = "1m", 
  limit = 1000,
  startTime?: number
): Promise<BinanceKline[]> {
  try {
    const formattedSymbol = symbol.replace("/", "").toUpperCase();
    let url = `https://api.binance.com/api/v3/klines?symbol=${formattedSymbol}&interval=${interval}&limit=${limit}`;
    
    if (startTime) {
      url += `&startTime=${startTime}`;
    }
    
    const res = await axios.get(url);

    return res.data.map((k: any) => ({
      // CRITICAL: Convert milliseconds to seconds for Lightweight Charts temporal scale
      time: Math.floor(k[0] / 1000), 
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));
  } catch (e) {
    console.error("Historical Data Error:", e);
    return [];
  }
}
