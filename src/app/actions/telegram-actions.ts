
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات تلغرام المطور v35.0 - Hybrid Runtime Aware
 * تم تعديل المحرك ليعمل بذكاء في بيئة Next.js أو بيئة Node الصافية.
 */

interface TelegramBot {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  botUsername: string;
}

export async function sendImageToChat(
  botId: string, 
  chatId: string, 
  caption: string, 
  imageUri?: string,
  symbolId?: string
) {
  try {
    const { firestore } = initializeFirebase();
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return { success: false };
    const bot = botSnap.data() as TelegramBot;

    let photoBlob: any = null;
    if (imageUri) {
      const base64Data = imageUri.split(',')[1];
      photoBlob = Buffer.from(base64Data, 'base64');
    }

    // تأمين الـ Host بذكاء
    let domain = "namix.pro";
    try {
      const headersList = await headers();
      domain = headersList.get('host')?.split(':')[0] || domain;
    } catch (e) {
      // نحن في بيئة Node (Render)
      domain = process.env.APP_URL || domain;
    }

    const tmaUrl = `https://${domain}/trade/${symbolId}`;

    const formData = new FormData();
    formData.append('chat_id', chatId);
    if (photoBlob) {
      formData.append('photo', new Blob([photoBlob], { type: 'image/jpeg' }), 'analysis.jpg');
      formData.append('caption', caption);
    } else {
      formData.append('text', caption);
    }
    
    formData.append('parse_mode', 'Markdown');
    
    if (symbolId) {
      formData.append('reply_markup', JSON.stringify({
        inline_keyboard: [[{ text: `🚀 تنفيذ الصفقة`, web_app: { url: tmaUrl } }]]
      }));
    }

    const endpoint = photoBlob ? 'sendPhoto' : 'sendMessage';
    await fetch(`https://api.telegram.org/bot${bot.token}/${endpoint}`, {
      method: 'POST',
      body: formData
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function broadcastSignalToTelegram(signal: any, symbol: any, imageUri?: string) {
  try {
    const { firestore } = initializeFirebase();
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    
    if (botsSnap.empty) return { success: false, error: "No active bots" };

    const isLong = signal.type === 'LONG';
    const trendIcon = isLong ? '📈' : '📉';
    
    let dialogueText = "";
    if (signal.dialogue && Array.isArray(signal.dialogue)) {
      dialogueText = "\n\n🗳️ *مناقشة محركات NAMIX:* \n" + signal.dialogue.map((d: any) => `• _${d.agent}:_ ${d.message}`).join('\n');
    }

    const caption = `
📊 *إشارة تداول — ${signal.pair}*

📍 *نوع العملية:* ${signal.type}  
💰 *نطاق التمركز:* ${signal.entry_range}  
🎯 *الهدف 1:* ${signal.targets.tp1.toFixed(2)}  
🎯 *الهدف 2:* ${signal.targets.tp2.toFixed(2)}  
🛑 *صمام الأمان:* ${signal.targets.sl.toFixed(2)}  

⚡ *نسبة الثقة:* %${signal.confidence}  
${trendIcon} *اتجاه النبض:* ${signal.trend}${dialogueText}

📝 *التحليل الفني:*
${signal.reason}

🔥 *المخاطرة:* ${signal.risk.label}  

_تم استخلاص البيانات عبر محركات NAMIX للتحليل اللحظي._
    `.trim();

    let domain = "namix.pro";
    try {
      const headersList = await headers();
      domain = headersList.get('host')?.split(':')[0] || domain;
    } catch (e) {
      domain = process.env.APP_URL || domain;
    }

    const tmaUrl = `https://${domain}/trade/${symbol.id}`;

    let photoBuffer: any = null;
    if (imageUri) {
      const base64Data = imageUri.split(',')[1];
      photoBuffer = Buffer.from(base64Data, 'base64');
    }

    const sendOps = botsSnap.docs.map(async (botDoc) => {
      const bot = botDoc.data() as TelegramBot;
      const subsSnap = await getDocs(collection(firestore, "system_settings", "telegram", "bots", botDoc.id, "subscribers"));
      
      const botOps = subsSnap.docs.map(subDoc => {
        const chatId = subDoc.id;
        const formData = new FormData();
        formData.append('chat_id', chatId);
        
        if (photoBuffer) {
          formData.append('photo', new Blob([photoBuffer], { type: 'image/jpeg' }), 'signal.jpg');
          formData.append('caption', caption);
        } else {
          formData.append('text', caption);
        }

        formData.append('parse_mode', 'Markdown');
        formData.append('reply_markup', JSON.stringify({
          inline_keyboard: [[{ text: `🚀 تنفيذ صفقة ${isLong ? 'شراء' : 'بيع'}`, web_app: { url: tmaUrl } }]]
        }));

        const endpoint = photoBuffer ? 'sendPhoto' : 'sendMessage';
        return fetch(`https://api.telegram.org/bot${bot.token}/${endpoint}`, {
          method: 'POST',
          body: formData
        });
      });

      return Promise.all(botOps);
    });

    await Promise.all(sendOps);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function addNewTelegramBot(name: string, token: string) {
  try {
    const { firestore } = initializeFirebase();
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    if (!data.ok) throw new Error("توكن البوت غير صحيح.");

    const botId = Math.random().toString(36).substr(2, 9);
    const botUsername = data.result.username;

    // استخدام رابط Render الجديد بشكل قاطع
    const botServerUrl = "https://namix.onrender.com";
    const webhookUrl = `${botServerUrl}/webhook/${botId}`;

    await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    });

    const botRef = doc(firestore, "system_settings", "telegram", "bots", botId);
    await setDoc(botRef, {
      id: botId, name, token, isActive: true,
      botUsername, webhookUrl, createdAt: new Date().toISOString()
    });

    return { success: true, id: botId };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
