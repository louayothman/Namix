'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment, addDoc, limit, deleteDoc } from 'firebase/firestore';
import { sendOTPEmail } from './auth-actions';

/**
 * @fileOverview محرك عمليات الهوية والتدفقات المباشرة v17.0 - Visual Identity Hub
 * تم تحديث الترحيب والتوثيق ليعكس الهوية البصرية الفخمة لناميكس وتفعيل الربط الوميضي.
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

/**
 * وظيفة مركزية لإرسال إشعارات تلغرام من أجزاء النظام المختلفة
 */
export async function notifyTelegramUser(userId: string, message: string) {
  try {
    const { firestore } = initializeFirebase();
    const userSnap = await getDoc(doc(firestore, "users", userId));
    const user = userSnap.data();
    if (!user?.telegramChatId) return;

    const botToken = await getActiveBotToken();
    if (!botToken) return;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: user.telegramChatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (e) {}
}

export async function sendTelegramOTP(email: string) {
  try {
    const { firestore } = initializeFirebase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 300000).toISOString();
    
    await setDoc(doc(firestore, "otp_verifications", email), { code: otpCode, expiresAt });
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

export async function sendWelcomeMessage(botToken: string, chatId: string) {
  const text = `
🔐 *أهلاً بك في NAMIX || بوت تداول بالذكاء الاصطناعي*

مكان مخصص لمن يفضل التداول برؤية أوضح وقرارات أكثر دقة.

📊 إشارات مدروسة وتحليل احترافي  
⚡ تنفيذ مباشر من داخل البوت  
🎯 فرص مختارة بعناية بدل الضجيج

افتح حساباً مجانياً أو سجل دخولك بحساب ناميكس الحالي.
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [{ text: "💎 فتح حساب مجاني", callback_data: "user_signup" }, { text: "🔑 تسجيل الدخول", callback_data: "user_login" }]
    ]
  };

  // استخدام صورة الهوية العامة (OG Image)
  const photoUrl = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop";

  await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption: text,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  });
}

export async function registerTelegramUser(data: any) {
  try {
    const { firestore } = initializeFirebase();
    const dupQuery = query(collection(firestore, "users"), where("email", "==", data.email.toLowerCase()), limit(1));
    const dupSnap = await getDocs(dupQuery);
    if (!dupSnap.empty) return { success: false, error: "هذا البريد مسجل مسبقاً." };

    const onboardSnap = await getDoc(doc(firestore, "system_settings", "onboarding"));
    const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;
    
    const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const namixId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newUser = {
      id: userId, namixId, email: data.email.toLowerCase(), displayName: data.fullName,
      password: data.password, telegramChatId: data.chatId.toString(),
      totalBalance: trialAmount, welcomeBonus: trialAmount, referralCode,
      activeInvestmentsTotal: 0, totalProfits: 0, role: "user", createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", userId), newUser);
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
    if (!botToken) return { success: false };

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
      formData.append('photo', new Blob([binaryData], { type: 'image/jpeg' }), 'id_card.jpg');
      formData.append('caption', caption);
    } else {
      formData.append('text', caption);
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, { method: 'POST', body: formData });
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
    text = `👤 *تفاصيل المركز المالي*\n\n💰 الرصيد الحالي: *$${user.totalBalance?.toLocaleString()}*\n📈 إجمالي الأرباح: *$${user.totalProfits?.toLocaleString()}*\n🛡️ العقود النشطة: *$${user.activeInvestmentsTotal?.toLocaleString()}*\n\n_يتم تحديث البيانات لحظياً عبر محركات ناميكس._`;
  }

  else if (action === 'user_partners') {
    const refLink = `https://${host}/login?ref=${user.referralCode}`;
    text = `👥 *مركز الشركاء والقادة*\n\n🔗 رابط الدعوة الخاص بك:\n\`${refLink}\`\n\n🎁 اكسب عمولات فورية عند انضمام مستثمرين جدد عبر رابطك المخصص.`;
    keyboard.inline_keyboard = [
      [{ text: "📤 مشاركة الرابط", url: `https://t.me/share/url?url=${encodeURIComponent(refLink)}` }],
      [{ text: "🔙 رجوع", callback_data: "user_home" }]
    ];
  }

  else if (action === 'user_deposit') {
    const depCats = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
    text = `📥 *بوابات الإيداع المباشر*\n\nاختر وسيلة الشحن المناسبة لفتح بوابة الدفع الموثقة في التطبيق المصغر:`;
    keyboard.inline_keyboard = depCats.docs.map(d => {
      const url = `https://${host}/deposit/${d.id}`;
      return [{ text: `💳 ${d.data().name}`, web_app: { url } }];
    });
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_withdraw') {
    const withCats = await getDocs(query(collection(firestore, "withdraw_methods"), where("isActive", "==", true)));
    text = `📤 *بوابات السحب المعتمدة*\n\nحدد وجهة تحويل الأرباح لفتح نافذة الصرف الموثقة:`;
    keyboard.inline_keyboard = withCats.docs.map(d => {
      const url = `https://${host}/withdraw/${d.id}`;
      return [{ text: `🏧 ${d.data().name}`, web_app: { url } }];
    });
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_invest') {
    const plans = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
    text = `🔬 *مختبر العقود الاستراتيجية*\n\nاختر خطة النمو المناسبة لتفعيلها في محفظتك:`;
    keyboard.inline_keyboard = plans.docs.map(d => {
      const p = d.data();
      const label = p.isPopular ? `💎 ${p.title} (%${p.profitPercent})` : `${p.title} (%${p.profitPercent})`;
      const url = `https://${host}/invest?planId=${d.id}`;
      return [{ text: label, web_app: { url } }];
    });
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_trade') {
    const symbols = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
    text = `📊 *محطة التداول الفوري*\n\nحدد السوق المالي المطلوب لبدء مراقبة النبض والتنفيذ:`;
    keyboard.inline_keyboard = symbols.docs.map(d => {
      const s = d.data();
      const url = `https://${host}/trade/${d.id}`;
      return [{ text: `📈 ${s.name}`, web_app: { url } }];
    });
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_logout') {
    if (userDoc) await updateDoc(userDoc.ref, { telegramChatId: "" });
    await fetch(`https://api.telegram.org/bot${botToken}/unpinChatMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId }) });
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId, message_id: messageId,
        caption: "🔐 تم تسجيل الخروج بنجاح. نأمل رؤيتك قريباً.",
        reply_markup: { inline_keyboard: [[{ text: "🔑 تسجيل الدخول", callback_data: "user_login" }, { text: "💎 فتح حساب مجاني", callback_data: "user_signup" }]] }
      })
    });
    return;
  }

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, caption: text, parse_mode: 'Markdown', reply_markup: keyboard })
  });
}
