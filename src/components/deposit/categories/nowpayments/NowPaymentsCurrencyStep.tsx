
"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface NowPaymentsCurrencyStepProps {
  availableIds: string[];
  onSelect: (asset: any) => void;
  loading: boolean;
  searchQuery: string;
}

const POPULAR_COINS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];

const NP_ASSET_METADATA: Record<string, { label: string, icon: string, coin: string }> = {
  'usdttrc20': { label: 'Tether', coin: 'USDT', icon: 'USDT' },
  'usdtbsc': { label: 'Tether', coin: 'USDT', icon: 'USDT' },
  'usdteth': { label: 'Tether', coin: 'USDT', icon: 'USDT' },
  'usdtsol': { label: 'Tether', coin: 'USDT', icon: 'USDT' },
  'usdtmatic': { label: 'Tether', coin: 'USDT', icon: 'USDT' },
  'btc': { label: 'Bitcoin', coin: 'BTC', icon: 'BTC' },
  'eth': { label: 'Ethereum', coin: 'ETH', icon: 'ETH' },
  'trx': { label: 'TRON', coin: 'TRX', icon: 'TRX' },
  'sol': { label: 'Solana', coin: 'SOL', icon: 'SOL' },
  'ltc': { label: 'Litecoin', coin: 'LTC', icon: 'LTC' },
  'bnbbsc': { label: 'BNB', coin: 'BNB', icon: 'BNB' },
  'doge': { label: 'Dogecoin', coin: 'DOGE', icon: 'DOGE' },
  'xrp': { label: 'Ripple', coin: 'XRP', icon: 'XRP' },
  'maticpolygon': { label: 'Polygon', coin: 'MATIC', icon: 'MATIC' }
};

export function NowPaymentsCurrencyStep({
  availableIds,
  onSelect,
  loading,
  searchQuery
}: NowPaymentsCurrencyStepProps) {
  const filtered = useMemo(() => {
    // تجميع العملات بشكل فريد دون تكرار الشبكات في هذه الخطوة
    const uniqueCoins: any[] = [];
    const coinsSeen = new Set<string>();

    availableIds.forEach(id => {
      const meta = NP_ASSET_METADATA[id];
      if (meta && !coinsSeen.has(meta.coin)) {
        uniqueCoins.push({ ...meta, sampleId: id });
        coinsSeen.add(meta.coin);
      }
    });

    let list = [...uniqueCoins];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.label.toLowerCase().includes(q) || a.coin.toLowerCase().includes(q));
    }
    
    return list.sort((a, b) => {
      const aSymbol = a.coin.toUpperCase();
      const bSymbol = b.coin.toUpperCase();
      const aPop = POPULAR_COINS.indexOf(aSymbol);
      const bPop = POPULAR_COINS.indexOf(bSymbol);
      
      if (aPop !== -1 && bPop !== -1) return aPop - bPop;
      if (aPop !== -1) return -1;
      if (bPop !== -1) return 1;
      
      return aSymbol.localeCompare(bSymbol);
    });
  }, [availableIds, searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="text-right">
           <h3 className="text-base font-black text-[#002d4d]">اختر العملة</h3>
           <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Select Asset Node</p>
        </div>
        <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">SECURE SYNC</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((asset) => (
          <button 
            key={asset.coin} 
            onClick={() => onSelect(asset)} 
            disabled={loading}
            className="h-[72px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CryptoIcon name={asset.icon} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.label}</p>
                {POPULAR_COINS.includes(asset.coin.toUpperCase()) && <Sparkles size={8} className="text-orange-400 animate-pulse" />}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase leading-none">{asset.coin}</p>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
