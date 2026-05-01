
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, addDoc } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from "@/app/actions/telegram-user-actions";
import { showChatAssetOptions, executeChatTrade, toggleChatAutoTrade, showChatMarkets } from "@/app/actions/telegram-trading-actions";

/**
 * @fileOverview محرك الاستجابة التفاعلي v18.0 - Resilient Response & Visual Integration
 * تم تأمين الرد الفوري على تلغرام لمنع تعليق الأزرار وربط محرك التحليل المرئي.
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    // جلب بيانات البوت النشط
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    // 1. معالجة نقرات الأزرار (Callback Queries)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      // رد فوري لتلغرام لإيقاف حالة التحميل (Loading Spinner)
      await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      });

      const host = req.headers.get('host') || "";

      // مسارات الهوية (نوافذ TMA)
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
      
      // مسار التداول والأسواق
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
        // تشغيل محرك الصفقات السينمائي (يستغرق 15 ثانية)
        executeChatTrade(bot.token, chatId, symbolId, side, 10, 15).catch(console.error);
      }
      
      // رادار التحليل المرئي (يرتبط بمكون Reactor في المتصفح)
      else if (data.startsWith('tchat_ai_')) {
        const symbolId = data.replace('tchat_ai_', '');
        const symSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
        if (symSnap.exists()) {
           const symData = symSnap.data();
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
      
      // القائمة الموحدة والتداول الآلي
      else if (data.startsWith('user_autotrade_')) {
        const current = data.split('_')[2] === 'true';
        await toggleChatAutoTrade(bot.token, chatId, messageId, current);
      }
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }

      return NextResponse.json({ ok: true });
    }

    // 2. معالجة الرسائل النصية
    const message = update.message;
    if (!message || !message.chat) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text;

    // بروتوكول البدء الذكي (استعادة الجلسة)
    if (text === '/start') {
      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        // إرسال التقرير الترحيبي وبطاقة الهوية فوراً
        await sendUserSuccessBriefing(chatId, { ...userData, id: userSnap.docs[0].id }); 
      } else {
        await sendWelcomeMessage(bot.token, chatId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Telegram Webhook Error:", e);
    // نرسل دائماً OK لتلغرام لمنع تكرار المحاولات في حال وجود خطأ عابر
    return NextResponse.json({ ok: true });
  }
}
