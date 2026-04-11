
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
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
      <div className="flex items-center gap-5 px-4">
        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner">
          <CryptoIcon name={selectedAsset.coin} size={28} />
        </div>
        <div className="text-right">
          <h3 className="text-xl font-black text-[#002d4d]">حدد شبكة التحويل</h3>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Network Selection Node for {selectedAsset.coin}</p>
        </div>
      </div>

      <div className="grid gap-3">
        {selectedAsset.networkList?.filter((n: any) => n.depositEnable).map((net: any) => (
          <button 
            key={net.network} 
            onClick={() => onSelect(net)}
            disabled={loading}
            className="p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center justify-between group active:scale-[0.99] disabled:opacity-50"
          >
            <div className="text-right">
              <p className="font-black text-lg text-[#002d4d]">{net.name} ({net.network})</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-2.5 py-0.5 rounded-full shadow-sm">INSTANT VERIFICATION</Badge>
                <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
              </div>
            </div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-blue-500" /> : <ChevronLeft className="h-6 w-6 text-gray-200 group-hover:text-[#002d4d] transition-all" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
