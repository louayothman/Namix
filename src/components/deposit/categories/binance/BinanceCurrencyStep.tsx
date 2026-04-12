
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { Search, Sparkles, ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BinanceCurrencyStepProps {
  assets: any[];
  onSelect: (asset: any) => void;
  loading: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
}

const POPULAR_COINS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];

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
      list = list.filter(a => (a.name || "").toLowerCase().includes(q) || (a.coin || "").toLowerCase().includes(q));
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
        <h3 className="text-base font-black text-[#002d4d]">اختر عملة الإيداع</h3>
        <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[8px] px-2 py-0.5 rounded-md uppercase">Live Pulse</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedAssets.map((asset: any) => (
          <button 
            key={asset.coin} 
            onClick={() => onSelect(asset)} 
            disabled={loading}
            className="h-[72px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CryptoIcon name={asset.icon || asset.coin} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.name || asset.coin}</p>
                {POPULAR_COINS.includes(asset.coin.toUpperCase()) && <Sparkles size={8} className="text-orange-400 animate-pulse" />}
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">{asset.coin}</p>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
          </button>
        ))}
      </div>

      {hasMore && <div ref={observerRef} className="h-12 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-gray-200" /></div>}
    </motion.div>
  );
}
