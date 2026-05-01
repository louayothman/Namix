
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, addDoc } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from "@/app/actions/telegram-user-actions";
import { showChatAssetOptions, executeChatTrade, toggleChatAutoTrade, showChatMarkets } from "@/app/actions/telegram-trading-actions";

/**
 * @fileOverview محرك الاستجابة التفاعلي v16.0 - Visual Analysis & Cinematic Trading
 * تم ربط زر التحليل بنظام التوليد المرئي وتفعيل محرك الصفقات السينمائي.
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      });

      const host = req.headers.get('host') || "";

      if (data === 'user_signup') {
        const url = `https://${host}/auth/telegram-signup?chatId=${chatId}&firstName=${encodeURIComponent(cb.from.first_name)}`;
        await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "💎 *بوابة الهوية الرقمية*\n\nيرجى الضغط على الزر أدناه لفتح واجهة التسجيل الموثقة وتفعيل حسابك بلمسة واحدة.",
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: "⚡ تفعيل الهوية الرقمية", web_app: { url } }]] }
          })
        });
      } else if (data === 'user_login') {
        const url = `https://${host}/auth/telegram-login?chatId=${chatId}`;
        await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🔑 *بوابة الدخول المؤمن*\n\nيرجى فتح النافذة أدناه لربط حسابك الحالي بـ تلغرام بشكل مؤمن.",
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: "🔒 دخول مؤمن", web_app: { url } }]] }
          })
        });
      } 
      else if (data === 'user_trade') {
        await showChatMarkets(bot.token, chatId, messageId);
      }
      else if (data.startsWith('tchat_sym_')) {
        const symbolId = data.replace('tchat_sym_', '');
        await showChatAssetOptions(bot.token, chatId, messageId, symbolId);
      }
      else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        const side = parts[2] as 'buy' | 'sell';
        const symbolId = parts[3];
        // تنفيذ صفقة افتراضية بـ 10$ لمدة 60 ثانية بتجربة سينمائية
        await executeChatTrade(bot.token, chatId, symbolId, side, 10, 60);
      }
      else if (data.startsWith('tchat_ai_')) {
        const symbolId = data.replace('tchat_ai_', '');
        const symSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
        if (symSnap.exists()) {
           const symData = symSnap.data();
           // إنشاء طلب تحليل مرئي لتشغيل المفاعل (Reactor)
           await addDoc(collection(firestore, "market_analysis_requests"), {
              symbolId: symSnap.id,
              symbolCode: symData.code,
              chatId: chatId,
              messageId: messageId,
              botId: botId,
              status: "pending",
              createdAt: new Date().toISOString()
           });
        }
      }
      else if (data.startsWith('user_autotrade_')) {
        const current = data.split('_')[2] === 'true';
        await toggleChatAutoTrade(bot.token, chatId, messageId, current);
      }
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }

      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    if (!message || !message.chat) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text;

    if (text === '/start') {
      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        await sendUserSuccessBriefing(chatId, { ...userData, id: userSnap.docs[0].id }); 
      } else {
        await sendWelcomeMessage(bot.token, chatId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
