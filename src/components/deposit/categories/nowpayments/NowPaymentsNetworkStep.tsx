
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft, Layers, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAvailableNowPaymentsCurrencies } from "@/app/actions/nowpayments-actions";

interface NowPaymentsNetworkStepProps {
  selectedAsset: any;
  onSelect: (network: any) => void;
  loading: boolean;
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
  ADA: [{ id: 'ada', name: 'Cardano', network: 'ADA' }],
  DOT: [{ id: 'dot', name: 'Polkadot', network: 'DOT' }],
  MATIC: [{ id: 'maticpolygon', name: 'Polygon (Native)', network: 'POLYGON' }],
};

export function NowPaymentsNetworkStep({ selectedAsset, onSelect, loading: parentLoading }: NowPaymentsNetworkStepProps) {
  const [availableIds, setAvailableIds] = useState<string[]>([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      setChecking(true);
      const res = await getAvailableNowPaymentsCurrencies();
      if (res.success && res.currencies) {
        setAvailableIds(res.currencies);
      }
      setChecking(false);
    };
    fetchAvailability();
  }, []);

  const filteredNetworks = useMemo(() => {
    const allPossible = NETWORK_MAP[selectedAsset?.symbol] || [
      { id: selectedAsset?.symbol.toLowerCase(), name: selectedAsset?.name, network: 'Mainnet' }
    ];
    
    // إخفاء الشبكات غير المتاحة لحظياً في NOWPayments
    return allPossible.filter(net => availableIds.includes(net.id));
  }, [selectedAsset, availableIds]);

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

      {checking ? (
        <div className="py-20 text-center flex flex-col items-center gap-4 animate-pulse">
           <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning Available Nodes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {filteredNetworks.map((net) => (
            <button 
              key={net.id} 
              onClick={() => onSelect(net)}
              disabled={parentLoading}
              className="h-[80px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
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
                 {parentLoading ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />}
              </div>
            </button>
          ))}
          
          {filteredNetworks.length === 0 && !checking && (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-40">
               <Layers size={40} className="text-gray-200" />
               <p className="text-[10px] font-black uppercase text-gray-400">لا توجد شبكات متاحة لهذه العملة حالياً</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
