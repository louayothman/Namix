
/**
 * @fileOverview NamixAIOrchestrator v1.0
 * محرك الذكاء الاصطناعي بنظام الوكلاء المتعددين (Multi-Agent System)
 * يدمج التحليل الفني (SMC/ICT) مع تحليل السيولة والمخاطر.
 */

import { z } from "zod";

// --- الواجهات التقنية (Strict Typing) ---

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
  ohlcv: {
    h1: OHLCV[];
    h4: OHLCV[];
    d1: OHLCV[];
  };
  indicators: {
    rsi: number;
    macd: { value: number; signal: number; hist: number };
    bb: { upper: number; lower: number; middle: number };
    ema: { ema7: number; ema25: number; ema100: number };
    atr: number;
  };
  liquidity: {
    bids: number;
    asks: number;
    volume24h: number;
  };
}

export interface AgentSignal {
  agentName: string;
  bias: 'Long' | 'Short' | 'Neutral';
  confidence: number;
  reasoning: string;
  metadata?: any;
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
  reasoning_summary: string;
  timestamp: string;
}

export class NamixAIOrchestrator {
  
  /**
   * المحلل الفني (Technical Expert Agent)
   * يركز على الاتجاه ومناطق SMC/ICT
   */
  private async technicalExpert(data: MarketData): Promise<AgentSignal> {
    const { h1, h4 } = data.ohlcv;
    const { ema, rsi } = data.indicators;
    
    // تحديد الاتجاه عبر EMAs
    const isBullish = ema.ema25 > ema.ema100;
    const isBearish = ema.ema25 < ema.ema100;
    
    // البحث عن فجوات السيولة (Fair Value Gaps - FVG) في H1
    const lastThree = h1.slice(-3);
    const hasBullishFVG = lastThree[0].high < lastThree[2].low;
    const hasBearishFVG = lastThree[0].low > lastThree[2].high;

    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    let reasoning = "";
    let confidence = 0;

    if (isBullish) {
      bias = 'Long';
      confidence = 70;
      reasoning = "الاتجاه العام صاعد بناءً على تقاطع المتوسطات المتحركة (EMA).";
      if (hasBullishFVG) {
        confidence += 15;
        reasoning += " تم رصد فجوة سيولة (FVG) تدعم استمرار الصعود.";
      }
    } else if (isBearish) {
      bias = 'Short';
      confidence = 70;
      reasoning = "الاتجاه العام هابط؛ ضغط بيعي مستمر تحت المتوسطات الكبرى.";
      if (hasBearishFVG) {
        confidence += 15;
        reasoning += " كسر هيكلي مع وجود فجوة سعرية تدعم الهبوط.";
      }
    }

    // الربط المنطقي: الأولوية للاتجاه حتى لو تشبع RSI
    if (bias === 'Long' && rsi > 70) {
      confidence -= 10;
      reasoning += " تنبيه: مؤشر RSI في منطقة تشبع، ولكن الأولوية للزخم الصاعد.";
    }

    return { agentName: "Technical Expert", bias, confidence, reasoning };
  }

  /**
   * خبير المشاعر والسيولة (Sentiment & Liquidity Agent)
   */
  private async sentimentExpert(data: MarketData): Promise<AgentSignal> {
    const { bids, asks, volume24h } = data.liquidity;
    const volumeRatio = bids / (asks || 1);
    
    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    let confidence = 60;
    let reasoning = "";

    if (volumeRatio > 1.5) {
      bias = 'Long';
      reasoning = "سيولة شرائية ضخمة مرصودة في دفتر الطلبات (Order Book Depth).";
    } else if (volumeRatio < 0.6) {
      bias = 'Short';
      reasoning = "تراكم عروض البيع يشير إلى احتمالية تصريف قريبة.";
    } else {
      reasoning = "توازن في قوى العرض والطلب؛ السيولة مستقرة حالياً.";
    }

    return { agentName: "Sentiment Expert", bias, confidence, reasoning };
  }

  /**
   * مدقق المخاطر (Risk Auditor Agent)
   */
  private async riskAuditor(data: MarketData, bias: 'Long' | 'Short' | 'Neutral'): Promise<AgentSignal> {
    const atr = data.indicators.atr;
    const currentPrice = data.ohlcv.h1[data.ohlcv.h1.length - 1].close;
    
    const stopLossDist = atr * 2; // وضع SL بناءً على ضعف الـ ATR
    const sl = bias === 'Long' ? currentPrice - stopLossDist : currentPrice + stopLossDist;
    
    return {
      agentName: "Risk Auditor",
      bias,
      confidence: 100,
      reasoning: `تم حساب مستويات الحماية بناءً على معدل التذبذب الحقيقي (ATR: ${atr.toFixed(2)}).`,
      metadata: { sl, atr }
    };
  }

  /**
   * الوظيفة الأساسية: تحليل السوق الشامل
   */
  public async analyzeMarket(pair: string, data: MarketData): Promise<TradeSignal> {
    try {
      // تشغيل الوكلاء بالتوازي لضمان السرعة
      const [tech, sent] = await Promise.all([
        this.technicalExpert(data),
        this.sentimentExpert(data)
      ]);

      const signals = [tech, sent];
      const finalBias = this.determineFinalBias(signals);
      const confidence = this.calculateConfidenceScore(signals);
      
      const risk = await this.riskAuditor(data, finalBias);
      const currentPrice = data.ohlcv.h1[data.ohlcv.h1.length - 1].close;

      return this.generateTradeRecommendation(pair, finalBias, confidence, signals, risk, currentPrice);
    } catch (error) {
      throw new Error(`NamixAI Analysis Failed: ${error instanceof Error ? error.message : 'Unknown Error'}`);
    }
  }

  private determineFinalBias(signals: AgentSignal[]): 'Long' | 'Short' | 'Neutral' {
    const longs = signals.filter(s => s.bias === 'Long').length;
    const shorts = signals.filter(s => s.bias === 'Short').length;
    
    if (longs > shorts) return 'Long';
    if (shorts > longs) return 'Short';
    return 'Neutral';
  }

  /**
   * حساب درجة الثقة التراكمية
   */
  public calculateConfidenceScore(signals: AgentSignal[]): number {
    const activeSignals = signals.filter(s => s.bias !== 'Neutral');
    if (activeSignals.length === 0) return 0;
    
    const avg = activeSignals.reduce((sum, s) => sum + s.confidence, 0) / activeSignals.length;
    return Math.min(Math.round(avg), 100);
  }

  /**
   * توليد التوصية النهائية بصيغة JSON نظيفة
   */
  public generateTradeRecommendation(
    pair: string, 
    bias: 'Long' | 'Short' | 'Neutral', 
    confidence: number, 
    signals: AgentSignal[], 
    risk: AgentSignal,
    currentPrice: number
  ): TradeSignal {
    const atr = risk.metadata.atr;
    const sl = risk.metadata.sl;
    
    // حساب الأهداف بناءً على نسب المخاطرة للعائد
    const targets = {
      tp1: bias === 'Long' ? currentPrice + atr : currentPrice - atr,
      tp2: bias === 'Long' ? currentPrice + (atr * 2) : currentPrice - (atr * 2),
      tp3: bias === 'Long' ? currentPrice + (atr * 4) : currentPrice - (atr * 4)
    };

    const reasoning = signals.map(s => s.reasoning).join(" ");

    return {
      pair,
      bias,
      entry_zone: `${currentPrice.toFixed(2)} - ${(currentPrice * (bias === 'Long' ? 0.998 : 1.002)).toFixed(2)}`,
      targets,
      invalidated_at: sl,
      confidence,
      reasoning_summary: reasoning,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * التحقق الخلفي السريع (Backtest Validation)
   */
  public backtestValidation(signal: TradeSignal, history: OHLCV[]): boolean {
    // منطق بسيط للتحقق: هل وصل السعر للهدف الأول قبل ضرب الـ SL في آخر 24 شمعة؟
    const prices = history.slice(-24);
    for (const p of prices) {
      if (signal.bias === 'Long') {
        if (p.low <= signal.invalidated_at) return false;
        if (p.high >= signal.targets.tp1) return true;
      } else if (signal.bias === 'Short') {
        if (p.high >= signal.invalidated_at) return false;
        if (p.low <= signal.targets.tp1) return true;
      }
    }
    return false;
  }
}

export const namixOrchestrator = new NamixAIOrchestrator();
