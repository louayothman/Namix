
'use client';

/**
 * @fileOverview NAMIX AI CENTRAL ENGINE v3.0 - MAS Gateway
 * الواجهة المركزية التي تربط المنصة بمحرك الوكلاء المتعددين (Orchestrator).
 */

import { namixOrchestrator, MarketData, TradeSignal } from "./namix-ai-orchestrator";

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
   * إجراء تحليل استخباراتي عميق باستخدام محرك الأوركسترا
   */
  public async getDeepAnalysis(asset: any, livePrice: number | null): Promise<TradeSignal | null> {
    if (!asset || livePrice === null) return null;

    // تحضير البيانات الوهمية للمحرك (في الواقع سيتم جلبها من Binance API)
    const mockData: MarketData = {
      pair: asset.code,
      ohlcv: {
        h1: Array(100).fill({ close: livePrice, high: livePrice * 1.01, low: livePrice * 0.99, open: livePrice, volume: 1000, time: Date.now() }),
        h4: [],
        d1: []
      },
      indicators: {
        rsi: 55, // قيمة افتراضية
        macd: { value: 0.5, signal: 0.2, hist: 0.3 },
        bb: { upper: livePrice * 1.05, middle: livePrice, lower: livePrice * 0.95 },
        ema: { ema7: livePrice, ema25: livePrice * 0.98, ema100: livePrice * 0.95 },
        atr: livePrice * 0.02 // تذبذب بنسبة 2%
      },
      liquidity: {
        bids: 1500000,
        asks: 1200000,
        volume24h: 50000000
      }
    };

    return await namixOrchestrator.analyzeMarket(asset.code, mockData);
  }
}

export const namixAI = NamixAI.getInstance();
