
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { runNamix } from '@/lib/namix-orchestrator';
import { sendWhaleAlertToTelegram } from '@/app/actions/telegram-actions';
import axios from 'axios';

/**
 * @fileOverview محرك النبض التلقائي (Vercel Cron) v1.0
 * المسار المسؤول عن بث الإشارات ورصد الحيتان دورياً بداخل بيئة Vercel.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // زيادة توقيت التنفيذ لـ 60 ثانية

export async function GET(req: Request) {
  // التحقق من مفتاح الحماية لمنع الاستدعاء العشوائي
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { firestore } = initializeFirebase();

  try {
    // 1. محرك بث الإشارات التلقائي
    const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true)));
    const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    if (symbols.length > 0) {
      // اختيار "أفضل" إشارة متاحة في السوق حالياً لبثها
      const analyses = [];
      for (const sym of symbols) {
        const analysis = await runNamix(sym.binanceSymbol || sym.code);
        const strength = Math.abs(analysis.score - 0.5);
        analyses.push({ sym, analysis, strength });
      }
      const best = analyses.sort((a, b) => b.strength - a.strength)[0];
      if (best && best.analysis.decision !== 'HOLD') {
        // يتم بث الإشارة بداخل runNamix أو عبر استدعاء مباشر هنا
        console.log(`[Cron] Broadcasting Signal for ${best.sym.code}`);
      }
    }

    // 2. رادار الحيتان (نظام المسح النبضي)
    // فحص آخر صفقات ضخمة لـ BTC و ETH لتبسيط الحمل على Serverless
    const topSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
    for (const sym of topSymbols) {
      const res = await axios.get(`https://api.binance.com/api/v3/aggTrades?symbol=${sym}&limit=10`);
      const trades = res.data;
      
      for (const t of trades) {
        const amountUSD = parseFloat(t.p) * parseFloat(t.q);
        if (amountUSD >= 50000) { // عتبة 50 ألف دولار
          const side = t.m ? 'SELL' : 'BUY';
          await sendWhaleAlertToTelegram({
            symbol: sym,
            side,
            amount: amountUSD,
            price: parseFloat(t.p),
            comment: side === 'BUY' ? "دخول سيولة ذكية تدعم التمركز الحالي." : "تصريف لحظي قد يضغط على مستويات الدعم."
          });
          break; // إرسال تنبيه واحد لكل رمز في كل دورة
        }
      }
    }

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error("Cron Execution Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
