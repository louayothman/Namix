
"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/lib/crypto-icons";
import { TrendingUp, TrendingDown, Star, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";

interface EliteWatchlistProps {
  favorites: any[];
}

/**
 * @fileOverview رموز التداول النخبوية v12.0 - Optimized Render Engine
 * يستخدم React.memo ومراقبة الأسعار من المتجر المركزي لمنع إعادة رسم الصفحة بالكامل.
 */
const EliteAssetCard = React.memo(({ asset, price, change }: { asset: any, price: number, change: number }) => {
  const isUp = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="shrink-0"
    >
      <Link href={`/trade/${asset.id}`}>
        <div className="w-[155px] p-5 rounded-[32px] bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group active:scale-95 relative overflow-hidden">
          <div className="absolute -bottom-2 -left-2 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none text-[#002d4d]">
             <CryptoIcon name={asset.icon} size={70} />
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <CryptoIcon name={asset.icon} size={18} color="#002d4d" />
                  <span className="font-black text-[11px] text-[#002d4d] uppercase tracking-tighter">{asset.code.split('/')[0]}</span>
               </div>
               <div className={cn("h-1 w-1 rounded-full", isUp ? "bg-emerald-500" : "bg-red-500")} />
            </div>

            <div className="text-right space-y-1">
               <p className="text-[15px] font-black text-[#002d4d] tabular-nums tracking-tighter leading-none">
                 ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || asset.currentPrice}
               </p>
               <div className={cn("flex items-center justify-end gap-1 font-black text-[8px]", isUp ? "text-emerald-500" : "text-red-500")}>
                  {isUp ? <TrendingUp size={8}/> : <TrendingDown size={8}/>}
                  <span className="tabular-nums">%{Math.abs(change).toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

EliteAssetCard.displayName = "EliteAssetCard";

export function EliteWatchlist({ favorites }: EliteWatchlistProps) {
  const prices = useMarketStore(state => state.prices);
  const changes = useMarketStore(state => state.dailyChanges);

  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="relative space-y-6 py-2 font-body" dir="rtl">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center text-orange-400">
            <Star className="h-5 w-5 fill-orange-400" />
          </div>
          <div className="text-right">
            <h3 className="text-sm md:text-base font-black text-[#002d4d] tracking-normal">رموز التداول النخبوية</h3>
            <div className="flex items-center gap-1.5 opacity-30">
               <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[7px] font-black uppercase tracking-[0.2em]">Sovereign Nexus Feed</span>
            </div>
          </div>
        </div>
        
        <Link href="/trade">
          <Button variant="ghost" className="h-9 rounded-full bg-white/50 border border-gray-100 shadow-sm px-5 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-all active:scale-95 group">
            استكشاف الأسواق 
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-4 px-2" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
        {favorites.map((asset) => (
          <EliteAssetCard 
            key={asset.id} 
            asset={asset} 
            price={prices[asset.id]} 
            change={changes[asset.id] || 0} 
          />
        ))}
      </div>
    </div>
  );
}
