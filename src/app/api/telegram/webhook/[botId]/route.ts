
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview محرك الاستجابة التفاعلي v3.0 - Instant Mini App & Market Buttons
 * يدير لوحة التحكم السفلية للبوت، فتح التطبيق المصغر، والتحليل الفوري للأسواق.
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

    // جلب رابط الموقع الحالي لفتحه في الـ Mini App
    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // 1. معالجة أمر البداية /start - بناء لوحة التحكم
    if (text === '/start') {
      const subRef = doc(firestore, "system_settings", "telegram", "bots", botId, "subscribers", chatId.toString());
      await setDoc(subRef, {
        chatId: chatId,
        firstName: message.from?.first_name || "Investor",
        username: message.from?.username || "",
        createdAt: new Date().toISOString()
      }, { merge: true });

      // جلب الأسواق النشطة لبناء الأزرار
      const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
      const symbols = symbolsSnap.docs.map(d => d.data().code);

      // تقسيم الأزرار لصفوف (كل صف زرين)
      const keyboard = [];
      for (let i = 0; i < symbols.length; i += 2) {
        keyboard.push(symbols.slice(i, i + 2).map(s => ({ text: s })));
      }

      const welcomeMessage = `
مرحباً بك في ناميكس 🟠

منصتك الذكية لإدارة وتداول الأصول الرقمية.
يمكنك الآن رصد الأسواق العالمية فوراً عبر أزرار الوصول السريع أدناه.

✨ اضغط على أي سوق للحصول على تحليل NAMIX AI اللحظي.
🚀 نفذ صفقاتك بلمسة واحدة عبر التطبيق المصغر.
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

      // إرسال زر فتح التطبيق كـ Inline لضمان بروتوكول web_app
      await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: "الوصول السريع للمحطة الرئيسية:",
          reply_markup: {
            inline_keyboard: [[
              { text: "🟠 فتح التطبيق", web_app: { url: `${baseUrl}/home` } }
            ]]
          }
        })
      });
    } 
    // 2. معالجة طلبات تحليل الأسواق (عند الضغط على أزرار الكيبورد)
    else if (text) {
      const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("code", "==", text), where("isActive", "==", true)));
      
      if (!symbolsSnap.empty) {
        const symbolDoc = symbolsSnap.docs[0];
        const symbolData = symbolDoc.data();
        
        // استدعاء محرك الذكاء الاصطناعي
        const signal = await runNamix(symbolData.binanceSymbol || symbolData.code);
        const confidence = Math.round(signal.score * 100);
        const isBuy = signal.decision === 'BUY';
        const colorEmoji = isBuy ? '🟢' : signal.decision === 'SELL' ? '🔴' : '⚪';
        const actionLabel = isBuy ? 'شراء' : signal.decision === 'SELL' ? 'بيع' : 'انتظار';

        const analysisMsg = `
${colorEmoji} *تحليل NAMIX AI: ${text}*

*الاتجاه المتوقع:* ${actionLabel}
*نسبة الثقة:* %${confidence}
*السعر الحالي:* $${signal.agents?.tech?.last?.toLocaleString()}

*الأهداف الاستراتيجية:*
🎯 هدف 1: $${(signal.agents.tech.last * (isBuy ? 1.005 : 0.995)).toFixed(2)}
🎯 هدف 2: $${(signal.agents.tech.last * (isBuy ? 1.01 : 0.99)).toFixed(2)}
🛑 وقف الخسارة: $${signal.invalidated_at?.toFixed(2)}

_التحليل مبني على تقاطع بيانات الزخم والسيولة اللحظية._
        `;

        await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: analysisMsg,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { 
                  text: `${colorEmoji} تنفيذ صفقة ${actionLabel}`, 
                  web_app: { url: `${baseUrl}/trade/${symbolDoc.id}` } 
                }
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
