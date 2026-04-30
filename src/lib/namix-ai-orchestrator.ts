
/**
 * @fileOverview NamixAIOrchestrator v6.1 - Property Alignment Fix
 * تم تحديث واجهة التخاطب لإعادة الخصائص بالأسماء المتوقعة من واجهة المستخدم.
 */

export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  pair: string;
  currentPrice: number;
  ohlcv: OHLCV[]; 
  indicators: {
    rsi: number;
    macd: { value: number; signal: number; hist: number };
    bb: { upper: number; lower: number; middle: number };
    ema: { ema7: number; ema25: number; ema100: number };
    atr: number;
  };
  liquidity: {
    bids: { price: number; amount: number }[];
    asks: { price: number; amount: number }[];
  };
  timeframes: {
    m1: 'Long' | 'Short' | 'Neutral';
    m15: 'Long' | 'Short' | 'Neutral';
    h1: 'Long' | 'Short' | 'Neutral';
  };
}

export interface RiskScorecard {
  momentum: number;   // 0-100
  liquidity: number;  // 0-100
  volatility: number; // 0-100
}

export interface TradeSignal {
  pair: string;
  bias: 'Long' | 'Short' | 'Neutral';
  entry_zone: string;
  targets: {
    tp1: number;
    tp2: number;
    tp3: number;
  };
  invalidated_at: number;
  confidence: number;
  turbulence: number;
  scorecard: RiskScorecard;
  reasoning: string; // Added for UI compatibility
  reasoning_summary: string;
  market_summary: string;
  timestamp: string;
}

export class NamixAIOrchestrator {
  
  private calculateOrderFlowImbalance(liquidity: MarketData['liquidity']) {
    const totalBids = liquidity.bids.reduce((sum, b) => sum + b.amount, 0);
    const totalAsks = liquidity.asks.reduce((sum, a) => sum + a.amount, 0);
    return {
      ratio: totalBids / (totalAsks || 1),
      strength: Math.min(Math.max((totalBids / (totalBids + totalAsks)) * 100, 0), 100)
    };
  }

  public async analyzeMarket(pair: string, data: MarketData): Promise<TradeSignal> {
    const imbalance = this.calculateOrderFlowImbalance(data.liquidity);
    const tf = data.timeframes;
    
    let finalBias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    const longSignals = [tf.m1, tf.m15, tf.h1].filter(s => s === 'Long').length;
    const shortSignals = [tf.m1, tf.m15, tf.h1].filter(s => s === 'Short').length;

    if (longSignals >= 2 && imbalance.ratio > 1.1) finalBias = 'Long';
    else if (shortSignals >= 2 && imbalance.ratio < 0.9) finalBias = 'Short';

    const currentPrice = data.currentPrice || 0;
    const atr = data.indicators.atr || currentPrice * 0.005;
    
    const scorecard: RiskScorecard = {
      momentum: Math.min(Math.max(Math.abs(data.indicators.rsi - 50) * 2, 30), 98),
      liquidity: Math.round(imbalance.strength),
      volatility: Math.min(Math.max(100 - (atr / currentPrice * 10000), 20), 95)
    };

    const targets = {
      tp1: finalBias === 'Long' ? currentPrice + (atr * 1.5) : currentPrice - (atr * 1.5),
      tp2: finalBias === 'Long' ? currentPrice + (atr * 3.5) : currentPrice - (atr * 3.5),
      tp3: finalBias === 'Long' ? currentPrice + (atr * 7) : currentPrice - (atr * 7)
    };

    const baseConfidence = (scorecard.momentum + scorecard.liquidity + scorecard.volatility) / 3;

    const reasoning = finalBias === 'Neutral' 
        ? "تشتت الإشارات بين الأطر الزمنية يمنع التنفيذ الآمن؛ محرك السيولة يظهر توازناً هشاً بين العرض والطلب." 
        : `تم رصد توافق استراتيجي بين الأطر الزمنية مع ${finalBias === 'Long' ? 'تراكم سيولة شرائية' : 'ضغط تصريفي مكثف'} عند مستويات الطلب الحالية.`;

    return {
      pair,
      bias: finalBias,
      entry_zone: `${currentPrice.toFixed(2)} - ${(currentPrice * (finalBias === 'Long' ? 0.999 : 1.001)).toFixed(2)}`,
      targets,
      invalidated_at: finalBias === 'Long' ? currentPrice - (atr * 2.5) : currentPrice + (atr * 2.5),
      confidence: Math.min(Math.max(baseConfidence, 30), 98),
      turbulence: Math.round(100 - scorecard.volatility),
      scorecard,
      reasoning: reasoning, // Mapping for UI compatibility
      reasoning_summary: reasoning,
      market_summary: scorecard.liquidity > 70 ? "ثبات عالي في جدران السيولة يدعم المسار المقترح." : "سيولة متذبذبة؛ يرجى توخي الحذر من الانزلاقات السعرية الخاطفة.",
      timestamp: new Date().toISOString()
    };
  }
}

export const namixOrchestrator = new NamixAIOrchestrator();
