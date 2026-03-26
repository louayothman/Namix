
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function MarketTicker() {
  const [prices, setPrices] = useState<any[]>([
    { id: 'BTC', price: 0, change: 0 },
    { id: 'ETH', price: 0, change: 0 },
    { id: 'SOL', price: 0, change: 0 },
    { id: 'BNB', price: 0, change: 0 },
  ]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"]');
        const data = await res.json();
        const mapped = data.map((item: any) => ({
          id: item.symbol.replace('USDT', ''),
          price: parseFloat(item.lastPrice),
          change: parseFloat(item.priceChangePercent)
        }));
        setPrices(mapped);
      } catch (e) { console.error("Sync Error"); }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white/80 border-y border-gray-100 backdrop-blur-xl py-4 overflow-hidden relative z-50">
      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
        {[...prices, ...prices].map((p, i) => (
          <div key={i} className="flex items-center gap-3 px-4">
            <span className="text-[10px] font-black text-[#002d4d]/30 uppercase tracking-widest">{p.id}/USDT</span>
            <span className="text-sm font-black text-[#002d4d] tabular-nums">${p.price > 1000 ? Math.round(p.price).toLocaleString() : p.price.toLocaleString()}</span>
            <span className={cn("text-[9px] font-black tabular-nums", p.change >= 0 ? "text-emerald-500" : "text-red-500")}>
              {p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
}
