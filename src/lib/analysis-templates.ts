/**
 * @fileOverview مصفوفة القوالب الديناميكية v2.0 - Dynamic Injection
 * تدعم الحقن الآلي للسعر والثقة لضمان دقة التحليل الاحتياطي.
 */

type TemplateSet = {
  openings: string[];
  actions: string[];
  conclusions: string[];
};

const BUY_TEMPLATES: TemplateSet = {
  openings: [
    "يستقر السعر عند PRICE$ مع زخم شرائي",
    "تمركز إيجابي فوق مستوى PRICE$ الآن",
    "ثبات سعري ملحوظ عند PRICE$ بدعم سيولة",
    "تدفقات سيولة تدخل عند السعر PRICE$",
    "قراءة فنية عند PRICE$ تشير للتجميع",
    "استقرار القوة النسبية حول PRICE$ بنجاح",
    "نشاط غير اعتيادي قرب PRICE$ يدفع للصعود",
    "المؤشرات تدعم النمو فوق PRICE$ حالياً"
  ],
  actions: [
    "مما يرفع نسبة الثقة في المسار لـ %CONF",
    "بالتزامن مع تأكيد فني بنسبة %CONF",
    "مدعوماً ببيانات زخم تبلغ نسبتها %CONF",
    "نظراً لقوة التوافق الرقمي بـ %CONF",
    "وسط إشارات نمو تبلغ قوتها %CONF",
    "تفاعلاً مع نبض السوق بنسبة ثقة %CONF"
  ],
  conclusions: [
    "مما يفتح باباً لاستكشاف قمم جديدة.",
    "مما يعزز فرص الوصول للأهداف المرسومة.",
    "وهذا يدعم استراتيجية الدخول في هذه النقطة.",
    "الأمر الذي يرجح استمرار الاتجاه الصاعد.",
    "مبشراً بمرحلة نمو سعري مستقرة."
  ]
};

const SELL_TEMPLATES: TemplateSet = {
  openings: [
    "رفض سعري عند PRICE$ مع ضغط بيع",
    "تراجع في مستويات الدعم عند PRICE$ الآن",
    "تشبع شرائي حاد يظهر عند السعر PRICE$",
    "خروج تدريجي للسيولة حول مستوى PRICE$",
    "فشل في اختراق الحاجز عند PRICE$ حالياً",
    "بدء تشكل موجة هابطة من السعر PRICE$"
  ],
  actions: [
    "مما يجعل نسبة الثقة في التصحيح %CONF",
    "بسبب ضعف السيولة وتأكيد بـ %CONF",
    "بالتزامن مع تراجع القوة النسبية بنسبة %CONF",
    "نظراً لضغوط البيع التي رفعت الثقة لـ %CONF",
    "تفاعلاً مع ضغوط جني الأرباح بقوة %CONF"
  ],
  conclusions: [
    "مما يرجح استمرار التصحيح نحو الأسفل.",
    "وهذا يستدعي الحذر من تراجعات إضافية.",
    "مما يفتح الطريق لاختبار مناطق دعم أدنى.",
    "الأمر الذي يعزز سيناريو المسار الهابط.",
    "وهذا ينسجم مع رؤية المخاطر الفنية العالية."
  ]
};

const HOLD_TEMPLATES: TemplateSet = {
  openings: [
    "تعادل تقني مؤقت عند السعر PRICE$",
    "تذبذب جانبي يسيطر على PRICE$ حالياً",
    "توازن حذر بين القوى عند مستوى PRICE$",
    "حالة ترقب تسود مناطق PRICE$ المذكورة"
  ],
  actions: [
    "بانتظار ثقة أعلى تتجاوز %CONF",
    "لحين وضوح النبض بنسبة أقوى من %CONF",
    "مع استقرار هش للثقة عند مستوى %CONF",
    "بسبب تداخل الإشارات بقوة %CONF"
  ],
  conclusions: [
    "لذا يفضل التريث لضمان دخول آمن.",
    "مما يستدعي مراقبة مناطق الكسر المحتملة.",
    "وهذا يتطلب البقاء خارج السوق مؤقتاً.",
    "لضمان استقرار استراتيجية التنفيذ لاحقاً."
  ]
};

export function generateFallbackAnalysis(decision: 'BUY' | 'SELL' | 'HOLD', price: number, confidence: number): string {
  const set = decision === 'BUY' ? BUY_TEMPLATES : decision === 'SELL' ? SELL_TEMPLATES : HOLD_TEMPLATES;
  
  const opening = set.openings[Math.floor(Math.random() * set.openings.length)]
    .replace('PRICE', price.toLocaleString());
  
  const action = set.actions[Math.floor(Math.random() * set.actions.length)]
    .replace('CONF', confidence.toString());
  
  const conclusion = set.conclusions[Math.floor(Math.random() * set.conclusions.length)];

  return `${opening} ${action} ${conclusion}`;
}

export function generateFallbackDialogue(decision: string, durLabel: string) {
  const isBuy = decision === "BUY";
  const isSell = decision === "SELL";

  const bullMsg = isBuy ? "أرى اختراقاً إيجابياً؛ الزخم يتزايد والمنحنى يستهدف قمة جديدة." : "السعر يبني قاعدة تجميع هادئة، التمركز الحالي جيد.";
  const bearMsg = isSell ? "المؤشرات الفنية سلبية؛ كسر مستويات الدعم يفتح الباب للتراجع." : "احذر من فخ سعري؛ السيولة غير مستقرة حالياً.";

  return [
    { agent: "وكيل النمو", icon: "Zap", color: "bg-emerald-500", message: bullMsg },
    { agent: "وكيل المخاطر", icon: "Target", color: "bg-red-500", message: bearMsg },
    { agent: "محرك القرار", icon: "Cpu", color: "bg-[#002d4d]", message: `تم التوافق على مسار ${isBuy ? 'صعودي' : isSell ? 'تصحيحي' : 'متذبذب'} للنافذة ${durLabel}.` }
  ];
}
