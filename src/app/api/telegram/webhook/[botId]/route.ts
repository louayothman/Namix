
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { generateDeepMarketReport } from "@/lib/market-report-engine";

/**
 * @fileOverview محرك الاستجابة التفاعلي v4.0 - Deep Intel Hub
 * تم دمج محرك التقارير المتعمقة وتطوير لوحة الأوامر بأسلوب نخبوي.
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

    const host = req.headers.get('host');
    const domain = host?.split(':')[0] || "";
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // 1. معالجة أمر البداية /start - بناء لوحة التحكم الاحترافية
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
🚀 *تطبيق ناميكس المصغر* متاح دائماً للتنفيذ السريع.
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

      await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🟠 *بوابة الوصول السريع:*",
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: "فتح تطبيق ناميكس", web_app: { url: `${baseUrl}/home` } }
            ]]
          }
        })
      });
    } 
    // 2. معالجة طلبات تحليل الأسواق - استدعاء المحرك المتعمق
    else if (text) {
      const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("code", "==", text), where("isActive", "==", true)));
      
      if (!symbolsSnap.empty) {
        const symbolDoc = symbolsSnap.docs[0];
        const symbolData = symbolDoc.data();
        
        // إرسال رسالة "جاري التحليل" لإعطاء انطباع بالعمق
        const loadingMsgRes = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🔍 جاري مزامنة بيانات سوق *${text}* واستخلاص الرؤية العميقة...`,
            parse_mode: 'Markdown'
          })
        });
        const loadingMsgData = await loadingMsgRes.json();

        // استدعاء محرك التقارير المتعمقة الجديد
        const deepReport = await generateDeepMarketReport(symbolData.binanceSymbol || symbolData.code, symbolDoc.id);

        // تحديث الرسالة بالتقرير الكامل
        await fetch(`https://api.telegram.org/bot${bot.token}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: loadingMsgData.result.message_id,
            text: deepReport,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: `🚀 تنفيذ صفقة في تطبيق ناميكس`, web_app: { url: `${baseUrl}/trade/${symbolDoc.id}` } }
              ]]
            }
          })
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Telegram Webhook Error:", e.message);
    return NextResponse.json({ ok: true });
  }
}
