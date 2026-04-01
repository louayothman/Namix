
'use server';

import { Resend } from 'resend';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard } from '@/lib/telegram-bot';

const resend = new Resend('re_GJABmije_GN8S3yKMsCxjNkhm3YvWMnLk');

/**
 * يرسل رسالة ترحيب وتفعيل لوحة التحكم بعد نجاح الدخول من التطبيق المصغر
 */
export async function notifyTelegramLoginSuccess(userId: string, chatId: string) {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. تحديث معرف الدردشة في الحساب
    await updateDoc(doc(firestore, "users", userId), {
      telegramChatId: chatId,
      updatedAt: new Date().toISOString()
    });

    // 2. جلب بيانات المستخدم وتوكن البوت
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
      generateTelegramAppKeyboard(baseUrl)
    );

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function sendTelegramNotification(userId: string, message: string, inlineButtons?: any[]) {
  try {
    const { firestore } = initializeFirebase();
    const userSnap = await getDoc(doc(firestore, "users", userId));
    const userData = userSnap.data();
    if (!userData || !userData.telegramChatId) return { success: false };

    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = configSnap.data()?.botToken;
    if (!botToken) return { success: false };

    const replyMarkup = inlineButtons ? { inline_keyboard: inlineButtons } : undefined;
    await sendTelegramMessage(botToken, userData.telegramChatId, message, replyMarkup);
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
