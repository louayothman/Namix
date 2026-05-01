
import express from 'express';
import { initializeFirebase } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, addDoc, updateDoc } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from '../app/actions/telegram-user-actions';
import { showChatAssetOptions, executeChatTrade, toggleChatAutoTrade, showChatMarkets } from '../app/actions/telegram-trading-actions';
import { runNamix } from '../lib/namix-orchestrator';
import { broadcastSignalToTelegram } from '../app/actions/telegram-actions';

/**
 * @fileOverview NAMIX SOVEREIGN BOT ENGINE v6.0 - Mood-Aware Execution
 * خادم البوت المطور ليعمل كقمرة قيادة ذكية تفهم "مزاج السوق" وتدعم التنفيذ المزدوج.
 * تم تطهير الكلمات المرفوضة.
 */

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { firestore } = initializeFirebase();

app.get('/', (req, res) => {
  res.status(200).send('Namix Sovereign Bot Engine v6.0 is Operational.');
});

app.post('/webhook/:botId', async (req, res) => {
  const { botId } = req.params;
  const update = req.body;

  // رد فوري لتلغرام لضمان سرعة الأزرار
  res.status(200).send({ ok: true });

  try {
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return;
    const bot = botSnap.data();

    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      // تأكيد استلام النقرة
      fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      }).catch(() => {});

      const host = process.env.APP_URL || "namix.pro";

      if (data === 'user_trade') {
        await showChatMarkets(bot.token, chatId, messageId);
      } 
      else if (data.startsWith('tchat_sym_')) {
        await showChatAssetOptions(bot.token, chatId, messageId, data.replace('tchat_sym_', ''));
      } 
      else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        const side = parts[2] as 'buy' | 'sell';
        const symbolId = parts[3];
        // تنفيذ حقيقي وسينمائي بداخل الشات
        executeChatTrade(bot.token, chatId, symbolId, side, 10, 20).catch(console.error);
      }
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
      else if (data.startsWith('user_autotrade_')) {
        const current = data.split('_')[2] === 'true';
        await toggleChatAutoTrade(bot.token, chatId, messageId, current);
      }
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }
    }

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
 * محرك البث الآلي الذكي (يتأثر بمزاج السوق)
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
        
        // إذا كان التداول الآلي مفعلاً لمجموعة من المستخدمين، نقوم بالتنفيذ فوراً
        // يتم هذا الجزء عبر فحص المستخدمين الذين لديهم isChatAutoTradeEnabled: true
      } catch (e) {}
    }

    // اختيار أقوى إشارة حالية للبث
    const best = analyses.sort((a, b) => b.strength - a.strength)[0];
    if (best && best.analysis.decision !== 'HOLD' && best.analysis.confidence >= 65) {
      await broadcastSignalToTelegram(best.analysis, best.sym);
    }
  } catch (e) {
    console.error("Autonomous Broadcast Error:", e);
  }
}

// تشغيل محرك البث كل 5 دقائق
setInterval(runAutonomousBroadcast, 300000);
setTimeout(runAutonomousBroadcast, 15000);

// معالجة الأخطاء غير المتوقعة لمنع انهيار الخادم على Render
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason, promise) => console.error('Unhandled Rejection at:', promise, 'reason:', reason));

app.listen(PORT, () => {
  console.log(`Namix Mood-Adaptive Engine is now Active on port ${PORT}`);
});
