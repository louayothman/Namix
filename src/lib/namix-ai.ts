'use client';

/**
 * @fileOverview NAMIX AI CENTRAL SERVICE v4.0
 * واجهة المحرك المركزي المعزول التي تمد المنصة ببيانات استخباراتية تفاعلية.
 */

import { namixOrchestrator, MarketData, TradeSignal, OHLCV } from "./namix-ai-orchestrator";

export class NamixAI {
  private static instance: NamixAI;
  
  private constructor() {}

  public static getInstance(): NamixAI {
    if (!NamixAI.instance) {
      NamixAI.instance = new NamixAI();
    }
    return NamixAI.instance;
  }

  public async getDeepAnalysis(asset: any, livePrice: number | null): Promise<TradeSignal | null> {
    if (!asset || livePrice === null) return null;

    // توليد بيانات تاريخية (1000 شمعة) للمحرك
    const deepHistory: OHLCV[] = Array.from({ length: 1000 }).map((_, i) => {
      const time = Date.now() - (1000 - i) * 60 * 1000;
      const base = livePrice * (0.98 + (i / 1000) * 0.04);
      return {
        time,
        open: base,
        close: base + (Math.random() - 0.5) * (livePrice * 0.002),
        high: base + (livePrice * 0.003),
        low: base - (livePrice * 0.003),
        volume: 100000
      };
    });

    const currentData: MarketData = {
      pair: asset.code,
      currentPrice: livePrice,
      ohlcv: deepHistory,
      indicators: {
        rsi: 45 + Math.random() * 10,
        macd: { value: 0, signal: 0, hist: 0 },
        bb: { upper: livePrice * 1.02, middle: livePrice, lower: livePrice * 0.98 },
        ema: { ema7: livePrice, ema25: livePrice * 0.99, ema100: livePrice * 0.97 },
        atr: livePrice * 0.012
      },
      liquidity: {
        bids: Array.from({ length: 5 }).map((_, i) => ({ price: livePrice * (1 - i * 0.001), amount: Math.random() * 10 })),
        asks: Array.from({ length: 5 }).map((_, i) => ({ price: livePrice * (1 + i * 0.001), amount: Math.random() * 10 }))
      }
    };

    return await namixOrchestrator.analyzeMarket(asset.code, currentData);
  }
}

export const namixAI = NamixAI.getInstance();
