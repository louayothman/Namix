
/**
 * @fileOverview NAMIX NEXUS BOT CORE ENGINE v20.0
 * محرك البوت المطور - واجهة تحكم موحدة ثنائية اللغة لجميع الزوار والمستثمرين.
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

/**
 * إرسال رسالة نصية عادية
 */
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

/**
 * إرسال صورة مع نص (تستخدم لإشارات التداول مع أيقونة العملة الملونة)
 */
export async function sendTelegramPhoto(token: string, chatId: string, photoUrl: string, caption: string, replyMarkup?: any) {
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}${token}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      })
    });
    return await response.json();
  } catch (e) {
    console.error("Telegram Photo Error:", e);
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
 * يولد لوحة التحكم الرئيسية الموحدة ثنائية اللغة
 */
export function generateMainKeyboard(baseUrl: string) {
  return {
    keyboard: [
      [
        { text: "📊 الرصيد Check Balance" },
        { text: "🔬 مختبر العقود Lab", web_app: { url: `${baseUrl}/invest` } }
      ],
      [
        { text: "📈 التداول الفوري Trading", web_app: { url: `${baseUrl}/trade` } },
        { text: "💎 ملفي Profile", web_app: { url: `${baseUrl}/profile` } }
      ],
      [
        { text: "💳 شحن Deposit", web_app: { url: `${baseUrl}/home?action=deposit` } },
        { text: "📤 سحب Withdraw", web_app: { url: `${baseUrl}/home?action=withdraw` } }
      ],
      [
        { text: "❓ مساعدة Help" }
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
          text: `🚀 Execute ${action === 'buy' ? 'BUY' : 'SELL'} / تنفيذ الصفقة`, 
          web_app: { url: `${baseUrl}/trade/${symbolId}` } 
        }
      ]
    ]
  };
}
