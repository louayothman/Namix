'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, increment, addDoc, limit } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات المستخدمين عبر تلغرام v8.0 - Full Deposit & Share Protocol
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

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
        [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول", callback_data: "user_trade" }],
        [{ text: "🚪 خروج", callback_data: "user_logout" }]
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
      [{ text: "🔬 مختبر العقود", callback_data: "user_invest" }, { text: "📊 التداول", callback_data: "user_trade" }],
      [{ text: "🚪 خروج", callback_data: "user_logout" }]
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

  else if (action.startsWith('user_dep_cat_')) {
    const catId = action.replace('user_dep_cat_', '');
    const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
    const cat = catSnap.data();
    text = `📍 *قسم الإيداع: ${cat.name}*\n\n${cat.description || 'اختر إحدى البوابات المتاحة لمشاهدة بيانات الاستلام:'}`;
    
    if (cat.type === 'internal') {
       text = `🆔 *بروتوكول التحويل الداخلي*\n\nالمعرف الرقمي الخاص بك (Namix ID) هو:\n\`${user.namixId}\`\n\n_استخدم هذا المعرف لاستلام المبالغ من مستخدمي ناميكس الآخرين فوراً._`;
       keyboard.inline_keyboard = [[{ text: "🔙 رجوع للأقسام", callback_data: "user_deposit" }]];
    } else {
       keyboard.inline_keyboard = (cat.portals || []).map((p: any) => [{ text: `💎 ${p.name}`, callback_data: `user_dep_portal_${catId}_${p.id}` }]);
       keyboard.inline_keyboard.push([{ text: "🔙 رجوع للأقسام", callback_data: "user_deposit" }]);
    }
  }

  else if (action.startsWith('user_dep_portal_')) {
    const [, , , catId, portalId] = action.split('_');
    const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
    const portal = catSnap.data()?.portals?.find((p: any) => p.id === portalId);
    
    text = `📋 *بيانات الإيداع: ${portal.name}*\n\nالعنوان/المعرف:\n\`${portal.walletAddress}\`\n\n📝 *التعليمات:*\n${portal.instructions}\n\n_بعد الانتهاء من الإرسال، اضغط على زر التحقق أدناه لتأكيد العملية._`;
    
    const headersList = await headers();
    const host = headersList.get('host') || "";
    const verifyUrl = `https://${host}/deposit/${catId}?step=execution&portalId=${portalId}`;

    keyboard.inline_keyboard = [
      [{ text: "⚡ إرسال إثبات الدفع (TXID)", web_app: { url: verifyUrl } }],
      [{ text: "🔙 تغيير البوابة", callback_data: `user_dep_cat_${catId}` }]
    ];
  }

  else if (action === 'user_logout') {
    await updateDoc(userDoc.ref, { telegramChatId: "" });
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

// ... باقي الوظائف (تداول، تسجيل، إلخ) تبقى كما هي
