
'use client';

/**
 * @fileOverview NAMIX AI CENTRAL SERVICE v7.0
 * تم تعديل الخدمة لتعمل بذكاء "نانوي" يعتمد على آخر 10 شمعات فقط لضمان الحيوية.
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

    const seed = parseInt(asset.id.substring(0, 5), 36);
    
    // محاكاة آخر 10 شمعات فقط للتحليل النانوي السريع
    const nanoHistory: OHLCV[] = Array.from({ length: 10 }).map((_, i) => {
      const time = Date.now() - (10 - i) * 60 * 1000;
      const base = livePrice * (0.998 + (i / 1000) * 0.004);
      return {
        time,
        open: base,
        close: base + (Math.random() - 0.5) * (livePrice * 0.001),
        high: base + (livePrice * 0.002),
        low: base - (livePrice * 0.002),
        volume: 50000
      };
    });

    const timeframeBiases: ('Long' | 'Short' | 'Neutral')[] = ['Long', 'Short', 'Neutral'];
    const tfIndex = (seed + Math.floor(Date.now() / 15000)) % 3;

    const currentData: MarketData = {
      pair: asset.code,
      currentPrice: livePrice,
      ohlcv: nanoHistory,
      indicators: {
        rsi: 30 + Math.random() * 40,
        macd: { value: 0, signal: 0, hist: 0 },
        bb: { upper: livePrice * 1.01, middle: livePrice, lower: livePrice * 0.99 },
        ema: { ema7: livePrice, ema25: livePrice * 0.995, ema100: livePrice * 0.99 },
        atr: livePrice * 0.002
      },
      liquidity: {
        bids: Array.from({ length: 10 }).map((_, i) => ({ price: livePrice * (1 - i * 0.0002), amount: 5 + Math.random() * 20 })),
        asks: Array.from({ length: 10 }).map((_, i) => ({ price: livePrice * (1 + i * 0.0002), amount: 5 + Math.random() * 20 }))
      },
      timeframes: {
        m1: timeframeBiases[tfIndex],
        m15: timeframeBiases[(tfIndex + 1) % 3],
        h1: timeframeBiases[tfIndex]
      }
    };

    return await namixOrchestrator.analyzeMarket(asset.code, currentData);
  }
}

export const namixAI = NamixAI.getInstance();
