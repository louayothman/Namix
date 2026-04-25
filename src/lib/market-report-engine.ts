
/**
 * @fileOverview مُفاعل التقارير المتعمقة v3.0 - Professional Analysis Matrix
 * محرك مخصص لتوليد تحليلات فنية شاملة لأسواق تلغرام بلغة مالية نخبوية وهادئة.
 */

import { runNamix } from "./namix-orchestrator";

export async function generateDeepMarketReport(symbolCode: string, symbolId: string) {
  try {
    const signal = await runNamix(symbolCode);
    
    const isBuy = signal.decision === 'BUY';
    const isSell = signal.decision === 'SELL';
    
    const statusEmoji = isBuy ? '📈' : isSell ? '📉' : '⚖️';
    const trendLabel = isBuy ? 'مسار صعودي' : isSell ? 'مسار تصحيحي' : 'منطقة استقرار';
    
    const report = `
${statusEmoji} *تقرير التحليل الفني: ${symbolCode}*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
📊 *الرؤية الاستراتيجية:*
${signal.reason === "Market Equilibrium" ? "السوق في حالة تعادل فني؛ ننصح بالانتظار حتى وضوح اتجاه النبض القادم لضمان دخول آمن ومستقر." : signal.reason}

🔍 *تشخيص الحالة اللحظية:*
• *السعر الحالي:* $${signal.agents.tech.last.toLocaleString()}
• *درجة الثقة:* %${signal.confidence}
• *اتجاه السوق:* ${trendLabel}
• *حجم السيولة:* ${signal.volume}

🎯 *خارطة الأهداف المقترحة:*
• *نطاق التمركز:* ${signal.entry_range}
• *الهدف الأول:* $${signal.targets.tp1.toLocaleString()}
• *الهدف الثاني:* $${signal.targets.tp2.toLocaleString()}
• *الهدف الأقصى:* $${signal.targets.tp3.toLocaleString()}
• *صمام الأمان:* $${signal.targets.sl.toLocaleString()}

🛡️ *تقييم المخاطرة:*
${signal.risk.reason} (${signal.risk.label})

ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
📡 *تم استخلاص التقرير بواسطة NAMIX AI Core*
_نظام التحليل المتطور v1.0_
    `.trim();

    return report;
  } catch (e) {
    return "⚠️ عذراً، واجه المحرك صعوبة في مزامنة بيانات هذا السوق حالياً.";
  }
}
