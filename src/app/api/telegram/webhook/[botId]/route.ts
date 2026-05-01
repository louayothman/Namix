
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from "@/app/actions/telegram-user-actions";
import { showChatAssetOptions, executeChatTrade, toggleChatAutoTrade } from "@/app/actions/telegram-trading-actions";
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview محرك الاستجابة التفاعلي v15.0 - Universal Trading & Identity Core
 * تم إصلاح خطأ استدعاء botSnap وتفعيل محركات التداول والتحليل اللحظي.
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    // جلب بيانات البوت النشط للوصول للتوكن
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    // 1. معالجة نقرات الأزرار (Callback Queries)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      // إرسال إشارة استلام فورية لإيقاف التحميل في واجهة تلغرام
      await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      });

      const host = req.headers.get('host') || "";

      // مسار الهوية (Signup / Login)
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
      
      // مسار التداول الفوري والتحليل (Chat Trading)
      else if (data.startsWith('tchat_sym_')) {
        const symbolId = data.replace('tchat_sym_', '');
        await showChatAssetOptions(bot.token, chatId, messageId, symbolId);
      }
      else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        const side = parts[2] as 'buy' | 'sell';
        const symbolId = parts[3];
        await executeChatTrade(bot.token, chatId, symbolId, side, 10, 60);
      }
      else if (data.startsWith('tchat_ai_')) {
        const symbolId = data.replace('tchat_ai_', '');
        const symSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
        if (symSnap.exists()) {
           const analysis = await runNamix(symSnap.data().code);
           await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               chat_id: chatId,
               text: `🤖 *تحليل NAMIX AI لـ ${symSnap.data().code}:*\n\n_${analysis.reasoning}_\n\n🎯 الثقة: %${analysis.confidence}\n📍 التوصية: *${analysis.decision}*`,
               parse_mode: 'Markdown'
             })
           });
        }
      }
      else if (data.startsWith('user_autotrade_')) {
        const current = data.split('_')[2] === 'true';
        await toggleChatAutoTrade(bot.token, chatId, messageId, current);
      }
      
      // مسار القائمة الرئيسية (Menu Actions)
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }

      return NextResponse.json({ ok: true });
    }

    // 2. معالجة الرسائل النصية والأوامر
    const message = update.message;
    if (!message || !message.chat) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const text = message.text;

    if (text === '/start') {
      // محاولة استعادة الجلسة السيادية فوراً
      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        // إرسال التقرير الترحيبي وتثبيته فوراً (Pin)
        await sendUserSuccessBriefing(chatId, { ...userData, id: userSnap.docs[0].id }); 
      } else {
        // إذا كان المستخدم جديداً، نرسل رسالة الترحيب بصورة الهوية العامة
        await sendWelcomeMessage(bot.token, chatId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
