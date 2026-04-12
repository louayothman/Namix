
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

const NP_ASSET_METADATA: Record<string, { label: string, icon: string, network: string }> = {
  'usdttrc20': { label: 'Tether (TRC20)', icon: 'USDT', network: 'TRON' },
  'usdtbsc': { label: 'Tether (BEP20)', icon: 'USDT', network: 'BSC' },
  'usdteth': { label: 'Tether (ERC20)', icon: 'USDT', network: 'Ethereum' },
  'usdtsol': { label: 'Tether (SOL)', icon: 'USDT', network: 'Solana' },
  'usdtmatic': { label: 'Tether (MATIC)', icon: 'USDT', network: 'Polygon' },
  'btc': { label: 'Bitcoin', icon: 'BTC', network: 'BTC' },
  'eth': { label: 'Ethereum', icon: 'ETH', network: 'Ethereum' },
  'trx': { label: 'TRON', icon: 'TRX', network: 'TRON' },
  'sol': { label: 'Solana', icon: 'SOL', network: 'Solana' },
  'ltc': { label: 'Litecoin', icon: 'LTC', network: 'LTC' },
  'bnbbsc': { label: 'BNB', icon: 'BNB', network: 'BSC' },
  'doge': { label: 'Dogecoin', icon: 'DOGE', network: 'DOGE' },
  'xrp': { label: 'Ripple', icon: 'XRP', network: 'XRP' },
  'maticpolygon': { label: 'Polygon', icon: 'MATIC', network: 'Polygon' }
};

export function NowPaymentsCurrencyStep({
  availableIds,
  onSelect,
  loading,
  searchQuery
}: NowPaymentsCurrencyStepProps) {
  const filtered = useMemo(() => {
    // عرض العملات المتوفرة فقط في ناوبايمنتس
    let list = availableIds
      .filter(id => !!NP_ASSET_METADATA[id])
      .map(id => ({ id, ...NP_ASSET_METADATA[id] }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.label.toLowerCase().includes(q) || a.icon.toLowerCase().includes(q));
    }
    
    return list;
  }, [availableIds, searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="text-right">
           <h3 className="text-base font-black text-[#002d4d]">اختر العملة والشبكة</h3>
           <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Select Asset & Network</p>
        </div>
        <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">SECURE SYNC</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((asset) => (
          <button 
            key={asset.id} 
            onClick={() => onSelect(asset)} 
            disabled={loading}
            className="h-[80px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CryptoIcon name={asset.icon} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.label}</p>
                {asset.icon === 'USDT' && <Sparkles size={8} className="text-orange-400 animate-pulse" />}
              </div>
              <Badge className="font-black text-[7px] px-1.5 py-0.5 rounded-md shadow-sm uppercase border-none bg-blue-50 text-blue-600">
                {asset.network}
              </Badge>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
