
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

/**
 * @fileOverview محرك عمليات تلغرام الموحد v1.0
 * يدير إرسال الإشارات وتوثيقها عبر كافة البوتات النشطة.
 */

interface TelegramBot {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
}

/**
 * إرسال إشارة تداول لكافة البوتات النشطة في النظام
 */
export async function broadcastSignalToTelegram(signal: any, symbol: any) {
  try {
    const { firestore } = initializeFirebase();
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    
    if (botsSnap.empty) return { success: false, error: "No active bots" };

    const isBuy = signal.decision === 'BUY';
    const accentEmoji = isBuy ? '🟢' : '🔴';
    const actionLabel = isBuy ? 'شراء | BUY' : 'بيع | SELL';
    
    // صياغة الرسالة الاحترافية
    const message = `
${accentEmoji} *توصية تداول ذكية: ${symbol.code}*

*الاتجاه:* ${actionLabel}
*نسبة الثقة:* %${Math.round(signal.score * 100)}
*سعر الدخول:* $${signal.entry_zone.split('-')[1].trim()}

*الأهداف الاستراتيجية:*
🎯 الهدف 1: $${(symbol.currentPrice * signal.targets.tp1).toFixed(2)}
🎯 الهدف 2: $${(symbol.currentPrice * signal.targets.tp2).toFixed(2)}
🚀 الهدف الأقصى: $${(symbol.currentPrice * signal.targets.tp3).toFixed(2)}

🛑 نقطة الخروج الآمنة: $${signal.invalidated_at.toFixed(2)}

_تم التحليل بواسطة محرك NAMIX AI_
    `;

    // إرسال الرسالة لكل بوت
    const sendOps = botsSnap.docs.map(async (botDoc) => {
      const bot = botDoc.data() as TelegramBot;
      
      // جلب كافة المشتركين في هذا البوت (يتم تخزينهم عند بدء المحادثة)
      const subsSnap = await getDocs(collection(firestore, "system_settings", "telegram", "bots", botDoc.id, "subscribers"));
      
      const botOps = subsSnap.docs.map(subDoc => {
        const chatId = subDoc.id;
        const buttonColor = isBuy ? "🟢" : "🔴";
        const tmaUrl = `https://t.me/${bot.name.replace('@', '')}/app?startapp=${symbol.id}`;

        return fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: `${buttonColor} تنفيذ الصفقة في المحطة`, url: tmaUrl }
              ]]
            }
          })
        });
      });

      return Promise.all(botOps);
    });

    await Promise.all(sendOps);

    // توثيق عملية البث
    await addDoc(collection(firestore, "telegram_broadcast_logs"), {
      symbolId: symbol.id,
      symbolCode: symbol.code,
      decision: signal.decision,
      confidence: Math.round(signal.score * 100),
      botCount: botsSnap.size,
      createdAt: new Date().toISOString()
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * إضافة بوت جديد للمنظومة
 */
export async function addNewTelegramBot(name: string, token: string) {
  try {
    const { firestore } = initializeFirebase();
    // التحقق من صحة التوكن عبر API تلغرام قبل الحفظ
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    
    if (!data.ok) throw new Error("توكن البوت غير صحيح أو غير صالح.");

    const botRef = doc(collection(firestore, "system_settings", "telegram", "bots"));
    await setDoc(botRef, {
      id: botRef.id,
      name: name.startsWith('@') ? name : `@${name}`,
      token: token,
      isActive: true,
      botUsername: data.result.username,
      createdAt: new Date().toISOString()
    });

    return { success: true, id: botRef.id };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function setDoc(botRef: any, arg1: { id: any; name: string; token: string; isActive: boolean; botUsername: any; createdAt: string; }) {
    const { firestore } = initializeFirebase();
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(botRef, arg1);
}
