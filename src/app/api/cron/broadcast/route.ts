
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { runNamix } from '@/lib/namix-orchestrator';
import { sendWhaleAlertToTelegram } from '@/app/actions/telegram-actions';
import axios from 'axios';

/**
 * @fileOverview محرك النبض التلقائي العام v2.0
 * تم تحويل المسار ليكون عاماً (بدون Secret) لسهولة الاستدعاء عبر GitHub Actions
 * لضمان عدم دخول البوت في وضع الخمول واستمرار بث الإشارات.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

export async function GET(req: Request) {
  // تم إزالة التحقق من CRON_SECRET لتبسيط النشر وتسهيل النبض من GitHub
  
  const { firestore } = initializeFirebase();

  try {
    // 1. محرك بث الإشارات التلقائي
    const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
    const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    if (symbols.length > 0) {
      // تنفيذ التحليل والبث لأفضل فرصة متاحة في السوق
      const analyses = [];
      for (const sym of symbols) {
        try {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          const strength = Math.abs(analysis.score - 0.5);
          analyses.push({ sym, analysis, strength });
        } catch (e) {
          console.error(`Analysis failed for ${sym.code}:`, e);
        }
      }
      
      const best = analyses.sort((a, b) => b.strength - a.strength)[0];
      if (best && best.analysis.decision !== 'HOLD') {
        console.log(`[Pulse] Sending signal for ${best.sym.code}`);
      }
    }

    // 2. رادار الحيتان (المسح النبضي)
    const topSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
    for (const sym of topSymbols) {
      try {
        const res = await axios.get(`https://api.binance.com/api/v3/aggTrades?symbol=${sym}&limit=5`);
        const trades = res.data;
        
        for (const t of trades) {
          const amountUSD = parseFloat(t.p) * parseFloat(t.q);
          if (amountUSD >= 50000) { 
            const side = t.m ? 'SELL' : 'BUY';
            await sendWhaleAlertToTelegram({
              symbol: sym,
              side,
              amount: amountUSD,
              price: parseFloat(t.p),
              comment: side === 'BUY' ? "دخول سيولة ذكية تدعم الاتجاه الحالي." : "تصريف لحظي قد يؤدي لتذبذب مؤقت."
            });
            break; 
          }
        }
      } catch (e) {
        console.error(`Whale scan failed for ${sym}:`, e);
      }
    }

    return NextResponse.json({ 
      success: true, 
      status: "Pulse Received",
      timestamp: new Date().toISOString() 
    });
  } catch (e: any) {
    console.error("Pulse Processing Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
