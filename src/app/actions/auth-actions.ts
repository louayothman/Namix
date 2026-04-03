
'use server';

import { Resend } from 'resend';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { sendTelegramMessage, sendTelegramPhoto, generateSignalButton } from '@/lib/telegram-bot';

const resend = new Resend('re_GJABmije_GN8S3yKMsCxjNkhm3YvWMnLk');

/**
 * @fileOverview NAMIX AUTH ACTIONS v22.0 - Global Broadcast Core
 * محرك البث والعمليات - تم فصل قناة البث عن سجلات المستخدمين لضمان الشمولية.
 */

/**
 * يرسل إشارة تداول مرئية لكافة المشتركين في البوت (Global Visual Broadcast)
 * يتم الإرسال لكل من ضغط على زر البدء مسجل أو غير مسجل.
 */
export async function broadcastAISignal(symbolId: string, symbolCode: string, action: string, confidence: number, price: number) {
  try {
    const { firestore } = initializeFirebase();
    const configRef = doc(firestore, "system_settings", "trading_ai");
    const configSnap = await getDoc(configRef);
    const configData = configSnap.data();

    const now = Date.now();
    const lastSignalKey = `lastSignalAt_${symbolId}`;
    const lastSignalTime = configData?.[lastSignalKey] || 0;

    // حماية: إشارة واحدة كل دقيقتين لنفس الأصل
    if (now - lastSignalTime < 120000) return { success: false, reason: "Throttled" };

    await setDoc(configRef, { [lastSignalKey]: now }, { merge: true });

    const tgConfigSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = tgConfigSnap.data()?.botToken;
    if (!botToken) return { success: false, reason: "Token Missing" };

    // سحب كافة المشتركين (قناة البث العالمية المستقلة)
    const subscribersSnap = await getDocs(collection(firestore, "bot_subscribers"));
    const chatIds = subscribersSnap.docs.map(d => d.id);

    if (chatIds.length === 0) return { success: false, reason: "No Subscribers" };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";
    const baseAsset = symbolCode.split('/')[0].toUpperCase();
    
    // أيقونة السوق الملونة من المستودع العالمي
    const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${baseAsset.toLowerCase()}.png`;
    
    const message = `<b>🔥 Tactical Signal / إشارة استراتيجية</b>\n\nAsset: <b>${symbolCode}</b>\nAction: <b>${action === 'buy' ? 'BUY / شراء 📈' : 'SELL / بيع 📉'}</b>\nConfidence: <b>%${confidence.toFixed(1)}</b>\nPrice: <b>$${price.toLocaleString()}</b>\n\n<i>Executed via NAMIX Intelligence Core.</i>`;
    const replyMarkup = generateSignalButton(baseUrl, symbolId, action);

    // البث الجماعي الموثق
    const sendPromises = chatIds.map(chatId => 
      sendTelegramPhoto(botToken, chatId, iconUrl, message, replyMarkup).catch(() => 
        sendTelegramMessage(botToken, chatId, message, replyMarkup)
      )
    );

    await Promise.all(sendPromises);
    return { success: true, count: chatIds.length };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * يرسل نتيجة إشارة تداول ناجحة لكافة المشتركين
 */
export async function broadcastSignalOutcome(symbolCode: string, result: 'win' | 'lose', profit: number) {
  try {
    if (result !== 'win') return;

    const { firestore } = initializeFirebase();
    const tgConfigSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = tgConfigSnap.data()?.botToken;
    if (!botToken) return;

    const subscribersSnap = await getDocs(collection(firestore, "bot_subscribers"));
    const chatIds = subscribersSnap.docs.map(d => d.id);

    const message = `<b>🎯 Target Reached / اكتمال الهدف</b>\n\nMarket: <b>${symbolCode}</b>\nOutcome: <b>Success / فوز استثنائي ✅</b>\n\n<i>NAMIX AI proves precision once again.</i>`;

    const sendPromises = chatIds.map(chatId => 
      sendTelegramMessage(botToken, chatId, message).catch(() => {})
    );

    await Promise.all(sendPromises);
  } catch (e) {}
}

/**
 * يرسل إشعاراً خاصاً لمستثمر معين (Personal Notifications)
 */
export async function sendTelegramNotification(userId: string, message: string) {
  try {
    const { firestore } = initializeFirebase();
    const userSnap = await getDoc(doc(firestore, "users", userId));
    const chatId = userSnap.data()?.telegramChatId;

    if (!chatId) return { success: false, reason: "Not Linked" };

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
 * تحديث معرف تلغرام بصمت (Silent Identity Sync)
 */
export async function syncTelegramChatId(userId: string, chatId: string) {
  try {
    const { firestore } = initializeFirebase();
    await updateDoc(doc(firestore, "users", userId), {
      telegramChatId: chatId,
      updatedAt: new Date().toISOString()
    });
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
