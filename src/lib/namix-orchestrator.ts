/**
 * @fileOverview محرك التحليل والقرار المطور v11.0 - Full Generative Dialogue
 * يدمج بين التحليل التوليدي وإدارة مناقشة محركات NAMIX بشكل مبتكر.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";
import { sendAISignalNotification } from "@/app/actions/notification-actions";
import { generateFallbackAnalysis, generateFallbackDialogue } from "./analysis-templates";
import { generateAILogic } from "@/ai/flows/market-analysis-flow";

export async function runNamix(symbol: string, duration?: number, userId?: string) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  const decisionScore = (tech.score * 0.7) + (volume.score * 0.3);

  let decision: 'BUY' | 'SELL' | 'HOLD' = "HOLD";
  if (decisionScore > 0.505) decision = "BUY";
  else if (decisionScore < 0.495) decision = "SELL";

  const confidence = Math.round(decisionScore * 100);
  const trend = decision === 'BUY' ? "صاعد" : decision === 'SELL' ? "هابط" : "جانبي";
  const currentPrice = tech.last;
  const durLabel = duration ? (duration < 60 ? `${duration} ثانية` : `${Math.floor(duration/60)} دقيقة`) : "اللحظية";

  if (userId && confidence >= 60 && decision !== 'HOLD') {
    sendAISignalNotification(userId, cleanSymbol, confidence, decision).catch(() => {});
  }

  const risk = riskEngine(decision, tech, volume);
  const volatility = tech.high - tech.low;
  const atrProxy = volatility * 0.25;

  const isLong = decision === 'BUY';
  const targets = {
    tp1: isLong ? currentPrice + (atrProxy * 1.5) : currentPrice - (atrProxy * 1.5),
    tp2: isLong ? currentPrice + (atrProxy * 3.5) : currentPrice - (atrProxy * 3.5),
    tp3: isLong ? currentPrice + (atrProxy * 7.0) : currentPrice - (atrProxy * 7.0),
    sl: isLong ? currentPrice - (atrProxy * 2.5) : currentPrice + (atrProxy * 2.5)
  };

  const entryMin = currentPrice * (isLong ? 0.999 : 1.001);
  const entryMax = currentPrice * (isLong ? 1.001 : 0.999);

  // --- محرك التوليد الشامل لناميكس ---
  let finalReason = "";
  let finalDialogue: any[] = [];

  try {
    // محاولة التوليد عبر Gemini لصياغة التحليل والحوار معاً
    const aiResponse = await generateAILogic({
      symbol: cleanSymbol,
      price: currentPrice,
      rsi: Math.round(tech.score * 100),
      confidence,
      decision,
      trend,
      duration: durLabel
    });
    
    finalReason = aiResponse.reasoning;
    finalDialogue = aiResponse.dialogue;
  } catch (e) {
    // محرك الاحتياط في حال فشل Gemini
    finalReason = generateFallbackAnalysis(decision, currentPrice, confidence);
    finalDialogue = generateFallbackDialogue(decision, durLabel);
  }

  memoryEngine({ symbol: cleanSymbol, decision, score: decisionScore });

  return {
    pair: cleanSymbol,
    decision,
    type: isLong ? "LONG" : decision === 'SELL' ? "SHORT" : "NEUTRAL",
    score: decisionScore,
    confidence,
    risk: {
      ...risk,
      label: risk.level === 'LOW' ? 'منخفضة' : risk.level === 'HIGH' ? 'متوسطة' : 'عالية'
    },
    reason: finalReason,
    reasoning: finalReason,
    dialogue: finalDialogue,
    trend,
    volume: volume.score > 0.7 ? "عالي" : volume.score > 0.4 ? "متوسط" : "منخفض",
    targets,
    entry_range: `${entryMin.toLocaleString(undefined, {minimumFractionDigits: 2})} – ${entryMax.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
    invalidated_at: targets.sl,
    timeframe: duration ? (duration < 3600 ? "قصير" : "متوسط") : "يومي",
    agents: { tech, volume },
    timestamp: new Date().toISOString()
  };
}
