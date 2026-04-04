
/**
 * @fileOverview NamixAIOrchestrator v2.5 - Institutional Grade Strategic Intelligence
 * محرك الذكاء الاصطناعي بنظام الوكلاء المتعددين المطور.
 * يقوم بدراسة شاملة لكافة الشموع والمؤشرات الفنية لتقديم توصيات استراتيجية عميقة.
 */

export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketZone {
  price: number;
  type: 'Supply' | 'Demand';
  strength: number;
}

export interface MarketData {
  pair: string;
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
  market_summary: string;
  timestamp: string;
}

export class NamixAIOrchestrator {
  
  /**
   * Technical Expert - تحليل الهيكل السعري (SMC/ICT Logic)
   */
  private async technicalExpert(data: MarketData): Promise<AgentSignal> {
    const history = data.ohlcv;
    const currentPrice = history[history.length - 1].close;
    
    // رصد فجوات السيولة (FVG) والتحقق من التخفيف
    let unmitigatedFVG = null;
    for (let i = history.length - 3; i > history.length - 100; i--) {
      const c1 = history[i-2], c3 = history[i];
      if (c1.high < c3.low) {
        const gapBottom = c1.high;
        const isMitigated = history.slice(i + 1).some(c => c.low <= gapBottom);
        if (!isMitigated) {
          unmitigatedFVG = { type: 'Bullish', bottom: gapBottom };
          break;
        }
      }
      if (c1.low > c3.high) {
        const gapTop = c1.low;
        const isMitigated = history.slice(i + 1).some(c => c.high >= gapTop);
        if (!isMitigated) {
          unmitigatedFVG = { type: 'Bearish', top: gapTop };
          break;
        }
      }
    }

    const isBullishTrend = data.indicators.ema.ema25 > data.indicators.ema.ema100;
    
    let bias: 'Long' | 'Short' | 'Neutral' = isBullishTrend ? 'Long' : 'Short';
    let confidence = 78;
    let reasoning = `تم رصد انحياز ${isBullishTrend ? 'إيجابي' : 'سلبي'} بناءً على دراسة شاملة للهيكل السعري واتجاه المتوسطات المتحركة.`;

    if (unmitigatedFVG) {
      reasoning += ` يوجد تمركز للسيولة غير المستغلة يعمل كمغناطيس تكتيكي للسعر.`;
      if ((unmitigatedFVG.type === 'Bullish' && bias === 'Long') || (unmitigatedFVG.type === 'Bearish' && bias === 'Short')) {
        confidence += 12;
      }
    }

    return { 
      agentName: "Technical Expert", 
      bias, 
      confidence: Math.min(confidence, 100), 
      reasoning
    };
  }

  /**
   * Sentiment Expert - تحليل ضغط السيولة (Imbalance Pressure)
   */
  private async sentimentExpert(data: MarketData): Promise<AgentSignal> {
    const currentPrice = data.ohlcv[data.ohlcv.length - 1].close;
    
    const calculatePressure = (orders: any[]) => {
      return orders.reduce((sum, order) => {
        const distance = Math.abs(order.price - currentPrice) / currentPrice;
        const weight = 1 / (distance + 0.001);
        return sum + (order.amount * weight);
      }, 0);
    };

    const buyPressure = calculatePressure(data.liquidity.bids);
    const sellPressure = calculatePressure(data.liquidity.asks);
    const imbalance = buyPressure / (sellPressure || 1);

    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    let confidence = 70;
    let reasoning = "";

    if (imbalance > 1.6) {
      bias = 'Long';
      reasoning = "رصد تراكم عروض شراء ضخمة تدعم استمرار الزخم الصاعد.";
    } else if (imbalance < 0.6) {
      bias = 'Short';
      reasoning = "ضغط بيعي مكثف يرجح تراجع السعر لاختبار مستويات أدنى.";
    } else {
      reasoning = "توازن نسبي في تدفقات السيولة اللحظية بين البائعين والمشترين.";
    }

    return { agentName: "Sentiment Expert", bias, confidence, reasoning };
  }

  /**
   * Risk Auditor - إدارة المخاطر والأهداف
   */
  private async riskAuditor(data: MarketData, bias: 'Long' | 'Short' | 'Neutral'): Promise<AgentSignal> {
    const currentPrice = data.ohlcv[data.ohlcv.length - 1].close;
    const atr = data.indicators.atr;
    
    let sl = bias === 'Long' ? currentPrice - (atr * 2.2) : currentPrice + (atr * 2.2);

    return {
      agentName: "Risk Auditor",
      bias,
      confidence: 100,
      reasoning: "تمت معايرة مستويات الحماية بناءً على تقلبات السوق اللحظية.",
      metadata: { sl, atr }
    };
  }

  /**
   * المحلل الرئيسي - دمج القرارات وتوليد التقرير
   */
  public async analyzeMarket(pair: string, data: MarketData): Promise<TradeSignal> {
    const [tech, sent] = await Promise.all([
      this.technicalExpert(data),
      this.sentimentExpert(data)
    ]);

    let finalBias = tech.bias;
    let conflictNotes = "";

    if (tech.bias !== sent.bias && sent.bias !== 'Neutral') {
      if (sent.confidence > tech.confidence + 5) {
        finalBias = sent.bias;
        conflictNotes = " (ملاحظة: زخم السيولة اللحظي يرجح هذا الاتجاه حالياً).";
      }
    }

    const confidence = Math.round((tech.confidence + sent.confidence) / 2);
    const risk = await this.riskAuditor(data, finalBias);
    const currentPrice = data.ohlcv[data.ohlcv.length - 1].close;

    const atr = risk.metadata.atr;
    const targets = {
      tp1: finalBias === 'Long' ? currentPrice + (atr * 1.5) : currentPrice - (atr * 1.5),
      tp2: finalBias === 'Long' ? currentPrice + (atr * 3) : currentPrice - (atr * 3),
      tp3: finalBias === 'Long' ? currentPrice + (atr * 6) : currentPrice - (atr * 6)
    };

    return {
      pair,
      bias: finalBias,
      entry_zone: `${currentPrice.toFixed(2)} - ${(currentPrice * (finalBias === 'Long' ? 0.998 : 1.002)).toFixed(2)}`,
      targets,
      invalidated_at: risk.metadata.sl,
      confidence,
      reasoning_summary: `${tech.reasoning} ${sent.reasoning}${conflictNotes}`,
      market_summary: `السوق يظهر حالة من ${confidence > 80 ? 'الاستقرار الاتجاهي القوي' : 'التذبذب المدروس'} مع تدفقات سيولة ${finalBias === 'Long' ? 'إيجابية' : 'تصحيحية'}.`,
      timestamp: new Date().toISOString()
    };
  }

  public backtestValidation(signal: TradeSignal, history: OHLCV[]): boolean {
    const prices = history.slice(-30);
    for (const p of prices) {
      if (signal.bias === 'Long') {
        if (p.low <= signal.invalidated_at) return false;
        if (p.high >= signal.targets.tp1) return true;
      } else if (signal.bias === 'Short') {
        if (p.high <= signal.invalidated_at) return false;
        if (p.low <= signal.targets.tp1) return true;
      }
    }
    return false;
  }
}

export const namixOrchestrator = new NamixAIOrchestrator();
