
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات تلغرام المطور v40.0 - Executable Signal Cards
 * تم تطوير الإشارات لتصبح "بطاقات تفاعلية" تدعم التنفيذ المباشر أو الفتح في TMA.
 */

interface TelegramBot {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  botUsername: string;
}

export async function broadcastSignalToTelegram(signal: any, symbol: any, imageUri?: string) {
  try {
    const { firestore } = initializeFirebase();
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    
    if (botsSnap.empty) return { success: false, error: "No active bots" };

    const isLong = signal.type === 'LONG';
    const trendIcon = isLong ? '📈' : '📉';
    const moodColor = isLong ? 'Emerald' : 'Rose';
    
    let dialogueText = "";
    if (signal.dialogue && Array.isArray(signal.dialogue)) {
      dialogueText = "\n\n🗳️ *مناقشة محركات NAMIX:* \n" + signal.dialogue.map((d: any) => `• _${d.agent}:_ ${d.message}`).join('\n');
    }

    const caption = `
📊 *إشارة تداول — ${signal.pair}*
ــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
📍 *نوع العملية:* ${signal.type}  
💰 *نطاق التمركز:* ${signal.entry_range}  
🎯 *الهدف المحتمل:* ${signal.targets.tp1.toFixed(2)}  
🛑 *صمام الأمان:* ${signal.targets.sl.toFixed(2)}  

⚡ *نسبة الثقة:* %${signal.confidence}  
${trendIcon} *اتجاه النبض:* ${signal.trend}${dialogueText}

📝 *التحليل الاستراتيجي:*
_${signal.reason}_

_تم استخلاص البيانات عبر أوركسترا NAMIX للتحليل اللحظي._
    `.trim();

    const domain = process.env.NEXT_PUBLIC_APP_URL || "namix.pro";
    const tmaUrl = `https://${domain}/trade/${symbol.id}`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: `🚀 تنفيذ صفقة ${isLong ? 'شراء' : 'بيع'}`, callback_data: `tchat_side_${isLong ? 'buy' : 'sell'}_${symbol.id}` },
        ],
        [
          { text: `🔍 اكتشاف السوق (TMA)`, web_app: { url: tmaUrl } }
        ]
      ]
    };

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
        formData.append('reply_markup', JSON.stringify(keyboard));

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

    const domain = process.env.NEXT_PUBLIC_APP_URL || "namix.pro";
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
        inline_keyboard: [
          [{ text: `🚀 تنفيذ صفقة فورية`, callback_data: `tchat_sym_${symbolId}` }],
          [{ text: `🔍 اكتشاف السوق (TMA)`, web_app: { url: tmaUrl } }]
        ]
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
