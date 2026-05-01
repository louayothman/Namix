
'use client';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment, addDoc, limit, deleteDoc } from 'firebase/firestore';
import { sendOTPEmail } from './auth-actions';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * @fileOverview محرك عمليات الهوية والتدفقات المباشرة v32.0 - Dynamic Media Engine
 * يدير البوت كلوحة تحكم ثابتة مع تبديل الصور حسب نوع الإجراء بداخل الرسالة المثبتة.
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

/**
 * تحديث الوسائط المتعددة (صورة + نص) في رسالة تليجرام موجودة
 */
async function editBotMessageMedia(chatId: string, messageId: string, imageKey: string, caption: string, replyMarkup: any) {
  const botToken = await getActiveBotToken();
  if (!botToken) return;

  const imageUrl = `${SITE_CONFIG.url}/${imageKey}`;

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageMedia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
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

export async function sendWelcomeMessage(botToken: string, chatId: string) {
  const text = `
🔐 *أهلاً بك في NAMIX || قمرة القيادة الاستثمارية*

مكان مخصص لمن يفضل التداول برؤية أوضح وقرارات أكثر دقة عبر محركات الذكاء الاصطناعي.

افتح حساباً مجانياً أو سجل دخولك بحساب ناميكس الحالي لبدء رحلة النمو.
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [{ text: "💎 فتح حساب مجاني", callback_data: "user_signup" }, { text: "🔑 تسجيل الدخول", callback_data: "user_login" }]
    ]
  };

  const photoUrl = `${SITE_CONFIG.url}/telegram_bot.png`;

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

    const imageUrl = imageUri || `${SITE_CONFIG.url}/card-bg.png`;

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
  
  if (userSnap.empty && action !== 'user_logout' && action !== 'user_login' && action !== 'user_signup') return;
  
  const userDoc = userSnap.docs[0];
  const user = userDoc?.data();

  let text = "";
  let image = "card-bg.png";
  let keyboard: any = { inline_keyboard: [[{ text: "🔙 رجوع للقائمة الرئيسية", callback_data: "user_home" }]] };

  if (action === 'user_home') {
    text = `👋 *مرحباً ${user.displayName} !!*\nأهلاً بك مجدداً في لوحة تحكم ناميكس الاستراتيجية.\n\n📌 *بيانات حسابك:*\n• 👤 الاسم: ${user.displayName}\n• 📧 البريد: ${user.email}\n• 🆔 المعرف: \`${user.namixId}\``;
    image = "card-bg.png";
    keyboard.inline_keyboard = [
      [{ text: "👤 حسابي", callback_data: "user_account" }, { text: "👥 الشركاء", callback_data: "user_partners" }],
      [{ text: "📥 إيداع", callback_data: "user_deposit" }, { text: "📤 سحب", callback_data: "user_withdraw" }],
      [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول الفوري", callback_data: "user_trade" }],
      [{ text: "⚙️ الإعدادات", callback_data: "user_settings" }],
      [{ text: "🚪 تسجيل الخروج", callback_data: "user_logout" }]
    ];
  } 
  
  else if (action === 'user_account') {
    text = `👤 *تفاصيل المركز المالي*\n\n💰 الرصيد الجاري: *$${user.totalBalance?.toLocaleString()}*\n📈 صافي الأرباح: *$${user.totalProfits?.toLocaleString()}*\n🛡️ العقود النشطة: *$${user.activeInvestmentsTotal?.toLocaleString()}*\n\n_يتم تحديث البيانات لحظياً عبر محركات ناميكس._`;
    image = "account.png";
    keyboard.inline_keyboard.push([{ text: "📈 عرض السجلات المالية", web_app: { url: `https://${host}/profile` } }]);
  }

  else if (action === 'user_partners') {
    const refLink = `https://${host}/login?ref=${user.referralCode}`;
    text = `👥 *مركز الشركاء والقادة*\n\n🔗 رابط الدعوة الخاص بك:\n\`${refLink}\`\n\n🎁 نظام العمولات يمنحك مكافآت فورية عند نشاط شبكتك المباشرة.`;
    image = "share.png";
    keyboard.inline_keyboard = [
      [{ text: "📤 مشاركة الرابط", url: `https://t.me/share/url?url=${encodeURIComponent(refLink)}` }],
      [{ text: "🔙 رجوع", callback_data: "user_home" }]
    ];
  }

  else if (action === 'user_deposit') {
    const depCats = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
    text = `📥 *بوابات الإيداع والتدفق*\n\nاختر وسيلة الشحن المناسبة لفتح بوابة الدفع الموثقة بلمسة واحدة:`;
    image = "deposit.png";
    keyboard.inline_keyboard = depCats.docs.map(d => ([{ text: `💳 ${d.data().name}`, web_app: { url: `https://${host}/deposit/${d.id}` } }]));
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_withdraw') {
    const withCats = await getDocs(query(collection(firestore, "withdraw_methods"), where("isActive", "==", true)));
    text = `📤 *بوابات السحب المعتمدة*\n\nحدد وجهة تحويل الأرباح المستحقة لفتح نافذة الصرف الموثقة:`;
    image = "withdrawal.png";
    keyboard.inline_keyboard = withCats.docs.map(d => ([{ text: `🏧 ${d.data().name}`, web_app: { url: `https://${host}/withdraw/${d.id}` } }]));
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_invest') {
    const plans = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
    text = `🔬 *مختبر العقود الاستراتيجية*\n\nاختر خطة النمو المناسبة لتفعيلها في محفظتك عبر النافذة الموثقة:`;
    image = "invest.png";
    keyboard.inline_keyboard = plans.docs.map(d => {
      const p = d.data();
      const label = p.isPopular ? `💎 ${p.title} (%${p.profitPercent})` : `${p.title} (%${p.profitPercent})`;
      return [{ text: label, web_app: { url: `https://${host}/invest?planId=${d.id}` } }];
    });
    keyboard.inline_keyboard.push([{ text: "🔙 رجوع", callback_data: "user_home" }]);
  }

  else if (action === 'user_settings') {
    const isAuto = !!user.isChatAutoTradeEnabled;
    text = `⚙️ *إعدادات المنظومة والنبض*\n\nتحكم في بروتوكولات التداول الآلي وإشعارات الإشارات بأسلوب مخصص:`;
    image = "setting.png";
    keyboard.inline_keyboard = [
      [{ text: isAuto ? "⚪ إيقاف التداول الآلي" : "🤖 تفعيل التداول الآلي (Chat)", callback_data: `user_autotrade_${isAuto}` }],
      [{ text: "📊 تخصيص إشارات الأسواق", callback_data: "user_set_signals" }],
      [{ text: "🔙 رجوع", callback_data: "user_home" }]
    ];
  }

  else if (action === 'user_logout') {
    if (userDoc) await updateDoc(userDoc.ref, { telegramChatId: "" });
    await fetch(`https://api.telegram.org/bot${botToken}/unpinChatMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId }) });
    
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageMedia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId, message_id: messageId,
        media: { type: 'photo', media: `${SITE_CONFIG.url}/signout.png`, caption: "🔐 تم إنهاء الجلسة الآمنة بنجاح. نأمل رؤيتك قريباً.", parse_mode: 'Markdown' },
        reply_markup: { inline_keyboard: [[{ text: "🔑 تسجيل الدخول", callback_data: "user_login" }, { text: "💎 فتح حساب مجاني", callback_data: "user_signup" }]] }
      })
    });
    return;
  }

  if (action === 'user_login' || action === 'user_signup') {
    const route = action === 'user_login' ? 'telegram-login' : 'telegram-signup';
    const img = action === 'user_login' ? 'signin.png' : 'signin.png';
    const msg = action === 'user_login' ? "🔑 *بوابة الدخول الموثق*" : "💎 *تفعيل الهوية الرقمية*";
    
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageMedia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId, message_id: messageId,
        media: { type: 'photo', media: `${SITE_CONFIG.url}/${img}`, caption: `${msg}\n\nيرجى فتح النافذة أدناه لإتمام العملية بشكل مؤمن.`, parse_mode: 'Markdown' },
        reply_markup: { inline_keyboard: [[{ text: "⚡ فتح البوابة", web_app: { url: `https://${host}/auth/${route}?chatId=${chatId}` } }], [{ text: "🔙 رجوع", callback_data: "user_logout" }]] }
      })
    });
    return;
  }

  // تنفيذ تحديث الرسالة المثبتة بالوسائط الجديدة
  await editBotMessageMedia(chatId, messageId, image, text, keyboard);
}
