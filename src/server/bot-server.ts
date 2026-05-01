
import express from 'express';
import { initializeFirebase } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, addDoc, updateDoc } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from '../app/actions/telegram-user-actions';
import { showChatAssetOptions, executeChatTrade, showChatMarkets } from '../app/actions/telegram-trading-actions';
import { runNamix } from '../lib/namix-orchestrator';
import { broadcastSignalToTelegram } from '../app/actions/telegram-actions';

/**
 * @fileOverview NAMIX SOVEREIGN BOT ENGINE v5.0 - Multi-Platform Adaptive Core
 * خادم البوت المطور ليعمل كقمرة قيادة 24/7 مع دعم التبديل البصري للرسائل المثبتة.
 */

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { firestore } = initializeFirebase();

app.get('/', (req, res) => {
  res.status(200).send('Namix Sovereign Bot Engine is Operational and Synced.');
});

app.post('/webhook/:botId', async (req, res) => {
  const { botId } = req.params;
  const update = req.body;

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
        executeChatTrade(bot.token, chatId, parts[3], parts[2] as any, 10, 15).catch(console.error);
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
      await broadcastSignalToTelegram(best.analysis, best.sym);
    }
  } catch (e) {
    console.error("Autonomous Broadcast Error:", e);
  }
}

setInterval(runAutonomousBroadcast, 300000);
setTimeout(runAutonomousBroadcast, 10000);

app.listen(PORT, () => {
  console.log(`Namix Autonomous Engine is now Active on port ${PORT}`);
});
