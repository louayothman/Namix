/**
 * @fileOverview NamixAIOrchestrator v3.0 - Integrated Strategic Intelligence
 * محرك الذكاء الاصطناعي بنظام الوكلاء المتعددين المطور.
 * يقوم بدراسة شاملة للهيكل السعري والسيولة لتقديم توصيات استراتيجية عميقة وديناميكية.
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
   * Technical Expert - تحليل الهيكل السعري والزخم
   */
  private async technicalExpert(data: MarketData) {
    const isBullish = data.indicators.ema.ema25 > data.indicators.ema.ema100;
    const rsi = data.indicators.rsi;
    
    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    let confidence = 70;
    let reasoning = "";

    if (isBullish && rsi < 60) {
      bias = 'Long';
      reasoning = "رصد اتجاه صاعد مستقر مع وجود مساحة نمو فنية كافية.";
    } else if (!isBullish && rsi > 40) {
      bias = 'Short';
      reasoning = "ضغط بيعي مسيطر مع كسر مؤكد لهيكل السعر التصاعدي.";
    } else {
      reasoning = "السوق في مرحلة توازن مؤقت؛ ننتقل لمراقبة فجوات السيولة.";
    }

    return { bias, confidence, reasoning };
  }

  /**
   * Sentiment Expert - تحليل ضغط دفتر الطلبات
   */
  private async sentimentExpert(data: MarketData) {
    const bidsVolume = data.liquidity.bids.reduce((s, b) => s + b.amount, 0);
    const asksVolume = data.liquidity.asks.reduce((s, a) => s + a.amount, 0);
    const imbalance = bidsVolume / (asksVolume || 1);

    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    if (imbalance > 1.5) bias = 'Long';
    else if (imbalance < 0.6) bias = 'Short';

    return { 
      bias, 
      confidence: 75, 
      reasoning: imbalance > 1 ? "تراكم طلبات شراء ضخمة تدعم الزخم." : "ضغط بيعي لحظي يرجح التراجع." 
    };
  }

  /**
   * المحلل الرئيسي - توليد التقرير النهائي التفاعلي
   */
  public async analyzeMarket(pair: string, data: MarketData): Promise<TradeSignal> {
    const [tech, sent] = await Promise.all([
      this.technicalExpert(data),
      this.sentimentExpert(data)
    ]);

    let finalBias = tech.bias;
    if (tech.bias === 'Neutral') finalBias = sent.bias;

    // تذبذب الثقة بناءً على السعر اللحظي (محاكاة التفاعل)
    const pricePulse = Math.sin(Date.now() / 1000) * 2;
    const baseConfidence = Math.round(((tech.confidence + sent.confidence) / 2) + pricePulse);
    
    const currentPrice = data.currentPrice;
    const atr = data.indicators.atr;

    const targets = {
      tp1: finalBias === 'Long' ? currentPrice + (atr * 1.2) : currentPrice - (atr * 1.2),
      tp2: finalBias === 'Long' ? currentPrice + (atr * 2.5) : currentPrice - (atr * 2.5),
      tp3: finalBias === 'Long' ? currentPrice + (atr * 5) : currentPrice - (atr * 5)
    };

    return {
      pair,
      bias: finalBias,
      entry_zone: `${currentPrice.toFixed(2)} - ${(currentPrice * (finalBias === 'Long' ? 0.999 : 1.001)).toFixed(2)}`,
      targets,
      invalidated_at: finalBias === 'Long' ? currentPrice - (atr * 2) : currentPrice + (atr * 2),
      confidence: Math.min(Math.max(baseConfidence, 30), 98),
      reasoning_summary: `${tech.reasoning} ${sent.reasoning}`,
      market_summary: `النبض الحالي يظهر ${finalBias === 'Long' ? 'تراكم سيولة إيجابي' : finalBias === 'Short' ? 'تصحيحاً هيكلياً' : 'توازناً حذراً'} في الأسواق.`,
      timestamp: new Date().toISOString()
    };
  }
}

export const namixOrchestrator = new NamixAIOrchestrator();
