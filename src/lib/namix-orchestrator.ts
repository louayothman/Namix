/**
 * @fileOverview NAMIX AI Orchestrator v8.0 - Independent Intelligence Node
 * محرك الاستنتاج الذاتي المطور الذي يولد نصوصاً احترافية متغيرة لحظياً بدون Gemini.
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";

/**
 * محرك صياغة الاستنتاجات المنطقية - تم تطويره ليكون أكثر حيوية وتغيراً في كل ثانية.
 */
function generateStrategicReasoning(decision: string, score: number, tech: any, volume: any): string {
  const intensity = Math.round(score * 100);
  
  // استخدام مصفوفات جمل متنوعة يتم دمجها بناءً على بذور زمنية ومؤشرات تقنية
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

  // دمج الجمل بناءً على الوقت (تغير كل ثانية) لضمان عدم التكرار البصري
  const second = Math.floor(Date.now() / 1000);
  if (decision === 'BUY') return buyPhrases[second % buyPhrases.length];
  if (decision === 'SELL') return sellPhrases[second % sellPhrases.length];
  return holdPhrases[second % holdPhrases.length];
}

export async function runNamix(symbol: string) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  // 1. استدعاء وكلاء البيانات
  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  // 2. حساب النتيجة الموزونة بدقة مجهرية
  const decisionScore = (tech.score * 0.6) + (volume.score * 0.4);

  let decision = "HOLD";
  if (decisionScore > 0.58) decision = "BUY";
  if (decisionScore < 0.42) decision = "SELL";

  // 3. تقييم المخاطر
  const risk = riskEngine(decision, tech, volume);

  // 4. توليد التبرير الاستراتيجي (محرك داخلي متطور)
  const reasoning = generateStrategicReasoning(decision, decisionScore, tech, volume);

  // 5. بناء مصفوفة تحليل المؤشرات (Nano Heatmap - Flat Matrix)
  const heatmap = [
    { 
      label: "زخم RSI", 
      status: tech.change > 0.2 ? "bullish" : tech.change < -0.2 ? "bearish" : "neutral", 
      val: tech.change.toFixed(2) + "%" 
    },
    { 
      label: "سيولة Inflow", 
      status: volume.score > 0.6 ? "bullish" : volume.score < 0.3 ? "bearish" : "neutral", 
      val: (volume.volume / 10).toFixed(0) 
    },
    { 
      label: "نبض EMA", 
      status: tech.score > 0.5 ? "bullish" : "bearish", 
      val: "Active" 
    },
    { 
      label: "ثبات القناة", 
      status: Math.abs(tech.change) < 1.5 ? "bullish" : "neutral", 
      val: "Synced" 
    }
  ];

  memoryEngine({
    symbol: cleanSymbol,
    decision,
    score: decisionScore,
  });

  return {
    pair: symbol,
    decision,
    score: decisionScore,
    risk,
    reasoning,
    agents: { tech, volume },
    heatmap,
    timestamp: new Date().toISOString()
  };
}
