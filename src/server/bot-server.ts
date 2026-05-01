
import express from 'express';
import { initializeFirebase } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, addDoc, updateDoc } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from '../app/actions/telegram-user-actions';
import { showChatAssetOptions, executeChatTrade, showChatMarkets } from '../app/actions/telegram-trading-actions';
import { runNamix } from '../lib/namix-orchestrator';
import { broadcastSignalToTelegram } from '../app/actions/telegram-actions';

/**
 * @fileOverview NAMIX SOVEREIGN BOT ENGINE v3.0 - Full Autonomous Operation
 * خادم البوت المستقل المطور ليعمل كقمرة قيادة 24/7 على Render.
 */

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { firestore } = initializeFirebase();

// 1. مسار فحص الحالة (Health Check) لضمان بقاء الخدمة نشطة
app.get('/', (req, res) => {
  res.status(200).send('Namix Sovereign Bot Engine is Operational and Synced.');
});

// 2. معالجة طلبات تيلجرام (Webhooks)
app.post('/webhook/:botId', async (req, res) => {
  const { botId } = req.params;
  const update = req.body;

  // الخطوة الذهبية: الرد الفوري لإغلاق الاتصال ومنع تعليق الأزرار
  res.status(200).send({ ok: true });

  try {
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return;
    const bot = botSnap.data();

    // معالجة نقرات الأزرار التفاعلية
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      // إخطار تيلجرام باستلام النقرة فوراً
      fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      }).catch(() => {});

      const host = process.env.APP_URL || "namix.pro";

      // --- مصفوفة توجيه العمليات ---
      
      // الدخول والتسجيل (TMA)
      if (data === 'user_signup' || data === 'user_login') {
        const route = data === 'user_signup' ? 'telegram-signup' : 'telegram-login';
        const url = `https://${host}/auth/${route}?chatId=${chatId}`;
        await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "🔐 *بوابة الهوية الرقمية*\n\nيرجى فتح النافذة أدناه لإتمام العملية بشكل مؤمن.",
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: "⚡ فتح البوابة", web_app: { url } }]] }
          })
        });
      } 
      
      // التداول والأسواق
      else if (data === 'user_trade') {
        await showChatMarkets(bot.token, chatId, messageId);
      } 
      else if (data.startsWith('tchat_sym_')) {
        await showChatAssetOptions(bot.token, chatId, messageId, data.replace('tchat_sym_', ''));
      } 
      else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        const side = parts[2];
        const symbolId = parts[3];
        // تشغيل محرك الصفقات السينمائي
        executeChatTrade(bot.token, chatId, symbolId, side as any, 10, 15).catch(console.error);
      }
      
      // رادار التحليل المرئي
      else if (data.startsWith('tchat_ai_')) {
        const symbolId = data.replace('tchat_ai_', '');
        const symSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
        if (symSnap.exists()) {
           const symData = symSnap.data();
           await addDoc(collection(firestore, "market_analysis_requests"), {
              symbolId: symSnap.id,
              symbolCode: symData.code,
              chatId: chatId,
              messageId: messageId,
              botId: botId,
              status: "pending",
              createdAt: new Date().toISOString()
           });
        }
      }

      // القوائم والعمليات العامة
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }
    }

    // معالجة رسائل البداية والتعرف على الجلسة
    if (update.message && update.message.text === '/start') {
      const chatId = update.message.chat.id.toString();
      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        await sendUserSuccessBriefing(chatId, { ...userData, id: userSnap.docs[0].id });
      } else {
        await sendWelcomeMessage(bot.token, chatId);
      }
    }
  } catch (error) {
    console.error("Critical Bot Server Execution Error:", error);
  }
});

/**
 * 🛰️ محرك البث الاستخباراتي التلقائي (Autonomous Signals)
 * يقوم بفحص الأسواق وبث الإشارات كل 5 دقائق بشكل مستقل تماماً.
 */
async function runAutonomousBroadcast() {
  try {
    const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
    if (symbolsSnap.empty) return;
    
    const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    const analyses = [];

    for (const sym of symbols) {
      try {
        const analysis = await runNamix(sym.binanceSymbol || sym.code);
        const strength = Math.abs(analysis.score - 0.5);
        analyses.push({ sym, analysis, strength });
      } catch (e) {}
    }

    const best = analyses.sort((a, b) => b.strength - a.strength)[0];
    if (best && best.analysis.decision !== 'HOLD') {
      // إرسال الإشارة نصياً فوراً؛ الصورة سيولدها "المفاعل" في المتصفح لاحقاً إذا كان الموقع مفتوحاً
      await broadcastSignalToTelegram(best.analysis, best.sym);
    }
  } catch (e) {
    console.error("Autonomous Broadcast Error:", e);
  }
}

// تشغيل محرك الإشارات كل 5 دقائق
setInterval(runAutonomousBroadcast, 300000);
// تشغيل أولي عند بدء الخادم
setTimeout(runAutonomousBroadcast, 10000);

app.listen(PORT, () => {
  console.log(`Namix Autonomous Engine is now Active on port ${PORT}`);
});
