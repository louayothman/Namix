"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Wallet, Clock, ShieldCheck, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ParameterConsoleProps {
  amount: number;
  onAmountChange: (val: number) => void;
  duration: number;
  onDurationChange: (val: number) => void;
  durations: { label: string, seconds: number }[];
  balance: number;
  minAmount: number;
  maxAmount: number;
}

export function ParameterConsole({ 
  amount, 
  onAmountChange, 
  duration, 
  onDurationChange, 
  durations,
  balance,
  minAmount,
  maxAmount
}: ParameterConsoleProps) {

  return (
    <div className="space-y-6 font-body select-none text-right" dir="rtl">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <section className="p-4 bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[140px]">
           <div className="absolute -top-2 -right-2 opacity-[0.02] pointer-events-none text-[#002d4d]">
              <Wallet size={80} strokeWidth={1.5} />
           </div>
           <div className="relative z-10 space-y-3">
              <div className="px-1">
                 <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-normal">حقن السيولة</h4>
              </div>
              <div className="text-center space-y-1">
                 <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">
                   <span className="text-[10px] text-gray-300 ml-0.5">$</span>
                   {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 <p className="text-[7px] font-bold text-emerald-600 opacity-60 tabular-nums">Avl: ${balance.toLocaleString()}</p>
              </div>
              <div className="px-1">
                 <Slider 
                   value={[amount]}
                   min={minAmount}
                   max={Math.min(maxAmount, balance)}
                   step={0.01}
                   onValueChange={([val]) => onAmountChange(val)}
                   className="[&>span:first-child]:h-1 [&>span:first-child]:bg-gray-200 [&>span:first-child_span]:bg-[#002d4d] [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-[#002d4d]"
                 />
              </div>
           </div>
        </section>

        <section className="p-4 bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-inner relative overflow-hidden flex flex-col min-h-[140px]">
           <div className="absolute -top-2 -left-2 opacity-[0.02] pointer-events-none text-[#002d4d]">
              <Clock size={80} strokeWidth={1.5} />
           </div>
           <div className="relative z-10 space-y-3 flex-1 flex flex-col">
              <div className="px-1 flex items-center justify-between">
                 <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-normal">نافذة التنفيذ</h4>
                 <Badge variant="outline" className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[6px] px-1.5 py-0.5 rounded-md">LIVE</Badge>
              </div>
              <div className="grid grid-cols-2 gap-1.5 flex-1 content-start">
                 {durations.slice(0, 6).map((d, idx) => (
                   <button
                     key={`${d.label}-${idx}`}
                     onClick={() => onDurationChange(d.seconds)}
                     className={cn(
                       "h-8 rounded-xl font-black text-[8px] transition-all duration-300 border tabular-nums",
                       duration === d.seconds 
                         ? "bg-[#002d4d] border-[#002d4d] text-[#f9a885] shadow-md" 
                         : "bg-white/60 border-gray-100 text-gray-400 hover:bg-white"
                     )}
                   >
                      {d.label}
                   </button>
                 ))}
              </div>
           </div>
        </section>
      </div>
      <div className="flex items-center justify-center gap-4 opacity-20 select-none">
         <div className="flex items-center gap-1.5">
            <ShieldCheck size={8} className="text-[#002d4d]" />
            <span className="text-[6px] font-black uppercase tracking-widest">Authorized</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-200" />
         <div className="flex items-center gap-1.5">
            <Coins size={8} className="text-[#002d4d]" />
            <span className="text-[6px] font-black uppercase tracking-widest">Precision Core</span>
         </div>
      </div>
    </div>
  );
}