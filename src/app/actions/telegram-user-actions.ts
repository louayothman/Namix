'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment, addDoc, limit, deleteDoc } from 'firebase/firestore';
import { sendOTPEmail } from './auth-actions';

/**
 * @fileOverview محرك عمليات المستخدمين عبر تلغرام v12.0 - Advanced Security & UI Fix
 * تم إصلاح تعطل الأزرار وإضافة نظام التحقق المزدوج (OTP) للتسجيل.
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

export async function sendTelegramOTP(email: string) {
  try {
    const { firestore } = initializeFirebase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 300000).toISOString();
    
    await setDoc(doc(firestore, "otp_verifications", email), { 
      code: otpCode, 
      expiresAt 
    });
    
    await sendOTPEmail(email, otpCode);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function verifyTelegramOTP(email: string, code: string) {
  try {
    const { firestore } = initializeFirebase();
    const snap = await getDoc(doc(firestore, "otp_verifications", email));
    if (snap.exists() && snap.data().code === code) {
      await deleteDoc(doc(firestore, "otp_verifications", email));
      return { success: true };
    }
    return { success: false, error: "رمز التحقق غير صحيح." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function registerTelegramUser(data: any) {
  try {
    const { firestore } = initializeFirebase();
    
    // منع تكرار البريد
    const dupQuery = query(collection(firestore, "users"), where("email", "==", data.email.toLowerCase()), limit(1));
    const dupSnap = await getDocs(dupQuery);
    if (!dupSnap.empty) return { success: false, error: "هذا البريد مسجل مسبقاً في النظام." };

    const onboardSnap = await getDoc(doc(firestore, "system_settings", "onboarding"));
    const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;
    
    const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const namixId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // توليد كود إحالة
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    let referredBy = "";
    if (data.invitationCode) {
      const refQuery = query(collection(firestore, "users"), where("referralCode", "==", data.invitationCode.trim().toUpperCase()));
      const refSnap = await getDocs(refQuery);
      if (!refSnap.empty) referredBy = refSnap.docs[0].id;
    }

    const newUser = {
      id: userId,
      namixId,
      email: data.email.toLowerCase(),
      displayName: data.fullName,
      password: data.password,
      telegramChatId: data.chatId.toString(),
      totalBalance: trialAmount,
      welcomeBonus: trialAmount,
      referralCode,
      referredBy,
      activeInvestmentsTotal: 0,
      totalProfits: 0,
      role: "user",
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(firestore, "users", userId), newUser);
    return { success: true, user: newUser };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function loginTelegramUser(data: any) {
  try {
    const { firestore } = initializeFirebase();
    const q = query(collection(firestore, "users"), where("email", "==", data.email.toLowerCase()), limit(1));
    const snap = await getDocs(q);
    
    if (snap.empty) return { success: false, error: "المستخدم غير موجود." };
    const userDoc = snap.docs[0];
    const user = userDoc.data();

    if (user.password !== data.password) return { success: false, error: "كلمة المرور غير صحيحة." };

    await updateDoc(userDoc.ref, { telegramChatId: data.chatId.toString(), lastActive: new Date().toISOString() });
    return { success: true, user: { ...user, id: userDoc.id } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function sendUserSuccessBriefing(chatId: string, user: any, imageUri?: string) {
  try {
    const botToken = await getActiveBotToken();
    if (!botToken) throw new Error("No active bot found");

    const caption = `
👋 *مرحباً ${user.displayName} !!*
تم تسجيل دخولك بنجاح إلى NAMIX ::

📌 *بيانات حسابك:*
• 👤 الاسم: ${user.displayName}
• 📧 البريد الالكتروني: ${user.email}
• 🆔 المعرف الرقمي: \`${user.namixId}\`

🚀 *يمكنك الآن إدارة أصولك مباشرة من هنا:*
  `.trim();

    const keyboard = {
      inline_keyboard: [
        [{ text: "👤 حسابي", callback_data: "user_account" }, { text: "👥 الشركاء", callback_data: "user_partners" }],
        [{ text: "📥 إيداع", callback_data: "user_deposit" }, { text: "📤 سحب", callback_data: "user_withdraw" }],
        [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول الفوري", callback_data: "user_trade" }],
        [{ text: "🚪 تسجيل الخروج", callback_data: "user_logout" }]
      ]
    };

    const endpoint = imageUri ? 'sendPhoto' : 'sendMessage';
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('parse_mode', 'Markdown');
    formData.append('reply_markup', JSON.stringify(keyboard));

    if (imageUri) {
      const base64Data = imageUri.split(',')[1];
      const binaryData = Buffer.from(base64Data, 'base64');
      const photoBlob = new Blob([binaryData], { type: 'image/jpeg' });
      formData.append('photo', photoBlob, 'id_card.jpg');
      formData.append('caption', caption);
    } else {
      formData.append('text', caption);
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, { method: 'POST', body: formData });
    const data = await res.json();
    
    if (data.ok && data.result.message_id) {
      await fetch(`https://api.telegram.org/bot${botToken}/pinChatMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, message_id: data.result.message_id })
      });
    }
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function handleTelegramMenuAction(botToken: string, chatId: string, messageId: string, action: string) {
  const { firestore } = initializeFirebase();
  const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId.toString()), limit(1));
  const userSnap = await getDocs(userQuery);
  
  if (userSnap.empty && action !== 'user_logout') return;
  
  const userDoc = userSnap.docs[0];
  const user = userDoc?.data();

  let text = "";
  let keyboard: any = { inline_keyboard: [[{ text: "🔙 رجوع للقائمة الرئيسية", callback_data: "user_home" }]] };

  if (action === 'user_home') {
    text = `👋 *مرحباً ${user.displayName} !!*\nتم تسجيل دخولك بنجاح إلى NAMIX ::\n\n📌 *بيانات حسابك:*\n• 👤 الاسم: ${user.displayName}\n• 📧 البريد الالكتروني: ${user.email}\n• 🆔 المعرف الرقمي: \`${user.namixId}\`\n\n🚀 *يمكنك الآن إدارة أصولك مباشرة من هنا:*`;
    keyboard.inline_keyboard = [
      [{ text: "👤 حسابي", callback_data: "user_account" }, { text: "👥 الشركاء", callback_data: "user_partners" }],
      [{ text: "📥 إيداع", callback_data: "user_deposit" }, { text: "📤 سحب", callback_data: "user_withdraw" }],
      [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول الفوري", callback_data: "user_trade" }],
      [{ text: "🚪 تسجيل الخروج", callback_data: "user_logout" }]
    ];
  } 
  
  else if (action === 'user_account') {
    text = `👤 *تفاصيل المركز المالي*\n\n💰 الرصيد الحالي: *$${user.totalBalance?.toLocaleString()}*\n📈 إجمالي الأرباح: *$${user.totalProfits?.toLocaleString()}*\n🛡️ العقود النشطة: *$${user.activeInvestmentsTotal?.toLocaleString()}*\n\n_يتم تحديث البيانات لحظياً عبر نظام ناميكس المتطور._`;
  }

  else if (action === 'user_partners') {
    const refLink = `https://namix.pro/login?ref=${user.referralCode}`;
    text = `👥 *مركز الشركاء والقادة*\n\n🔗 رابط الدعوة الخاص بك:\n\`${refLink}\`\n\n🎁 اكسب عمولات فورية عند انضمام مستثمرين جدد عبر رابطك المخصص. شارك النجاح وقم بتنمية شبكتك الآن!`;
    keyboard.inline_keyboard = [
      [{ text: "📤 مشاركة الرابط", url: `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent('انضم إلي في ناميكس وابدأ رحلتك في التداول الذكي!')}` }],
      [{ text: "🔙 رجوع", callback_data: "user_home" }]
    ];
  }

  else if (action === 'user_deposit') {
    const depCats = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
    text = `📥 *بوابات استلام الأموال*\n\nاختر وسيلة الشحن المناسبة لتعزيز رصيدك الاستثماري:`;
    keyboard.inline_keyboard = depCats.docs.map(d => [{ text: `💳 ${d.data().name}`, callback_data: `user_dep_cat_${d.id}` }]);
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_logout') {
    if (userDoc) await updateDoc(userDoc.ref, { telegramChatId: "" });
    await fetch(`https://api.telegram.org/bot${botToken}/unpinChatMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId }) });
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        caption: "🔐 تم تسجيل الخروج بنجاح. نأمل رؤيتك قريباً في NAMIX.",
        reply_markup: { inline_keyboard: [[{ text: "🔑 تسجيل الدخول", callback_data: "user_login" }, { text: "💎 فتح حساب مجاني", callback_data: "user_signup" }]] }
      })
    });
    return;
  }

  // تحديث محتوى الرسالة المثبتة
  await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      caption: text,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  });
}
