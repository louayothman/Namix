
'use client';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment, addDoc, limit, deleteDoc } from 'firebase/firestore';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * @fileOverview محرك عمليات الهوية والتدفقات المباشرة v33.0 - Settings & Filtering
 * تم إضافة منطق إدارة إعدادات الإشارات (الأسواق، الفترات، الثقة) المخصصة للمستخدم.
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

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
  
  if (userSnap.empty && !['user_logout', 'user_login', 'user_signup'].includes(action)) return;
  
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
  
  else if (action === 'user_settings') {
    text = `⚙️ *إعدادات المنظومة والنبض*\n\nتحكم في بروتوكولات التداول الآلي وتخصيص إشارات الأسواق التي تود استلامها بأسلوب مخصص:`;
    image = "setting.png";
    keyboard.inline_keyboard = [
      [{ text: "🤖 التداول الآلي (Auto-Pilot)", callback_data: "user_set_autopilot" }],
      [{ text: "📊 تخصيص رادار الإشارات", callback_data: "user_set_signals" }],
      [{ text: "🔙 رجوع", callback_data: "user_home" }]
    ];
  }

  else if (action === 'user_set_signals') {
    text = `📊 *تخصيص رادار الإشارات*\n\nقم بتحديد الفلاتر التي تضمن استلامك للإشارات الأكثر دقة وتوافقاً مع استراتيجيتك:`;
    image = "setting.png";
    keyboard.inline_keyboard = [
      [{ text: "🎯 تحديد الأسواق المفضلة", callback_data: "set_sig_symbols" }],
      [{ text: "⚡ الحد الأدنى للثقة", callback_data: "set_sig_conf" }],
      [{ text: "⏳ فترات النبض", callback_data: "set_sig_freq" }],
      [{ text: "📉 نوع الإشارة (بيع/شراء)", callback_data: "set_sig_type" }],
      [{ text: "🔙 رجوع", callback_data: "user_settings" }]
    ];
  }

  else if (action === 'set_sig_type') {
    text = `📉 *تحديد نوع الإشارات المستلمة*\n\nاختر نوع العمليات التي تود أن يقوم الرادار بتنبيهك إليها بداخل الدردشة:`;
    keyboard.inline_keyboard = [
      [{ text: "🟢 شراء فقط (LONG)", callback_data: "save_sig_type_BUY" }],
      [{ text: "🔴 بيع فقط (SHORT)", callback_data: "save_sig_type_SELL" }],
      [{ text: "🔄 الكل (BUY & SELL)", callback_data: "save_sig_type_BOTH" }],
      [{ text: "🔙 رجوع", callback_data: "user_set_signals" }]
    ];
  }

  else if (action.startsWith('save_sig_type_')) {
    const type = action.replace('save_sig_type_', '');
    await updateDoc(userDoc.ref, { 'signalSettings.type': type });
    text = `✅ *تم تحديث بروتوكول الإشارات*\n\nستصلك الآن إشارات الـ ${type === 'BOTH' ? 'شراء والبيع' : type === 'BUY' ? 'شراء' : 'بيع'} فقط.`;
  }

  else if (action === 'set_sig_conf') {
    text = `⚡ *تحديد عتبة الثقة (Min Confidence)*\n\nلن تصلك أي إشارة إلا إذا تجاوزت نسبة الثقة التي حددتها أدناه لضمان جودة الدخول:`;
    keyboard.inline_keyboard = [
      [{ text: "%60+ (عالي)", callback_data: "save_sig_conf_60" }, { text: "%75+ (مؤكد)", callback_data: "save_sig_conf_75" }],
      [{ text: "%85+ (نخبوي)", callback_data: "save_sig_conf_85" }, { text: "%95+ (فائق)", callback_data: "save_sig_conf_95" }],
      [{ text: "🔙 رجوع", callback_data: "user_set_signals" }]
    ];
  }

  else if (action.startsWith('save_sig_conf_')) {
    const conf = Number(action.replace('save_sig_conf_', ''));
    await updateDoc(userDoc.ref, { 'signalSettings.minConfidence': conf });
    text = `✅ *تم ضبط عتبة الثقة لـ %${conf}*\n\nسيقوم الرادار الآن بحجب كافة الإشارات التي لا تستوفي هذا المعيار التقني.`;
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

  await editBotMessageMedia(chatId, messageId, image, text, keyboard);
}
