
'use server';

import { Resend } from 'resend';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { sendTelegramMessage, sendTelegramPhoto, generateMainKeyboard, generateSignalButton } from '@/lib/telegram-bot';

const resend = new Resend('re_GJABmije_GN8S3yKMsCxjNkhm3YvWMnLk');

/**
 * يرسل إشارة تداول مرئية لكافة المشتركين في البوت (Bot Subscribers)
 * تم تعديل مصدر البيانات لضمان وصول الإشارات للزوار والمسجلين معاً.
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

    // حماية: إشارة واحدة كل دقيقتين لنفس الأصل لضمان الزخم دون إزعاج
    if (now - lastSignalTime < 120000) return { success: false, reason: "Throttled" };

    await setDoc(configRef, { [lastSignalKey]: now }, { merge: true });

    const tgConfigSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = tgConfigSnap.data()?.botToken;
    if (!botToken) return { success: false, reason: "Token Missing" };

    // سحب كافة المشتركين في البوت (قناة البث العامة)
    const subscribersSnap = await getDocs(collection(firestore, "bot_subscribers"));
    const chatIds = subscribersSnap.docs.map(d => d.id);

    if (chatIds.length === 0) return { success: false, reason: "No Subscribers" };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";
    const baseAsset = symbolCode.split('/')[0].toUpperCase();
    
    // أيقونة السوق الملونة لتعزيز المظهر الاحترافي
    const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${baseAsset.toLowerCase()}.png`;
    
    const message = `<b>🔥 Tactical Signal / إشارة استراتيجية</b>\n\nAsset: <b>${symbolCode}</b>\nAction: <b>${action === 'buy' ? 'BUY / شراء 📈' : 'SELL / بيع 📉'}</b>\nConfidence: <b>%${confidence.toFixed(1)}</b>\nPrice: <b>$${price.toLocaleString()}</b>\n\n<i>Detected via NAMIX AI Neural Core.</i>`;
    const replyMarkup = generateSignalButton(baseUrl, symbolId, action);

    // البث الجماعي المرئي
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
 * يرسل نتيجة إشارة تداول ناجحة لكافة المشتركين (Bot Subscribers)
 */
export async function broadcastSignalOutcome(symbolCode: string, result: 'win' | 'lose', profit: number) {
  try {
    if (result !== 'win') return;

    const { firestore } = initializeFirebase();
    const tgConfigSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = tgConfigSnap.data()?.botToken;
    if (!botToken) return;

    // سحب كافة المشتركين لبث الخبر السار
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
 * يعتمد على معرف تلغرام المربوط بالمستثمر عبر المزامنة الصامتة.
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
 * تنبيه السفراء عند انضمام شريك جديد
 */
export async function notifyNewReferral(referrerId: string, newUserName: string) {
  const message = `<b>👥 New Partner / شريك جديد</b>\n\n<b>${newUserName}</b> joined your network.\nانضم شريك جديد لشبكتك العالمية الآن.\n\n<i>Maintain leadership for higher yields.</i>`;
  await sendTelegramNotification(referrerId, message);
}

/**
 * تنبيه عند الرد على تذكرة دعم
 */
export async function notifySupportReply(userId: string) {
  const message = `<b>🎧 Support Update / رد الدعم الفني</b>\n\nThe technical department has responded to your ticket.\nقام القسم التقني بالرد على استفسارك الآن.\n\n<i>Check your profile for details.</i>`;
  await sendTelegramNotification(userId, message);
}

/**
 * تنبيه الاكتتابات الوميضية للبث العام
 */
export async function notifyFlashPlan(planTitle: string, profit: number) {
  try {
    const { firestore } = initializeFirebase();
    const tgConfigSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const botToken = tgConfigSnap.data()?.botToken;
    if (!botToken) return;

    const subscribersSnap = await getDocs(collection(firestore, "bot_subscribers"));
    const chatIds = subscribersSnap.docs.map(d => d.id);

    const message = `<b>⚡ Flash Protocol / اكتتاب وميضي</b>\n\nNew Opportunity: <b>${planTitle}</b>\nYield Rate: <b>%${profit}</b>\n\n<i>Available for a limited time in Contract Lab.</i>`;

    const sendPromises = chatIds.map(chatId => 
      sendTelegramMessage(botToken, chatId, message).catch(() => {})
    );
    await Promise.all(sendPromises);
  } catch (e) {}
}

/**
 * تحديث معرف تلغرام بصمت (Silent Identity Sync)
 * يتم استدعاؤها من الصفحة الرئيسية لربط الهوية المالية بمعرف تلغرام.
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
