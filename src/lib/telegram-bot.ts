
/**
 * @fileOverview NAMIX NEXUS BOT CORE ENGINE v15.0
 * محرك البوت المطور - دعم التطبيق المصغر والربط التلقائي بأزرار مباشرة.
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
 * يولد لوحة التحكم الاحترافية التي تفتح الأقسام المطلوبة مباشرة
 */
export function generateTelegramAppKeyboard(baseUrl: string) {
  return {
    keyboard: [
      [
        { text: "📊 لوحة القيادة", web_app: { url: `${baseUrl}/home` } },
        { text: "🔬 الخطط الاستثمارية", web_app: { url: `${baseUrl}/invest` } }
      ],
      [
        { text: "📈 التداول الفوري", web_app: { url: `${baseUrl}/trade` } },
        { text: "🎮 العب واكسب", web_app: { url: `${baseUrl}/arena` } }
      ],
      [
        { text: "💳 شحن الرصيد", web_app: { url: `${baseUrl}/home?action=deposit` } },
        { text: "📤 سحب الرصيد", web_app: { url: `${baseUrl}/home?action=withdraw` } }
      ]
    ],
    resize_keyboard: true,
    persistent: true
  };
}

/**
 * يولد أزرار الترحيب للزوار غير الموثقين
 */
export function generateGuestKeyboard(baseUrl: string) {
  return {
    inline_keyboard: [
      [{ text: "✨ إنشاء حساب نخبوي", web_app: { url: `${baseUrl}/login` } }],
      [{ text: "🔑 تسجيل الدخول", web_app: { url: `${baseUrl}/login` } }]
    ]
  };
}
