
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

/**
 * @fileOverview محرك الاستجابة التلقائية لبوتات ناميكس v1.0
 * يدير معالجة رسائل المستخدمين (مثل /start) وتوثيق المشتركين.
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

    // 1. جلب بيانات البوت من القاعدة السيادية
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return NextResponse.json({ ok: true });
    
    const bot = botSnap.data();

    if (text === '/start') {
      // 2. توثيق المستخدم كمشترك لاستقبال الإشارات
      const subRef = doc(firestore, "system_settings", "telegram", "bots", botId, "subscribers", chatId.toString());
      await setDoc(subRef, {
        chatId: chatId,
        firstName: message.from?.first_name || "Investor",
        username: message.from?.username || "",
        createdAt: new Date().toISOString()
      });

      // 3. صياغة الرسالة الترحيبية الراقية
      const welcomeMessage = `
مرحباً بك في ناميكس 🟠
منصتك الذكية لإدارة وتداول الأصول الرقمية.

يسرنا انضمامك إلينا، يمكنك الآن الاستفادة من المزايا التالية:
✨ إشارات تداول ذكية مبنية على تحليل دقيق.
📊 متابعة مباشرة لأسعار الأصول العالمية.
🚀 تنفيذ الصفقات بلمسة واحدة عبر التطبيق المصغر.
🔔 تنبيهات فورية لأرباحك ونشاط حسابك.

اضغط على الزر أدناه لفتح المحطة وبدء رحلة النمو المالي.
      `;

      const tmaUrl = `https://t.me/${bot.botUsername}/app`;

      // 4. إرسال الرسالة عبر API تلغرام
      await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeMessage,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: "🟠 فتح التطبيق", url: tmaUrl }
            ]]
          }
        })
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Telegram Webhook Error:", e.message);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
