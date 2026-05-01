
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات المستخدمين عبر تلغرام v2.0 - Signup Flow
 * تم إضافة وظائف إرسال دعوة التسجيل وتنفيذ إنشاء الحساب الفعلي.
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
  
  // رابط واجهة التسجيل مع تمرير البيانات للتعرف الآلي
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
    
    // 1. التحقق من عدم وجود البريد مسبقاً
    const qEmail = query(collection(firestore, "users"), where("email", "==", formData.email.toLowerCase()));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) return { success: false, error: "هذا البريد الإلكتروني مسجل مسبقاً." };

    // 2. التحقق من عدم وجود الحساب المرتبط بتلغرام مسبقاً
    const qChat = query(collection(firestore, "users"), where("telegramChatId", "==", formData.chatId));
    const snapChat = await getDocs(qChat);
    if (!snapChat.empty) return { success: false, error: "هذا الحساب في تلغرام مرتبط بالفعل بمستثمر آخر." };

    // 3. جلب إعدادات الترحيب
    const onboardSnap = await getDoc(doc(firestore, "system_settings", "onboarding"));
    const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;

    // 4. توليد المعرفات
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
      email: formData.email.toLowerCase(),
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
