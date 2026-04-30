
'use server';

/**
 * @fileOverview محرك عمليات المستخدمين عبر تلغرام v1.0
 * ملف معزول لادارة الهوية، تسجيل الدخول، وانشاء الحسابات بداخل البوت.
 */

export async function sendWelcomeMessage(botToken: string, chatId: string) {
  const ogImageUrl = "https://namix.pro/og-image.png";
  
  const caption = `
🔐 *أهلاً بك في NAMIX* || بوت تداول بالذكاء الاصطناعي الأقوى على الإطلاق

مكان مخصص لمن يفضل التداول برؤية أوضح وقرارات أكثر دقة.

📊 *إشارات مدروسة وتحليل احترافي*
⚡ *تنفيذ مباشر من داخل البوت*
🎯 *فرص مختارة بعناية بدل الضجيج*

افتح حساباً مجانياً أو سجل دخولك بحساب ناميكس.
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [
        { text: "💎 فتح حساب مجاني", callback_data: "user_signup" },
        { text: "🔑 تسجيل الدخول", callback_data: "user_login" }
      ]
    ]
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: ogImageUrl,
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      })
    });
    return { success: true };
  } catch (e) {
    console.error("Welcome Message Error:", e);
    return { success: false };
  }
}
