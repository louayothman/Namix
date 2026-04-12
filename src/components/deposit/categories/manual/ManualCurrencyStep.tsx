"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ManualCurrencyStepProps {
  portals: any[];
  onSelect: (portal: any) => void;
  loading: boolean;
  searchQuery: string;
}

export function ManualCurrencyStep({
  portals,
  onSelect,
  loading,
  searchQuery
}: ManualCurrencyStepProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return portals;
    const q = searchQuery.toLowerCase();
    return portals.filter(p => p.name.toLowerCase().includes(q));
  }, [portals, searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-black text-[#002d4d]">حدد وسيلة الدفع المباشر</h3>
        <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">MANUAL REVIEW</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((portal) => (
          <button 
            key={portal.id} 
            onClick={() => onSelect(portal)} 
            disabled={loading}
            className="h-[72px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CryptoIcon name={portal.icon} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{portal.name}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">إيداع يدوي</p>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
