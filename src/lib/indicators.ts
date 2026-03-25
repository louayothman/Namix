
'use client';
/**
 * @fileOverview NAMIX TECHNICAL INDICATORS ENGINE v4.0 - FULL PRO SPECTRA
 * Optimized calculations for RSI, MACD, Bollinger Bands, ATR, Stochastic, EMA, and SMA.
 */

import { EMA, SMA, RSI, MACD, BollingerBands, ADX, ATR, Stochastic } from "technicalindicators";

export interface OHLC {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Puts undefined at the start of results to match input array length exactly.
 */
function pad(results: any[], totalLength: number): any[] {
  const diff = totalLength - results.length;
  if (diff <= 0) return results;
  const padding = new Array(diff).fill(undefined);
  return padding.concat(results);
}

export function calculateIndicators(data: OHLC[]) {
  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  // 1-3. EMAs
  const ema7 = EMA.calculate({ period: 7, values: closes });
  const ema25 = EMA.calculate({ period: 25, values: closes });
  const ema100 = EMA.calculate({ period: 100, values: closes });

  // 4-5. SMAs
  const sma20 = SMA.calculate({ period: 20, values: closes });
  const sma50 = SMA.calculate({ period: 50, values: closes });

  // 6. RSI
  const rsi = RSI.calculate({ period: 14, values: closes });

  // 7. MACD
  const macd = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });

  // 8. Bollinger Bands
  const bb = BollingerBands.calculate({ period: 20, stdDev: 2, values: closes });

  // 9. ATR
  const atr = ATR.calculate({ period: 14, high: highs, low: lows, close: closes });

  // 10. Stochastic
  const stoch = Stochastic.calculate({
    period: 14,
    signalPeriod: 3,
    high: highs,
    low: lows,
    close: closes
  });

  return {
    ema7: pad(ema7, data.length),
    ema25: pad(ema25, data.length),
    ema100: pad(ema100, data.length),
    sma20: pad(sma20, data.length),
    sma50: pad(sma50, data.length),
    rsi: pad(rsi, data.length),
    macd: pad(macd, data.length),
    bb: pad(bb, data.length),
    atr: pad(atr, data.length),
    stoch: pad(stoch, data.length)
  };
}
