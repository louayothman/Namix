"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { Search, Sparkles, ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface NowPaymentsCurrencyStepProps {
  onSelect: (asset: any) => void;
  loading: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
}

const NOWPAYMENTS_ASSETS = [
  { id: 'usdttrc20', name: 'Tether (TRC20)', coin: 'USDT', network: 'TRC20', icon: 'USDT' },
  { id: 'usdtbsc', name: 'Tether (BEP20)', coin: 'USDT', network: 'BEP20 (BSC)', icon: 'USDT' },
  { id: 'usdteth', name: 'Tether (ERC20)', coin: 'USDT', network: 'ERC20 (ETH)', icon: 'USDT' },
  { id: 'btc', name: 'Bitcoin', coin: 'BTC', network: 'BTC', icon: 'BTC' },
  { id: 'eth', name: 'Ethereum', coin: 'ETH', network: 'ERC20', icon: 'ETH' },
  { id: 'sol', name: 'Solana', coin: 'SOL', network: 'SOL', icon: 'SOL' },
  { id: 'trx', name: 'TRON', coin: 'TRX', network: 'TRC20', icon: 'TRX' },
  { id: 'ltc', name: 'Litecoin', coin: 'LTC', network: 'LTC', icon: 'LTC' },
  { id: 'doge', name: 'Dogecoin', coin: 'DOGE', network: 'DOGE', icon: 'DOGE' },
  { id: 'matic', name: 'Polygon', coin: 'MATIC', network: 'POLYGON', icon: 'MATIC' },
  { id: 'bnbbsc', name: 'Binance Coin', coin: 'BNB', network: 'BEP20 (BSC)', icon: 'BNB' },
  { id: 'xrp', name: 'Ripple', coin: 'XRP', network: 'XRP', icon: 'XRP' },
  { id: 'ada', name: 'Cardano', coin: 'ADA', network: 'ADA', icon: 'ADA' },
  { id: 'dot', name: 'Polkadot', coin: 'DOT', network: 'DOT', icon: 'DOT' },
];

export function NowPaymentsCurrencyStep({
  onSelect,
  loading,
  searchQuery,
  isSearchOpen
}: NowPaymentsCurrencyStepProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return NOWPAYMENTS_ASSETS;
    const q = searchQuery.toLowerCase();
    return NOWPAYMENTS_ASSETS.filter(a => a.name.toLowerCase().includes(q) || a.coin.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-black text-[#002d4d]">اختر عملة الإيداع المباشر</h3>
        <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">AUTO-SYNC</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((asset) => (
          <button 
            key={asset.id} 
            onClick={() => onSelect(asset)} 
            disabled={loading}
            className="h-[72px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CryptoIcon name={asset.icon} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.name}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">{asset.network}</p>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
