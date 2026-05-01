import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, limit } from 'firebase/firestore';
import { sendWelcomeMessage, sendSignupPrompt, sendLoginPrompt, handleTelegramMenuAction, sendUserSuccessBriefing } from "@/app/actions/telegram-user-actions";

/**
 * @fileOverview محرك الاستجابة التفاعلي v10.0 - Session Recovery & Auto-Briefing
 * تم إضافة بروتوكول التعرف التلقائي على المستخدمين القدامى فور ضغط "ابدأ".
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    // 1. معالجة نقرات الأزرار
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;
      const data = cb.data;

      if (data === 'user_signup') {
        await sendSignupPrompt(bot.token, chatId.toString(), cb.from.first_name);
      } else if (data === 'user_login') {
        await sendLoginPrompt(bot.token, chatId.toString());
      } 
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

    const chatId = message.chat.id.toString();
    const text = message.text;

    if (text === '/start') {
      // بروتوكول استعادة الجلسة: البحث عن مستخدم مرتبطة بهذا الـ Chat ID
      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        // المستخدم مسجل مسبقاً -> جلب بياناته وإرسال التقرير الترحيبي فوراً
        const userData = userSnap.docs[0].data();
        // ملاحظة: لإرسال الصورة نحتاج لـ Image URI، سنعتمد هنا على صورة افتراضية أو نطلب منه إعادة الدخول إذا كانت الصورة ضرورية
        // ولكن للسرعة سنعيد عرض القائمة الرئيسية (Briefing)
        await sendUserSuccessBriefing(chatId, userData, ""); 
      } else {
        // مستخدم جديد أو غير مرتبط -> عرض رسالة الترحيب الأساسية
        const subRef = doc(firestore, "system_settings", "telegram", "bots", botId, "subscribers", chatId);
        await setDoc(subRef, {
          chatId: chatId,
          firstName: message.from?.first_name || "Investor",
          username: message.from?.username || "",
          createdAt: new Date().toISOString()
        }, { merge: true });

        await sendWelcomeMessage(bot.token, chatId);
      }
    } else if (text) {
      // معالجة طلبات تحليل الأسواق (كود العملة)
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
          chatId: chatId,
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
