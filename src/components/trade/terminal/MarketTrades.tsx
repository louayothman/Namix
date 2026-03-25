
"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * @fileOverview رادار الصفقات العالمية v13.0 - Bilingual Throttled 1s
 * تحديث واجهة الصفقات لتصبح ثنائية اللغة ومطهرة من تباعد الحروف.
 */

interface MarketTradesProps {
  symbolId: string;
  binanceSymbol?: string;
}

export function MarketTrades({ symbolId, binanceSymbol }: MarketTradesProps) {
  const [trades, setTrades] = useState<any[]>([]);
  const bufferRef = useRef<any[]>([]);

  useEffect(() => {
    if (!binanceSymbol) return;

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol.toLowerCase()}@trade`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newTrade = {
        id: data.t,
        price: data.p,
        qty: data.q,
        time: data.T,
        isBuyerMaker: data.m
      };
      bufferRef.current = [newTrade, ...bufferRef.current].slice(0, 15);
    };

    const interval = setInterval(() => {
      if (bufferRef.current.length > 0) {
        setTrades([...bufferRef.current]);
      }
    }, 1000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, [binanceSymbol]);

  if (!binanceSymbol) {
    return (
      <div className="p-10 text-center opacity-20 flex flex-col items-center gap-3">
        <div className="h-1 w-8 bg-gray-200 rounded-full" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Internal Stream Node Active</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-body" dir="ltr">
      {/* Bilingual Column Headers */}
      <div className="grid grid-cols-3 px-2 border-b border-gray-50 pb-3">
        <div className="flex flex-col items-start">
           <span className="text-[9px] font-black text-[#002d4d]">السعر</span>
           <span className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">Execution Price</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-[9px] font-black text-[#002d4d]">الكمية</span>
           <span className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">Qty</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[9px] font-black text-[#002d4d]">التوقيت</span>
           <span className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">Timestamp</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 font-mono text-[10px]">
        {trades.map((t) => (
          <div key={t.id} className="grid grid-cols-3 py-2.5 px-3 hover:bg-gray-50/80 rounded-xl transition-all animate-in fade-in duration-500 border border-transparent hover:border-gray-100">
            <span className={cn("font-black tracking-tight", !t.isBuyerMaker ? "text-emerald-500" : "text-red-500")}>
              {parseFloat(t.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-center text-gray-500 font-black opacity-80">{parseFloat(t.qty).toFixed(5)}</span>
            <span className="text-right text-gray-400 font-bold">{format(t.time, "HH:mm:ss")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
