
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات تلغرام الموحد v6.0 - High Frequency Vital Signals
 * تم تطوير المحرك لإرسال إشارات مصورة وعصرية تليق بهوية ناميكس النخبوية.
 */

interface TelegramBot {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  botUsername: string;
}

const CHART_IMAGES = [
  "https://images.unsplash.com/photo-1611974714024-4607a0a715f8?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1642790103547-1757df15039a?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1644659399105-3e284a1e9447?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000"
];

/**
 * إرسال إشارة تداول مصورة لكافة البوتات النشطة في النظام
 */
export async function broadcastSignalToTelegram(signal: any, symbol: any) {
  try {
    const { firestore } = initializeFirebase();
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    
    if (botsSnap.empty) return { success: false, error: "No active bots" };

    const confidence = Math.round(signal.score * 100);
    const isBuy = signal.decision === 'BUY';
    const accentEmoji = isBuy ? '🟢' : '🔴';
    const actionLabel = isBuy ? 'شراء | LONG' : 'بيع | SHORT';
    
    const caption = `
${accentEmoji} *تحليل فرصة تداول: ${symbol.code}*

*الاتجاه المقترح:* ${actionLabel}
*نسبة الثقة:* %${confidence}
*سعر التمركز:* $${(signal.agents?.tech?.last || symbol.currentPrice).toLocaleString()}

---

*الأهداف الاستراتيجية:*
🎯 الهدف 1: $${(symbol.currentPrice * (isBuy ? 1.005 : 0.995)).toFixed(2)}
🎯 الهدف 2: $${(symbol.currentPrice * (isBuy ? 1.01 : 0.99)).toFixed(2)}
🚀 الهدف الأقصى: $${(symbol.currentPrice * (isBuy ? 1.02 : 0.98)).toFixed(2)}

🛑 وقف الخسارة المعتمد: $${(signal.invalidated_at || symbol.currentPrice * (isBuy ? 0.99 : 1.01)).toFixed(2)}

---
_تم التحليل بواسطة NAMIX AI_
    `;

    const randomPhoto = CHART_IMAGES[Math.floor(Math.random() * CHART_IMAGES.length)];

    const sendOps = botsSnap.docs.map(async (botDoc) => {
      const bot = botDoc.data() as TelegramBot;
      const subsSnap = await getDocs(collection(firestore, "system_settings", "telegram", "bots", botDoc.id, "subscribers"));
      
      const botOps = subsSnap.docs.map(subDoc => {
        const chatId = subDoc.id;
        const buttonEmoji = isBuy ? "🟢" : "🔴";
        const host = headers().get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const tmaUrl = `${protocol}://${host}/trade/${symbol.id}`;

        return fetch(`https://api.telegram.org/bot${bot.token}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            photo: randomPhoto,
            caption: caption,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: `${buttonEmoji} تنفيذ الصفقة فوراً`, web_app: { url: tmaUrl } }
              ]]
            }
          })
        });
      });

      return Promise.all(botOps);
    });

    await Promise.all(sendOps);

    await addDoc(collection(firestore, "telegram_broadcast_logs"), {
      symbolId: symbol.id,
      symbolCode: symbol.code,
      decision: signal.decision,
      confidence: confidence,
      botCount: botsSnap.size,
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

    const headersList = headers();
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
