/**
 * @fileOverview محرك التحليل والقرار المطور v10.0 - Generative & Hybrid Logic
 * يدمج بين التحليل التوليدي (Gemini) ومصفوفة القوالب البديلة لضمان الاستمرارية.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";
import { sendAISignalNotification } from "@/app/actions/notification-actions";
import { generateFallbackAnalysis } from "./analysis-templates";
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

  // --- محرك الوعي التوليدي المزدوج ---
  let finalReason = "";
  try {
    // محاولة التوليد عبر Gemini (المقترح الأول)
    finalReason = await generateAILogic({
      symbol: cleanSymbol,
      price: currentPrice,
      rsi: Math.round(tech.score * 100), // استخدام السكور كدلالة للـ RSI
      confidence,
      decision,
      trend
    });
  } catch (e) {
    // في حال الفشل، نستخدم مصفوفة القوالب (المقترح الثاني)
    finalReason = generateFallbackAnalysis(decision);
  }

  const dialogue = generateEngineDialogue(decision, tech, volume, duration);

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
    reason: finalReason,      // للتوافق مع كود تلغرام
    reasoning: finalReason,   // للتوافق مع كود التطبيق
    dialogue,
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

function generateEngineDialogue(decision: string, tech: any, volume: any, duration?: number) {
  const isBuy = decision === "BUY";
  const isSell = decision === "SELL";
  const durLabel = duration ? (duration < 60 ? `${duration} ثانية` : `${Math.floor(duration/60)} دقيقة`) : "اللحظية";

  const bullMessages = {
    BUY: "أرى اختراقاً إيجابياً قوياً؛ الزخم الشرائي يتزايد والمنحنى يستهدف قمة جديدة.",
    SELL: "رغم الضغط الحالي، إلا أن مستويات القاع متينة وقد نرى ارتداداً فنياً قريباً.",
    HOLD: "السعر يبني قاعدة تجميع هادئة، التمركز الحالي قد يسبق انطلاقة قوية."
  };

  const bearMessages = {
    BUY: "احذر من فخ سعري؛ السيولة غير مستقرة وقد نرى تصحيحاً خاطفاً قبل الصعود.",
    SELL: "المؤشرات الفنية سلبية؛ كسر مستويات الدعم يفتح الباب لمزيد من التراجع.",
    HOLD: "الزخم ضعيف جداً؛ البقاء خارج السوق يجنبنا تقلبات المسار العرضي."
  };

  const status = isBuy ? 'BUY' : isSell ? 'SELL' : 'HOLD';

  return [
    { agent: "وكيل النمو", icon: "Zap", color: "bg-emerald-500", message: bullMessages[status] },
    { agent: "وكيل المخاطر", icon: "Target", color: "bg-red-500", message: bearMessages[status] },
    { agent: "محرك القرار", icon: "Cpu", color: "bg-[#002d4d]", message: isBuy ? `تم التوافق على مسار صعودي للنافذة ${durLabel}. التنفيذ المقترح: شراء.` : isSell ? `تم التوافق على مسار تصحيحي للنافذة ${durLabel}. التنفيذ المقترح: بيع.` : "لا يوجد إجماع كافٍ حالياً؛ نظامنا يفضل التريث لضمان سلامة المحفظة." }
  ];
}
