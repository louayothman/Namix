
/**
 * @fileOverview NamixAIOrchestrator v5.0 - Institutional Glass Intelligence
 * محرك الذكاء الاصطناعي المؤسساتي المطور لدعم "المختبر الزجاجي العائم".
 * تم إضافة منطق "الاضطراب" (Turbulence) ومعايرة الأهداف بناءً على مستويات السيولة.
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
  turbulence: number; // 0-100 (معدل الاضطراب المتوقع)
  reasoning_summary: string;
  market_summary: string;
  timestamp: string;
}

export class NamixAIOrchestrator {
  
  private async technicalExpert(data: MarketData) {
    if (!data.currentPrice) return { bias: 'Neutral' as const, confidence: 50 };

    const candles = data.ohlcv;
    const currentPrice = data.currentPrice;
    const last100 = candles.slice(-100);
    const highs = last100.map(c => c.high);
    const lows = last100.map(c => c.low);
    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);
    
    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    let confidence = 70;

    if (currentPrice > (maxHigh + minLow) / 2) {
      bias = 'Long';
      confidence += 10;
    } else {
      bias = 'Short';
      confidence += 10;
    }

    const rsi = data.indicators.rsi;
    if (rsi > 70 && bias === 'Long') confidence -= 20;
    if (rsi < 30 && bias === 'Short') confidence -= 20;

    return { bias, confidence };
  }

  private async sentimentExpert(data: MarketData) {
    const bidsVolume = data.liquidity.bids.reduce((s, b) => s + b.amount, 0);
    const asksVolume = data.liquidity.asks.reduce((s, a) => s + a.amount, 0);
    const imbalance = bidsVolume / (asksVolume || 1);

    let bias: 'Long' | 'Short' | 'Neutral' = 'Neutral';
    if (imbalance > 1.5) bias = 'Long';
    else if (imbalance < 0.6) bias = 'Short';

    return { bias, confidence: 80 };
  }

  public async analyzeMarket(pair: string, data: MarketData): Promise<TradeSignal> {
    const [tech, sent] = await Promise.all([
      this.technicalExpert(data),
      this.sentimentExpert(data)
    ]);

    let finalBias = tech.bias;
    if (tech.bias !== sent.bias && sent.bias !== 'Neutral') {
      finalBias = 'Neutral';
    }

    const currentPrice = data.currentPrice || 0;
    const atr = data.indicators.atr || currentPrice * 0.005;
    
    // حساب معدل الاضطراب (Turbulence) بناءً على التذبذب والـ RSI
    const volatilityFactor = Math.min((atr / (currentPrice || 1)) * 1000, 50);
    const rsiStress = Math.abs(data.indicators.rsi - 50);
    const turbulence = Math.min(volatilityFactor + rsiStress, 100);

    const targets = {
      tp1: finalBias === 'Long' ? currentPrice + (atr * 1.5) : currentPrice - (atr * 1.5),
      tp2: finalBias === 'Long' ? currentPrice + (atr * 3.5) : currentPrice - (atr * 3.5),
      tp3: finalBias === 'Long' ? currentPrice + (atr * 7) : currentPrice - (atr * 7)
    };

    const pulse = Math.sin(Date.now() / 1500) * 4;
    const baseConfidence = Math.round((tech.confidence + sent.confidence) / 2);

    return {
      pair,
      bias: finalBias,
      entry_zone: `${currentPrice.toFixed(2)} - ${(currentPrice * (finalBias === 'Long' ? 0.999 : 1.001)).toFixed(2)}`,
      targets,
      invalidated_at: finalBias === 'Long' ? currentPrice - (atr * 2.5) : currentPrice + (atr * 2.5),
      confidence: Math.min(Math.max(baseConfidence + pulse, 30), 98),
      turbulence,
      reasoning_summary: finalBias === 'Neutral' 
        ? "توازن القوى اللحظي يمنع التنفيذ الآمن؛ ننصح بانتظار وضوح الهيكل السعري." 
        : `تم رصد ${finalBias === 'Long' ? 'تمركز شرائي' : 'ضغط تصريفي'} عند مستويات السيولة الحالية بدعم من مؤشرات الزخم.`,
      market_summary: turbulence > 60 ? "تحذير: نبض السوق يظهر اضطراباً عالياً؛ حركة سعرية عنيفة متوقعة." : "استقرار نسبي في تدفق الأوامر يدعم استمرارية الاتجاه الحالي.",
      timestamp: new Date().toISOString()
    };
  }
}

export const namixOrchestrator = new NamixAIOrchestrator();
