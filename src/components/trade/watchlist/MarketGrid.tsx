
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { TrendingUp, TrendingDown, Loader2, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";

interface MarketGridProps {
  symbols: any[];
  isLoading: boolean;
}

/**
 * @fileOverview قائمة جرد الأسواق v9.0 - Throttled 5s Sync
 * تم تطهير البطاقة من شارات المصادر الخارجية وتثبيت تحديث الواجهة كل 5 ثوانٍ.
 */
export function MarketGrid({ symbols, isLoading }: MarketGridProps) {
  const storePrices = useMarketStore(state => state.prices);
  const storeChanges = useMarketStore(state => state.dailyChanges);
  
  const [displayPrices, setDisplayPrices] = useState<Record<string, number>>({});
  const [displayChanges, setDisplayChanges] = useState<Record<string, number>>({});

  // بروتوكول التزامن المخفف (5 ثوانٍ) لراحة العين في صفحة الجرد
  useEffect(() => {
    const syncData = () => {
      setDisplayPrices({ ...storePrices });
      setDisplayChanges({ ...storeChanges });
    };

    // مزامنة أولية فورية
    if (Object.keys(storePrices).length > 0) {
      syncData();
    }

    const interval = setInterval(syncData, 5000);
    return () => clearInterval(interval);
  }, [storePrices, storeChanges]);

  if (isLoading) {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-4">
         <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
         <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">جاري جرد القنوات السوقية...</p>
      </div>
    );
  }

  if (!symbols || symbols.length === 0) {
    return (
      <div className="py-24 text-center flex flex-col items-center gap-4 bg-white/40 border-2 border-dashed border-gray-100 rounded-[48px] opacity-40">
         <Zap className="h-12 w-12 text-[#002d4d]" />
         <p className="text-[10px] font-black uppercase tracking-[0.2em]">لا توجد أصول نشطة في القطاع الحالي</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 font-body">
      {symbols.map((asset, i) => {
        const livePrice = displayPrices[asset.id] || asset.currentPrice;
        const changePercent = displayChanges[asset.id] || 0;
        const isUp = changePercent >= 0;

        return (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="h-full"
          >
            <Link href={`/trade/${asset.id}`} className="block h-full">
              <Card className="border-none shadow-sm rounded-[32px] bg-white hover:bg-gray-50/30 transition-all duration-500 group active:scale-[0.98] border-r-[6px] border-transparent hover:border-r-[#002d4d] hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-1000 pointer-events-none">
                   <CryptoIcon name={asset.icon} size={120} />
                </div>

                <CardContent className="p-5 md:p-6 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 flex items-center justify-center text-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                      <div className="transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(249,168,133,0.4)]">
                        <CryptoIcon name={asset.icon} size={32} />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <h4 className="font-black text-base text-[#002d4d] leading-none tracking-tight group-hover:text-blue-600 transition-colors">{asset.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                         <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[7px] px-2 py-0.5 rounded-md tracking-widest uppercase">
                            {asset.code}
                         </Badge>
                         <div className="flex items-center gap-1 opacity-40">
                            <Activity size={8} className="text-emerald-500 animate-pulse" />
                            <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest">Operational Asset</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                     <p className={cn(
                       "text-lg md:text-xl font-black text-[#002d4d] tabular-nums tracking-tighter transition-all duration-500",
                       isUp ? "text-emerald-600" : "text-red-600"
                     )}>
                       ${livePrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                     </p>
                     <div className={cn(
                       "flex items-center justify-end gap-1 font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-sm",
                       isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                     )}>
                       {isUp ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                       {isUp ? '+' : ''}{changePercent.toFixed(2)}%
                     </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
