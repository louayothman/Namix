
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

interface ArenaHeaderProps {
  title: string;
  balance: number;
  onOpenDeposit: () => void;
}

/**
 * ArenaHeader - شريط التحكم العلوي v7.0
 * تم تحديث الخط لـ 13px وتطهير النصوص العربية.
 */
export function ArenaHeader({ title, balance, onOpenDeposit }: ArenaHeaderProps) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white/90 backdrop-blur-xl z-[150] shrink-0 sticky top-0 font-body" dir="rtl">
      <div className="flex items-center gap-4">
         <Link href="/arena">
           <button className="h-9 w-9 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all border border-gray-100 flex items-center justify-center">
             <ChevronRight className="h-5 w-5" />
           </button>
         </Link>
         <div className="text-right">
            <h1 className="text-[13px] font-black text-[#002d4d] leading-none tracking-normal">{title}</h1>
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">Sovereign Arena</p>
         </div>
      </div>
      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-50 shadow-sm">
         <div className="text-right pr-1">
            <p className="text-[7px] font-black text-gray-400 uppercase leading-none tracking-widest">Liquidity</p>
            <p className="text-[13px] font-black text-[#002d4d] tabular-nums mt-1 tracking-tighter">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-7 w-7 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Plus size={14} />
         </button>
      </div>
    </header>
  );
}
