
/**
 * @fileOverview NAMIX TELEGRAM BOT CORE ENGINE v1.0
 * Handles API calls to Telegram and webhook management.
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

export function generateTelegramAppKeyboard(baseUrl: string) {
  return {
    inline_keyboard: [
      [
        { text: "🚀 فتح منصة ناميكس", web_app: { url: `${baseUrl}/home` } }
      ],
      [
        { text: "📊 التداول الفوري", web_app: { url: `${baseUrl}/trade` } },
        { text: "🔬 مختبر العقود", web_app: { url: `${baseUrl}/invest` } }
      ],
      [
        { text: "🎮 ساحة المغامرة", web_app: { url: `${baseUrl}/arena` } }
      ],
      [
        { text: "💰 شحن / سحب الرصيد", web_app: { url: `${baseUrl}/profile` } }
      ]
    ]
  };
}
