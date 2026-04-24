
"use client";

import { useEffect, useRef } from "react";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { runNamix } from "@/lib/namix-orchestrator";
import { broadcastSignalToTelegram } from "@/app/actions/telegram-actions";

/**
 * @fileOverview محرك بث تلغرام المستقل v2.0 - Deep Intelligence Node
 * يعمل بشكل معزول تماماً ويقوم بمسح السوق كل 5 دقائق لبث أفضل الفرص المتاحة.
 */
export function TelegramBroadcastManager() {
  const db = useFirestore();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const runTelegramCycle = async () => {
      if (!isMounted.current) return;

      try {
        // 1. جلب كافة الأسواق النشطة
        const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
        const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        if (symbols.length === 0) return;

        // 2. تحليل كافة الأسواق واختيار أفضل إشارة
        const analyses = [];
        for (const sym of symbols) {
          // جلب تحليل عميق لملء كافة حقول الإشارة الجديدة
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          // القوة هي الانحراف عن السكور المحايد 0.5
          const strength = Math.abs(analysis.score - 0.5);
          analyses.push({ sym, analysis, strength });
        }

        // 3. اختيار الفرصة الذهبية في هذه الدورة (الأعلى ثقة)
        const best = analyses.sort((a, b) => b.strength - a.strength)[0];

        // 4. البث الفوري لتلغرام بنظام البطاقة المصورة الجديد
        if (best && best.analysis.decision !== 'HOLD') {
          await broadcastSignalToTelegram(best.analysis, best.sym);
        }
      } catch (e) {
        console.error("Telegram Intelligence Cycle Error:", e);
      }
    };

    // تشغيل المحرك: دورة كل 5 دقائق (300,000 مللي ثانية)
    const interval = setInterval(runTelegramCycle, 300000);
    
    // تشغيل أولي فوري عند الدخول لتنشيط البوت
    runTelegramCycle();

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [db]);

  return null;
}
