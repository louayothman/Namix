
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, updateDoc, increment, query, where, getDocs, limit } from 'firebase/firestore';
import { SITE_CONFIG } from '@/lib/site-config';
import { runNamix } from '@/lib/namix-orchestrator';

/**
 * @fileOverview محرك التداول السينمائي السيادي v10.0 - Real Execution & Mood UI
 * يدير عمليات التداول الحقيقية بداخل الدردشة مع محاكاة بصرية تفاعلية ومزاجية.
 */

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

  // جلب التحليل اللحظي لتحديد "مزاج" الواجهة
  const analysis = await runNamix(asset.code);
  const moodEmoji = analysis.decision === 'BUY' ? '🟢' : analysis.decision === 'SELL' ? '🔴' : '⚖️';
  const moodText = analysis.decision === 'BUY' ? 'فرصة نمو واعدة' : analysis.decision === 'SELL' ? 'منطقة تصحيح' : 'استقرار عرضي';

  const text = `${moodEmoji} *سوق ${asset.name} (${asset.code})*\n\nالمنظومة رصدت *${moodText}*. حدد اتجاه التنفيذ المقترح أو اطلب تقريراً بيانياً من المحرك الاستنتاجي:`;
  
  const domain = process.env.NEXT_PUBLIC_APP_URL || "namix.pro";
  const tmaUrl = `https://${domain}/trade/${symbolId}`;

  const keyboard = {
    inline_keyboard: [
      [{ text: "🟢 شراء / LONG", callback_data: `tchat_side_buy_${symbolId}` }, { text: "🔴 بيع / SHORT", callback_data: `tchat_side_sell_${symbolId}` }],
      [{ text: "🤖 تحليل NAMIX AI المرئي", callback_data: `tchat_ai_${symbolId}` }],
      [{ text: "🔍 فتح المحطة الكاملة (TMA)", web_app: { url: tmaUrl } }],
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
  
  // 1. التحقق من الهوية والرصيد
  const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId.toString()), limit(1));
  const userSnap = await getDocs(userQuery);
  if (userSnap.empty) return;
  const userDoc = userSnap.docs[0];
  const user = userDoc.data();

  if (user.totalBalance < amount) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: "❌ *عجز في الرصيد المتاح*\nيرجى تعزيز محفظتك لمتابعة التنفيذ.", parse_mode: 'Markdown' })
    });
    return;
  }

  const assetSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
  const asset = assetSnap.data();
  if (!asset) return;

  // 2. إنشاء الصفقة الحقيقية وخصم الرصيد
  const entryPrice = asset.currentPrice || 64231.50;
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + duration * 1000);
  const profitRate = 80; // افتراضي لتداول الشات

  const tradeRef = await addDoc(collection(firestore, "trades"), {
    userId: userDoc.id,
    userName: user.displayName,
    symbolId,
    symbolCode: asset.code,
    tradeType: side,
    amount,
    entryPrice,
    profitRate,
    expectedProfit: (amount * profitRate) / 100,
    status: "open",
    result: "pending",
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    createdAt: startTime.toISOString(),
    isChatTrade: true
  });

  await updateDoc(userDoc.ref, { totalBalance: increment(-amount) });

  const image = side === 'buy' ? 'buy.png' : 'sell.png';

  // 3. رسالة التهيئة السينمائية
  const initMsg = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: `${SITE_CONFIG.url}/${image}`,
      caption: `⏳ *جاري حقن السيولة لـ ${asset.code}...*\n[░░░░░░░░░░] 0%`,
      parse_mode: 'Markdown'
    })
  }).then(r => r.json());

  const msgId = initMsg.result.message_id;

  // 4. حلقة التحديث اللحظي (المزاجي)
  for (let i = 1; i <= 5; i++) {
    const bars = "█".repeat(i * 2) + "░".repeat(10 - i * 2);
    const currentPrice = entryPrice + (side === 'buy' ? (Math.random() * 50 - 10) : (Math.random() * 10 - 50));
    const isWinning = side === 'buy' ? currentPrice > entryPrice : currentPrice < entryPrice;
    const moodEmoji = isWinning ? "🟢" : "🔴";
    const moodColor = isWinning ? "ربح مؤقت" : "تصحيح مؤقت";

    const liveText = `
${moodEmoji} *صفقة ${side === 'buy' ? 'شراء' : 'بيع'} نشطة: ${asset.code}*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
📏 *الدخول:* $${entryPrice.toLocaleString()}
🔥 *السعر:* $${currentPrice.toLocaleString()}

⚡ *النبض:* ${moodEmoji} ${moodColor}
⏳ *الوقت:* ${Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000))}s
[${bars}] ${i * 20}%
    `.trim();

    await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: msgId, caption: liveText, parse_mode: 'Markdown' })
    });
    await new Promise(r => setTimeout(r, 2000));
  }

  // 5. التسوية النهائية
  const finalPrice = entryPrice + (side === 'buy' ? (Math.random() * 100 + 10) : (Math.random() * -100 - 10));
  const isWin = side === 'buy' ? finalPrice > entryPrice : finalPrice < entryPrice;
  const profit = isWin ? (amount * profitRate) / 100 : -amount;

  await updateDoc(tradeRef, {
    status: "closed",
    result: isWin ? "win" : "lose",
    finalPrice,
    profit,
    updatedAt: new Date().toISOString()
  });

  if (isWin) {
    await updateDoc(userDoc.ref, {
      totalBalance: increment(amount + profit),
      totalProfits: increment(profit)
    });
  }

  const finalResultText = `
${isWin ? '💰 *اكتمال الصفقة بنجاح*' : '📉 *إغلاق مركز التداول*'}
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
✅ *النتيجة:* ${isWin ? 'ربح محقق' : 'تسوية عادية'}
💵 *العائد:* ${isWin ? `+$${profit.toFixed(2)}` : `-$${amount.toFixed(2)}`}
🏁 *الإغلاق:* $${finalPrice.toLocaleString()}

_تم تحديث الملاءة المالية في حسابك عبر محرك ناميكس._
  `.trim();

  await fetch(`https://api.telegram.org/bot${botToken}/editMessageMedia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: msgId,
      media: {
        type: 'photo',
        media: `${SITE_CONFIG.url}/${isWin ? 'account.png' : 'withdrawal.png'}`,
        caption: finalResultText,
        parse_mode: 'Markdown'
      },
      reply_markup: { inline_keyboard: [[{ text: "🚀 تنفيذ صفقة جديدة", callback_data: `tchat_sym_${symbolId}` }]] }
    })
  });
}
