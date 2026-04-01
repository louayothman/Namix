
'use server';

import { Resend } from 'resend';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram-bot';

const resend = new Resend('re_GJABmije_GN8S3yKMsCxjNkhm3YvWMnLk');

/**
 * يرسل تنبيهاً عبر تلغرام للمستخدم إذا كان مرتباً بالبوت
 */
export async function sendTelegramNotification(userId: string, message: string) {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. جلب بيانات المستخدم للتحقق من وجود Chat ID
    const userSnap = await getDoc(doc(firestore, "users", userId));
    if (!userSnap.exists()) return { success: false, error: "User not found" };
    
    const userData = userSnap.data();
    if (!userData.telegramChatId) return { success: false, error: "Not linked to telegram" };

    // 2. جلب توكن البوت من الإعدادات
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return { success: false, error: "Bot token missing" };

    // 3. إرسال الرسالة
    await sendTelegramMessage(config.botToken, userData.telegramChatId, message);
    return { success: true };
  } catch (e: any) {
    console.error("Telegram Notification Error:", e);
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
            <p style="color: #f9a885; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Sovereign Investment Protocol</p>
          </div>
          <div style="background-color: #fcfdfe; padding: 30px; border-radius: 15px; text-align: center;">
            <p style="color: #444; font-size: 16px;">أهلاً بك في بروتوكول ناميكس المعتمد. يرجى استخدام الرمز التالي لتأمين دخولك:</p>
            <h2 style="color: #002d4d; font-size: 42px; letter-spacing: 10px; margin: 20px 0;">${otp}</h2>
            <p style="color: #888; font-size: 12px;">هذا الرمز صالح لمدة 5 دقائق فقط لضمان أقصى درجات الأمان.</p>
          </div>
          <div style="margin-top: 30px; text-align: center; color: #aaa; font-size: 10px;">
            <p>© 2024 Namix Universal Network. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error('Server Action Error:', e);
    return { success: false, error: e.message };
  }
}

export async function sendAdminResetEmail(email: string, type: 'password' | 'pin', newValue: string) {
  try {
    const typeLabel = type === 'password' ? 'كلمة المرور الجديدة' : 'رمز PIN الجديد للخزنة';
    const typeLabelEn = type === 'password' ? 'New Password' : 'New Vault PIN';

    const { data, error } = await resend.emails.send({
      from: 'Namix Security <auth@namix.pro>',
      to: email,
      subject: `تحديث بيانات الأمان | ${typeLabelEn} Update`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #002d4d; margin: 0;">Namix Security</h1>
            <p style="color: #f9a885; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Sovereign Protection Protocol</p>
          </div>
          <div style="background-color: #fcfdfe; padding: 30px; border-radius: 15px; text-align: center;">
            <p style="color: #444; font-size: 16px;">قام المشرف بإعادة تعيين <strong>${typeLabel}</strong> الخاصة بك بناءً على طلبك أو لدواعٍ أمنية:</p>
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px dashed #002d4d; margin: 20px 0;">
              <h2 style="color: #002d4d; font-size: 32px; letter-spacing: 2px; margin: 0;">${newValue}</h2>
            </div>
            <p style="color: #888; font-size: 12px;">يرجى تسجيل الدخول وتغيير هذه البيانات فوراً من إعدادات الملف الشخصي لضمان سيادتك الكاملة.</p>
          </div>
          <div style="margin-top: 30px; text-align: center; color: #aaa; font-size: 10px;">
            <p>تم إرسال هذا البريد آلياً من مركز القيادة والتحكم في ناميكس.</p>
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
        <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 32px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #002d4d; margin: 0; font-size: 28px;">Namix Protocol</h1>
            <p style="color: #f9a885; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: bold;">Official Communication Hub</p>
          </div>
          <div style="background-color: #fcfdfe; padding: 40px; border-radius: 24px; border: 1px solid #f5f7f9;">
            <h2 style="color: #002d4d; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #f9a885; display: inline-block; padding-bottom: 5px;">${title}</h2>
            <p style="color: #445566; font-size: 15px; line-height: 1.8; margin-bottom: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 40px; text-align: center; color: #abbccb; font-size: 9px; line-height: 1.6;">
            <p>تم إرسال هذه الرسالة الرسمية بناءً على بروتوكول التواصل المعتمد في منصة ناميكس.</p>
            <p>© 2024 Namix Universal Network. Global Asset Protection. All rights reserved.</p>
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
