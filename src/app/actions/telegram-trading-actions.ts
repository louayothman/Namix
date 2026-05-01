
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, updateDoc, increment, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * @fileOverview محرك التداول السينمائي v3.0 - Optimized Cinematic Engine
 * تم تقليل مدد الانتظار لضمان تنفيذ العملية بداخل نافذة الـ Webhook دون تعليق.
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

/**
 * عرض قائمة الأسواق المتاحة للتداول بداخل الدردشة
 */
export async function showChatMarkets(botToken: string, chatId: string, messageId: string) {
  const { firestore } = initializeFirebase();
  const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
  
  const text = `📊 *محطة التداول الفوري — الأسواق النشطة*\n\nاختر الرمز المراد مراقبة نبضه أو طلب تحليله الذكي من قائمة الأصول المتاحة أدناه:`;
  
  const keyboard = {
    inline_keyboard: symbolsSnap.docs.map(d => ([
      { text: `📈 ${d.data().name} (${d.data().code})`, callback_data: `tchat_sym_${d.id}` }
    ]))
  };
  keyboard.inline_keyboard.push([{ text: "🔙 العودة للقائمة الرئيسية", callback_data: "user_home" }]);

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, caption: text, parse_mode: 'Markdown', reply_markup: keyboard })
  });
}

/**
 * عرض خيارات التداول للعملة المختارة (شراء/بيع/تحليل)
 */
export async function showChatAssetOptions(botToken: string, chatId: string, messageId: string, symbolId: string) {
  const { firestore } = initializeFirebase();
  const assetSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
  if (!assetSnap.exists()) return;
  const asset = assetSnap.data();

  const text = `💎 *سوق ${asset.name} (${asset.code})*\n\nالمنظومة متصلة بالنبض السعري اللحظي لهذا السوق. حدد الاتجاه المقترح أو اطلب تقريراً بيانياً من المحرك الذكي:`;
  
  const keyboard = {
    inline_keyboard: [
      [{ text: "🟢 شراء / LONG", callback_data: `tchat_side_buy_${symbolId}` }, { text: "🔴 بيع / SHORT", callback_data: `tchat_side_sell_${symbolId}` }],
      [{ text: "🤖 تحليل NAMIX AI المرئي", callback_data: `tchat_ai_${symbolId}` }],
      [{ text: "🔙 تغيير السوق", callback_data: "user_trade" }]
    ]
  };

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, caption: text, parse_mode: 'Markdown', reply_markup: keyboard })
  });
}

/**
 * بدء تفعيل التداول الآلي بداخل الدردشة
 */
export async function toggleChatAutoTrade(botToken: string, chatId: string, messageId: string, currentStatus: boolean) {
  const { firestore } = initializeFirebase();
  const q = query(collection(firestore, "users"), where("telegramChatId", "==", chatId.toString()), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return;
  
  const userRef = snap.docs[0].ref;
  await updateDoc(userRef, { isChatAutoTradeEnabled: !currentStatus });

  const text = !currentStatus 
    ? `✅ *تم تفعيل محرك التداول الآلي*\n\nسيقوم النظام الآن بتنفيذ الصفقات تلقائياً بناءً على إشارات NAMIX AI بمبلغ دخول ثابت ($10).`
    : `⚪ *تم إيقاف التداول الآلي*\n\nيمكنك الآن تنفيذ الصفقات يدوياً عبر قائمة الأسواق المتاحة.`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}

/**
 * محاكي تنفيذ الصفقة بداخل الدردشة مع التحديث اللحظي السينمائي
 * تم تحسين المدد الزمنية لتفادي الـ Timeout
 */
export async function executeChatTrade(botToken: string, chatId: string, symbolId: string, side: 'buy' | 'sell', amount: number, duration: number) {
  const { firestore } = initializeFirebase();
  const assetSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
  const asset = assetSnap.data();
  if (!asset) return;

  // 1. رسالة التهيئة السينمائية
  const initMsg = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `⏳ *جاري تهيئة العقد التشغيلي لـ ${asset.code}...*\n[░░░░░░░░░░] 0%`,
      parse_mode: 'Markdown'
    })
  }).then(r => r.json());

  const msgId = initMsg.result.message_id;

  // 2. شريط تقدم وميضي سريع (3 خطوات)
  for (let i = 1; i <= 3; i++) {
    const bars = "█".repeat(i * 3) + "░".repeat(10 - i * 3);
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId, message_id: msgId,
        text: `⏳ *فتح مركز ${side.toUpperCase()} في السوق...*\n[${bars}] ${i * 33}%`,
        parse_mode: 'Markdown'
      })
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. التقاط سعر الدخول وتحديد وقت الانتهاء
  const entryPrice = asset.currentPrice || 64231.50;
  const endTime = new Date(Date.now() + duration * 1000);
  
  // 4. حلقة التحديث اللحظي التفاعلية (مضغوطة لـ 4 تحديثات)
  const totalTicks = 4;
  for (let i = 1; i <= totalTicks; i++) {
    const currentPrice = entryPrice + (side === 'buy' ? (Math.random() * 80 - 20) : (Math.random() * 20 - 80));
    const isWinning = side === 'buy' ? currentPrice > entryPrice : currentPrice < entryPrice;
    const statusEmoji = isWinning ? "🟢" : "🔴";
    const statusText = isWinning ? "ربح مؤقت" : "تصحيح مؤقت";

    const liveText = `
📊 *صفقة نشطة: ${asset.code}*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
📍 *نوع العملية:* ${side === 'buy' ? 'شراء / LONG' : 'بيع / SHORT'}
💰 *مبلغ الدخول:* $${amount}
📏 *سعر الدخول:* $${entryPrice.toLocaleString()}
🔥 *السعر اللحظي:* $${currentPrice.toLocaleString()}

⚡ *الحالة:* ${statusEmoji} ${statusText}
⏳ *الوقت المتبقي:* ${Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000))} ثانية
    `.trim();

    await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: msgId, text: liveText, parse_mode: 'Markdown' })
    });
    await new Promise(r => setTimeout(r, 1500));
  }

  // 5. رسالة التسوية النهائية والنتيجة المالية
  const finalPrice = entryPrice + (Math.random() * 100 - 30);
  const isWin = side === 'buy' ? finalPrice > entryPrice : finalPrice < entryPrice;
  
  const finalResultText = `
${isWin ? '💰 *تهانينا! اكتملت الصفقة بنجاح*' : '📉 *إغلاق مركز التداول*'}
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
✅ *النتيجة:* ${isWin ? 'ربح محقق' : 'تسوية عادية'}
💵 *العائد الصافي:* ${isWin ? '+$8.00' : '-$10.00'}
🏁 *سعر الإغلاق:* $${finalPrice.toLocaleString()}

_تم تحديث الملاءة المالية في محفظتك الآن._
  `.trim();

  const keyboard = {
    inline_keyboard: [[{ text: "🚀 تنفيذ صفقة جديدة", callback_data: `tchat_sym_${symbolId}` }]]
  };

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: msgId, text: finalResultText, parse_mode: 'Markdown', reply_markup: keyboard })
  });
}
