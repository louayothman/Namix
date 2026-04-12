
"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface NowPaymentsCurrencyStepProps {
  onSelect: (asset: any) => void;
  loading: boolean;
  searchQuery: string;
}

// قائمة العملات الأساسية الفريدة
const BASE_ASSETS = [
  { symbol: 'USDT', name: 'Tether', icon: 'USDT' },
  { symbol: 'BTC', name: 'Bitcoin', icon: 'BTC' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'ETH' },
  { symbol: 'SOL', name: 'Solana', icon: 'SOL' },
  { symbol: 'TRX', name: 'TRON', icon: 'TRX' },
  { symbol: 'LTC', name: 'Litecoin', icon: 'LTC' },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'BNB' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'DOGE' },
  { symbol: 'XRP', name: 'Ripple', icon: 'XRP' },
  { symbol: 'ADA', name: 'Cardano', icon: 'ADA' },
  { symbol: 'DOT', name: 'Polkadot', icon: 'DOT' },
  { symbol: 'MATIC', name: 'Polygon', icon: 'MATIC' },
];

export function NowPaymentsCurrencyStep({
  onSelect,
  loading,
  searchQuery
}: NowPaymentsCurrencyStepProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return BASE_ASSETS;
    const q = searchQuery.toLowerCase();
    return BASE_ASSETS.filter(a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="text-right">
           <h3 className="text-base font-black text-[#002d4d]">اختر العملة المراد شحنها</h3>
           <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Select Base Currency</p>
        </div>
        <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">SECURE SYNC</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((asset) => (
          <button 
            key={asset.symbol} 
            onClick={() => onSelect(asset)} 
            disabled={loading}
            className="h-[72px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CryptoIcon name={asset.icon} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.name}</p>
                {asset.symbol === 'USDT' && <Sparkles size={8} className="text-orange-400 animate-pulse" />}
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">{asset.symbol}</p>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
