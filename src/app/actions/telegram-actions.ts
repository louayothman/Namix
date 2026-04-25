
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات تلغرام المطور v29.0 - Support for Direct Chat Sending
 */

interface TelegramBot {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  botUsername: string;
}

/**
 * إرسال صورة تحليل أو إشارة لدردشة محددة (Chat ID)
 */
export async function sendImageToChat(botId: string, chatId: string, caption: string, imageUri?: string) {
  try {
    const { firestore } = initializeFirebase();
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return { success: false };
    const bot = botSnap.data() as TelegramBot;

    let photoBlob: Blob | null = null;
    if (imageUri) {
      const base64Data = imageUri.split(',')[1];
      const binaryData = Buffer.from(base64Data, 'base64');
      photoBlob = new Blob([binaryData], { type: 'image/jpeg' });
    }

    const formData = new FormData();
    formData.append('chat_id', chatId);
    if (photoBlob) formData.append('photo', photoBlob, 'analysis_card.jpg');
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');

    const endpoint = photoBlob ? 'sendPhoto' : 'sendMessage';
    if (!photoBlob) formData.set('text', caption);

    await fetch(`https://api.telegram.org/bot${bot.token}/${endpoint}`, {
      method: 'POST',
      body: formData
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * إرسال إشارة تداول مصورة واحترافية (JPG) لكافة البوتات النشطة
 */
export async function broadcastSignalToTelegram(signal: any, symbol: any, imageUri?: string) {
  try {
    const { firestore } = initializeFirebase();
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    
    if (botsSnap.empty) return { success: false, error: "No active bots" };

    const isLong = signal.type === 'LONG';
    const trendIcon = isLong ? '📈' : '📉';
    
    const caption = `
📊 *إشارة تداول — ${signal.pair}*

📍 *نوع العملية:* ${signal.type}  
💰 *نطاق التمركز:* ${signal.entry_range}  
🎯 *الهدف 1:* ${signal.targets.tp1.toFixed(2)}  
🎯 *الهدف 2:* ${signal.targets.tp2.toFixed(2)}  
🎯 *الهدف 3:* ${signal.targets.tp3.toFixed(2)}  
🛑 *وقف الخسارة:* ${signal.targets.sl.toFixed(2)}  

⚡ *نسبة الثقة:* %${signal.confidence}  
${trendIcon} *اتجاه النبض:* ${signal.trend}  

🧠 *التحليل الاستراتيجي:*
${signal.reason}

🔥 *المخاطرة:* ${signal.risk.label}  

_تم استنباط هذه الإشارة عبر محرك NAMIX AI لتحليل تدفقات السوق اللحظية._
    `.trim();

    const headersList = await headers();
    const host = headersList.get('host') || "";
    const domain = host.split(':')[0];
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    const tmaUrl = `${protocol}://${domain}/trade/${symbol.id}`;

    let photoBlob: Blob | null = null;
    if (imageUri) {
      const base64Data = imageUri.split(',')[1];
      const binaryData = Buffer.from(base64Data, 'base64');
      photoBlob = new Blob([binaryData], { type: 'image/jpeg' });
    }

    const sendOps = botsSnap.docs.map(async (botDoc) => {
      const bot = botDoc.data() as TelegramBot;
      const subsSnap = await getDocs(collection(firestore, "system_settings", "telegram", "bots", botDoc.id, "subscribers"));
      
      const botOps = subsSnap.docs.map(subDoc => {
        const chatId = subDoc.id;
        const formData = new FormData();
        formData.append('chat_id', chatId);
        if (photoBlob) formData.append('photo', photoBlob, 'signal_card.jpg');
        formData.append('caption', caption);
        formData.append('parse_mode', 'Markdown');
        formData.append('reply_markup', JSON.stringify({
          inline_keyboard: [[{ text: `🚀 تنفيذ صفقة ${isLong ? 'شراء' : 'بيع'}`, web_app: { url: tmaUrl } }]]
        }));

        const endpoint = photoBlob ? 'sendPhoto' : 'sendMessage';
        if (!photoBlob) formData.set('text', caption);

        return fetch(`https://api.telegram.org/bot${bot.token}/${endpoint}`, {
          method: 'POST',
          body: formData
        });
      });

      return Promise.all(botOps);
    });

    await Promise.all(sendOps);

    await addDoc(collection(firestore, "telegram_broadcast_logs"), {
      symbolId: symbol.id,
      symbolCode: signal.pair,
      decision: signal.decision,
      confidence: signal.confidence,
      botCount: botsSnap.size,
      createdAt: new Date().toISOString()
    });

    return { success: true };
  } catch (e: any) {
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
    const host = headersList.get('host') || "";
    const domain = host.split(':')[0];
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    const webhookUrl = `${protocol}://${domain}/api/telegram/webhook/${botId}`;

    const webhookRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    });
    
    const webhookData = await webhookRes.json();
    if (!webhookData.ok) {
      throw new Error(`Telegram API Error: ${webhookData.description || "فشل الربط"}`);
    }

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
