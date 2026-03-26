
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

export function ArenaHeader({ title, balance, onOpenDeposit }: ArenaHeaderProps) {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md z-50 shrink-0 sticky top-0 font-body" dir="rtl">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all">
             <ChevronRight className="h-4 w-4" />
           </Button>
         </Link>
         <div className="text-right">
            <h1 className="text-[11px] font-black text-[#002d4d] leading-none uppercase">{title}</h1>
            <p className="text-[7px] font-bold text-gray-300 uppercase tracking-widest mt-1">Sovereign Arena</p>
         </div>
      </div>
      <div className="flex items-center gap-2 bg-gray-50/80 px-2 py-1 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right pr-1">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Liquidity</p>
            <p className="text-[10px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-6 w-6 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Plus size={12} />
         </button>
      </div>
    </header>
  );
}
