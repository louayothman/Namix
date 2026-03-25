
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CryptoIcon } from "@/lib/crypto-icons";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";

interface WatchlistHeroProps {
  favorites: any[];
}

/**
 * @fileOverview المحفظة النخبوية v9.0 - Throttled 5s Sync
 * تحديث واجهة الهيرو كل 5 ثوانٍ مع تطهير الهوية من أي إشارات خارجية.
 */
export function WatchlistHero({ favorites }: WatchlistHeroProps) {
  const storePrices = useMarketStore(state => state.prices);
  const storeChanges = useMarketStore(state => state.dailyChanges);

  const [displayPrices, setDisplayPrices] = useState<Record<string, number>>({});
  const [displayChanges, setDisplayChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const syncData = () => {
      setDisplayPrices({ ...storePrices });
      setDisplayChanges({ ...storeChanges });
    };

    if (Object.keys(storePrices).length > 0) {
      syncData();
    }

    const interval = setInterval(syncData, 5000);
    return () => clearInterval(interval);
  }, [storePrices, storeChanges]);

  if (favorites.length === 0) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 font-body" dir="rtl">
      {favorites.map((asset, i) => {
        const livePrice = displayPrices[asset.id] || asset.currentPrice;
        const changePercent = displayChanges[asset.id] || 0;
        const isUp = changePercent >= 0;
        
        return (
          <Link key={asset.id} href={`/trade/${asset.id}`} className="block">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="h-full"
            >
              <Card className={cn(
                "border-none shadow-sm rounded-[28px] overflow-hidden transition-all active:scale-95 relative group h-full",
                "bg-white border border-gray-50/50 hover:shadow-2xl hover:shadow-blue-900/5"
              )}>
                <div className="absolute -bottom-3 -left-3 opacity-[0.06] group-hover:opacity-[0.1] group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                   <CryptoIcon name={asset.icon} size={72} />
                </div>

                <CardContent className="p-3.5 space-y-4 relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[10px] text-[#002d4d] uppercase tracking-tighter">
                      {asset.code.split('/')[0]}
                    </span>
                    <div className={cn(
                      "flex items-center gap-0.5 font-black text-[7px] px-1.5 py-0.5 rounded-full shadow-sm",
                      isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    )}>
                      {isUp ? <TrendingUp size={6}/> : <TrendingDown size={6}/>}
                      {Math.abs(changePercent).toFixed(1)}%
                    </div>
                  </div>

                  <div className="text-right pt-2 border-t border-gray-50/20">
                    <div className="flex flex-col">
                       <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5">سعر التداول</p>
                       <p className={cn(
                         "text-[13px] font-black tabular-nums tracking-tighter leading-none group-hover:text-blue-600 transition-colors",
                         isUp ? "text-emerald-600" : "text-red-600"
                       )}>
                         ${livePrice > 1000 
                           ? Math.round(livePrice).toLocaleString() 
                           : livePrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f9a885]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
