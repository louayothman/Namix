
/**
 * @fileOverview محرك التحليل الاستنتاجي المطور v5.0
 * ربط إشعارات الذكاء الاصطناعي بنسبة ثقة 60% وفق المعايير المطلوبة.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";
import { sendAISignalNotification } from "@/app/actions/notification-actions";

export async function runNamix(symbol: string, duration?: number, userId?: string) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  const decisionScore = (tech.score * 0.7) + (volume.score * 0.3);

  let decision = "HOLD";
  if (decisionScore > 0.58) decision = "BUY";
  else if (decisionScore < 0.42) decision = "SELL";

  const confidence = Math.round(decisionScore * 100);

  // إطلاق تنبيه إشارة التداول إذا تجاوزت الثقة 60% وكان هناك مستخدم مستهدف
  if (userId && confidence >= 60 && decision !== 'HOLD') {
    sendAISignalNotification(userId, cleanSymbol, confidence, decision).catch(() => {});
  }

  const risk = riskEngine(decision, tech, volume);
  const dialogue = generateVastAgentDialogue(decision, tech, volume, decisionScore, duration);
  const reasoning = generateVastReasoning(decision, tech, volume, duration);

  const currentPrice = tech.last;
  const volatility = tech.high - tech.low;
  const atrProxy = volatility * 0.2;

  const targets = {
    tp1: decision === "BUY" ? 1 + (atrProxy / currentPrice * 0.4) : 1 - (atrProxy / currentPrice * 0.4),
    tp2: decision === "BUY" ? 1 + (atrProxy / currentPrice * 0.9) : 1 - (atrProxy / currentPrice * 0.9),
    tp3: decision === "BUY" ? 1 + (atrProxy / currentPrice * 1.8) : 1 - (atrProxy / currentPrice * 1.8)
  };

  const entryMin = currentPrice * (decision === "BUY" ? 0.9995 : 1.0005);
  const entryMax = currentPrice;

  memoryEngine({ symbol: cleanSymbol, decision, score: decisionScore });

  return {
    pair: symbol,
    decision,
    score: decisionScore,
    risk,
    reasoning,
    dialogue,
    targets,
    entry_zone: `${entryMin.toLocaleString(undefined, {minimumFractionDigits: 2})} - ${entryMax.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
    invalidated_at: decision === "BUY" ? currentPrice - (atrProxy * 1.2) : currentPrice + (atrProxy * 1.2),
    agents: { tech, volume },
    timestamp: new Date().toISOString()
  };
}

function generateVastAgentDialogue(decision: string, tech: any, volume: any, score: number, duration?: number) {
  const isBuy = decision === "BUY";
  const isSell = decision === "SELL";
  const durLabel = duration ? (duration < 60 ? `${duration}ثانية` : `${Math.floor(duration/60)}دقيقة`) : "الحالية";

  const alphaPool = {
    BUY: [`هناك زيادة ملحوظة في مستويات الطلب.`, `تم رصد اتجاه إيجابي في إطار ${durLabel}.`],
    SELL: [`ضغط بيع متزايد في الوقت الحالي.`, `إشارة هبوط محتملة في إطار ${durLabel}.`],
    HOLD: [`توازن في الحركة السعرية دون اتجاه واضح.`, `النظام يراقب مناطق الاستقرار في إطار ${durLabel}.`]
  };

  const status = isBuy ? 'BUY' : isSell ? 'SELL' : 'HOLD';
  const seed = Math.floor(Date.now() / 3000) % 2;
  
  return [
    { agent: "Alpha", icon: "Zap", color: "bg-orange-500", message: alphaPool[status][seed] },
    { agent: "Core", icon: "Cpu", color: "bg-[#002d4d]", message: isBuy ? `تحقق التوافق الفني. التوصية: تنفيذ شراء ${durLabel}.` : isSell ? `تحقق التوافق الفني. التوصية: تنفيذ بيع ${durLabel}.` : `لا يوجد توافق كافٍ. التوصية: الترقب.` }
  ];
}

function generateVastReasoning(decision: string, tech: any, volume: any, duration?: number): string {
  const durLabel = duration ? (duration < 60 ? `${duration}ثانية` : `${Math.floor(duration/60)}دقيقة`) : "الحالية";
  if (decision === 'BUY') return `تحليل البيانات الأخيرة يظهر تحسناً في مستويات الدعم خلال إطار ${durLabel}.`;
  if (decision === 'SELL') return `ضغط تصريفي يظهر في الدقائق الأخيرة نحو مستويات أدنى في إطار ${durLabel}.`;
  return `حالة توازن بين العرض والطلب؛ يفضل الانتظار في إطار ${durLabel}.`;
}
