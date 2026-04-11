
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { Search, Sparkles, ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AssetSelectionStepProps {
  filteredAssets: any[];
  onSelect: (asset: any) => void;
  loading: boolean;
  selectedAsset: any;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isSearchOpen: boolean;
}

const POPULAR_COINS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'USDC', 'XRP', 'ADA', 'DOGE', 'TRX'];

export function AssetSelectionStep({
  filteredAssets,
  onSelect,
  loading,
  selectedAsset,
  searchQuery,
  setSearchQuery,
  isSearchOpen
}: AssetSelectionStepProps) {
  // نظام التحميل التلقائي (Infinite Scroll Logic)
  const [visibleCount, setVisibleCount] = useState(24);
  const observerRef = useRef<HTMLDivElement>(null);
  
  const displayedAssets = useMemo(() => {
    return filteredAssets.slice(0, visibleCount);
  }, [filteredAssets, visibleCount]);

  const hasMore = filteredAssets.length > visibleCount;

  // إعداد مراقب التمرير (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount(prev => prev + 24);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  // إعادة ضبط التصفيف عند البحث
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
      
      {isSearchOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
          <div className="relative group">
            <Input 
              autoFocus
              placeholder="ابحث عن اسم العملة أو الرمز..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-sm px-12 text-right focus-visible:ring-4 focus-visible:ring-blue-500/5 shadow-inner"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
             <h3 className="text-lg font-black text-[#002d4d]">الأصول المتاحة</h3>
             <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md">
                {filteredAssets.length} Total
             </Badge>
          </div>
          <div className="flex items-center gap-2 opacity-30">
             <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[8px] font-black uppercase tracking-widest">Live Auto-Stream</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedAssets.map((asset: any) => {
            const coinSymbol = (asset.coin || asset.name || "").toUpperCase();
            const isCurrentlyProcessing = loading && selectedAsset?.id === asset.id;
            
            return (
              <button 
                key={asset.id || asset.coin} 
                onClick={() => onSelect(asset)} 
                disabled={loading}
                className="p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98] relative overflow-hidden disabled:opacity-50 min-h-[72px]"
              >
                <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <CryptoIcon name={asset.icon || coinSymbol} size={36} />
                </div>
                
                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.name || asset.coin}</p>
                    {POPULAR_COINS.includes(coinSymbol) && <Sparkles size={8} className="text-orange-400 animate-pulse" />}
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{asset.coin || asset.network}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                   {isCurrentlyProcessing ? (
                     <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                   ) : (
                     <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
                   )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sentinel element for Infinite Scroll */}
        {hasMore && (
          <div ref={observerRef} className="h-20 flex items-center justify-center py-10">
             <div className="flex items-center gap-3 opacity-20">
                <Loader2 className="h-5 w-5 animate-spin text-[#002d4d]" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">تحميل المزيد من الأصول...</p>
             </div>
          </div>
        )}

        {filteredAssets.length === 0 && (
          <div className="py-32 text-center opacity-20 border-2 border-dashed border-gray-100 rounded-[48px] flex flex-col items-center gap-4">
            <Search size={48} />
            <p className="text-xs font-black uppercase tracking-widest">لم يتم العثور على نتائج في هذا القطاع</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
