
'use client';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment, addDoc, limit, deleteDoc } from 'firebase/firestore';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * @fileOverview محرك عمليات الهوية والتدفقات المباشرة v35.0 - Persistant Dashboard Update
 * تم توثيق نظام التبديل البصري للرسالة المثبتة لتعمل كقمرة قيادة ثابتة.
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

  // --- نظام التبديل البصري (Dashboard Persistent Node) ---

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
    text = `👥 *مركز الشركاء والسفراء*\n\nعدد الإحالات النشطة: ${user.referralCount || 0}\nعمولات الشبكة: *$${user.referralEarnings || 0}*\nكود الدعوة: \`${user.referralCode}\`\n\n_شارك هويتك لتنمية محفظتك الاستراتيجية._`;
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

  else if (action === 'user_logout') {
    if (userDoc) await updateDoc(userDoc.ref, { telegramChatId: "" });
    await fetch(`https://api.telegram.org/bot${botToken}/unpinChatMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId }) });
    
    // تسجيل الخروج يفتح رسالة جديدة بصورة منفصلة
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
