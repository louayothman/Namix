
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * @fileOverview دفتر الطلبات العالمي v13.0 - Bilingual Throttled 1s
 * تم تحديث الهيدر ليصبح ثنائي اللغة وتطهير النصوص العربية.
 */

interface OrderBookProps {
  symbolId: string;
  binanceSymbol?: string;
}

export function OrderBook({ symbolId, binanceSymbol }: OrderBookProps) {
  const [orders, setOrders] = useState<{ bids: [string, string][], asks: [string, string][] }>({ bids: [], asks: [] });
  const bufferRef = useRef<{ bids: [string, string][], asks: [string, string][] }>({ bids: [], asks: [] });

  useEffect(() => {
    if (!binanceSymbol) return;

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol.toLowerCase()}@depth10@1000ms`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      bufferRef.current = {
        bids: data.bids.slice(0, 8),
        asks: data.asks.slice(0, 8).reverse()
      };
    };

    const interval = setInterval(() => {
      if (bufferRef.current.bids.length > 0) {
        setOrders(bufferRef.current);
      }
    }, 1000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, [binanceSymbol]);

  const maxVolume = useMemo(() => {
    const all = [...orders.bids, ...orders.asks];
    return Math.max(...all.map(o => parseFloat(o[1])), 1);
  }, [orders]);

  if (!binanceSymbol) {
    return (
      <div className="p-10 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Internal Order Matching Core</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-body" dir="ltr">
      {/* Bilingual Column Headers */}
      <div className="grid grid-cols-3 px-2 border-b border-gray-50 pb-3">
        <div className="flex flex-col items-start">
           <span className="text-[9px] font-black text-[#002d4d]">السعر</span>
           <span className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">Price (USDT)</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-[9px] font-black text-[#002d4d]">الكمية</span>
           <span className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">Amount</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[9px] font-black text-[#002d4d]">الإجمالي</span>
           <span className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 font-mono text-[10px]">
        {orders.asks.map(([price, amt], i) => (
          <div key={i} className="relative h-7 flex items-center group overflow-hidden rounded-lg">
            <div 
              className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all duration-1000 ease-out" 
              style={{ width: `${(parseFloat(amt) / maxVolume) * 100}%` }}
            />
            <div className="grid grid-cols-3 w-full px-3 relative z-10 font-black">
              <span className="text-red-500">{parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="text-center text-gray-500/80">{parseFloat(amt).toFixed(4)}</span>
              <span className="text-right text-gray-400">{(parseFloat(price) * parseFloat(amt)).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="py-3 bg-gray-50/50 rounded-2xl flex items-center justify-center gap-4 border border-gray-100 shadow-inner">
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-black text-emerald-600 tracking-normal">سبريد منخفض</span>
         </div>
         <div className="h-3 w-[1px] bg-gray-200" />
         <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Spread: 0.01%</span>
      </div>

      <div className="flex flex-col gap-1 font-mono text-[10px]">
        {orders.bids.map(([price, amt], i) => (
          <div key={i} className="relative h-7 flex items-center group overflow-hidden rounded-lg">
            <div 
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-1000 ease-out" 
              style={{ width: `${(parseFloat(amt) / maxVolume) * 100}%` }}
            />
            <div className="grid grid-cols-3 w-full px-3 relative z-10 font-black">
              <span className="text-emerald-500">{parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="text-center text-gray-500/80">{parseFloat(amt).toFixed(4)}</span>
              <span className="text-right text-gray-400">{(parseFloat(price) * parseFloat(amt)).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
