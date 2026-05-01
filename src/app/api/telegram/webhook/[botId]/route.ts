
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from "@/app/actions/telegram-user-actions";
import { showChatAssetOptions, executeChatTrade, toggleChatAutoTrade } from "@/app/actions/telegram-trading-actions";

/**
 * @fileOverview محرك الاستجابة التفاعلي v13.0 - Integrated Chat Trading & AI Support
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!snap.exists()) return NextResponse.json({ ok: true });
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

      const host = req.headers.get('host');

      // 1. منطق الهوية (Signup / Login)
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
      
      // 2. منطق التداول في الدردشة (Chat Trading)
      else if (data.startsWith('tchat_sym_')) {
        const symbolId = data.replace('tchat_sym_', '');
        await showChatAssetOptions(bot.token, chatId, messageId, symbolId);
      }
      else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        const side = parts[2] as 'buy' | 'sell';
        const symbolId = parts[3];
        // فتح واجهة اختيار المبلغ (محاكاة لاختيار 10$ افتراضياً في البداية)
        await executeChatTrade(bot.token, chatId, symbolId, side, 10, 60);
      }
      else if (data.startsWith('user_autotrade_')) {
        const current = data.split('_')[2] === 'true';
        await toggleChatAutoTrade(bot.token, chatId, messageId, current);
      }
      
      // 3. منطق القائمة الرئيسية (Menu Actions)
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host || "");
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
