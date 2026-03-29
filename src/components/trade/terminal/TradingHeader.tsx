
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradingHeaderProps {
  asset: any;
}

export function TradingHeader({ asset }: TradingHeaderProps) {
  const [change, setChange] = useState<string | null>(null);

  useEffect(() => {
    // Generate or fetch change value client-side only
    setChange(asset.priceChangePercent || (Math.random() * 4).toFixed(2));
  }, [asset.priceChangePercent]);

  const isUp = change ? Number(change) >= 0 : true;

  return (
    <div className="px-2 space-y-4 text-right animate-in fade-in slide-in-from-top-2 duration-700" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest justify-end md:justify-start">
               <Activity className="h-3 w-3 animate-pulse" />
               Live Feed
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#002d4d] tabular-nums tracking-tighter">
              ${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </h2>
         </div>
         
         <div className="flex items-center gap-3">
            <Badge className={cn(
              "h-8 px-4 rounded-full border-none font-black text-[10px] flex items-center gap-2 shadow-lg",
              isUp ? "bg-emerald-500 text-white" : "bg-red-50 text-white"
            )}>
              {isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {isUp ? '+' : ''}{change || '0.00'}%
            </Badge>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-gray-300 uppercase tracking-widest">
               <ShieldCheck size={10} className="text-blue-400" />
               <span>Professional Node</span>
            </div>
         </div>
      </div>
    </div>
  );
}
