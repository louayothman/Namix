
"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft, Layers, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NowPaymentsNetworkStepProps {
  selectedAsset: any;
  onSelect: (network: any) => void;
  loading: boolean;
}

const NETWORK_MAP: Record<string, any[]> = {
  USDT: [
    { id: 'usdttrc20', name: 'Tether (TRC20)', network: 'TRON (TRC20)', isAvailable: true },
    { id: 'usdtbsc', name: 'Tether (BEP20)', network: 'BNB Smart Chain', isAvailable: true },
    { id: 'usdteth', name: 'Tether (ERC20)', network: 'Ethereum', isAvailable: true },
    { id: 'usdtsol', name: 'Tether (SOL)', network: 'Solana', isAvailable: true },
    { id: 'usdtmatic', name: 'Tether (POLYGON)', network: 'Polygon', isAvailable: true },
  ],
  BTC: [{ id: 'btc', name: 'Bitcoin (Native)', network: 'BTC', isAvailable: true }],
  ETH: [
    { id: 'eth', name: 'Ethereum (Native)', network: 'ERC20', isAvailable: true },
    { id: 'ethbsc', name: 'Ethereum (BEP20)', network: 'BNB Smart Chain', isAvailable: true }
  ],
  SOL: [{ id: 'sol', name: 'Solana (Native)', network: 'SOL', isAvailable: true }],
  TRX: [{ id: 'trx', name: 'TRON (Native)', network: 'TRC20', isAvailable: true }],
  LTC: [{ id: 'ltc', name: 'Litecoin (Native)', network: 'LTC', isAvailable: true }],
  BNB: [{ id: 'bnbbsc', name: 'Binance Coin', network: 'BEP20 (BSC)', isAvailable: true }],
  DOGE: [{ id: 'doge', name: 'Dogecoin', network: 'DOGE', isAvailable: true }],
  XRP: [{ id: 'xrp', name: 'Ripple', network: 'XRP', isAvailable: true }],
  ADA: [{ id: 'ada', name: 'Cardano', network: 'ADA', isAvailable: true }],
  DOT: [{ id: 'dot', name: 'Polkadot', network: 'DOT', isAvailable: true }],
  MATIC: [{ id: 'maticpolygon', name: 'Polygon (Native)', network: 'POLYGON', isAvailable: true }],
};

export function NowPaymentsNetworkStep({ selectedAsset, onSelect, loading }: NowPaymentsNetworkStepProps) {
  const [hoveredNetId, setHoveredNetId] = useState<string | null>(null);
  
  const networks = useMemo(() => {
    return NETWORK_MAP[selectedAsset?.symbol] || [{ id: selectedAsset?.symbol.toLowerCase(), name: selectedAsset?.name, network: 'Mainnet', isAvailable: true }];
  }, [selectedAsset]);

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 flex items-center justify-center">
          <CryptoIcon name={selectedAsset?.icon} size={36} />
        </div>
        <div className="text-right">
          <h3 className="text-base font-black text-[#002d4d] leading-none">حدد شبكة التحويل</h3>
          <p className="text-[8px] font-bold text-gray-400 uppercase mt-1.5">Asset: {selectedAsset?.symbol}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {networks.map((net) => (
          <div key={net.id} className="space-y-2">
            <button 
              onClick={() => net.isAvailable && onSelect(net)}
              disabled={loading || !net.isAvailable}
              onMouseEnter={() => setHoveredNetId(net.id)}
              onMouseLeave={() => setHoveredNetId(null)}
              className={cn(
                "h-[80px] w-full p-4 rounded-[24px] border transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]",
                net.isAvailable 
                  ? "bg-white border-gray-100 hover:border-[#002d4d] hover:shadow-lg" 
                  : "bg-gray-50 border-transparent opacity-60 grayscale cursor-not-allowed"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-inner",
                net.isAvailable ? "bg-gray-50 text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600" : "bg-gray-100 text-gray-300"
              )}>
                 <Layers size={20} />
              </div>
              <div className="flex-1 space-y-0.5 min-w-0">
                <p className="font-black text-[13px] text-[#002d4d] truncate">{net.name}</p>
                <Badge className={cn(
                  "font-black text-[7px] px-1.5 py-0.5 rounded-md shadow-sm uppercase border-none",
                  net.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-gray-200 text-gray-400"
                )}>
                  {net.network}
                </Badge>
              </div>
              <div className="shrink-0">
                 {loading ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />}
              </div>
            </button>
            
            {!net.isAvailable && (
              <div className="flex items-center gap-1.5 px-3 py-1 animate-in fade-in slide-in-from-top-1">
                 <AlertCircle size={10} className="text-red-500" />
                 <p className="text-[8px] font-bold text-red-500">الشبكة غير متاحة حالياً يرجى اختيار شبكة اخرى</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
