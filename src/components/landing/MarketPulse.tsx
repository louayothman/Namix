
"use client";

import React, { useMemo } from "react";
import { useMarketStore } from "@/store/use-market-store";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface MarketPulseProps {
  symbols: any[];
}

/**
 * @fileOverview مُفاعل نبض الأسواق v2.0 - Professional Live Feed
 * شريط تداول حي يعرض بيانات الأسعار اللحظية بنسق تقني فاخر.
 */
export function MarketPulse({ symbols }: MarketPulseProps) {
  const prices = useMarketStore(state => state.prices);
  const changes = useMarketStore(state => state.dailyChanges);

  const displaySymbols = useMemo(() => {
    return symbols.filter(s => s.priceSource === 'binance').slice(0, 12);
  }, [symbols]);

  if (displaySymbols.length === 0) return null;

  return (
    <section className="w-full bg-white border-y border-gray-50 py-4 relative overflow-hidden group">
      {/* Live Status Indicator Overlay */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
         <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
         </div>
         <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.2em]">Live Pulse</span>
      </div>

      {/* Side Gradients for Seamless Depth */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-10 px-5">
            {displaySymbols.map((s) => {
              const price = prices[s.id];
              const change = changes[s.id] || 0;
              const isUp = change >= 0;

              return (
                <div key={`${idx}-${s.id}`} className="flex items-center gap-4 py-2 px-4 rounded-2xl hover:bg-gray-50/50 transition-all cursor-default group/item">
                  <div className="relative">
                    <CryptoIcon name={s.icon} size={20} color="#002d4d" />
                    <div className={cn(
                      "absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full border border-white",
                      isUp ? "bg-emerald-500" : "bg-red-500"
                    )} />
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#002d4d] uppercase tracking-tighter">{s.code.split('/')[0]}</span>
                      <ShieldCheck size={10} className="text-blue-400/40" />
                    </div>
                    <span className="text-[11px] font-black text-[#002d4d] tabular-nums tracking-tighter">
                      ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || s.currentPrice}
                    </span>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black shadow-inner transition-all group-hover/item:scale-105",
                    isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {isUp ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                    <span className="tabular-nums">{Math.abs(change).toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
