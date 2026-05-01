
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { sendWelcomeMessage, sendSignupPrompt } from "@/app/actions/telegram-user-actions";

/**
 * @fileOverview محرك الاستجابة التفاعلي v7.0 - Callback & Identity Integration
 * تم تحديث المحرك ليدعم معالجة أزرار الهوية (Callbacks) والربط الشخصي.
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    // 1. معالجة الضغط على الأزرار المدمجة (Callback Queries)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const data = cb.data;

      const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
      if (!botSnap.exists()) return NextResponse.json({ ok: true });
      const bot = botSnap.data();

      if (data === 'user_signup') {
        await sendSignupPrompt(bot.token, chatId.toString(), cb.from.first_name);
      }
      
      // إرسال تأكيد استلام الـ Callback لتلغرام (لإخفاء حالة التحميل في الزر)
      await fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      });

      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    if (!message || !message.chat) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text;
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    // 2. معالجة أمر البداية /start
    if (text === '/start') {
      const subRef = doc(firestore, "system_settings", "telegram", "bots", botId, "subscribers", chatId.toString());
      await setDoc(subRef, {
        chatId: chatId,
        firstName: message.from?.first_name || "Investor",
        username: message.from?.username || "",
        createdAt: new Date().toISOString()
      }, { merge: true });

      await sendWelcomeMessage(bot.token, chatId.toString());
    } 
    // 3. معالجة طلبات تحليل الأسواق
    else if (text) {
      const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("code", "==", text.toUpperCase()), where("isActive", "==", true)));
      
      if (!symbolsSnap.empty) {
        const symbolDoc = symbolsSnap.docs[0];
        const loadingMsg = `🔍 *جاري تحليل سوق ${text}...*\n[░░░░░░░░░░] 10%\n\n_يتم الآن جرد مستويات السيولة ومعايرة محرك NAMIX AI_`;

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
