
/**
 * @fileOverview NAMIX TELEGRAM BOT CORE ENGINE v2.0
 * مطور لدعم التنقل المتعدد، إنشاء الحسابات، وتجربة الـ WebApp الفاخرة.
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
 * تعتمد على Reply Keyboard لسهولة الوصول الدائم
 */
export function generateTelegramAppKeyboard(baseUrl: string) {
  return {
    keyboard: [
      [{ text: "📊 الأسواق الحية" }, { text: "🔬 مختبر العقود" }],
      [{ text: "💰 الرصيد والمحفظة" }, { text: "🎮 ساحة المغامرة" }],
      [{ text: "🚀 فتح التطبيق المصغر", web_app: { url: `${baseUrl}/home` } }]
    ],
    resize_keyboard: true,
    persistent: true
  };
}

/**
 * يولد أزرار الترحيب للمستخدمين الجدد
 */
export function generateGuestKeyboard(baseUrl: string) {
  return {
    keyboard: [
      [{ text: "✨ إنشاء حساب جديد" }],
      [{ text: "🔑 دخول للمنصة", web_app: { url: `${baseUrl}/login` } }],
      [{ text: "🌍 الموقع الرسمي", url: baseUrl }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}
