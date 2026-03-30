
"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/lib/crypto-icons";
import { TrendingUp, TrendingDown, Star, ChevronLeft, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";

interface EliteWatchlistProps {
  favorites: any[];
}

/**
 * @fileOverview رموز التداول النخبوية v15.0 - Tactical Intelligence Edition
 * تم إعادة تصميم البطاقات لتصبح وحدات عمليات فاخرة بفيزياء حركية ونبض سعري لحظي.
 */
const EliteAssetCard = React.memo(({ asset, price, change }: { asset: any, price: number, change: number }) => {
  const isUp = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="shrink-0"
    >
      <Link href={`/trade/${asset.id}`}>
        <div className="w-[165px] h-[180px] p-6 rounded-[40px] bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,45,77,0.08)] hover:shadow-[0_40px_80px_-20px_rgba(0,45,77,0.15)] transition-all duration-700 group active:scale-95 relative overflow-hidden">
          
          {/* Sovereign Watermark Icon */}
          <div className="absolute -bottom-4 -left-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 pointer-events-none text-[#002d4d]">
             <CryptoIcon name={asset.icon} size={100} />
          </div>
          
          <div className="space-y-5 relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center">
               <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                  <CryptoIcon name={asset.icon} size={20} />
               </div>
               {/* Status Pulse Node */}
               <div className="relative flex h-2 w-2">
                  <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isUp ? "bg-emerald-400" : "bg-red-400"
                  )}></span>
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2 shadow-sm",
                    isUp ? "bg-emerald-500" : "bg-red-500"
                  )}></span>
               </div>
            </div>

            <div className="space-y-1 text-right">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 opacity-60">
                 {asset.name.split(' ')[0]}
               </p>
               <h4 className="text-[12px] font-black text-[#002d4d] uppercase tracking-tighter leading-none">{asset.code}</h4>
            </div>

            <div className="mt-auto text-right space-y-1.5">
               <p className={cn(
                 "text-[18px] font-black tabular-nums tracking-tighter leading-none transition-colors duration-500",
                 isUp ? "text-emerald-600" : "text-red-600"
               )}>
                 ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || asset.currentPrice}
               </p>
               <div className={cn(
                 "inline-flex items-center gap-1 font-black text-[9px] px-2 py-0.5 rounded-full shadow-inner",
                 isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
               )}>
                  {isUp ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
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
    <div className="relative space-y-6 py-4 font-body" dir="rtl">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-[22px] bg-white shadow-xl flex items-center justify-center text-orange-400 relative overflow-hidden group">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-tr from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Star className="h-6 w-6 fill-orange-400 relative z-10" />
          </div>
          <div className="text-right">
            <h3 className="text-base md:text-xl font-black text-[#002d4d] tracking-normal">رموز التداول النخبوية</h3>
            <div className="flex items-center gap-2 mt-0.5 opacity-40">
               <Activity size={10} className="text-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-[0.3em]">Sovereign Nexus Feed Active</span>
            </div>
          </div>
        </div>
        
        <Link href="/trade">
          <Button variant="ghost" className="h-11 rounded-full bg-white border border-gray-100 shadow-sm px-6 text-[10px] font-black text-[#002d4d] hover:bg-[#002d4d] hover:text-[#f9a885] transition-all active:scale-95 group">
            استكشاف الأسواق 
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-5 overflow-x-auto scrollbar-none pb-8 px-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
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
