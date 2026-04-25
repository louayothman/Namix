
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { generateDeepMarketReport } from "@/lib/market-report-engine";

/**
 * @fileOverview محرك الاستجابة التفاعلي v5.0 - Visual Analysis Trigger
 */

export async function POST(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;
  const { firestore } = initializeFirebase();

  try {
    const update = await req.json();
    const message = update.message;

    if (!message || !message.chat) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text;
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    const bot = botSnap.data();

    // 1. معالجة أمر البداية /start
    if (text === '/start') {
      const subRef = doc(firestore, "system_settings", "telegram", "bots", botId, "subscribers", chatId.toString());
      await setDoc(subRef, {
        chatId: chatId,
        firstName: message.from?.first_name || "Investor",
        username: message.from?.username || "",
        createdAt: new Date().toISOString()
      }, { merge: true });

      const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
      const symbols = symbolsSnap.docs.map(d => d.data().code);

      const keyboard = [];
      for (let i = 0; i < symbols.length; i += 2) {
        keyboard.push(symbols.slice(i, i + 2).map(s => ({ text: s })));
      }

      const welcomeMessage = `
📊 *رادار الأسواق الحية | NAMIX MARKET RADAR*

مرحباً بك في وحدة الاستخبارات المالية لناميكس. 
يمكنك الآن الحصول على تحليلات متعمقة وفورية لكافة الأصول المتاحة.

✨ *اضغط على أي سوق* أدناه لاستدعاء تقرير NAMIX AI المفصل.
      `;

      await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeMessage,
          parse_mode: 'Markdown',
          reply_markup: {
            keyboard: keyboard,
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
      });
    } 
    // 2. معالجة طلبات تحليل الأسواق بالصور
    else if (text) {
      const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("code", "==", text), where("isActive", "==", true)));
      
      if (!symbolsSnap.empty) {
        const symbolDoc = symbolsSnap.docs[0];
        
        // إرسال رسالة انتظار تفاعلية
        const loadingMsg = `
🔍 *جاري تحليل سوق ${text}...*
[░░░░░░░░░░] 10%

_يتم الآن جرد مستويات السيولة ومعايرة محرك NAMIX AI_
        `.trim();

        const loadingRes = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: loadingMsg, parse_mode: 'Markdown' })
        });

        const loadingData = await loadingRes.json();
        const messageId = loadingData.result.message_id;

        // تسجيل طلب تحليل "مرئي" ليقوم المُفاعل بالتقاط الصورة
        await addDoc(collection(firestore, "market_analysis_requests"), {
          botId,
          chatId: chatId.toString(),
          messageId,
          symbolId: symbolDoc.id,
          symbolCode: text,
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
