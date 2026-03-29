
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useMarketStore } from "@/store/use-market-store";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketPulseProps {
  symbols: any[];
}

/**
 * @fileOverview مُفاعل نبض الأسواق v3.5 - Zero-Noise Calibration Edition
 * تم فصل محرك العرض عن محرك البيانات لضمان تحديث هادئ كل 20 ثانية.
 * تم تحسين الأحجام للهواتف لضمان التناسق والفخامة المجهرية.
 */
export function MarketPulse({ symbols }: MarketPulseProps) {
  // نحن لا نستخدم الهوك بشكل تفاعلي هنا لتجنب إعادة الرندر المستمرة (100ms)
  // بدلاً من ذلك سنقوم بـ "سحب" البيانات يدوياً كل 20 ثانية لضمان هدوء الواجهة
  const [displayPrices, setDisplayPrices] = useState<Record<string, number>>({});
  const [displayChanges, setDisplayChanges] = useState<Record<string, number>>({});
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    const performSync = () => {
      // سحب الحالة الحالية من المتجر المركزي دون الاشتراك التفاعلي الذي يسبب إزعاجاً بصرياً
      const state = useMarketStore.getState();
      
      if (Object.keys(state.prices).length > 0) {
        setDisplayPrices({ ...state.prices });
        setDisplayChanges({ ...state.dailyChanges });
        setIsCalibrated(true);
      }
    };

    // محاولة مزامنة فورية عند التحميل
    performSync();

    // دورة التحديث الاستراتيجي الرصين (كل 20 ثانية) لتقليل الضجيج الرقمي
    const interval = setInterval(performSync, 20000);
    
    // محرك المعايرة السريع: يحاول المزامنة كل ثانية فقط حتى تتوفر أول مجموعة بيانات
    const calibrationInterval = setInterval(() => {
      const state = useMarketStore.getState();
      if (Object.keys(state.prices).length > 0) {
        performSync();
        clearInterval(calibrationInterval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(calibrationInterval);
    };
  }, []);

  const displaySymbols = useMemo(() => {
    // تصفية الرموز التي تعتمد على بيانات بينانس الحقيقية فقط لضمان دقة النبض
    return symbols.filter(s => s.priceSource === 'binance').slice(0, 12);
  }, [symbols]);

  // واجهة المعايرة: تظهر نبضاً تقنياً هادئاً بدلاً من شريط فارغ أو أرقام غير صحيحة
  if (!isCalibrated || displaySymbols.length === 0) {
    return (
      <section className="w-full bg-white border-y border-gray-50 py-4 flex items-center justify-center gap-3">
         <Loader2 size={12} className="animate-spin text-blue-200" />
         <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] tracking-normal">Calibrating Market Pulse...</span>
      </section>
    );
  }

  return (
    <section className="w-full bg-white border-y border-gray-50 py-3 md:py-5 relative overflow-hidden group select-none">
      {/* حواف تدرجية ناعمة لعمق بصري انسيابي يمنع القطع المفاجئ للنصوص */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee-zen">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-10 md:gap-16 px-4 md:px-8">
            {displaySymbols.map((s) => {
              const price = displayPrices[s.id] || s.currentPrice;
              const change = displayChanges[s.id] || 0;
              const isUp = change >= 0;

              return (
                <div key={`${idx}-${s.id}`} className="flex items-center gap-3 md:gap-5 group/item transition-opacity duration-1000">
                  <div className="relative shrink-0">
                    <div className="h-6 w-6 md:h-9 md:w-9 rounded-lg md:rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100/50 group-hover/item:bg-white group-hover/item:shadow-sm transition-all duration-700">
                      <CryptoIcon name={s.icon} size={12} className="md:size-[18px]" color="#002d4d" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none">{s.code.split('/')[0]}</span>
                    <span className="text-[10px] md:text-[13px] font-black text-[#002d4d] tabular-nums tracking-tighter mt-0.5">
                      ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className={cn(
                    "flex items-center gap-0.5 md:gap-1 font-black text-[7px] md:text-[9px] tabular-nums transition-colors duration-1000",
                    isUp ? "text-emerald-500/80" : "text-red-500/80"
                  )}>
                    {isUp ? <TrendingUp size={8} className="md:size-[10px]" /> : <TrendingDown size={8} className="md:size-[10px]" />}
                    <span>{Math.abs(change).toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee-zen {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }
        .animate-marquee-zen {
          animation: marquee-zen 70s linear infinite;
        }
        .animate-marquee-zen:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
