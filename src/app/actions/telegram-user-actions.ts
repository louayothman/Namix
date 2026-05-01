'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات المستخدمين عبر تلغرام v5.0 - Integrated Command Hub
 * يدير الهوية، الترحيب، ونظام القوائم الديناميكية الموحدة بداخل تلغرام.
 */

const FORBIDDEN_WORDS = [/سيادة/g, /بروتوكول/g, /ميثاق/g, /استخبارات/g, /مفاعل/g];
const cleanText = (text: string) => {
  let cleaned = text;
  cleaned = cleaned.replace(/سيادة/g, "احترافية");
  cleaned = cleaned.replace(/بروتوكول/g, "نظام");
  cleaned = cleaned.replace(/ميثاق/g, "دليل");
  cleaned = cleaned.replace(/استخبارات/g, "تحليلات");
  cleaned = cleaned.replace(/مفاعل/g, "محرك");
  return cleaned;
};

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
    return { success: false };
  }
}

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
    inline_keyboard: [[{ text: "⚡ تفعيل الهوية الرقمية", web_app: { url: signupUrl } }]]
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: caption, parse_mode: 'Markdown', reply_markup: keyboard })
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

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
    inline_keyboard: [[{ text: "🔑 تسجيل دخول مؤمن", web_app: { url: loginUrl } }]]
  };

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: caption, parse_mode: 'Markdown', reply_markup: keyboard })
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

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

    const onboardSnap = await getDoc(doc(firestore, "system_settings", "onboarding"));
    const trialAmount = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;

    const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const namixId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let referralCode = "";
    for(let i=0; i<8; i++) referralCode += chars.charAt(Math.floor(Math.random() * chars.length));

    const newUser = {
      id: userId, namixId, referralCode, telegramChatId: formData.chatId,
      email: emailLower, displayName: formData.fullName, password: formData.password,
      role: "user", totalBalance: trialAmount, welcomeBonus: trialAmount,
      totalProfits: 0, activeInvestmentsTotal: 0, isVerified: false, createdAt: new Date().toISOString()
    };

    await setDoc(doc(firestore, "users", userId), newUser);
    return { success: true, user: newUser };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

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
    
    await updateDoc(userDoc.ref, { telegramChatId: formData.chatId, lastActive: new Date().toISOString() });
    return { success: true, user: { id: userDoc.id, ...userData, telegramChatId: formData.chatId } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * إرسال التقرير الترحيبي وتثبيته مع القائمة الرئيسية
 */
export async function sendUserSuccessBriefing(botToken: string, chatId: string, user: any, imageUri: string) {
  try {
    const base64Data = imageUri.split(',')[1];
    const binaryData = Buffer.from(base64Data, 'base64');
    const photoBlob = new Blob([binaryData], { type: 'image/jpeg' });

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
        [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول", callback_data: "user_trade" }],
        [{ text: "🚪 خروج", callback_data: "user_logout" }]
      ]
    };

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', photoBlob, 'id_card.jpg');
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    formData.append('reply_markup', JSON.stringify(keyboard));

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: formData });
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

/**
 * محرك إدارة القوائم الديناميكية (Dynamic Command Hub)
 */
export async function handleTelegramMenuAction(botToken: string, chatId: string, messageId: string, action: string) {
  const { firestore } = initializeFirebase();
  const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId.toString()), limit(1));
  const userSnap = await getDocs(userQuery);
  if (userSnap.empty && action !== 'user_logout') return;
  const user = userSnap.docs[0]?.data();

  let text = "";
  let keyboard: any = { inline_keyboard: [[{ text: "🔙 رجوع", callback_data: "user_home" }]] };

  switch(action) {
    case 'user_home':
      text = `👋 *مرحباً ${user.displayName} !!*\nتم تسجيل دخولك بنجاح إلى NAMIX ::\n\n📌 *بيانات حسابك:*\n• 👤 الاسم: ${user.displayName}\n• 📧 البريد الالكتروني: ${user.email}\n• 🆔 المعرف الرقمي: \`${user.namixId}\`\n\n🚀 *يمكنك الآن إدارة أصولك مباشرة من هنا:*`;
      keyboard.inline_keyboard = [
        [{ text: "👤 حسابي", callback_data: "user_account" }, { text: "👥 الشركاء", callback_data: "user_partners" }],
        [{ text: "📥 إيداع", callback_data: "user_deposit" }, { text: "📤 سحب", callback_data: "user_withdraw" }],
        [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول", callback_data: "user_trade" }],
        [{ text: "🚪 خروج", callback_data: "user_logout" }]
      ];
      break;

    case 'user_account':
      text = `👤 *تفاصيل المركز المالي*\n\n💰 الرصيد الحالي: *$${user.totalBalance?.toLocaleString()}*\n📈 إجمالي الأرباح: *$${user.totalProfits?.toLocaleString()}*\n🛡️ العقود النشطة: *$${user.activeInvestmentsTotal?.toLocaleString()}*\n\n_يتم تحديث البيانات لحظياً عبر نظام ناميكس المتطور._`;
      break;

    case 'user_partners':
      const refLink = `https://namix.pro/login?ref=${user.referralCode}`;
      text = `👥 *مركز الشركاء والقادة*\n\n🔗 رابط الدعوة الخاص بك:\n\`${refLink}\`\n\n🎁 اكسب عمولات فورية عند انضمام مستثمرين جدد عبر رابطك المخصص. شارك النجاح وقم بتنمية شبكتك الآن!`;
      keyboard.inline_keyboard.unshift([{ text: "🔗 نسخ الرابط المخصص", callback_data: "user_partners" }]);
      break;

    case 'user_deposit':
      const depCats = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
      text = `📥 *بوابات استلام الأموال*\n\nاختر وسيلة الشحن المناسبة لتعزيز رصيدك الاستثماري:`;
      keyboard.inline_keyboard = depCats.docs.map(d => [{ text: `💳 ${d.data().name}`, callback_data: `user_home` }]);
      keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
      break;

    case 'user_withdraw':
      text = `📤 *بوابات سحب الأرباح*\n\nحدد وجهة تحويل الأموال المتاحة لك حالياً:`;
      const withCats = await getDocs(query(collection(firestore, "withdraw_methods"), where("isActive", "==", true)));
      keyboard.inline_keyboard = withCats.docs.map(d => [{ text: `🏧 ${d.data().name}`, callback_data: `user_home` }]);
      keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
      break;

    case 'user_invest':
      text = `🔬 *مختبر العقود الاستثمارية*\n\nاكتشف فرص النمو المتاحة بضمانات ناميكس المعتمدة:`;
      const plans = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
      keyboard.inline_keyboard = plans.docs.map(p => [{ text: `💎 ${p.data().title} (%${p.data().profitPercent})`, callback_data: `user_home` }]);
      keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
      break;

    case 'user_trade':
      text = `📊 *محطة التداول الفوري*\n\nاختر السوق المناسب لبدء اقتناص الفرص اللحظية:`;
      const symbols = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true), limit(5)));
      keyboard.inline_keyboard = symbols.docs.map(s => [{ text: `🚀 تداول ${s.data().code}`, callback_data: `user_home` }]);
      keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
      break;

    case 'user_logout':
      await updateDoc(userSnap.docs[0].ref, { telegramChatId: "" });
      await fetch(`https://api.telegram.org/bot${botToken}/unpinChatMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId }) });
      await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          caption: "🔐 تم تسجيل الخروج بنجاح. نأمل رؤيتك قريباً في NAMIX.",
          reply_markup: { inline_keyboard: [[{ text: "🔑 دخول مؤمن", callback_data: "user_login" }, { text: "💎 فتح حساب", callback_data: "user_signup" }]] }
        })
      });
      return;
  }

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
