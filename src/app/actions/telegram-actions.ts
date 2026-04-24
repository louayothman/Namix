
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات تلغرام المطور v10.0 - Professional Signal Cards
 * تم تحديث المحرك لدعم توليد البطاقات الاستخباراتية المصورة والتنسيق الاحترافي الكامل.
 */

interface TelegramBot {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  botUsername: string;
}

/**
 * إرسال إشارة تداول مصورة واحترافية لكافة البوتات النشطة
 */
export async function broadcastSignalToTelegram(signal: any, symbol: any) {
  try {
    const { firestore } = initializeFirebase();
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    
    if (botsSnap.empty) return { success: false, error: "No active bots" };

    const isLong = signal.type === 'LONG';
    const accentEmoji = isLong ? '🟢' : '🔴';
    const trendIcon = isLong ? '📈' : '📉';
    
    // بناء كابشن الإشارة بنظام التنسيق الاحترافي
    const caption = `
📊 *تنبيه تداول — ${signal.pair}*

📍 *نوع الصفقة:* ${signal.type}  
💰 *الدخول:* ${signal.entry_range}  
🎯 *TP1:* ${signal.targets.tp1.toFixed(2)}  
🎯 *TP2:* ${signal.targets.tp2.toFixed(2)}  
🎯 *TP3:* ${signal.targets.tp3.toFixed(2)}  
🛑 *SL:* ${signal.targets.sl.toFixed(2)}  

⚡ *الثقة:* %${signal.confidence}  
${trendIcon} *الاتجاه:* ${signal.trend}  

🧠 *السبب:*
${signal.reason}

⏱ *المدة:* ${signal.timeframe}  
🔥 *المخاطرة:* ${signal.risk.label}  

---
_تم التحليل بواسطة NAMIX AI_
    `.trim();

    // استخدام محرك صور الرسوم البيانية المعتمد (TradingView Screenshot API Proxy)
    const chartUrl = `https://chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:${signal.pair.replace('/', '')}&theme=dark&width=800&height=500&interval=1h&style=1`;

    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const tmaUrl = `${protocol}://${host}/trade/${symbol.id}`;

    const sendOps = botsSnap.docs.map(async (botDoc) => {
      const bot = botDoc.data() as TelegramBot;
      const subsSnap = await getDocs(collection(firestore, "system_settings", "telegram", "bots", botDoc.id, "subscribers"));
      
      const botOps = subsSnap.docs.map(subDoc => {
        const chatId = subDoc.id;
        const buttonEmoji = isLong ? "🟢" : "🔴";

        return fetch(`https://api.telegram.org/bot${bot.token}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            photo: chartUrl,
            caption: caption,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `🚀 تنفيذ صفقة ${isLong ? 'شراء' : 'بيع'}`, web_app: { url: tmaUrl } }
                ],
                [
                  { text: `🔔 متابعة الصفقة`, callback_data: `sub_${signal.pair}` }
                ]
              ]
            }
          })
        });
      });

      return Promise.all(botOps);
    });

    await Promise.all(sendOps);

    // توثيق عملية البث في السجل التاريخي
    await addDoc(collection(firestore, "telegram_broadcast_logs"), {
      symbolId: symbol.id,
      symbolCode: signal.pair,
      decision: signal.decision,
      confidence: signal.confidence,
      botCount: botsSnap.size,
      messagePreview: caption.substring(0, 100),
      createdAt: new Date().toISOString()
    });

    return { success: true };
  } catch (e: any) {
    console.error("Telegram Broadcast Error:", e.message);
    return { success: false, error: e.message };
  }
}

/**
 * إضافة بوت جديد وتفعيل الـ Webhook الخاص به آلياً
 */
export async function addNewTelegramBot(name: string, token: string) {
  try {
    const { firestore } = initializeFirebase();
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    
    if (!data.ok) throw new Error("توكن البوت غير صحيح أو غير صالح.");

    const botId = Math.random().toString(36).substr(2, 9);
    const botUsername = data.result.username;

    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const webhookUrl = `${protocol}://${host}/api/telegram/webhook/${botId}`;

    const webhookRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    });
    
    const webhookData = await webhookRes.json();
    if (!webhookData.ok) throw new Error("فشل في ربط الـ Webhook مع تلغرام.");

    const botRef = doc(firestore, "system_settings", "telegram", "bots", botId);
    await setDoc(botRef, {
      id: botId,
      name: name,
      token: token,
      isActive: true,
      botUsername: botUsername,
      webhookUrl: webhookUrl,
      createdAt: new Date().toISOString()
    });

    return { success: true, id: botId };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
