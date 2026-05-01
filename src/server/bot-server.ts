
import express from 'express';
import WebSocket from 'ws';
import { initializeFirebase } from '../firebase';
import { doc, getDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { sendWhaleAlertToTelegram } from '../app/actions/telegram-actions';
import { runNamix } from '../lib/namix-orchestrator';

/**
 * @fileOverview NAMIX AUTONOMOUS WORKER v8.0 - Background Operations Only
 * تم تجريد هذا الخادم من مسؤولية الويب هوك (نُقلت لـ Vercel) وتخصيصه للمهام الثقيلة.
 * المهام: رادار الحيتان (WebSocket) + بث الإشارات التلقائي.
 */

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { firestore } = initializeFirebase();

app.get('/', (req, res) => {
  res.status(200).send('Namix Autonomous Background Worker v8.0 is Operational.');
});

// ملاحظة: مسار /webhook/:botId تم نقله إلى Vercel لضمان سرعة الاستجابة.

/**
 * 1. رادار السيولة الضخمة (Whale Watcher Hub)
 * مراقبة حية لتدفق الصفقات الكبرى عبر Binance WebSocket
 */
const WHALE_THRESHOLD = 50000;
let whaleWs: WebSocket | null = null;

function startWhaleWatching() {
  if (whaleWs) whaleWs.terminate();
  
  const symbols = ['btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'xrpusdt', 'trxusdt', 'ltcusdt', 'dogeusdt', 'adausdt', 'maticusdt'];
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${symbols.map(s => `${s}@trade`).join('/')}`;
  
  whaleWs = new WebSocket(wsUrl);

  whaleWs.on('message', async (data) => {
    try {
      const payload = JSON.parse(data.toString());
      const trade = payload.data;
      const amountUSD = parseFloat(trade.p) * parseFloat(trade.q);

      if (amountUSD >= WHALE_THRESHOLD) {
        const side = trade.m ? 'SELL' : 'BUY';
        await sendWhaleAlertToTelegram({
          symbol: trade.s,
          side,
          amount: amountUSD,
          price: parseFloat(trade.p),
          comment: side === 'BUY' ? "دخول سيولة ذكية ترفع سقف التوقعات." : "عملية تصريف قد تؤدي لتصحيح لحظي."
        });
      }
    } catch (e) {}
  });

  whaleWs.on('error', () => setTimeout(startWhaleWatching, 5000));
  whaleWs.on('close', () => setTimeout(startWhaleWatching, 5000));
}

/**
 * 2. محرك البث الآلي للإشارات الموجهة
 */
async function runAutonomousBroadcast() {
  try {
    const botsSnap = await getDocs(query(collection(firestore, "system_settings", "telegram", "bots"), where("isActive", "==", true)));
    if (botsSnap.empty) return;

    const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
    const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    for (const sym of symbols) {
      // تحليل كل سوق وبث النتائج للمشتركين المستهدفين (Logic internal to runNamix)
      await runNamix(sym.binanceSymbol || sym.code, 300).catch(() => {});
    }
  } catch (e) {
    console.error("Worker Broadcast Error:", e);
  }
}

// إطلاق العمال الخلفيين
startWhaleWatching();
setInterval(runAutonomousBroadcast, 300000); // كل 5 دقائق

app.listen(PORT, () => {
  console.log(`Namix Worker Hub is active on port ${PORT}`);
});
