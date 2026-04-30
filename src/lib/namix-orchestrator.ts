
/**
 * @fileOverview محرك التحليل الاستنتاجي المطور v8.1 - Property Alignment Fix
 * تم تحديث المحرك ليعيد كلاً من reason و reasoning لضمان التوافق مع كافة المكونات.
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

  if (userId && confidence >= 60 && decision !== 'HOLD') {
    sendAISignalNotification(userId, cleanSymbol, confidence, decision).catch(() => {});
  }

  const risk = riskEngine(decision, tech, volume);
  const currentPrice = tech.last;
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

  // توليد مناظرة الوكلاء (Oracle Debate)
  const dialogue = generateOracleDebate(decision, tech, volume, duration);
  
  const reason = isLong 
    ? "تم رصد زخم شرائي متصاعد مدعوم بتدفقات سيولة إيجابية عند مستويات الدعم الحالية." 
    : decision === 'SELL' 
    ? "رفض سعري واضح عند مناطق المقاومة مع مؤشرات على بدء تصحيح فني." 
    : "Market Equilibrium";

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
    reason,
    reasoning: reason,
    dialogue,
    trend: isLong ? "صاعد" : decision === 'SELL' ? "هابط" : "جانبي",
    volume: volume.score > 0.7 ? "عالي" : volume.score > 0.4 ? "متوسط" : "منخفض",
    targets,
    entry_range: `${entryMin.toLocaleString(undefined, {minimumFractionDigits: 2})} – ${entryMax.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
    invalidated_at: targets.sl,
    timeframe: duration ? (duration < 3600 ? "قصير" : "متوسط") : "يومي",
    agents: { tech, volume },
    timestamp: new Date().toISOString()
  };
}

/**
 * محرك مناظرة الوكلاء (Bull vs Bear Debate)
 */
function generateOracleDebate(decision: string, tech: any, volume: any, duration?: number) {
  const isBuy = decision === "BUY";
  const isSell = decision === "SELL";
  const durLabel = duration ? (duration < 60 ? `${duration} ثانية` : `${Math.floor(duration/60)} دقيقة`) : "الحالية";

  const bullMessages = {
    BUY: "أرى اختراقاً إيجابياً قوياً؛ ضغط الشراء يتزايد والمنحنى يستهدف قمة جديدة.",
    SELL: "رغم الضغط الحالي، إلا أن مستويات الدعم قوية وقد نرى ارتداداً وشيكاً.",
    HOLD: "السعر يبني قاعدة متينة هنا، التجميع الهادئ قد يسبق انطلاقة قوية."
  };

  const bearMessages = {
    BUY: "احذر من فخ شرائي؛ السيولة متذبذبة وقد نرى تصحيحاً خاطفاً قبل الصعود.",
    SELL: "المؤشرات الفنية سلبية تماماً؛ كسر مستويات الدعم يفتح الباب لمزيد من التراجع.",
    HOLD: "الزخم ضعيف جداً؛ لا أنصح بالدخول الآن لتجنب تقلبات المسار العرضي."
  };

  const status = isBuy ? 'BUY' : isSell ? 'SELL' : 'HOLD';

  return [
    { agent: "Bull_Agent", icon: "Zap", color: "bg-emerald-500", message: bullMessages[status] },
    { agent: "Bear_Agent", icon: "Target", color: "bg-red-500", message: bearMessages[status] },
    { agent: "Core_Engine", icon: "Cpu", color: "bg-[#002d4d]", message: isBuy ? `تم التوافق على مسار صعودي لـ ${durLabel}. التنفيذ: شراء.` : isSell ? `تم التوافق على مسار تصحيحي لـ ${durLabel}. التنفيذ: بيع.` : "لا يوجد إجماع كافٍ؛ البقاء في وضع الترقب هو القرار الأكثر أماناً." }
  ];
}
