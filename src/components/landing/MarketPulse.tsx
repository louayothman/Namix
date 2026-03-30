
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useMarketStore } from "@/store/use-market-store";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";

interface MarketPulseProps {
  symbols: any[];
}

/**
 * @fileOverview مُفاعل نبض الأسواق v15.0 - Sovereign Calibration Edition
 * تم تحديث واجهة المزامنة لتعتمد على مفاعل أيقوني صامت وفخم، مع تثبيت الارتفاع لمنع القفزات البصرية.
 */
export function MarketPulse({ symbols }: MarketPulseProps) {
  const storePrices = useMarketStore(state => state.prices);
  const storeChanges = useMarketStore(state => state.dailyChanges);
  
  const [displayPrices, setDisplayPrices] = useState<Record<string, number>>({});
  const [displayChanges, setDisplayChanges] = useState<Record<string, number>>({});
  const [isCalibrated, setIsCalibrated] = useState(false);

  const filteredSymbols = useMemo(() => {
    if (!symbols) return [];
    return symbols.filter(s => s.priceSource === 'binance').slice(0, 15);
  }, [symbols]);

  useEffect(() => {
    if (filteredSymbols.length === 0) return;

    const performSync = () => {
      const state = useMarketStore.getState();
      const hasData = filteredSymbols.some(s => state.prices[s.id] !== undefined);
      
      if (hasData) {
        setDisplayPrices({ ...state.prices });
        setDisplayChanges({ ...state.dailyChanges });
        setIsCalibrated(true);
      }
    };

    performSync();
    const interval = setInterval(performSync, 20000);
    const calInterval = setInterval(() => {
      if (!isCalibrated) performSync();
      else clearInterval(calInterval);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(calInterval);
    };
  }, [filteredSymbols, isCalibrated]);

  // بروتوكول المعايرة السيادي - صامت، فخم، وبدون نصوص
  if (!isCalibrated || filteredSymbols.length === 0) {
    return (
      <section className="w-full bg-white border-y border-gray-50 h-[72px] md:h-[88px] flex items-center justify-center">
         <div className="relative flex items-center justify-center opacity-20">
            {/* حلقة المزامنة الدورانية */}
            <div className="h-8 w-8 md:h-10 md:w-10 border-[2px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
            {/* أيقونة الختم المركزي */}
            <div className="absolute inset-0 flex items-center justify-center">
               <ShieldCheck className="h-4 w-4 text-[#002d4d]" />
            </div>
         </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white border-y border-gray-50 py-4 md:py-6 relative select-none overflow-hidden h-[72px] md:h-[88px]">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee-lux min-w-max hover:pause-animation">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-10 md:gap-20 px-6 md:px-10">
            {filteredSymbols.map((s) => {
              const price = displayPrices[s.id] || s.currentPrice;
              const change = displayChanges[s.id] || 0;
              const isUp = change >= 0;

              return (
                <div key={`${idx}-${s.id}`} className="flex items-center gap-4 group/item shrink-0">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner group-hover/item:bg-[#002d4d] group-hover/item:text-[#f9a885] transition-all">
                    <CryptoIcon name={s.icon} size={18} className="md:size-[22px]" />
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-tighter leading-none">{s.code.split('/')[0]}</span>
                    <span className="text-[12px] md:text-[16px] font-black text-[#002d4d] tabular-nums tracking-tighter mt-0.5">
                      ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1 font-black text-[9px] md:text-[11px] tabular-nums px-2 py-0.5 rounded-lg",
                    isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  )}>
                    {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
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
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-lux {
          animation: marquee-lux 90s linear infinite;
        }
        .hover:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
