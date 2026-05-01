
import express from 'express';
import { initializeFirebase } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { handleTelegramMenuAction, sendUserSuccessBriefing, sendWelcomeMessage } from '../app/actions/telegram-user-actions';
import { showChatAssetOptions, executeChatTrade, toggleChatAutoTrade, showChatMarkets } from '../app/actions/telegram-trading-actions';

/**
 * @fileOverview NAMIX STANDALONE BOT SERVER v2.0 - TypeScript ESM Edition
 * خادم مخصص للتشغيل المستمر على Render لضمان استقرار البوت 24/7.
 */

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { firestore } = initializeFirebase();

app.post('/webhook/:botId', async (req, res) => {
  const { botId } = req.params;
  const update = req.body;

  // 1. رد فوري لتلغرام لمنع تعليق الأزرار (أهم خطوة)
  res.status(200).send({ ok: true });

  try {
    const botSnap = await getDoc(doc(firestore, "system_settings", "telegram", "bots", botId));
    if (!botSnap.exists()) return;
    const bot = botSnap.data();

    // معالجة نقرات الأزرار
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id.toString();
      const messageId = cb.message.message_id.toString();
      const data = cb.data;

      // إبلاغ تلغرام باستلام النقرة فوراً
      fetch(`https://api.telegram.org/bot${bot.token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: cb.id })
      }).catch(() => {});

      const host = process.env.APP_URL || "namix.pro";

      // معالجة الأوامر
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
      } else if (data === 'user_trade') {
        await showChatMarkets(bot.token, chatId, messageId);
      } else if (data.startsWith('tchat_sym_')) {
        await showChatAssetOptions(bot.token, chatId, messageId, data.replace('tchat_sym_', ''));
      } else if (data.startsWith('tchat_side_')) {
        const parts = data.split('_');
        executeChatTrade(bot.token, chatId, parts[3], parts[2] as any, 10, 15).catch(() => {});
      } else if (data.startsWith('user_')) {
        await handleTelegramMenuAction(bot.token, chatId, messageId, data, host);
      }
    }

    // معالجة الرسائل النصية (/start)
    if (update.message && update.message.text === '/start') {
      const chatId = update.message.chat.id.toString();
      const userQuery = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        await sendUserSuccessBriefing(chatId, { ...userSnap.docs[0].data(), id: userSnap.docs[0].id });
      } else {
        await sendWelcomeMessage(bot.token, chatId);
      }
    }
  } catch (error) {
    console.error("Bot Server Error:", error);
  }
});

app.get('/', (req, res) => {
  res.send('Namix Bot Hub is Operational.');
});

app.listen(PORT, () => {
  console.log(`Namix Bot Hub is operational on port ${PORT}`);
});
