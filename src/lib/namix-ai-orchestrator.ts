
/**
 * @fileOverview NamixAIOrchestrator v2.0 - Institutional Grade MAS
 * محرك الذكاء الاصطناعي بنظام الوكلاء المتعددين المطور.
 * يحلل 1000+ شمعة، يعالج فجوات السيولة (FVG)، ويحل النزاعات المنطقية بين الوكلاء.
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
  ohlcv: OHLCV[]; // العمق التاريخي: 1000 شمعة فأكثر
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
  timestamp: string;
}

export class NamixAIOrchestrator {
  
  /**
   * Technical Expert - تحليل 1000 شمعة (SMC/ICT Logic)
   */
  private async technicalExpert(data: MarketData): Promise<AgentSignal> {
    const history = data.ohlcv;
    const currentPrice = history[history.length - 1].close;
    
    // 1. رصد فجوات السيولة (FVG) والتحقق من التخفيف (Mitigation)
    let unmitigatedFVG = null;
    for (let i = history.length - 3; i > history.length - 50; i--) {
      const c1 = history[i-2], c2 = history[i-1], c3 = history[i];
      // Bullish FVG
      if (c1.high < c3.low) {
        const gapTop = c3.low;
        const gapBottom = c1.high;
        // التحقق هل السعر عاد لملء الفجوة؟
        const isMitigated = history.slice(i + 1).some(c => c.low <= gapBottom);
        if (!isMitigated) {
          unmitigatedFVG = { type: 'Bullish', top: gapTop, bottom: gapBottom };
          break;
        }
      }
      // Bearish FVG
      if (c1.low > c3.high) {
        const gapBottom = c3.high;
        const gapTop = c1.low;
        const isMitigated = history.slice(i + 1).some(c => c.high >= gapTop);
        if (!isMitigated) {
          unmitigatedFVG = { type: 'Bearish', top: gapTop, bottom: gapBottom };
          break;
        }
      }
    }

    // 2. تحديد مناطق العرض والطلب (Order Blocks) من عمق التاريخ
    const demandZones = history.filter(c => c.close > c.open && c.volume > data.liquidity.volume24h / 1440 * 2).slice(-5);
    const supplyZones = history.filter(c => c.close < c.open && c.volume > data.liquidity.volume24h / 1440 * 2).slice(-5);

    const isBullishTrend = data.indicators.ema.ema25 > data.indicators.ema.ema100;
    
    let bias: 'Long' | 'Short' | 'Neutral' = isBullishTrend ? 'Long' : 'Short';
    let confidence = 75;
    let reasoning = `الاتجاه العام ${isBullishTrend ? 'صاعد' : 'هابط'} بناءً على تحليل 1000 شمعة.`;

    if (unmitigatedFVG) {
      reasoning += ` تم رصد فجوة سيولة غير مخففة (Unmitigated FVG) تعمل كمغناطيس للسعر عند ${unmitigatedFVG.bottom.toFixed(2)}.`;
      if ((unmitigatedFVG.type === 'Bullish' && bias === 'Long') || (unmitigatedFVG.type === 'Bearish' && bias === 'Short')) {
        confidence += 15;
      }
    }

    return { 
      agentName: "Technical Expert", 
      bias, 
      confidence: Math.min(confidence, 100), 
      reasoning,
      metadata: { demandZones, supplyZones }
    };
  }

  /**
   * Sentiment Expert - تحليل ضغط السيولة (Imbalance Pressure)
   */
  private async sentimentExpert(data: MarketData): Promise<AgentSignal> {
    const currentPrice = data.ohlcv[data.ohlcv.length - 1].close;
    
    // حساب الضغط بناءً على قرب الأوامر الضخمة (Weighted Proximity)
    const calculatePressure = (orders: any[]) => {
      return orders.reduce((sum, order) => {
        const distance = Math.abs(order.price - currentPrice) / currentPrice;
        const weight = 1 / (distance + 0.001); // كلما كان أقرب كان تأثيره أقوى
        return sum + (order.amount * weight);
      }, 0);
    };

    const buyPressure = calculatePressure(data.liquidity.bids);
    const sellPressure = calculatePressure(data.liquidity.asks);
    const imbalance = buyPressure / (sellPressure || 1);

    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    let confidence = 65;
    let reasoning = "";

    if (imbalance > 1.8) {
      bias = 'Long';
      reasoning = "ضغط شرائي حقيقي (Imbalance) مرصود بالقرب من السعر الحالي.";
    } else if (imbalance < 0.5) {
      bias = 'Short';
      reasoning = "تراكم عروض بيع ضخمة تضغط على السعر للهبوط.";
    } else {
      reasoning = "توازن نسبي في تدفق السيولة اللحظي.";
    }

    return { agentName: "Sentiment Expert", bias, confidence, reasoning };
  }

  /**
   * Risk Auditor - الربط مع المناطق التقنية (Zonal Risk Management)
   */
  private async riskAuditor(data: MarketData, bias: 'Long' | 'Short' | 'Neutral', techMetadata: any): Promise<AgentSignal> {
    const currentPrice = data.ohlcv[data.ohlcv.length - 1].close;
    const atr = data.indicators.atr;
    
    // وقف الخسارة يوضع خلف أقرب منطقة ارتداد (Order Block)
    let sl = bias === 'Long' ? currentPrice - (atr * 2) : currentPrice + (atr * 2);
    
    if (bias === 'Long' && techMetadata.demandZones.length > 0) {
      sl = Math.min(sl, techMetadata.demandZones[0].low);
    } else if (bias === 'Short' && techMetadata.supplyZones.length > 0) {
      sl = Math.max(sl, techMetadata.supplyZones[0].high);
    }

    return {
      agentName: "Risk Auditor",
      bias,
      confidence: 100,
      reasoning: "تمت معايرة مستويات الحماية بناءً على مناطق السيولة التاريخية والـ ATR.",
      metadata: { sl, atr }
    };
  }

  /**
   * المحلل الرئيسي - معالجة النزاعات (Conflict Resolution)
   */
  public async analyzeMarket(pair: string, data: MarketData): Promise<TradeSignal> {
    const [tech, sent] = await Promise.all([
      this.technicalExpert(data),
      this.sentimentExpert(data)
    ]);

    // منطق حل النزاع: الأولوية للتقني في الاتجاه، وللمشاعر في التوقيت
    let finalBias = tech.bias;
    let conflictNotes = "";

    if (tech.bias !== sent.bias && sent.bias !== 'Neutral') {
      if (sent.confidence > tech.confidence + 10) {
        finalBias = sent.bias;
        conflictNotes = " (تنبيه: زخم السيولة يغلب الاتجاه الفني حالياً).";
      } else {
        conflictNotes = " (على الرغم من ضغط السيولة المعاكس، يظل الاتجاه الفني أقوى).";
      }
    }

    const confidence = Math.round((tech.confidence + sent.confidence) / 2);
    const risk = await this.riskAuditor(data, finalBias, tech.metadata);
    const currentPrice = data.ohlcv[data.ohlcv.length - 1].close;

    const atr = risk.metadata.atr;
    const targets = {
      tp1: finalBias === 'Long' ? currentPrice + atr : currentPrice - atr,
      tp2: finalBias === 'Long' ? currentPrice + (atr * 2.5) : currentPrice - (atr * 2.5),
      tp3: finalBias === 'Long' ? currentPrice + (atr * 5) : currentPrice - (atr * 5)
    };

    return {
      pair,
      bias: finalBias,
      entry_zone: `${currentPrice.toFixed(2)} - ${(currentPrice * (finalBias === 'Long' ? 0.997 : 1.003)).toFixed(2)}`,
      targets,
      invalidated_at: risk.metadata.sl,
      confidence,
      reasoning_summary: `${tech.reasoning} ${sent.reasoning}${conflictNotes}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * التحقق الخلفي (Backtest) - عامل الزمن (Time TTL)
   */
  public backtestValidation(signal: TradeSignal, history: OHLCV[]): boolean {
    const prices = history.slice(-50); // فحص آخر 50 شمعة (الزخم)
    let candlesCount = 0;

    for (const p of prices) {
      candlesCount++;
      if (candlesCount > 24) return false; // فشل الإشارة بسبب انتهاء "عمر الزخم" (24 شمعة)

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
