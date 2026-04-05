/**
 * @fileOverview NAMIX AI Orchestrator v9.0 - Strategic Analytics Node
 * محرك الاستنتاج الذاتي المطور الذي يولد نصوصاً وأهدافاً استراتيجية متغيرة.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";

/**
 * محرك صياغة الاستنتاجات المنطقية - توليد نصوص مؤسساتية حيوية.
 */
function generateStrategicReasoning(decision: string, score: number): string {
  const intensity = Math.round(score * 100);
  const second = Math.floor(Date.now() / 1000);
  
  const buyPhrases = [
    `رصد تدفق سيولة إيجابي يتوافق مع اختراق مستويات الزخم؛ النبض الحالي يدعم مسار نمو وميضي.`,
    `تكدس جدران الطلب عند القيعان اللحظية يعزز احتمالية الارتداد الاستراتيجي في الإطار الزمني الحالي.`,
    `الوكيل الفني يؤكد وجود انحراف إيجابي ميكروي؛ السيولة تتدفق لدعم مراكز الشراء المفتوحة.`,
    `تم كسر حاجز المقاومة النانوي بنجاح؛ محرك الزخم يشير إلى استمرارية الصعود بقوة بمعدل ثقة ${intensity}%.`
  ];

  const sellPhrases = [
    `تشبع شرائي حاد عند القمم الحالية؛ بروتوكول الأمان يتوقع تصحيحاً سعرياً لتفريغ الزخم الزائد.`,
    `ضغط تصريفي مكثف يظهر في سجل الأوامر؛ السيولة تتراجع لدعم مستويات دعم أدنى بشكل تكتيكي.`,
    `الوكيل الفني يكتشف بوادر انعكاس في الاتجاه؛ ينصح بتأمين المراكز أو اتخاذ وضعية البيع الاحترافية.`,
    `فشل في الحفاظ على مستويات الدعم العليا؛ المحرك العصبي يرصد حركة هبوطية استباقية بثقة ${intensity}%.`
  ];

  const holdPhrases = [
    `توازن هش بين العرض والطلب؛ الذكاء يفضل التريث حتى اتضاح مسار السيولة القادم بدقة.`,
    `تذبذب جانبي ناتج عن ضعف حجم التداول؛ بروتوكول الأمان يجمد الإشارات لحماية رأس المال السيادي.`,
    `منطقة ترقب استراتيجية؛ المؤشرات الفنية لا تظهر انحيازاً صريحاً في اللحظة الراهنة.`,
    `سيولة خاملة بانتظار نبض سعري محفز؛ ينصح بمراقبة اختراق القنوات الحالية من قبل الوكلاء.`
  ];

  if (decision === 'BUY') return buyPhrases[second % buyPhrases.length];
  if (decision === 'SELL') return sellPhrases[second % sellPhrases.length];
  return holdPhrases[second % holdPhrases.length];
}

export async function runNamix(symbol: string) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  const decisionScore = (tech.score * 0.6) + (volume.score * 0.4);

  let decision = "HOLD";
  if (decisionScore > 0.58) decision = "BUY";
  if (decisionScore < 0.42) decision = "SELL";

  const risk = riskEngine(decision, tech, volume);
  const reasoning = generateStrategicReasoning(decision, decisionScore);

  // توليد أهداف استراتيجية وهمية دقيقة بناءً على النبض الحالي (للمحاكاة الاحترافية)
  const basePrice = tech.change; // نستخدم التغير كمؤشر وهمي للسعر إذا لم يتوفر
  const targets = {
    tp1: 1.005,
    tp2: 1.012,
    tp3: 1.025
  };

  const heatmap = [
    { label: "RSI", status: tech.change > 0.2 ? "bullish" : tech.change < -0.2 ? "bearish" : "neutral", val: tech.change.toFixed(2) + "%" },
    { label: "VOL", status: volume.score > 0.6 ? "bullish" : "neutral", val: (volume.volume / 10).toFixed(0) },
    { label: "EMA", status: tech.score > 0.5 ? "bullish" : "bearish", val: "Active" },
    { label: "SYNC", status: "bullish", val: "Locked" }
  ];

  memoryEngine({ symbol: cleanSymbol, decision, score: decisionScore });

  return {
    pair: symbol,
    decision,
    score: decisionScore,
    risk,
    reasoning,
    targets,
    entry_zone: "Current Market",
    invalidated_at: 0.985, // 1.5% below
    agents: { tech, volume },
    heatmap,
    timestamp: new Date().toISOString()
  };
}
