import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, limit } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from "@/app/actions/telegram-user-actions";

/**
 * @fileOverview محرك الاستجابة التفاعلي v11.0 - Robust Callback & Session Recovery
 * تم إصلاح تعطل الأزرار وضمان معالجة دقيقة لطلبات الـ Callback.
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    // 1. معالجة نقرات الأزرار (Callback Queries)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      // إرسال استجابة فورية لتلغرام لإيقاف التحميل في الزر
      await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      });

      if (data === 'user_signup') {
        const url = `https://${req.headers.get('host')}/auth/telegram-signup?chatId=${chatId}&firstName=${encodeURIComponent(cb.from.first_name)}`;
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
        const url = `https://${req.headers.get('host')}/auth/telegram-login?chatId=${chatId}`;
        await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🔑 *بوابة الدخول المؤمن*\n\nيرجى فتح النافذة أدناه لربط حسابك الحالي بـ تلغرام بشكل سيادي ومؤمن.",
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: "🔒 دخول مؤمن", web_app: { url } }]] }
          })
        });
      } 
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data);
      }

      return NextResponse.json({ ok: true });
    }

    // 2. معالجة الرسائل النصية
    const message = update.message;
    if (!message || !message.chat) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text;

    if (text === '/start') {
      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        await sendUserSuccessBriefing(chatId, userData); 
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
