
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات المستخدمين عبر تلغرام v3.0 - Login & Success Briefing
 * تم إضافة وظائف تسجيل الدخول وإرسال الرسائل المثبتة مع صورة الهوية.
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

/**
 * إرسال دعوة التسجيل التي تفتح التطبيق المصغر (TMA)
 */
export async function sendSignupPrompt(botToken: string, chatId: string, firstName: string) {
  const headersList = await headers();
  const host = headersList.get('host') || "";
  const domain = host.split(':')[0];
  const protocol = domain.includes('localhost') ? 'http' : 'https';
  
  const signupUrl = `${protocol}://${domain}/auth/telegram-signup?chatId=${chatId}&firstName=${encodeURIComponent(firstName)}`;

  const caption = `
🚀 *خطوة واحدة لتفعيل هويتك المالية*

أنت على وشك الانضمام لنخبة المستثمرين. اضغط على الزر أدناه لاستكمال بياناتك وتنشيط محفظتك في أقل من 15 ثانية.
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [
        { text: "⚡ تفعيل الهوية الرقمية", web_app: { url: signupUrl } }
      ]
    ]
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: caption,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      })
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

/**
 * إرسال دعوة تسجيل الدخول (TMA)
 */
export async function sendLoginPrompt(botToken: string, chatId: string) {
  const headersList = await headers();
  const host = headersList.get('host') || "";
  const domain = host.split(':')[0];
  const protocol = domain.includes('localhost') ? 'http' : 'https';
  
  const loginUrl = `${protocol}://${domain}/auth/telegram-login?chatId=${chatId}`;

  const caption = `
🔑 *تسجيل الدخول لحساب NAMIX*

يرجى الضغط على الزر أدناه لتسجيل الدخول وربط حسابك الحالي ببوت الإشعارات والتداول.
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [
        { text: "🔑 تسجيل دخول مؤمن", web_app: { url: loginUrl } }
      ]
    ]
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: caption,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      })
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

/**
 * تنفيذ عملية إنشاء الحساب والربط بـ تلغرام
 */
export async function registerTelegramUser(formData: {
  chatId: string;
  fullName: string;
  email: string;
  password: string;
}) {
  try {
    const { firestore } = initializeFirebase();
    const emailLower = formData.email.toLowerCase().trim();
    
    const qEmail = query(collection(firestore, "users"), where("email", "==", emailLower));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) return { success: false, error: "هذا البريد الإلكتروني مسجل مسبقاً." };

    const qChat = query(collection(firestore, "users"), where("telegramChatId", "==", formData.chatId));
    const snapChat = await getDocs(qChat);
    if (!snapChat.empty) return { success: false, error: "هذا الحساب في تلغرام مرتبط بالفعل بمستثمر آخر." };

    const onboardSnap = await getDoc(doc(firestore, "system_settings", "onboarding"));
    const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;

    const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const namixId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let referralCode = "";
    for(let i=0; i<8; i++) referralCode += chars.charAt(Math.floor(Math.random() * chars.length));

    const newUser = {
      id: userId,
      namixId: namixId,
      referralCode: referralCode,
      telegramChatId: formData.chatId,
      email: emailLower,
      displayName: formData.fullName,
      password: formData.password,
      role: "user",
      totalBalance: trialAmount,
      welcomeBonus: trialAmount,
      totalProfits: 0,
      activeInvestmentsTotal: 0,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(firestore, "users", userId), newUser);

    return { success: true, user: newUser };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * تنفيذ عملية تسجيل الدخول وربط تلغرام
 */
export async function loginTelegramUser(formData: {
  chatId: string;
  email: string;
  password: string;
}) {
  try {
    const { firestore } = initializeFirebase();
    const emailLower = formData.email.toLowerCase().trim();
    
    const q = query(collection(firestore, "users"), where("email", "==", emailLower));
    const snap = await getDocs(q);
    
    if (snap.empty) return { success: false, error: "البريد الإلكتروني غير مسجل." };
    
    const userDoc = snap.docs[0];
    const userData = userDoc.data();
    
    if (userData.password !== formData.password) return { success: false, error: "كلمة المرور غير صحيحة." };
    
    // ربط الـ Chat ID بالحساب
    await updateDoc(userDoc.ref, {
      telegramChatId: formData.chatId,
      lastActive: new Date().toISOString()
    });

    return { success: true, user: { id: userDoc.id, ...userData, telegramChatId: formData.chatId } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * إرسال التقرير الترحيبي النهائي وتثبيت الرسالة
 */
export async function sendUserSuccessBriefing(botId: string, chatId: string, user: any, imageUri: string) {
  try {
    const { firestore } = initializeFirebase();
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return { success: false };
    const bot = botSnap.data();

    const base64Data = imageUri.split(',')[1];
    const binaryData = Buffer.from(base64Data, 'base64');
    const photoBlob = new Blob([binaryData], { type: 'image/jpeg' });

    const caption = `
👋 *مرحباً ${user.displayName} !!*
تم تفعيل وصولك بنجاح إلى NAMIX ::

📌 *بيانات حسابك:*
• 👤 الاسم: ${user.displayName}
• 📧 البريد الالكتروني: ${user.email}
• 🆔 المعرف الرقمي: \`${user.namixId}\`

🚀 *يمكنك الآن:*
• متابعة الإشارات اللحظية
• تنفيذ الصفقات من داخل البوت
• طلب تحليل الأسواق مباشرة
• مراجعة أداء حسابك في أي وقت

💡 *تذكير:* التداول بمسؤولية هو مفتاح النجاح، والقرارات الذكية تبدأ دائماً بالانضباط التقني.

*NAMIX — حسابك بين يديك، والفرص أمامك.*
    `.trim();

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', photoBlob, 'id_card.jpg');
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');

    const res = await fetch(`https://api.telegram.org/bot${bot.token}/sendPhoto`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.ok && data.result.message_id) {
      // تثبيت الرسالة
      await fetch(`https://api.telegram.org/bot${bot.token}/pinChatMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: data.result.message_id,
          disable_notification: false
        })
      });
    }

    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
