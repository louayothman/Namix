
/**
 * @fileOverview NAMIX TELEGRAM BOT CORE ENGINE v1.2
 * Expanded with multi-channel navigation and registration support.
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
 * يولد لوحة التحكم السيادية للمستخدمين المرتبطين
 */
export function generateTelegramAppKeyboard(baseUrl: string) {
  return {
    inline_keyboard: [
      [
        { text: "🚀 قمرة القيادة الرئيسية", web_app: { url: `${baseUrl}/home` } }
      ],
      [
        { text: "📊 التداول الفوري", web_app: { url: `${baseUrl}/trade` } },
        { text: "🔬 مختبر العقود", web_app: { url: `${baseUrl}/invest` } }
      ],
      [
        { text: "🎮 ساحة المغامرة", web_app: { url: `${baseUrl}/arena` } },
        { text: "🛡️ مركز الأمان والـ PIN", web_app: { url: `${baseUrl}/profile?action=setup-pin` } }
      ],
      [
        { text: "💰 شحن / سحب الرصيد", web_app: { url: `${baseUrl}/profile` } }
      ],
      [
        { text: "🎓 الأكاديمية التعليمية", web_app: { url: `${baseUrl}/academy` } }
      ]
    ]
  };
}

/**
 * يولد أزرار الترحيب للمستخدمين الجدد
 */
export function generateGuestKeyboard(baseUrl: string) {
  return {
    inline_keyboard: [
      [
        { text: "✨ إنشاء حساب استثماري جديد", web_app: { url: `${baseUrl}/login` } }
      ],
      [
        { text: "🔑 تسجيل الدخول", web_app: { url: `${baseUrl}/login` } }
      ],
      [
        { text: "🌍 الموقع الرسمي", url: baseUrl }
      ]
    ]
  };
}
