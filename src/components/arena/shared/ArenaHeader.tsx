
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
 * ArenaHeader - شريط التحكم العلوي v6.0
 * تم تحديث الخطوط لـ 16px وتطهير النصوص العربية من التباعد.
 */
export function ArenaHeader({ title, balance, onOpenDeposit }: ArenaHeaderProps) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-xl z-[150] shrink-0 sticky top-0 font-body" dir="rtl">
      <div className="flex items-center gap-4">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all border border-gray-100">
             <ChevronRight className="h-5 w-5" />
           </Button>
         </Link>
         <div className="text-right">
            <h1 className="text-base font-black text-[#002d4d] leading-none uppercase tracking-normal">{title}</h1>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Sovereign Arena</p>
         </div>
      </div>
      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
         <div className="text-right pr-1">
            <p className="text-[8px] font-black text-gray-400 uppercase leading-none tracking-widest">Liquidity</p>
            <p className="text-base font-black text-[#002d4d] tabular-nums mt-1 tracking-tighter">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-8 w-8 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Plus size={16} />
         </button>
      </div>
    </header>
  );
}
