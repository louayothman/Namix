
import express from 'express';
import { initializeFirebase } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, limit, updateDoc } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from '../app/actions/telegram-user-actions';
import { showChatAssetOptions, executeChatTrade, toggleChatAutoTrade, showChatMarkets } from '../app/actions/telegram-trading-actions';
import { runNamix } from '../lib/namix-orchestrator';
import { broadcastSignalToTelegram } from '../app/actions/telegram-actions';

/**
 * @fileOverview NAMIX SOVEREIGN BOT ENGINE v6.5 - Strategic Node Verification
 * خادم البوت المطور ليدعم فحص حالة العقدة (Maintenance Mode) قبل معالجة أي طلب.
 */

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { firestore } = initializeFirebase();

app.get('/', (req, res) => {
  res.status(200).send('Namix Sovereign Bot Engine v6.5 is Operational.');
});

/**
 * معالج الويب هوك المركزي مع فحص حالة العقدة
 */
app.post('/webhook/:botId', async (req, res) => {
  const { botId } = req.params;
  const update = req.body;

  res.status(200).send({ ok: true });

  try {
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return;
    const bot = botSnap.data();

    // 1. فحص وضع الصيانة (Maintenance Mode)
    if (bot.config?.maintenanceMode) {
      const chatId = update.callback_query?.message?.chat?.id || update.message?.chat?.id;
      if (chatId) {
        await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "⚪ *تنبيه النظام*\n\nتخضع هذه العقدة حالياً لأعمال صيانة وتحديث دورية. يرجى المحاولة لاحقاً أو استخدام بوابة الويب المعتمدة.",
            parse_mode: 'Markdown'
          })
        });
      }
      return;
    }

    // 2. معالجة نقرات الأزرار
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      const host = process.env.APP_URL || "namix.pro";

      if (data === 'user_trade') {
        await showChatMarkets(bot.token, chatId, messageId);
      } 
      else if (data.startsWith('tchat_sym_')) {
        await showChatAssetOptions(bot.token, chatId, messageId, data.replace('tchat_sym_', ''));
      } 
      else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        executeChatTrade(bot.token, chatId, parts[3], parts[2] as any, 10, 20).catch(console.error);
      }
      else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }
    }

    // 3. معالجة الرسائل النصية (/start)
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
    console.error("Critical Bot Server Error:", error);
  }
});

/**
 * محرك البث الآلي المخصص (Autonomous Dispatcher)
 */
async function runAutonomousBroadcast() {
  try {
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    if (botsSnap.empty) return;

    const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
    const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    const activeSignals: any[] = [];
    for (const sym of symbols) {
      try {
        const analysis = await runNamix(sym.binanceSymbol || sym.code);
        if (analysis.decision !== 'HOLD') {
          activeSignals.push({ sym, analysis });
        }
      } catch (e) {}
    }

    if (activeSignals.length === 0) return;

    const usersSnap = await getDocs(query(collection(firestore, "users"), where("telegramChatId", "!=", "")));
    
    for (const userDoc of usersSnap.docs) {
      const user = userDoc.data();
      const settings = user.signalSettings || { type: 'BOTH', minConfidence: 60, symbols: [], frequency: 5 };

      const lastSignalAt = user.lastSignalSentAt ? new Date(user.lastSignalSentAt).getTime() : 0;
      if ((Date.now() - lastSignalAt) / 60000 < (settings.frequency || 5)) continue;

      const userMatches = activeSignals.filter(s => {
        const marketMatch = !settings.symbols?.length || settings.symbols.includes(s.sym.id);
        const confMatch = s.analysis.confidence >= (settings.minConfidence || 60);
        const typeMatch = settings.type === 'BOTH' || settings.type === s.analysis.decision;
        return marketMatch && confMatch && typeMatch;
      });

      if (userMatches.length > 0) {
        const bestForUser = userMatches.sort((a, b) => b.analysis.confidence - a.analysis.confidence)[0];
        await broadcastSignalToTelegram(bestForUser.analysis, bestForUser.sym, undefined, user.telegramChatId);
        await updateDoc(userDoc.ref, { lastSignalSentAt: new Date().toISOString() });
      }
    }
  } catch (e) {
    console.error("Autonomous Dispatcher Error:", e);
  }
}

setInterval(runAutonomousBroadcast, 300000);
setTimeout(runAutonomousBroadcast, 15000);

app.listen(PORT, () => {
  console.log(`Namix Autonomous Hub v6.5 is Active on port ${PORT}`);
});
