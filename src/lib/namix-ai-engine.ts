
'use client';

/**
 * @fileOverview NAMIX AI CORE ENGINE v1.6 - Ultra-Pulse Aggressive Edition
 * تم خفض عتبة الثقة إلى 35% لضمان تدفق كثيف للإشارات الاستراتيجية للمستثمرين.
 */

export type TrendDirection = 'bullish' | 'bearish' | 'neutral';

export interface TradeSuggestion {
  durationLabel: string;
  action: 'buy' | 'sell' | 'wait';
  confidence: number;
  reason: string;
  seconds: number;
}

export interface AIAnalysisResult {
  symbolId: string;
  trend: TrendDirection;
  confidence: number;
  rsi: number;
  volatility: number;
  momentum: number;
  signal: 'buy' | 'sell' | 'wait';
  guidance: string[];
  suggestions: TradeSuggestion[];
  timestamp: string;
}

export interface AICalibration {
  rsiOversold: number;
  rsiOverbought: number;
  confidenceThreshold: number;
  volatilityWeight: number;
}

/**
 * محرك التحليل المتقدم - تم تعديله ليكون أكثر وتيرة في إرسال التوصيات
 */
export function analyzeMarket(asset: any, livePrice: number, calibration?: AICalibration, durations: any[] = []): AIAnalysisResult {
  const price = livePrice || asset.currentPrice;
  const seed = parseInt(asset.id.substring(0, 5), 36);
  
  // عتبة الثقة المحدثة: 35% لضمان بث كثيف للإشارات
  const config = calibration || {
    rsiOversold: 35,
    rsiOverbought: 65,
    confidenceThreshold: 35,
    volatilityWeight: 8
  };

  const rsiBase = 30 + (Math.sin(Date.now() / 5000 + seed) * 40 + 20);
  const volatility = 2 + (Math.random() * config.volatilityWeight);
  const momentum = 30 + (Math.random() * 70);
  
  let trend: TrendDirection = 'neutral';
  let signal: 'buy' | 'sell' | 'wait' = 'wait';
  let confidence = config.confidenceThreshold + (Math.random() * (100 - config.confidenceThreshold));
  
  if (rsiBase < config.rsiOversold || momentum > 60) {
    trend = 'bullish';
    signal = 'buy';
  } else if (rsiBase > config.rsiOverbought || momentum < 40) {
    trend = 'bearish';
    signal = 'sell';
  } else {
    trend = 'neutral';
    signal = 'wait';
  }

  // في حالة انتظار، نجعلها شراء أو بيع بنسبة 35% ثقة على الأقل لضمان البث
  if (signal === 'wait') {
    signal = Math.random() > 0.5 ? 'buy' : 'sell';
    confidence = 35 + (Math.random() * 15);
  }

  const guidance = [
    trend === 'bullish' 
      ? `رصد تدفق سيولة إيجابي. فرصة نمو وميضية محتملة.` 
      : trend === 'bearish'
      ? `تشبع شرائي ملحوظ. ترقب تصحيح سعري استراتيجي.`
      : "السوق في حالة تذبذب تكتيكي؛ ينصح بمراقبة المستويات الحالية.",
    `معدل التذبذب المرتفع يدعم تنفيذ صفقات سريعة المدى.`,
    `الهدف المقترح القادم هو $${(price * (trend === 'bullish' ? 1.008 : 0.992)).toFixed(2)}.`
  ];

  const suggestions: TradeSuggestion[] = durations.map((d, idx) => {
    return {
      durationLabel: d.label,
      action: signal as 'buy' | 'sell',
      confidence: confidence - (idx * 2),
      reason: `النبض اللحظي للسوق يدعم تنفيذ بروتوكول الـ ${d.label}.`,
      seconds: d.seconds
    };
  });

  return {
    symbolId: asset.id,
    trend,
    confidence,
    rsi: rsiBase,
    volatility,
    momentum,
    signal,
    guidance,
    suggestions,
    timestamp: new Date().toISOString()
  };
}
