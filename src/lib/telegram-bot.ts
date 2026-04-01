
/**
 * @fileOverview NAMIX NEXUS BOT CORE ENGINE v10.0
 * محرك البوت المطور - تحديث لوحة التحكم وتوحيد الهوية الاحترافية.
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
 * يولد لوحة التحكم المتقدمة للمستثمرين الموثقين
 * تم إضافة زر السحب المفقود وتوحيد المصطلحات
 */
export function generateTelegramAppKeyboard() {
  return {
    keyboard: [
      [{ text: "📊 الأسواق الحية" }, { text: "🔬 مختبر العقود" }],
      [{ text: "💰 الرصيد والمحفظة" }, { text: "📊 التقارير والأداء" }],
      [{ text: "💳 شحن الرصيد" }, { text: "📤 سحب الأرباح" }],
      [{ text: "🚀 فتح المنصة" }]
    ],
    resize_keyboard: true,
    persistent: true
  };
}

/**
 * يولد أزرار الترحيب للزوار الجدد
 */
export function generateGuestKeyboard() {
  return {
    keyboard: [
      [{ text: "✨ إنشاء حساب جديد" }],
      [{ text: "🔑 تسجيل دخول" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}
