
/**
 * @fileOverview NAMIX NEXUS BOT CORE ENGINE v18.0
 * محرك البوت المطور - بوابة وصول وميضية لميزات المنصة الاستراتيجية.
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

export async function sendTelegramMessage(token: string, chatId: string, text: string, replyMarkup?: any) {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      })
    });
    return await response.json();
  } catch (e) {
    console.error("Telegram Send Error:", e);
    return { ok: false, error: e };
  }
}

export async function setTelegramWebhook(token: string, url: string) {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${token}/setWebhook?url=${url}`);
    return await response.json();
  } catch (e) {
    return { ok: false, error: e };
  }
}

/**
 * يولد لوحة التحكم الرئيسية المباشرة لكافة المستخدمين والزوار
 */
export function generateMainKeyboard(baseUrl: string) {
  return {
    keyboard: [
      [
        { text: "📊 لوحة القيادة", web_app: { url: `${baseUrl}/home` } },
        { text: "🔬 مختبر العقود", web_app: { url: `${baseUrl}/invest` } }
      ],
      [
        { text: "📈 التداول الفوري", web_app: { url: `${baseUrl}/trade` } },
        { text: "💎 الملف الشخصي", web_app: { url: `${baseUrl}/profile` } }
      ],
      [
        { text: "💳 شحن الرصيد", web_app: { url: `${baseUrl}/home?action=deposit` } },
        { text: "📤 سحب الأرباح", web_app: { url: `${baseUrl}/home?action=withdraw` } }
      ]
    ],
    resize_keyboard: true,
    persistent: true
  };
}

/**
 * دالة مساعدة لتوليد زر التنفيذ الذكي لإشارات التداول
 */
export function generateSignalButton(baseUrl: string, symbolId: string, action: string) {
  return {
    inline_keyboard: [
      [
        { 
          text: `🚀 تنفيذ ${action === 'buy' ? 'شراء' : 'بيع'} وميضي`, 
          web_app: { url: `${baseUrl}/trade/${symbolId}` } 
        }
      ]
    ]
  };
}
