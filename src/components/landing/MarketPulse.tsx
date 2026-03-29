
"use client";

import React, { useMemo } from "react";
import { useMarketStore } from "@/store/use-market-store";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketPulseProps {
  symbols: any[];
}

export function MarketPulse({ symbols }: MarketPulseProps) {
  const prices = useMarketStore(state => state.prices);
  const changes = useMarketStore(state => state.dailyChanges);

  const displaySymbols = useMemo(() => {
    return symbols.filter(s => s.priceSource === 'binance').slice(0, 10);
  }, [symbols]);

  if (displaySymbols.length === 0) return null;

  return (
    <section className="w-full bg-gray-50 border-y border-gray-100 py-6 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-12 px-6">
            {displaySymbols.map((s) => {
              const price = prices[s.id];
              const change = changes[s.id] || 0;
              const isUp = change >= 0;

              return (
                <div key={`${idx}-${s.id}`} className="flex items-center gap-3">
                  <CryptoIcon name={s.icon} size={18} color="#002d4d" />
                  <span className="text-[11px] font-black text-[#002d4d] uppercase tracking-tighter">{s.code.split('/')[0]}</span>
                  <span className="text-[11px] font-black text-[#002d4d] tabular-nums">${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || s.currentPrice}</span>
                  <div className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black",
                    isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {isUp ? <TrendingUp size={8}/> : <TrendingDown size={8}/>}
                    {Math.abs(change).toFixed(2)}%
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
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
