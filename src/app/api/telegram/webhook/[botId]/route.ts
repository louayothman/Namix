import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { sendWelcomeMessage, sendSignupPrompt, sendLoginPrompt, handleTelegramMenuAction } from "@/app/actions/telegram-user-actions";

/**
 * @fileOverview محرك الاستجابة التفاعلي v9.0 - Integrated Menu Logic
 * تم ربط كافة أفعال المستخدم بمركز العمليات الديناميكي.
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
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;
      const data = cb.data;

      // أفعال الهوية (فتح نوافذ TMA)
      if (data === 'user_signup') {
        await sendSignupPrompt(bot.token, chatId.toString(), cb.from.first_name);
      } else if (data === 'user_login') {
        await sendLoginPrompt(bot.token, chatId.toString());
      } 
      // أفعال مركز العمليات (تعديل ديناميكي للرسالة)
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId.toString(), messageId.toString(), data);
      }
      
      await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      });

      return NextResponse.json({ ok: true });
    }

    // 2. معالجة الرسائل النصية
    const message = update.message;
    if (!message || !message.chat) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text;

    if (text === '/start') {
      const subRef = doc(firestore, "system_settings", "telegram", "bots", botId, "subscribers", chatId.toString());
      await setDoc(subRef, {
        chatId: chatId,
        firstName: message.from?.first_name || "Investor",
        username: message.from?.username || "",
        createdAt: new Date().toISOString()
      }, { merge: true });

      await sendWelcomeMessage(bot.token, chatId.toString());
    } else if (text) {
      const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("code", "==", text.toUpperCase()), where("isActive", "==", true)));
      
      if (!symbolsSnap.empty) {
        const symbolDoc = symbolsSnap.docs[0];
        const loadingMsg = `🔍 *جاري تحليل سوق ${text}...*\n[░░░░░░░░░░] 10%\n\n_يتم الآن جرد مستويات السيولة ومعايرة محرك التحليل_`;

        const loadingRes = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: loadingMsg, parse_mode: 'Markdown' })
        });

        const loadingData = await loadingRes.json();
        const messageId = loadingData.result.message_id;

        await addDoc(collection(firestore, "market_analysis_requests"), {
          botId,
          chatId: chatId.toString(),
          messageId,
          symbolId: symbolDoc.id,
          symbolCode: text.toUpperCase(),
          status: "pending",
          createdAt: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: true });
  }
}
