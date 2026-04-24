
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';
import { headers } from 'next/headers';

/**
 * @fileOverview محرك عمليات تلغرام الموحد v4.0
 * يدير إرسال الإشارات، إضافة البوتات مع جلب البيانات تلقائياً، وتفعيل الـ Webhook.
 */

interface TelegramBot {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  botUsername: string;
}

/**
 * إرسال إشارة تداول لكافة البوتات النشطة في النظام
 * يدعم إرسال الإشارات حتى بثقة منخفضة (1%) لضمان الاستمرارية
 */
export async function broadcastSignalToTelegram(signal: any, symbol: any) {
  try {
    const { firestore } = initializeFirebase();
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    
    if (botsSnap.empty) return { success: false, error: "No active bots" };

    const confidence = Math.round(signal.score * 100);
    const isBuy = signal.decision === 'BUY';
    const accentEmoji = isBuy ? '🟢' : '🔴';
    const actionLabel = isBuy ? 'شراء | BUY' : 'بيع | SELL';
    
    const message = `
${accentEmoji} *توصية تداول: ${symbol.code}*

*الاتجاه:* ${actionLabel}
*نسبة الثقة:* %${confidence}
*سعر الدخول:* $${(signal.agents?.tech?.last || symbol.currentPrice).toLocaleString()}

*الأهداف الاستراتيجية:*
🎯 الهدف 1: $${(symbol.currentPrice * (isBuy ? 1.005 : 0.995)).toFixed(2)}
🎯 الهدف 2: $${(symbol.currentPrice * (isBuy ? 1.01 : 0.99)).toFixed(2)}
🚀 الهدف الأقصى: $${(symbol.currentPrice * (isBuy ? 1.02 : 0.98)).toFixed(2)}

🛑 نقطة الخروج الآمنة: $${(symbol.currentPrice * (isBuy ? 0.99 : 1.01)).toFixed(2)}

_تم التحليل بواسطة NAMIX AI_
    `;

    const sendOps = botsSnap.docs.map(async (botDoc) => {
      const bot = botDoc.data() as TelegramBot;
      // جلب كافة المشتركين في هذا البوت
      const subsSnap = await getDocs(collection(firestore, "system_settings", "telegram", "bots", botDoc.id, "subscribers"));
      
      const botOps = subsSnap.docs.map(subDoc => {
        const chatId = subDoc.id;
        const buttonEmoji = isBuy ? "🟢" : "🔴";
        // الرابط يفتح التطبيق المصغر على صفحة السوق المحددة
        const tmaUrl = `https://t.me/${bot.botUsername}/app?startapp=${symbol.id}`;

        return fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: `${buttonEmoji} تنفيذ الصفقة في المحطة`, url: tmaUrl }
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
    return { success: false, error: e.message };
  }
}

/**
 * إضافة بوت جديد وتفعيل الـ Webhook الخاص به آلياً
 */
export async function addNewTelegramBot(name: string, token: string) {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. التحقق من صحة التوكن وجلب بيانات البوت (اليوزر نيم) تلقائياً لمنع الخطأ
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    
    if (!data.ok) throw new Error("توكن البوت غير صحيح أو غير صالح.");

    const botId = Math.random().toString(36).substr(2, 9);
    const botUsername = data.result.username;

    // 2. ربط الـ Webhook للاستجابة التلقائية فوراً
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

    // 3. حفظ البيانات الموثقة في القاعدة السيادية
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
