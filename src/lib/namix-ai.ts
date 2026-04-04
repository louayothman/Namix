'use client';

/**
 * @fileOverview NAMIX AI CENTRAL SERVICE v5.0
 * واجهة المحرك المركزي التي تمد المنصة ببيانات استخباراتية تفاعلية تعتمد على العقل المؤسساتي.
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

  /**
   * جلب التحليل العميق للأصل المالي بناءً على 1000 شمعة
   */
  public async getDeepAnalysis(asset: any, livePrice: number | null): Promise<TradeSignal | null> {
    if (!asset || livePrice === null) return null;

    // توليد بيانات تاريخية عميقة (1000 شمعة) لمحاكاة التحليل المؤسساتي
    const deepHistory: OHLCV[] = Array.from({ length: 1000 }).map((_, i) => {
      const time = Date.now() - (1000 - i) * 60 * 1000;
      const base = livePrice * (0.97 + (i / 1000) * 0.06);
      return {
        time,
        open: base,
        close: base + (Math.random() - 0.5) * (livePrice * 0.003),
        high: base + (livePrice * 0.004),
        low: base - (livePrice * 0.004),
        volume: 150000
      };
    });

    const currentData: MarketData = {
      pair: asset.code,
      currentPrice: livePrice,
      ohlcv: deepHistory,
      indicators: {
        rsi: 40 + Math.random() * 20,
        macd: { value: 0, signal: 0, hist: 0 },
        bb: { upper: livePrice * 1.03, middle: livePrice, lower: livePrice * 0.97 },
        ema: { ema7: livePrice, ema25: livePrice * 0.98, ema100: livePrice * 0.96 },
        atr: livePrice * 0.008
      },
      liquidity: {
        bids: Array.from({ length: 10 }).map((_, i) => ({ price: livePrice * (1 - i * 0.0005), amount: Math.random() * 25 })),
        asks: Array.from({ length: 10 }).map((_, i) => ({ price: livePrice * (1 + i * 0.0005), amount: Math.random() * 25 }))
      }
    };

    return await namixOrchestrator.analyzeMarket(asset.code, currentData);
  }
}

export const namixAI = NamixAI.getInstance();
