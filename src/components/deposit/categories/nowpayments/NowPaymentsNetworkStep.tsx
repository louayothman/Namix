"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft, Layers, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NowPaymentsNetworkStepProps {
  selectedAsset: any;
  onSelect: (network: any) => void;
  availableIds: string[];
  slowNetworkId?: string | null;
}

const NETWORK_MAP: Record<string, any[]> = {
  USDT: [
    { id: 'usdttrc20', name: 'Tether (TRC20)', network: 'TRON (TRC20)' },
    { id: 'usdtbsc', name: 'Tether (BEP20)', network: 'BNB Smart Chain' },
    { id: 'usdteth', name: 'Tether (ERC20)', network: 'Ethereum' },
    { id: 'usdtsol', name: 'Tether (SOL)', network: 'Solana' },
    { id: 'usdtmatic', name: 'Tether (POLYGON)', network: 'Polygon' },
  ],
  BTC: [{ id: 'btc', name: 'Bitcoin (Native)', network: 'BTC' }],
  ETH: [
    { id: 'eth', name: 'Ethereum (Native)', network: 'ERC20' },
    { id: 'ethbsc', name: 'Ethereum (BEP20)', network: 'BNB Smart Chain' }
  ],
  SOL: [{ id: 'sol', name: 'Solana (Native)', network: 'SOL' }],
  TRX: [{ id: 'trx', name: 'TRON (Native)', network: 'TRC20' }],
  LTC: [{ id: 'ltc', name: 'Litecoin (Native)', network: 'LTC' }],
  BNB: [{ id: 'bnbbsc', name: 'Binance Coin', network: 'BEP20 (BSC)' }],
  DOGE: [{ id: 'doge', name: 'Dogecoin', network: 'DOGE' }],
  XRP: [{ id: 'xrp', name: 'Ripple', network: 'XRP' }],
  MATIC: [{ id: 'maticpolygon', name: 'Polygon (Native)', network: 'POLYGON' }],
};

export function NowPaymentsNetworkStep({ selectedAsset, onSelect, availableIds, slowNetworkId }: NowPaymentsNetworkStepProps) {
  const filteredNetworks = useMemo(() => {
    const symbol = selectedAsset?.coin || selectedAsset?.symbol || "";
    const allPossible = NETWORK_MAP[symbol] || [
      { id: symbol.toLowerCase(), name: selectedAsset?.name, network: 'Mainnet' }
    ];
    
    // فلترة الشبكات المتاحة فعلياً بصمت
    return allPossible.filter(net => availableIds.includes(net.id));
  }, [selectedAsset, availableIds]);

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 flex items-center justify-center">
          <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={36} />
        </div>
        <div className="text-right">
          <h3 className="text-base font-black text-[#002d4d] leading-none">حدد شبكة الإرسال</h3>
          <p className="text-[8px] font-bold text-gray-400 uppercase mt-1.5">Asset: {selectedAsset?.coin || selectedAsset?.symbol}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredNetworks.map((net) => {
          const isSlow = slowNetworkId === net.id;
          return (
            <div key={net.id} className="space-y-2">
              <button 
                onClick={() => onSelect(net)}
                className={cn(
                  "h-[80px] w-full p-4 rounded-[24px] border transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]",
                  isSlow ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg"
                )}
              >
                <div className="h-10 w-10 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center transition-all shrink-0 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600">
                   <Layers size={20} />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="font-black text-[13px] text-[#002d4d] truncate">{net.name}</p>
                  <Badge className="font-black text-[7px] px-1.5 py-0.5 rounded-md shadow-sm uppercase border-none bg-emerald-50 text-emerald-600">
                    {net.network}
                  </Badge>
                </div>
                <div className="shrink-0">
                   <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
                </div>
              </button>
              
              {isSlow && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 px-3 text-red-500">
                   <AlertCircle size={10} />
                   <span className="text-[8px] font-bold">الشبكة غير متاحة حالياً يرجى اختيار شبكة اخرى أو المحاولة لاحقاً</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
