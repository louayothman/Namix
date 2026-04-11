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
  const [visibleCount, setVisibleCount] = useState(24);
  const observerRef = useRef<HTMLDivElement>(null);
  
  const displayedAssets = useMemo(() => {
    return filteredAssets.slice(0, visibleCount);
  }, [filteredAssets, visibleCount]);

  const hasMore = filteredAssets.length > visibleCount;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount(prev => prev + 24);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
      
      {isSearchOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden px-1">
          <div className="relative">
            <Input 
              autoFocus
              placeholder="ابحث عن اسم العملة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-sm px-12 text-right shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500/10"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-base font-black text-[#002d4d]">اختر عملة الايداع</h3>
          <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[8px] px-2 py-0.5 rounded-md uppercase">
            {filteredAssets.length} Total
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedAssets.map((asset: any) => {
            const coinSymbol = (asset.coin || asset.name || "").toUpperCase();
            const isProcessing = loading && selectedAsset?.id === asset.id;
            
            return (
              <button 
                key={asset.id || asset.coin} 
                onClick={() => onSelect(asset)} 
                disabled={loading}
                className="h-[72px] p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98] disabled:opacity-50"
              >
                <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <CryptoIcon name={asset.icon || coinSymbol} size={36} />
                </div>
                
                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.name || asset.coin}</p>
                    {POPULAR_COINS.includes(coinSymbol) && <Sparkles size={8} className="text-orange-400 animate-pulse" />}
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">{asset.coin || asset.network}</p>
                </div>

                <div className="shrink-0">
                   {isProcessing ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />}
                </div>
              </button>
            );
          })}
        </div>

        {hasMore && (
          <div ref={observerRef} className="h-12 flex items-center justify-center">
             <Loader2 className="h-5 w-5 animate-spin text-gray-200" />
          </div>
        )}

        {filteredAssets.length === 0 && (
          <div className="py-32 text-center opacity-20 border-2 border-dashed border-gray-100 rounded-[48px] flex flex-col items-center gap-4">
            <Search size={40} />
            <p className="text-[10px] font-black uppercase">لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}