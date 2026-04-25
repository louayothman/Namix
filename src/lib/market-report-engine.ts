
/**
 * @fileOverview مُفاعل التقارير المتعمقة v1.0 - Namix Deep Intel Engine
 * محرك مستقل لتوليد تحليلات فنية واسعة النطاق لأسواق تلغرام.
 */

import { runNamix } from "./namix-orchestrator";

export async function generateDeepMarketReport(symbolCode: string, symbolId: string) {
  try {
    // استدعاء الأوركسترا لجلب البيانات الأساسية والذكاء الاصطناعي
    const signal = await runNamix(symbolCode);
    
    const confidence = signal.confidence;
    const isBuy = signal.decision === 'BUY';
    const isSell = signal.decision === 'SELL';
    
    // بناء التقرير المتعمق بأسلوب مؤسساتي
    const statusEmoji = isBuy ? '🟢' : isSell ? '🔴' : '⚪';
    const trendLabel = isBuy ? 'مسار نمو (Bullish)' : isSell ? 'تصحيح سعري (Bearish)' : 'منطقة حياد (Neutral)';
    
    const report = `
${statusEmoji} *تقرير تحليل سوق: ${symbolCode}*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
🧠 *الرؤية الاستراتيجية (AI Insight):*
${signal.reason === "Market Equilibrium" ? "السوق حالياً في حالة توازن تقني؛ نوصي بالمراقبة اللحظية وانتظار كسر مناطق التذبذب." : signal.reason}

📈 *القراءات الفنية (Technical Data):*
• *السعر الحالي:* $${signal.agents.tech.last.toLocaleString()}
• *درجة الثقة:* %${confidence}
• *نبض الاتجاه:* ${trendLabel}
• *حجم السيولة:* ${signal.volume}

🎯 *خارطة التنفيذ المقترحة:*
• *نطاق التمركز:* ${signal.entry_range}
• *الهدف الأول:* $${signal.targets.tp1.toLocaleString()}
• *الهدف الثاني:* $${signal.targets.tp2.toLocaleString()}
• *الهدف الأقصى:* $${signal.targets.tp3.toLocaleString()}
• *صمام الأمان:* $${signal.targets.sl.toLocaleString()}

🔥 *تحليل المخاطر:*
${signal.risk.reason} (${signal.risk.label})

_تم استنباط هذا التقرير عبر تقاطع بيانات الزخم والسيولة بداخل محرك NAMIX AI._
    `.trim();

    return report;
  } catch (e) {
    return "⚠️ عذراً، واجه المحرك صعوبة في مزامنة بيانات هذا السوق حالياً.";
  }
}
