
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment, addDoc, limit, deleteDoc } from 'firebase/firestore';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * @fileOverview محرك عمليات الهوية والتدفقات المباشرة v36.0 - Partner Insight Update
 * تم تطوير قسم الشركاء ليقوم بجرد الشبكة لحظياً وعرض العمولات المحققة.
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

/**
 * تحديث وسائط الرسالة المثبتة (Image Injection)
 */
async function editBotMessageMedia(chatId: string, message_id: string, imageKey: string, caption: string, replyMarkup: any) {
  const botToken = await getActiveBotToken();
  if (!botToken) return;

  const imageUrl = `${SITE_CONFIG.url}/${imageKey}`;

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageMedia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: message_id,
      media: {
        type: 'photo',
        media: imageUrl,
        caption: caption,
        parse_mode: 'Markdown'
      },
      reply_markup: replyMarkup
    })
  });
}

export async function sendUserSuccessBriefing(chatId: string, user: any, imageUri?: string) {
  try {
    const botToken = await getActiveBotToken();
    if (!botToken) return { success: false };

    const caption = `
👋 *مرحباً ${user.displayName} !!*
أهلاً بك في لوحة التحكم المركزية لـ ناميكس نكسوس ::

📌 *بيانات حسابك:*
• 👤 الاسم: ${user.displayName}
• 📧 البريد: ${user.email}
• 🆔 المعرف: \`${user.namixId}\`

🚀 *إدارة الأصول والنمو اللحظي:*
    `.trim();

    const keyboard = {
      inline_keyboard: [
        [{ text: "👤 حسابي", callback_data: "user_account" }, { text: "👥 الشركاء", callback_data: "user_partners" }],
        [{ text: "📥 إيداع", callback_data: "user_deposit" }, { text: "📤 سحب", callback_data: "user_withdraw" }],
        [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول الفوري", callback_data: "user_trade" }],
        [{ text: "⚙️ الإعدادات", callback_data: "user_settings" }],
        [{ text: "🚪 تسجيل الخروج", callback_data: "user_logout" }]
      ]
    };

    const imageUrl = imageUri || `${SITE_CONFIG.url}/account.png`;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: imageUrl,
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      })
    });
    
    const resData = await res.json();
    if (resData.ok && resData.result.message_id) {
      await fetch(`https://api.telegram.org/bot${botToken}/pinChatMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, message_id: resData.result.message_id })
      });
    }
    return { success: true };
  } catch (e) { return { success: false }; }
}

export async function handleTelegramMenuAction(botToken: string, chatId: string, messageId: string, action: string, host: string) {
  const { firestore } = initializeFirebase();
  const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId.toString()), limit(1));
  const userSnap = await getDocs(userQuery);
  
  if (userSnap.empty && !['user_logout', 'user_login', 'user_signup'].includes(action)) return;
  
  const userDoc = userSnap.docs[0];
  const user = userDoc?.data();

  let text = "";
  let image = "account.png";
  let keyboard: any = { inline_keyboard: [[{ text: "🔙 رجوع للقائمة الرئيسية", callback_data: "user_home" }]] };

  if (action === 'user_home') {
    text = `👋 *مرحباً ${user.displayName} !!*\nأهلاً بك مجدداً في لوحة تحكم ناميكس الاستراتيجية.\n\n📌 *بيانات حسابك:*\n• 👤 الاسم: ${user.displayName}\n• 📧 البريد: ${user.email}\n• 🆔 المعرف: \`${user.namixId}\``;
    image = "account.png";
    keyboard.inline_keyboard = [
      [{ text: "👤 حسابي", callback_data: "user_account" }, { text: "👥 الشركاء", callback_data: "user_partners" }],
      [{ text: "📥 إيداع", callback_data: "user_deposit" }, { text: "📤 سحب", callback_data: "user_withdraw" }],
      [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول الفوري", callback_data: "user_trade" }],
      [{ text: "⚙️ الإعدادات", callback_data: "user_settings" }],
      [{ text: "🚪 تسجيل الخروج", callback_data: "user_logout" }]
    ];
  } 

  else if (action === 'user_account') {
    text = `👤 *تفاصيل الهوية المالية*\n\nالاسم: ${user.displayName}\nالرصيد الجاري: *$${user.totalBalance.toLocaleString()}*\nإجمالي الأرباح: *$${user.totalProfits.toLocaleString()}*\n\n_تم مزامنة البيانات عبر محرك ناميكس اللحظي._`;
    image = "account.png";
  }

  else if (action === 'user_partners') {
    // جرد الشركاء لحظياً من قاعدة البيانات
    const referralsQuery = query(collection(firestore, "users"), where("referredBy", "==", userDoc.id));
    const referralsSnap = await getDocs(referralsQuery);
    const referralCount = referralsSnap.size;
    const referralEarnings = user.referralEarnings || 0;

    text = `👥 *مركز الشركاء والسفراء*\n\n• عدد الشركاء المباشرين: *${referralCount}*\n• عمولات الشبكة المحققة: *$${referralEarnings.toLocaleString()}*\n• كود الدعوة الخاص بك: \`${user.referralCode}\`\n\n_شارك رابط إحالتك لتنمية شبكتك وزيادة عوائد محفظتك الجارية._`;
    image = "share.png";
  }

  else if (action === 'user_deposit') {
    text = `📥 *بوابة تدفق السيولة*\n\nيمكنك شحن رصيدك عبر القنوات المعتمدة آلياً أو يدوياً. اختر المسار الأنسب لك لمتابعة النمو.`;
    image = "deposit.png";
  }

  else if (action === 'user_withdraw') {
    text = `📤 *بوابة صرف الأرباح*\n\nحوّل أرباحك إلى محفظتك الخارجية بلمسة واحدة. تخضع العمليات لتدقيق الملاءة المالية لضمان الأمان.`;
    image = "withdrawal.png";
  }

  else if (action === 'user_invest') {
    text = `🔬 *مختبر العقود التشغيلية*\n\nاختر من مصفوفة الخطط الاستثمارية المتاحة؛ كل عقد يمثل وحدة نمو مؤتمتة تعمل لصالحك على مدار الساعة.`;
    image = "invest.png";
  }
  
  else if (action === 'user_settings') {
    text = `⚙️ *إعدادات المنظومة والنبض*\n\nتحكم في بروتوكولات التداول الآلي وتخصيص إشارات الأسواق التي تود استلامها بأسلوب مخصص:`;
    image = "setting.png";
    keyboard.inline_keyboard = [
      [{ text: "🤖 التداول الآلي (Auto-Pilot)", callback_data: "user_set_autopilot" }],
      [{ text: "📊 تخصيص رادار الإشارات", callback_data: "user_set_signals" }],
      [{ text: "🔙 رجوع", callback_data: "user_home" }]
    ];
  }

  else if (action === 'user_logout') {
    if (userDoc) await updateDoc(userDoc.ref, { telegramChatId: "" });
    await fetch(`https://api.telegram.org/bot${botToken}/unpinChatMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId }) });
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: `${SITE_CONFIG.url}/signout.png`,
        caption: "🔐 *تم إنهاء الجلسة الآمنة بنجاح*\n\nلقد تم فصل هويتك الرقمية عن تلغرام. نأمل رؤيتك قريباً في ناميكس.",
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: "🔑 تسجيل الدخول مجدداً", callback_data: "user_login" }]] }
      })
    });
    return;
  }

  await editBotMessageMedia(chatId, messageId, image, text, keyboard);
}

export async function sendWelcomeMessage(botToken: string, chatId: string) {
  const text = "💎 *مرحباً بك في ناميكس نكسوس*\n\nأنت الآن في قلب المحرك الأكثر تقدماً لإدارة الأصول الرقمية. يرجى تفعيل هويتك الرقمية للوصول لقمرة القيادة الموحدة.";
  const keyboard = {
    inline_keyboard: [
      [{ text: "🔑 تسجيل الدخول", callback_data: "user_login" }],
      [{ text: "⚡ تفعيل حساب جديد", callback_data: "user_signup" }]
    ]
  };

  await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: `${SITE_CONFIG.url}/signin.png`,
      caption: text,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  });
}

export async function loginTelegramUser(data: { email: string, password: string, chatId: string }) {
  const { firestore } = initializeFirebase();
  const q = query(collection(firestore, "users"), where("email", "==", data.email.toLowerCase()), limit(1));
  const snap = await getDocs(q);
  
  if (snap.empty) return { success: false, error: "المستخدم غير موجود." };
  const userDoc = snap.docs[0];
  const user = userDoc.data();
  
  if (user.password !== data.password) return { success: false, error: "كلمة المرور خاطئة." };
  
  await updateDoc(userDoc.ref, { telegramChatId: data.chatId.toString() });
  return { success: true, user: { id: userDoc.id, ...user } };
}

export async function registerTelegramUser(data: any) {
  const { firestore } = initializeFirebase();
  const q = query(collection(firestore, "users"), where("email", "==", data.email.toLowerCase()), limit(1));
  const snap = await getDocs(q);
  
  if (!snap.empty) return { success: false, error: "البريد مسجل مسبقاً." };

  const userId = Math.random().toString(36).substr(2, 9);
  const namixId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const referralCode = Math.random().toString(36).substr(2, 8).toUpperCase();

  const onboardSnap = await getDoc(doc(firestore, "system_settings", "onboarding"));
  const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;

  const newUser = {
    id: userId,
    namixId,
    referralCode,
    email: data.email.toLowerCase(),
    displayName: data.fullName,
    password: data.password,
    telegramChatId: data.chatId.toString(),
    totalBalance: trialAmount,
    welcomeBonus: trialAmount,
    totalProfits: 0,
    activeInvestmentsTotal: 0,
    role: "user",
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(firestore, "users", userId), newUser);
  return { success: true, user: newUser };
}

export async function sendTelegramOTP(email: string) {
  const { firestore } = initializeFirebase();
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await setDoc(doc(firestore, "otp_verifications", email.toLowerCase()), {
    code: otpCode,
    expiresAt: new Date(Date.now() + 300000).toISOString()
  });
  
  // نفترض وجود دالة إرسال بريد حقيقية هنا
  console.log(`[OTP DEBUG] Code for ${email}: ${otpCode}`);
  return { success: true };
}

export async function verifyTelegramOTP(email: string, code: string) {
  const { firestore } = initializeFirebase();
  const snap = await getDoc(doc(firestore, "otp_verifications", email.toLowerCase()));
  if (!snap.exists() || snap.data().code !== code) return { success: false };
  return { success: true };
}

export async function notifyTelegramUser(userId: string, message: string) {
  const { firestore } = initializeFirebase();
  const userSnap = await getDoc(doc(firestore, "users", userId));
  if (!userSnap.exists() || !userSnap.data().telegramChatId) return;

  const botToken = await getActiveBotToken();
  if (!botToken) return;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: userSnap.data().telegramChatId,
      text: message,
      parse_mode: 'Markdown'
    })
  });
}
