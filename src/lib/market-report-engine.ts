
/**
 * @fileOverview مُفاعل التقارير المتعمقة v2.0 - Deep Intelligence Matrix
 * محرك سيادي لتوليد تحليلات فنية دسمة وشاملة لأسواق تلغرام.
 */

import { runNamix } from "./namix-orchestrator";

export async function generateDeepMarketReport(symbolCode: string, symbolId: string) {
  try {
    // استدعاء الأوركسترا لجلب البيانات الأساسية والذكاء الاصطناعي
    const signal = await runNamix(symbolCode);
    
    const confidence = signal.confidence;
    const isBuy = signal.decision === 'BUY';
    const isSell = signal.decision === 'SELL';
    
    // بناء التقرير المتعمق بأسلوب نخبوي
    const statusEmoji = isBuy ? '🟢' : isSell ? '🔴' : '⚪';
    const trendLabel = isBuy ? 'مسار نمو (Bullish)' : isSell ? 'تصحيح سعري (Bearish)' : 'منطقة توازن (Neutral)';
    
    // محاكاة مؤشر القوة النسبية والزخم من بيانات الوكلاء
    const rsiProxy = Math.round((signal.agents.tech.score * 100));
    
    const report = `
${statusEmoji} *تقرير الاستخبارات المالية: ${symbolCode}*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
🧠 *الرؤية الاستراتيجية (AI Insight):*
${signal.reason === "Market Equilibrium" ? "السوق في حالة حياد تقني؛ محرك ناميكس يوصي بالانتظار حتى كسر مناطق التذبذب الحالية لضمان دخول آمن." : signal.reason}

📈 *نبض المؤشرات (Market Pulse):*
• *السعر الحالي:* $${signal.agents.tech.last.toLocaleString()}
• *درجة الثقة:* %${confidence}
• *اتجاه النبض:* ${trendLabel}
• *قوة الزخم (RSI):* %${rsiProxy}
• *حجم السيولة:* ${signal.volume}

🎯 *خارطة التنفيذ المقترحة:*
• *نطاق التمركز:* ${signal.entry_range}
• *الهدف الأول:* $${signal.targets.tp1.toLocaleString()}
• *الهدف الثاني:* $${signal.targets.tp2.toLocaleString()}
• *الهدف الأقصى:* $${signal.targets.tp3.toLocaleString()}
• *صمام الأمان:* $${signal.targets.sl.toLocaleString()}

🛡️ *تقييم المخاطر (Risk Audit):*
${signal.risk.reason} (${signal.risk.label})

ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
📡 *تم استخلاص التقرير بواسطة NAMIX AI Core*
_بروتوكول التحليل المتعمق v4.0_
    `.trim();

    return report;
  } catch (e) {
    return "⚠️ عذراً، واجه المحرك صعوبة في مزامنة بيانات هذا السوق حالياً.";
  }
}
