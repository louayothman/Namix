
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/lib/crypto-icons";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ChevronLeft, 
  Info, 
  Zap, 
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";
import { SpotTradingGuide } from "./SpotTradingGuide";

interface EliteWatchlistProps {
  favorites: any[];
}

const EliteAssetCard = React.memo(({ asset, price, change }: { asset: any, price: number, change: number }) => {
  const isUp = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="shrink-0"
    >
      <Link href={`/trade/${asset.id}`}>
        <div className="w-[180px] h-[145px] p-5 rounded-[36px] bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_15px_40px_-12px_rgba(0,45,77,0.06)] hover:shadow-[0_30px_60px_-15px_rgba(0,45,77,0.12)] transition-all duration-700 group active:scale-95 relative overflow-hidden">
          <div className="absolute -bottom-4 -left-4 opacity-[0.02] group-hover:opacity-[0.06] transition-all duration-1000 pointer-events-none text-[#002d4d]">
             <CryptoIcon name={asset.icon} size={90} />
          </div>
          <div className="space-y-4 relative z-10 flex flex-col h-full font-body">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shrink-0">
                  <CryptoIcon name={asset.icon} size={20} />
               </div>
               <div className="text-right min-w-0">
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-normal leading-none truncate">{asset.code.split('/')[0]}</h4>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-normal mt-1 truncate opacity-60">
                    {asset.name.split(' ')[0]}
                  </p>
               </div>
            </div>
            <div className="mt-auto space-y-1.5">
               <div className="flex items-center justify-between">
                  <p className={cn("text-[16px] font-black tabular-nums tracking-tighter leading-none transition-colors duration-500", isUp ? "text-emerald-600" : "text-red-600")}>
                    ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || asset.currentPrice}
                  </p>
                  <div className="relative flex h-1.5 w-1.5">
                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isUp ? "bg-emerald-400" : "bg-red-400")}></span>
                    <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", isUp ? "bg-emerald-500" : "bg-red-500")}></span>
                  </div>
               </div>
               <div className={cn("inline-flex items-center gap-1 font-black text-[8px] px-2 py-0.5 rounded-full shadow-sm", isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
                  {isUp ? <TrendingUp size={8}/> : <TrendingDown size={10}/>}
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
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="relative space-y-5 py-2 font-body" dir="rtl">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[18px] bg-white shadow-lg flex items-center justify-center text-orange-400">
            <Star className="h-5 w-5 fill-orange-400 animate-pulse" />
          </div>
          <div className="text-right">
            <h3 className="text-sm md:text-base font-black text-[#002d4d] tracking-normal">رموز التداول النخبوية</h3>
            <p className="text-[7px] font-black text-gray-300 uppercase tracking-normal mt-0.5">Professional Assets Feed</p>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <Link href="/trade">
            <Button variant="ghost" className="h-9 rounded-full bg-white border border-gray-100 shadow-sm px-5 text-[9px] font-black text-[#002d4d] hover:bg-[#002d4d] hover:text-[#f9a885] transition-all active:scale-95 group">
              استكشاف الأسواق 
              <ChevronLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-6 px-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
          {favorites.map((asset) => (
            <EliteAssetCard 
              key={asset.id} 
              asset={asset} 
              price={prices[asset.id]} 
              change={changes[asset.id] || 0} 
            />
          ))}
        </div>
      ) : (
        <div className="px-4 pb-4">
           <motion.button
             whileTap={{ scale: 0.98 }}
             onClick={() => setGuideOpen(true)}
             className="w-full p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                 <Zap size={80} className="text-[#002d4d]" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                 <div className="h-12 w-12 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                    <Info size={22} />
                 </div>
                 <div className="text-right">
                    <h4 className="text-[13px] font-black text-[#002d4d] tracking-normal">كيف أبدأ التداول الفوري؟</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-normal mt-0.5">Quick Onboarding Protocol</p>
                 </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#f9a885] group-hover:text-[#002d4d] transition-all shadow-sm">
                 <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
              </div>
           </motion.button>
        </div>
      )}

      <SpotTradingGuide open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}
