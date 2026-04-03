
'use server';

import { Resend } from 'resend';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { sendTelegramMessage, generateMainKeyboard, generateSignalButton } from '@/lib/telegram-bot';

const resend = new Resend('re_GJABmije_GN8S3yKMsCxjNkhm3YvWMnLk');

/**
 * يرسل إشارة تداول آلية لكافة المشتركين في البوت (مسجلين وغير مسجلين)
 * مع نظام حماية لمنع التكرار (2 دقيقة فاصلة)
 */
export async function broadcastAISignal(symbolId: string, symbolCode: string, action: string, confidence: number, price: number) {
  try {
    const { firestore } = initializeFirebase();
    const configRef = doc(firestore, "system_settings", "trading_ai");
    const configSnap = await getDoc(configRef);
    const configData = configSnap.data();

    // نظام الحماية: إشارة واحدة كحد أقصى لكل عملة كل 120 ثانية لضمان الزخم
    const now = Date.now();
    const lastSignalKey = `lastSignalAt_${symbolId}`;
    const lastSignalTime = configData?.[lastSignalKey] || 0;

    if (now - lastSignalTime < 120000) return { success: false, reason: "Throttled" };

    // تحديث وقت آخر إشارة في القاعدة
    await updateDoc(configRef, { [lastSignalKey]: now });

    // جلب توكن البوت المعتمد
    const tgConfigSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = tgConfigSnap.data()?.botToken;
    if (!botToken) return { success: false };

    // جلب كافة المشتركين (النظام العام) لضمان وصول الإشارة للجميع
    const subscribersSnap = await getDocs(collection(firestore, "bot_subscribers"));
    const chatIds = subscribersSnap.docs.map(d => d.id);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";
    const message = `<b>🔥 إشارة تداول استراتيجية</b>\n\nالأصل: <b>${symbolCode}</b>\nالاتجاه: <b>${action === 'buy' ? 'شراء 📈' : 'بيع 📉'}</b>\nنسبة الثقة: <b>%${confidence.toFixed(1)}</b>\nالسعر الحالي: <b>$${price.toLocaleString()}</b>\n\n<i>تم الرصد عبر محرك NAMIX AI المتقدم.</i>`;
    const replyMarkup = generateSignalButton(baseUrl, symbolId, action);

    // بث الرسالة للجميع عبر بروتوكول نكسوس
    const sendPromises = chatIds.map(chatId => 
      sendTelegramMessage(botToken, chatId, message, replyMarkup).catch(() => {})
    );

    await Promise.all(sendPromises);
    return { success: true, count: chatIds.length };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * يرسل إشعاراً خاصاً لمستثمر معين عبر تلغرام إذا كان حسابه مربوطاً
 */
export async function sendTelegramNotification(userId: string, message: string) {
  try {
    const { firestore } = initializeFirebase();
    const userSnap = await getDoc(doc(firestore, "users", userId));
    const chatId = userSnap.data()?.telegramChatId;

    if (!chatId) return { success: false, reason: "Not linked" };

    const tgConfigSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = tgConfigSnap.data()?.botToken;
    if (!botToken) return { success: false };

    await sendTelegramMessage(botToken, chatId, message);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * يرسل رسالة ترحيب وتفعيل لوحة التحكم بعد نجاح الدخول من التطبيق المصغر
 */
export async function notifyTelegramLoginSuccess(userId: string, chatId: string) {
  try {
    const { firestore } = initializeFirebase();
    
    await updateDoc(doc(firestore, "users", userId), {
      telegramChatId: chatId,
      updatedAt: new Date().toISOString()
    });

    const [userSnap, configSnap] = await Promise.all([
      getDoc(doc(firestore, "users", userId)),
      getDoc(doc(firestore, "system_settings", "telegram"))
    ]);

    const botToken = configSnap.data()?.botToken;
    const userData = userSnap.data();

    if (!botToken || !userData) return { success: false };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

    await sendTelegramMessage(botToken, chatId, 
      `<b>✅ تم إثبات الهوية بنجاح!</b>\n\nمرحباً بك يا <b>${userData.displayName}</b>. حسابك الآن مربوط بالكامل بمركز التحكم المتقدم.\n\n<i>يمكنك الآن استخدام الأزرار أدناه للوصول السريع لكافة الخدمات.</i>`,
      generateMainKeyboard(baseUrl)
    );

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Namix <auth@namix.pro>',
      to: email,
      subject: 'رمز التحقق من هوية ناميكس | Verification Code',
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #002d4d; margin: 0;">Namix</h1>
            <p style="color: #f9a885; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Advanced Investment Protocol</p>
          </div>
          <div style="background-color: #fcfdfe; padding: 30px; border-radius: 15px; text-align: center;">
            <p style="color: #444; font-size: 16px;">يرجى استخدام الرمز التالي لتأمين دخولك للمنصة:</p>
            <h2 style="color: #002d4d; font-size: 42px; letter-spacing: 10px; margin: 20px 0;">${otp}</h2>
            <p style="color: #888; font-size: 12px;">هذا الرمز صالح لمدة 5 دقائق لضمان الحماية القصوى.</p>
          </div>
          <div style="margin-top: 30px; text-align: center; color: #aaa; font-size: 10px;">
            <p>© 2024 Namix Universal Network. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function sendBroadcastEmail(email: string, title: string, message: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Namix Official <info@namix.pro>',
      to: email,
      subject: title,
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 32px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #002d4d; margin: 0;">Namix Protocol</h1>
          </div>
          <div style="background-color: #fcfdfe; padding: 40px; border-radius: 24px;">
            <h2 style="color: #002d4d;">${title}</h2>
            <p style="color: #445566; line-height: 1.8;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
