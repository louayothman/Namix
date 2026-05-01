
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, setDoc } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from "@/app/actions/telegram-user-actions";
import { executeChatTrade, toggleChatAutoTrade, showChatMarkets } from "@/app/actions/telegram-trading-actions";

/**
 * @fileOverview محرك الاستجابة الوميضي (Vercel API) v21.0
 * المركز السيادي الوحيد لاستلام ومعالجة كافة تفاعلات البوت بداخل Vercel.
 */

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    const botRef = doc(firestore, "system_settings", "telegram", "bots", botId);
    const botSnap = await getDoc(botRef);
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    // معالجة نقرات الأزرار
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      // الرد الفوري لتلغرام لمنع تعليق الواجهة
      await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      });

      const host = req.headers.get('host') || "namix.pro";

      // 1. بوابات الهوية
      if (data === 'user_signup' || data === 'user_login') {
        const route = data === 'user_signup' ? 'telegram-signup' : 'telegram-login';
        const url = `https://${host}/auth/${route}?chatId=${chatId}`;
        await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🔐 *بوابة الهوية الرقمية الموثقة*\n\nيرجى فتح النافذة أدناه لإتمام عملية الربط بشكل مؤمن.",
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: "⚡ فتح البوابة", web_app: { url } }]] }
          })
        });
      } 
      // 2. أوامر التداول
      else if (data === 'user_trade') {
        await showChatMarkets(bot.token, chatId, messageId);
      }
      else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        const side = parts[2] as 'buy' | 'sell';
        const symbolId = parts[3];
        // تشغيل العملية في الخلفية لضمان عدم تجاوز توقيت الـ API
        executeChatTrade(bot.token, chatId, symbolId, side, 10, 15).catch(console.error);
      }
      // 3. التداول الآلي والمنيو الموحد
      else if (data.startsWith('user_autotrade_')) {
        const current = data.split('_')[2] === 'true';
        await toggleChatAutoTrade(bot.token, chatId, messageId, current);
      }
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }

      return NextResponse.json({ ok: true });
    }

    // معالجة الرسائل النصية (/start)
    const message = update.message;
    if (message && message.text?.startsWith('/start')) {
      const chatId = message.chat.id.toString();
      
      // توثيق الحضور في مصفوفة البوت
      await setDoc(doc(firestore, "system_settings", "telegram", "bots", botId, "subscribers", chatId), {
        firstName: message.from.first_name,
        username: message.from.username || null,
        joinedAt: new Date().toISOString()
      }, { merge: true });

      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        await sendUserSuccessBriefing(chatId, { ...userSnap.docs[0].data(), id: userSnap.docs[0].id });
      } else {
        await sendWelcomeMessage(bot.token, chatId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Critical Webhook Fault:", e);
    return NextResponse.json({ ok: true }); 
  }
}
