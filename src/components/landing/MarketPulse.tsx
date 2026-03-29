
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useMarketStore } from "@/store/use-market-store";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface MarketPulseProps {
  symbols: any[];
}

/**
 * @fileOverview مُفاعل نبض الأسواق v3.6 - Luxurious Nano Edition
 * تم تحسين محرك السحب لضمان الاتصال بمتجر البيانات، وتصغير العناصر للموبايل.
 */
export function MarketPulse({ symbols }: MarketPulseProps) {
  // الحالة المحلية لعرض الأسعار (تحدث كل 20 ثانية)
  const [displayPrices, setDisplayPrices] = useState<Record<string, number>>({});
  const [displayChanges, setDisplayChanges] = useState<Record<string, number>>({});
  const [isCalibrated, setIsCalibrated] = useState(false);

  // تصفية الرموز التي تعتمد على بيانات بينانس فقط
  const filteredSymbols = useMemo(() => {
    if (!symbols) return [];
    return symbols.filter(s => s.priceSource === 'binance').slice(0, 12);
  }, [symbols]);

  useEffect(() => {
    if (filteredSymbols.length === 0) return;

    const performSync = () => {
      // سحب الحالة اللحظية من المتجر المركزي دون التأثير عليه
      const state = useMarketStore.getState();
      
      // التحقق من وجود بيانات حقيقية لأي من الرموز المطلوبة
      const hasData = filteredSymbols.some(s => state.prices[s.id] !== undefined);
      
      if (hasData) {
        setDisplayPrices({ ...state.prices });
        setDisplayChanges({ ...state.dailyChanges });
        setIsCalibrated(true);
      }
    };

    // محاولة مزامنة فورية
    performSync();

    // دورة التحديث الرصين (20 ثانية) لضمان الهدوء البصري
    const interval = setInterval(performSync, 20000);
    
    // محرك المعايرة السريع: يفحص كل ثانية حتى تظهر أول مجموعة بيانات
    const calInterval = setInterval(() => {
      if (!isCalibrated) {
        performSync();
      } else {
        clearInterval(calInterval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(calInterval);
    };
  }, [filteredSymbols, isCalibrated]);

  // واجهة المعايرة الهادئة
  if (!isCalibrated || filteredSymbols.length === 0) {
    return (
      <section className="w-full bg-white border-y border-gray-50 py-4 flex items-center justify-center gap-3">
         <Loader2 size={12} className="animate-spin text-blue-200" />
         <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] tracking-normal">Calibrating Market Nodes...</span>
      </section>
    );
  }

  return (
    <section className="w-full bg-white border-y border-gray-50 py-3 md:py-5 relative overflow-hidden group select-none">
      {/* حواف تدرجية ناعمة لعمق بصري */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee-lux">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
            {filteredSymbols.map((s) => {
              const price = displayPrices[s.id] || s.currentPrice;
              const change = displayChanges[s.id] || 0;
              const isUp = change >= 0;

              return (
                <div key={`${idx}-${s.id}`} className="flex items-center gap-3 md:gap-5 group/item">
                  <div className="h-7 w-7 md:h-9 md:w-9 rounded-xl bg-gray-50/50 flex items-center justify-center border border-gray-100/50">
                    <CryptoIcon name={s.icon} size={14} className="md:size-[18px]" color="#002d4d" />
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none">{s.code.split('/')[0]}</span>
                    <span className="text-[10px] md:text-[14px] font-black text-[#002d4d] tabular-nums tracking-tighter mt-0.5">
                      ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className={cn(
                    "flex items-center gap-0.5 md:gap-1 font-black text-[7px] md:text-[9px] tabular-nums",
                    isUp ? "text-emerald-500/70" : "text-red-500/70"
                  )}>
                    {isUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                    <span>{Math.abs(change).toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee-lux {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }
        .animate-marquee-lux {
          animation: marquee-lux 85s linear infinite;
        }
        .animate-marquee-lux:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
