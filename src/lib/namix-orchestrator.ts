
/**
 * @fileOverview محرك التحليل الاستنتاجي المطور v7.0 - Professional Signal Engine
 * يقوم بتوليد بيانات إشارة متكاملة تشمل الأهداف، وقف الخسارة، وتحليل المخاطر.
 * تم تطهير اللغة من المصطلحات المرفوضة وضمان توافق المفاتيح مع واجهة العرض.
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

  let decision: 'BUY' | 'SELL' | 'HOLD' = "HOLD";
  if (decisionScore > 0.505) decision = "BUY";
  else if (decisionScore < 0.495) decision = "SELL";

  const confidence = Math.round(decisionScore * 100);

  // إطلاق تنبيه إشارة التداول إذا تجاوزت الثقة 60%
  if (userId && confidence >= 60 && decision !== 'HOLD') {
    sendAISignalNotification(userId, cleanSymbol, confidence, decision).catch(() => {});
  }

  const risk = riskEngine(decision, tech, volume);
  const currentPrice = tech.last;
  const volatility = tech.high - tech.low;
  const atrProxy = volatility * 0.25;

  // هندسة الأهداف الاستراتيجية (Targets Architecture)
  const isLong = decision === 'BUY';
  const targets = {
    tp1: isLong ? currentPrice + (atrProxy * 1.5) : currentPrice - (atrProxy * 1.5),
    tp2: isLong ? currentPrice + (atrProxy * 3.5) : currentPrice - (atrProxy * 3.5),
    tp3: isLong ? currentPrice + (atrProxy * 7.0) : currentPrice - (atrProxy * 7.0),
    sl: isLong ? currentPrice - (atrProxy * 2.5) : currentPrice + (atrProxy * 2.5)
  };

  const entryMin = currentPrice * (isLong ? 0.999 : 1.001);
  const entryMax = currentPrice * (isLong ? 1.001 : 0.999);

  const dialogue = generateVastAgentDialogue(decision, tech, volume, decisionScore, duration);
  const reasoning = isLong ? "رصد اختراق إيجابي مدعوم بحجم تداول مرتفع عند مستويات الدعم اللحظية." : decision === 'SELL' ? "رفض سعري عند مستويات المقاومة مع زيادة في ضغط التصريف." : "توازن فني في حركة السعر الحالية؛ النظام ينصح بالترقب.";

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
    reasoning,
    dialogue,
    trend: isLong ? "صاعد" : decision === 'SELL' ? "هابط" : "جانبي",
    volume: volume.score > 0.7 ? "عالي" : volume.score > 0.4 ? "متوسط" : "منخفض",
    targets,
    entry_range: `${entryMin.toLocaleString(undefined, {minimumFractionDigits: 2})} – ${entryMax.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
    invalidated_at: targets.sl,
    timeframe: duration ? (duration < 3600 ? "سكالبينج" : "إنتراداي") : "تداول يومي",
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
    { agent: "Core", icon: "Cpu", color: "bg-[#002d4d]", message: isBuy ? `تحقق التوافق التقني. التوصية: تنفيذ شراء ${durLabel}.` : isSell ? `تحقق التوافق التقني. التوصية: تنفيذ بيع ${durLabel}.` : `لا يوجد توافق كافٍ في المعطيات حالياً.` }
  ];
}
