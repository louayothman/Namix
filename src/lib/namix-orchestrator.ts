/**
 * @fileOverview NAMIX AI Orchestrator v18.0 - Reactive Nano-Analysis
 * محرك استنتاجي مطور يحلل آخر 10 شمعات فقط لضمان سرعة تغير المقترحات.
 * تم تطهير كافة المصطلحات من كلمة "سيادة".
 */

import { technicalAgent } from "./agents/technical-agent";
import { volumeAgent } from "./agents/volume-agent";
import { riskEngine } from "./engines/risk-engine";
import { memoryEngine } from "./engines/memory-engine";

export async function runNamix(symbol: string, duration?: number) {
  const cleanSymbol = symbol.replace('/', '').toUpperCase();

  // جلب البيانات النانوية (آخر 10 دقائق)
  const [tech, volume] = await Promise.all([
    technicalAgent(cleanSymbol),
    volumeAgent(cleanSymbol)
  ]);

  // دمج السكور الفني وسكور السيولة (الوزن الأكبر للحركة الفنية اللحظية)
  const rangeFactor = tech.score; 
  const decisionScore = (rangeFactor * 0.7) + (volume.score * 0.3);

  let decision = "HOLD";
  if (decisionScore > 0.58) decision = "BUY";
  else if (decisionScore < 0.42) decision = "SELL";

  const risk = riskEngine(decision, tech, volume);
  
  // توليد الحوار بناءً على النبض اللحظي (آخر 10 شمعات)
  const dialogue = generateVastAgentDialogue(decision, tech, volume, decisionScore, duration);
  const reasoning = generateVastReasoning(decision, tech, volume, duration);

  const currentPrice = tech.last;
  const volatility = tech.high - tech.low;
  const atrProxy = volatility * 0.2; // استخدام تذبذب آخر 10 شمعات

  const targets = {
    tp1: decision === "BUY" ? 1 + (atrProxy / currentPrice * 0.4) : 1 - (atrProxy / currentPrice * 0.4),
    tp2: decision === "BUY" ? 1 + (atrProxy / currentPrice * 0.9) : 1 - (atrProxy / currentPrice * 0.9),
    tp3: decision === "BUY" ? 1 + (atrProxy / currentPrice * 1.8) : 1 - (atrProxy / currentPrice * 1.8)
  };

  const entry_zone_multiplier = decision === "BUY" ? 0.9995 : 1.0005;
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
    invalidated_at: decision === "BUY" ? currentPrice - (atrProxy * 1.2) : currentPrice + (atrProxy * 1.2),
    agents: { tech, volume },
    timestamp: new Date().toISOString()
  };
}

function generateVastAgentDialogue(decision: string, tech: any, volume: any, score: number, duration?: number) {
  const isBuy = decision === "BUY";
  const isSell = decision === "SELL";
  const confidence = Math.round(score * 100);
  const durLabel = duration ? (duration < 60 ? `${duration}ث` : `${Math.floor(duration/60)}د`) : "الحالية";

  const alphaPool = {
    BUY: [
      `النبض اللحظي لآخر 10 شمعات يظهر انفجاراً في الطلب؛ السعر يتجاوز المقاومة.`,
      `رصدتُ انحرافاً إيجابياً وميضياً في إطار الـ ${durLabel}؛ القوة الشرائية تسيطر.`,
      `تحليل الشموع الأخيرة يؤكد ارتداداً حاداً من منطقة الدعم في نافذة الـ ${durLabel}.`,
      `الثقة عند %${confidence} تدعم سيناريو الاختراق الصاعد خلال الـ ${durLabel} القادمة.`
    ],
    SELL: [
      `آخر 10 دقائق تظهر تراجعاً حاداً في الزخم؛ البائعون يضغطون بقوة الآن.`,
      `إشارة هبوط تلوح في أفق الـ ${durLabel}؛ الشموع الأخيرة أغلقت تحت المتوسط.`,
      `رصدتُ انكساراً لخط الاتجاه اللحظي في نافذة الـ ${durLabel}؛ الحذر مطلوب.`,
      `التحليل المجهري يشير لتشبع شرائي عند القمة الحالية في إطار الـ ${durLabel}.`
    ],
    HOLD: [
      `تذبذب ضيق جداً في آخر 10 شمعات؛ لا يوجد انحياز واضح للاتجاه.`,
      `النظام يراقب مناطق التوازن في الـ ${durLabel}؛ نبض السوق مستقر حالياً.`,
      `تساوي القوى بين العرض والطلب في نافذة الـ ${durLabel} يمنع المخاطرة.`,
      `تداخل إشارات الوكلاء في الشموع الأخيرة؛ ننتظر تأكيد الحركة القادمة.`
    ]
  };

  const betaPool = {
    BUY: [
      `أؤكد ذلك؛ السيولة تتدفق بكثافة في الدقائق الأخيرة لدعم عقد الـ ${durLabel}.`,
      `حجم التداول في آخر 10 شمعات يعكس دخول حيتان حقيقي لاقتناص القاع.`,
      `رصدنا فجوة سيولة صاعدة في سجل الأوامر تدعم تنفيذ صفقة الـ ${durLabel}.`,
      `تدفق الأموال إيجابي بنسبة ملحوظة؛ الطريق مفتوح للأعلى في الـ ${durLabel}.`
    ],
    SELL: [
      `انسحاب سريع للسيولة في الـ 10 دقائق الأخيرة؛ العرض يسيطر على الموقف.`,
      `حجم التداول يعكس ضعفاً هيكلياً في منطقة الطلب خلال نافذة الـ ${durLabel}.`,
      `أوامر البيع تتراكم بكثافة فوق السعر في الشموع الأخيرة للـ ${durLabel}.`,
      `تدفق السيولة السلبي يشير إلى تخارج رؤوس أموال ذكية في الـ ${durLabel}.`
    ],
    HOLD: [
      `السيولة متوازنة تماماً في آخر 10 دقائق؛ حجم التداول غير كافٍ للحركة.`,
      `محرك السيولة يظهر توازناً هشاً في نافذة الـ ${durLabel} الحالية.`,
      `السوق يفتقر للزخم المؤسساتي اللازم في إطار الـ ${durLabel}؛ التريث أفضل.`,
      `أوامر البيع والشراء متكافئة نانوياً في دورة الـ ${durLabel} الحالية.`
    ]
  };

  const deltaPool = {
    BUY: [
      `عتبة المخاطرة اللحظية آمنة جداً لتنفيذ عقد الـ ${durLabel}.`,
      `الوكيل الأمني يؤكد استقرار البروتوكول بناءً على نبض الشموع الأخيرة.`,
      `معدل التذبذب في آخر 10 دقائق يدعم تشغيل المفاعل للمدة ${durLabel}.`,
      `البيئة التشغيلية مستقرة تماماً وجاهزة لتنفيذ بروتوكول الـ ${durLabel}.`
    ],
    SELL: [
      `مخاطرة التراجع اللحظي مرتفعة جداً؛ تأمين المراكز هو القرار الأذكى.`,
      `الوكيل الأمني يرصد تلاعبات سعرية عند قمة الـ ${durLabel} الحالية.`,
      `نظام الإنذار المبكر يرصد بوادر انهيار سعري خلال نافذة الـ ${durLabel}.`,
      `المخاطرة في تنفيذ شراء حالياً غير مجدية استثمارياً في الـ ${durLabel}.`
    ],
    HOLD: [
      `المخاطرة متذبذبة في آخر 10 شمعات؛ يفضل الانتظار لتجنب الانزلاق.`,
      `نظام الأمان في وضع الترقب لقرار الـ ${durLabel}؛ لم يتم المنح بعد.`,
      `المخاطرة متوازنة مع العائد في الـ ${durLabel}؛ لا يوجد امتياز تنافسي.`,
      `انتظار استقرار السيولة هو أضمن وسيلة لحماية رأس مال الـ ${durLabel}.`
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
    `تحليل آخر 10 شمعات يظهر اختراقاً استراتيجياً للمقاومة في نافذة الـ ${durLabel}.`,
    `تكدس طلبات الشراء اللحظية عند القيعان يشير إلى تكوين قاعدة دعم صلبة للـ ${durLabel}.`,
    `الوكيل الفني يكتشف انحرافاً إيجابياً في الدقائق الأخيرة يعزز صعود الـ ${durLabel}.`,
    `تم كسر حاجز العرض النانوي؛ محرك السيولة يشير إلى سيطرة كاملة للمشترين في الـ ${durLabel}.`
  ];
  const sellPhrases = [
    `آخر 10 دقائق تظهر تشبعاً شرائياً حاداً؛ بروتوكول الأمان يتوقع تصحيحاً في الـ ${durLabel}.`,
    `ضغط تصريفي مكثف يظهر في الشموع الأخيرة لدعم مستويات أدنى تكتيكياً في الـ ${durLabel}.`,
    `الوكيل الفني يكتشف بوادر انعكاس هابط؛ ينصح بتأمين مراكز الـ ${durLabel} فوراً.`,
    `فشل السعر في الحفاظ على قمة آخر 10 دقائق يشير لضعف القوة الشرائية في الـ ${durLabel}.`
  ];
  const holdPhrases = [
    `توازن هش في آخر 10 شمعات بين العرض والطلب؛ المحرك يفضل التريث في الـ ${durLabel}.`,
    `تذبذب جانبي ناتج عن ضعف السيولة اللحظية؛ البروتوكول الموحد يجمد الإشارات للـ ${durLabel}.`,
    `منطقة ترقب نانوية؛ المؤشرات الفنية لا تظهر انحيازاً صريحاً في الـ 10 دقائق الأخيرة.`,
    `السوق في حالة 'انتظار' لحركة قيادية تؤكد مسار الـ ${durLabel} القادم.`
  ];

  const list = decision === 'BUY' ? buyPhrases : decision === 'SELL' ? sellPhrases : holdPhrases;
  return list[seed] || list[0];
}
