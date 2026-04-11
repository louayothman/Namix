"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface NetworkSelectionStepProps {
  selectedAsset: any;
  onSelect: (network: any) => void;
  loading: boolean;
}

export function NetworkSelectionStep({ selectedAsset, onSelect, loading }: NetworkSelectionStepProps) {
  if (!selectedAsset) return null;

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
      <div className="flex items-center gap-4 px-2">
        <div className="shrink-0 flex items-center justify-center">
          <CryptoIcon name={selectedAsset.icon || selectedAsset.coin} size={36} />
        </div>
        <div className="text-right">
          <h3 className="text-base font-black text-[#002d4d]">حدد شبكة الايداع</h3>
          <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Asset: {selectedAsset.coin}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {selectedAsset.networkList?.filter((n: any) => n.depositEnable).map((net: any) => (
          <button 
            key={net.network} 
            onClick={() => onSelect(net)}
            disabled={loading}
            className="h-[72px] p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex-1 space-y-0.5 min-w-0 pr-2">
              <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{net.name}</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-1.5 py-0.5 rounded-md shadow-sm uppercase">{net.network}</Badge>
              </div>
            </div>

            <div className="shrink-0">
               {loading ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}