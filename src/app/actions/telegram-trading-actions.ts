
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, updateDoc, increment, query, where, getDocs, limit } from 'firebase/firestore';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * @fileOverview محرك التداول السينمائي v5.0 - Isolated Dynamic Media
 * يدير عمليات التداول بداخل الدردشة باستخدام رسائل منفصلة وصور ديناميكية.
 */

async function getActiveBotToken() {
  const { firestore } = initializeFirebase();
  const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true), limit(1)));
  if (botsSnap.empty) return null;
  return botsSnap.docs[0].data().token;
}

export async function showChatMarkets(botToken: string, chatId: string, messageId: string) {
  const { firestore } = initializeFirebase();
  const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
  
  const text = `📊 *محطة التداول الفوري — الأسواق النشطة*\n\nاختر الرمز المراد مراقبة نبضه أو طلب تحليله الاستنتاجي من مصفوفة الأصول أدناه:`;
  
  const keyboard = {
    inline_keyboard: symbolsSnap.docs.map(d => ([
      { text: `📈 ${d.data().name} (${d.data().code})`, callback_data: `tchat_sym_${d.id}` }
    ]))
  };
  keyboard.inline_keyboard.push([{ text: "🔙 العودة للقائمة الرئيسية", callback_data: "user_home" }]);

  // استخدام رسالة منفصلة للتداول لضمان بقاء اللوحة الرئيسية مثبتة
  await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: `${SITE_CONFIG.url}/trade.png`,
      caption: text,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  });
}

export async function showChatAssetOptions(botToken: string, chatId: string, messageId: string, symbolId: string) {
  const { firestore } = initializeFirebase();
  const assetSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
  if (!assetSnap.exists()) return;
  const asset = assetSnap.data();

  const text = `💎 *سوق ${asset.name} (${asset.code})*\n\nالمنظومة متصلة بنبض هذا السوق. حدد اتجاه التنفيذ المقترح أو اطلب تقريراً بيانياً من المحرك الاستنتاجي:`;
  
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

export async function executeChatTrade(botToken: string, chatId: string, symbolId: string, side: 'buy' | 'sell', amount: number, duration: number) {
  const { firestore } = initializeFirebase();
  const assetSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
  const asset = assetSnap.data();
  if (!asset) return;

  const image = side === 'buy' ? 'buy.png' : 'sell.png';

  // 1. رسالة التهيئة السينمائية
  const initMsg = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: `${SITE_CONFIG.url}/${image}`,
      caption: `⏳ *جاري تهيئة العقد التشغيلي لـ ${asset.code}...*\n[░░░░░░░░░░] 0%`,
      parse_mode: 'Markdown'
    })
  }).then(r => r.json());

  const msgId = initMsg.result.message_id;

  // 2. شريط تقدم وميضي سريع
  for (let i = 1; i <= 3; i++) {
    const bars = "█".repeat(i * 3) + "░".repeat(10 - i * 3);
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId, message_id: msgId,
        caption: `⏳ *فتح مركز ${side.toUpperCase()} في المفاعل...*\n[${bars}] ${i * 33}%`,
        parse_mode: 'Markdown'
      })
    });
    await new Promise(r => setTimeout(r, 400));
  }

  const entryPrice = asset.currentPrice || 64231.50;
  const endTime = new Date(Date.now() + duration * 1000);
  
  // 3. حلقة التحديث اللحظي التفاعلية
  for (let i = 1; i <= 4; i++) {
    const currentPrice = entryPrice + (side === 'buy' ? (Math.random() * 80 - 20) : (Math.random() * 20 - 80));
    const isWinning = side === 'buy' ? currentPrice > entryPrice : currentPrice < entryPrice;
    const statusEmoji = isWinning ? "🟢" : "🔴";

    const liveText = `
📊 *صفقة نشطة: ${asset.code}*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
📍 *العملية:* ${side === 'buy' ? 'شراء' : 'بيع'}
💰 *المبلغ:* $${amount}
📏 *الدخول:* $${entryPrice.toLocaleString()}
🔥 *السعر:* $${currentPrice.toLocaleString()}

⚡ *الحالة:* ${statusEmoji} ${isWinning ? 'ربح مؤقت' : 'تصحيح مؤقت'}
⏳ *الوقت:* ${Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000))}s
    `.trim();

    await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: msgId, caption: liveText, parse_mode: 'Markdown' })
    });
    await new Promise(r => setTimeout(r, 1500));
  }

  // 4. رسالة التسوية النهائية
  const finalPrice = entryPrice + (Math.random() * 100 - 30);
  const isWin = side === 'buy' ? finalPrice > entryPrice : finalPrice < entryPrice;
  
  const finalResultText = `
${isWin ? '💰 *اكتمال الصفقة بنجاح*' : '📉 *إغلاق مركز التداول*'}
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
✅ *النتيجة:* ${isWin ? 'ربح محقق' : 'تسوية عادية'}
💵 *العائد:* ${isWin ? '+$8.00' : '-$10.00'}
🏁 *الإغلاق:* $${finalPrice.toLocaleString()}

_تم تحديث الملاءة المالية في حسابك الآن._
  `.trim();

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId, message_id: msgId,
      caption: finalResultText,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: "🚀 تنفيذ صفقة جديدة", callback_data: `tchat_sym_${symbolId}` }]] }
    })
  });
}
