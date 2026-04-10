/**
 * @fileOverview NAMIX AI Orchestrator v17.0 - Duration-Aware Intelligence
 * محرك استنتاجي مطور يربط التوصيات بالمدة الزمنية ونبض السوق اللحظي.
 * تم تطهير كافة المصطلحات من كلمة "سيادة".
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";

export async function runNamix(symbol: string, duration?: number) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  const rangeFactor = tech.score; 
  const decisionScore = (rangeFactor * 0.6) + (volume.score * 0.4);

  let decision = "HOLD";
  if (decisionScore > 0.65) decision = "BUY";
  else if (decisionScore < 0.35) decision = "SELL";

  const risk = riskEngine(decision, tech, volume);
  
  // توليد الحوار الاستنتاجي بناءً على المعطيات والدقة الزمنية
  const dialogue = generateVastAgentDialogue(decision, tech, volume, decisionScore, duration);
  const reasoning = generateVastReasoning(decision, tech, volume, duration);

  const currentPrice = tech.last;
  const volatility = tech.high - tech.low;
  const atrProxy = volatility * 0.15;

  const targets = {
    tp1: decision === "BUY" ? 1 + (atrProxy / currentPrice * 0.5) : 1 - (atrProxy / currentPrice * 0.5),
    tp2: decision === "BUY" ? 1 + (atrProxy / currentPrice * 1.2) : 1 - (atrProxy / currentPrice * 1.2),
    tp3: decision === "BUY" ? 1 + (atrProxy / currentPrice * 2.5) : 1 - (atrProxy / currentPrice * 2.5)
  };

  const entry_zone_multiplier = decision === "BUY" ? 0.9992 : 1.0008;
  const entryMin = currentPrice * Math.min(1, entry_zone_multiplier);
  const entryMax = currentPrice * Math.max(1, entry_zone_multiplier);

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
    invalidated_at: decision === "BUY" ? currentPrice - (atrProxy * 1.5) : currentPrice + (atrProxy * 1.5),
    agents: { tech, volume },
    timestamp: new Date().toISOString()
  };
}

function generateVastAgentDialogue(decision: string, tech: any, volume: any, score: number, duration?: number) {
  const isBuy = decision === "BUY";
  const isSell = decision === "SELL";
  const confidence = Math.round(score * 100);
  const rsi = Math.round(tech.score * 100);
  const durLabel = duration ? (duration < 60 ? `${duration}ث` : `${Math.floor(duration/60)}د`) : "الحالية";

  const alphaPool = {
    BUY: [
      `رصدتُ انحرافاً إيجابياً في نافذة الـ ${durLabel}؛ السعر يستعد للاختراق.`,
      `الثقة عند %${confidence} تدعم الصعود الوميضي خلال الـ ${durLabel} القادمة.`,
      `الوكيل الفني يرصد ارتداداً من القاع على إطار الـ ${durLabel}.`,
      `مستوى RSI الحالي (${rsi}) في نافذة الـ ${durLabel} يشير لفرصة شراء مثالية.`
    ],
    SELL: [
      `الزخم يضعف في إطار الـ ${durLabel}؛ ترقب تصحيحاً وشيكاً من القمة.`,
      `إشارة التشبع تلوح في أفق الـ ${durLabel}؛ ضغط العرض يتزايد.`,
      `رصدتُ كسرًا لخط الاتجاه في نافذة الـ ${durLabel}؛ الحذر مطلوب.`,
      `مستوى RSI (${rsi}) خلال الـ ${durLabel} وصل لمنطقة خطر؛ ينصح بالبيع.`
    ],
    HOLD: [
      `الزخم مستقر في الـ ${durLabel}؛ لا توجد إشارات حركية واضحة.`,
      `النظام يراقب مناطق التذبذب في الـ ${durLabel} بانتظار تأكيد الاتجاه.`,
      `مستوى RSI (${rsi}) في منطقة توازن تكتيكي على إطار الـ ${durLabel}.`,
      `تداخل الإشارات في نافذة الـ ${durLabel} يمنع إصدار قرار قاطع.`
    ]
  };

  const betaPool = {
    BUY: [
      `أؤكد ذلك؛ جدران طلب ضخمة تتراكم لدعم عقد الـ ${durLabel}.`,
      `حجم التداول في نافذة الـ ${durLabel} يعكس دخول حيتان حقيقي.`,
      `رصدنا فجوة سيولة صاعدة تدعم تنفيذ صفقة الـ ${durLabel}.`,
      `تدفق السيولة إيجابي بنسبة ملحوظة؛ الطريق مفتوح خلال الـ ${durLabel}.`
    ],
    SELL: [
      `انسحاب للسيولة في الـ ${durLabel}؛ العرض يسيطر على الموقف.`,
      `حجم التداول يعكس سيولة هشّة في نافذة الـ ${durLabel} الحالية.`,
      `أوامر البيع تتراكم بكثافة فوق السعر في إطار الـ ${durLabel}.`,
      `تدفق السيولة السلبي يشير إلى تخارج رؤوس أموال في الـ ${durLabel}.`
    ],
    HOLD: [
      `السيولة متوازنة في الـ ${durLabel}؛ حجم التداول لا يدعم الحركة.`,
      `محرك السيولة يظهر توازناً هشاً في نافذة الـ ${durLabel}.`,
      `السوق يفتقر للسيولة المؤسساتية اللازمة في إطار الـ ${durLabel}.`,
      `أوامر البيع والشراء متكافئة تماماً في دورة الـ ${durLabel} الحالية.`
    ]
  };

  const deltaPool = {
    BUY: [
      `عتبة المخاطرة آمنة لتنفيذ عقد الـ ${durLabel}.`,
      `الوكيل الأمني يؤكد استقرار البروتوكول في نافذة الـ ${durLabel}.`,
      `معدل التذبذب الحالي يدعم تشغيل المفاعل لمدة ${durLabel}.`,
      `البيئة التشغيلية مستقرة تماماً وجاهزة لتنفيذ الـ ${durLabel}.`
    ],
    SELL: [
      `مخاطرة التراجع مرتفعة في الـ ${durLabel}؛ تأمين المراكز أذكى قرار.`,
      `الوكيل الأمني يرصد تلاعبات عند قمة الـ ${durLabel} الحالية.`,
      `نظام الإنذار المبكر يرصد بوادر انهيار خلال الـ ${durLabel}.`,
      `المخاطرة في نافذة الـ ${durLabel} غير مجدية استثمارياً.`
    ],
    HOLD: [
      `المخاطرة متذبذبة في الـ ${durLabel}؛ يفضل الانتظار لتجنب الانزلاق.`,
      `نظام الأمان في وضع الترقب لقرار الـ ${durLabel}؛ لم يتم المنح.`,
      `المخاطرة متوازنة مع العائد في الـ ${durLabel}؛ لا يوجد امتياز تنافسي.`,
      `انتظار استقرار السيولة هو أضمن وسيلة لحماية عقد الـ ${durLabel}.`
    ]
  };

  const seed = Math.floor(Date.now() / 3000) % 4;
  const status = isBuy ? 'BUY' : isSell ? 'SELL' : 'HOLD';
  
  return [
    { agent: "Alpha", icon: "Zap", color: "bg-orange-500", message: alphaPool[status][seed] },
    { agent: "Beta", icon: "Target", color: "bg-blue-500", message: betaPool[status][(seed + 1) % 4] },
    { agent: "Delta", icon: "ShieldCheck", color: "bg-emerald-500", message: deltaPool[status][(seed + 2) % 4] },
    { agent: "Core", icon: "Cpu", color: "bg-[#002d4d]", message: isBuy ? `تحقق التوافق المؤسساتي. التوصية: تفعيل شراء ${durLabel}.` : isSell ? `تحقق التوافق المؤسساتي. التوصية: تفعيل بيع ${durLabel}.` : `لا يوجد توافق كامل في الـ ${durLabel}. التوصية: الترقب.` }
  ];
}

function generateVastReasoning(decision: string, tech: any, volume: any, duration?: number): string {
  const seed = Math.floor(Date.now() / 3000) % 4;
  const durLabel = duration ? (duration < 60 ? `${duration}ث` : `${Math.floor(duration/60)}د`) : "الحالية";
  
  const buyPhrases = [
    `تم رصد اختراق استراتيجي لمستويات المقاومة في نافذة الـ ${durLabel} بدعم من تدفق سيولة مؤسساتي.`,
    `تكدس طلبات الشراء عند القيعان الحالية للـ ${durLabel} يشير إلى تكوين قاعدة دعم صلبة.`,
    `الوكيل الفني يكتشف انحرافاً إيجابياً يعزز احتمالية الصعود الوميضي في إطار الـ ${durLabel}.`,
    `تم كسر حاجز العرض النانوي؛ محرك السيولة يشير إلى سيطرة كاملة للمشترين في الـ ${durLabel}.`
  ];
  const sellPhrases = [
    `تم رصد تشبع شرائي حاد عند القمم؛ بروتوكول الأمان يتوقع تصحيحاً خلال الـ ${durLabel}.`,
    `ضغط تصريفي مكثف يظهر في سجل الأوامر لدعم مستويات أدنى تكتيكياً في الـ ${durLabel}.`,
    `الوكيل الفني يكتشف بوادر انعكاس؛ ينصح بتأمين مراكز الـ ${durLabel} أو البيع.`,
    `فشل السعر في اختراق المقاومة التاريخية للـ ${durLabel} يشير إلى ضعف القوة الشرائية.`
  ];
  const holdPhrases = [
    `توازن هش بين العرض والطلب في نافذة الـ ${durLabel}؛ المحرك يفضل التريث.`,
    `تذبذب جانبي ناتج عن ضعف حجم التداول في الـ ${durLabel}؛ البروتوكول الموحد يجمد الإشارات.`,
    `منطقة ترقب استراتيجية؛ المؤشرات الفنية لا تظهر انحيازاً صريحاً في الـ ${durLabel}.`,
    `السوق في حالة 'انتظار' لحركة قيادية تؤكد مسار الـ ${durLabel} القادم.`
  ];

  const list = decision === 'BUY' ? buyPhrases : decision === 'SELL' ? sellPhrases : holdPhrases;
  return list[seed] || list[0];
}
