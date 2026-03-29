
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useMarketStore } from "@/store/use-market-store";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketPulseProps {
  symbols: any[];
}

/**
 * @fileOverview مُفاعل نبض الأسواق v3.0 - Zen Sync Edition
 * تصميم فاخر يعتمد على الهدوء البصري وتحديث البيانات كل 20 ثانية.
 */
export function MarketPulse({ symbols }: MarketPulseProps) {
  const storePrices = useMarketStore(state => state.prices);
  const storeChanges = useMarketStore(state => state.dailyChanges);
  
  // حالة محلية للتحكم في وتيرة التحديث (كل 20 ثانية)
  const [displayPrices, setDisplayPrices] = useState<Record<string, number>>({});
  const [displayChanges, setDisplayChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const syncData = () => {
      // مزامنة البيانات من المتجر المركزي إلى الواجهة الهادئة
      setDisplayPrices({ ...storePrices });
      setDisplayChanges({ ...storeChanges });
    };

    // التحديث الأول فور توفر البيانات
    if (Object.keys(storePrices).length > 0 && Object.keys(displayPrices).length === 0) {
      syncData();
    }

    // دورة التحديث الاستراتيجي (كل 20 ثانية)
    const interval = setInterval(syncData, 20000);
    return () => clearInterval(interval);
  }, [storePrices, storeChanges, displayPrices]);

  const displaySymbols = useMemo(() => {
    return symbols.filter(s => s.priceSource === 'binance').slice(0, 10);
  }, [symbols]);

  if (displaySymbols.length === 0) return null;

  return (
    <section className="w-full bg-white border-y border-gray-50 py-6 relative overflow-hidden group select-none">
      {/* مؤشر الحالة النانوي - هادئ جداً */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center gap-2.5 bg-gray-50/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-100/50">
         <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
         <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Zen Sync Active</span>
      </div>

      {/* حواف تدرجية ناعمة لعمق بصري انسيابي */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee-slow">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-16 px-8">
            {displaySymbols.map((s) => {
              const price = displayPrices[s.id] || s.currentPrice;
              const change = displayChanges[s.id] || 0;
              const isUp = change >= 0;

              return (
                <div key={`${idx}-${s.id}`} className="flex items-center gap-5 transition-opacity duration-1000 group/item">
                  <div className="relative shrink-0">
                    <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-sm transition-all duration-500">
                      <CryptoIcon name={s.icon} size={18} color="#002d4d" />
                    </div>
                    <div className={cn(
                      "absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white shadow-sm",
                      isUp ? "bg-emerald-400" : "bg-red-400"
                    )} />
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-tight">{s.code.split('/')[0]}</span>
                      <ShieldCheck size={8} className="text-blue-200" />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={price}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="text-[12px] font-black text-[#002d4d] tabular-nums tracking-tighter"
                      >
                        ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1 font-black text-[9px] tabular-nums transition-colors duration-1000",
                    isUp ? "text-emerald-500/80" : "text-red-500/80"
                  )}>
                    {isUp ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                    <span>{Math.abs(change).toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 60s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
