
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { Search, Sparkles, ChevronLeft, Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BinanceCurrencyStepProps {
  assets: any[];
  onSelect: (asset: any) => void;
  loading: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
}

const POPULAR_COINS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'TRX', 'LTC', 'XRP', 'DOGE', 'ADA'];

export function BinanceCurrencyStep({
  assets,
  onSelect,
  loading,
  searchQuery
}: BinanceCurrencyStepProps) {
  const [visibleCount, setVisibleCount] = useState(24);
  const observerRef = useRef<HTMLDivElement>(null);
  
  const filtered = useMemo(() => {
    let list = [...assets];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => 
        (a.name || "").toLowerCase().includes(q) || 
        (a.coin || "").toLowerCase().includes(q)
      );
    }
    
    // الترتيب: الأكثر شعبية أولاً ثم أبجدياً
    return list.sort((a, b) => {
      const aSymbol = (a.coin || "").toUpperCase();
      const bSymbol = (b.coin || "").toUpperCase();
      const aPop = POPULAR_COINS.indexOf(aSymbol);
      const bPop = POPULAR_COINS.indexOf(bSymbol);
      
      if (aPop !== -1 && bPop !== -1) return aPop - bPop;
      if (aPop !== -1) return -1;
      if (bPop !== -1) return 1;
      
      return aSymbol.localeCompare(bSymbol);
    });
  }, [assets, searchQuery]);

  const displayedAssets = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  // إعادة ضبط العداد عند تغيير البحث لضمان ظهور النتائج المفلترة من البداية
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery]);

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="text-right">
           <h3 className="text-base font-black text-[#002d4d]">اختر عملة الإيداع</h3>
           {searchQuery && (
             <p className="text-[10px] font-bold text-blue-600 mt-1">نتائج البحث عن: {searchQuery}</p>
           )}
        </div>
        <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[8px] px-3 py-1 rounded-md uppercase tracking-widest shadow-inner">
           {filtered.length} NODES
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedAssets.map((asset: any) => (
          <button 
            key={asset.coin} 
            onClick={() => onSelect(asset)} 
            disabled={loading}
            className="h-[76px] w-full p-4 rounded-[28px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98] relative overflow-hidden"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 relative z-10">
              <CryptoIcon name={asset.coin} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0 relative z-10">
              <div className="flex items-center gap-2">
                <p className="font-black text-[14px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.name || asset.coin}</p>
                {POPULAR_COINS.includes(asset.coin.toUpperCase()) && (
                  <Sparkles size={10} className="text-orange-400 animate-pulse shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2">
                 <Badge variant="outline" className="text-[8px] font-black border-gray-100 bg-gray-50/50 px-1.5 py-0 rounded-md text-gray-400">{asset.coin}</Badge>
                 {asset.priceSource === 'binance' && <Zap size={8} className="text-orange-400 fill-current" />}
              </div>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all relative z-10" />
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-4 bg-gray-50 rounded-[48px] border border-dashed border-gray-200 opacity-40">
           <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-inner">
              <Search size={24} className="text-[#002d4d]" />
           </div>
           <p className="text-xs font-black text-[#002d4d] uppercase tracking-widest">لم يتم العثور على نتائج</p>
        </div>
      )}

      {hasMore && (
        <div ref={observerRef} className="h-20 flex items-center justify-center">
           <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Syncing Matrix...</p>
           </div>
        </div>
      )}
    </motion.div>
  );
}
