"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Wallet, Clock, ShieldCheck, Sparkles, Coins, Zap } from "lucide-react";
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

/**
 * @fileOverview قُمرة المعايير التكتيكية v5.0 - Sovereign Precision Console
 * تصميم نقي يدمج منزلق سيولة فخم ومصفوفة زمنية شبكية لتوفير المساحة.
 */
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
    <div className="space-y-8 font-body select-none text-right" dir="rtl">
      
      {/* 1. قسم هندسة السيولة (Amount) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                 <Wallet size={16} />
              </div>
              <div className="text-right">
                 <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-normal leading-none">حقن السيولة</h4>
                 <p className="text-[7px] font-bold text-gray-400 uppercase mt-1">Capital Injection</p>
              </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Available</span>
              <span className="text-[11px] font-black text-emerald-600 tabular-nums">${balance.toLocaleString()}</span>
           </div>
        </div>

        <div className="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 shadow-inner space-y-8 relative overflow-hidden">
           {/* عرض المبلغ المركزي */}
           <div className="text-center relative z-10">
              <div className="flex items-baseline justify-center gap-2">
                 <span className="text-xl font-bold text-gray-300">$</span>
                 <span className="text-5xl font-black text-[#002d4d] tabular-nums tracking-tighter">
                   {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
              </div>
           </div>

           {/* منزلق السيولة الفخم (Sovereign Slider) */}
           <div className="px-2 relative z-10">
              <Slider 
                value={[amount]}
                min={minAmount}
                max={Math.min(maxAmount, balance)}
                step={0.01}
                onValueChange={([val]) => onAmountChange(val)}
                className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-gray-200 [&>span:first-child_span]:bg-gradient-to-l [&>span:first-child_span]:from-[#002d4d] [&>span:first-child_span]:to-blue-500 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-[3px] [&_[role=slider]]:border-white [&_[role=slider]]:bg-[#002d4d] [&_[role=slider]]:shadow-xl"
              />
              <div className="flex justify-between mt-4 px-1">
                 <span className="text-[8px] font-black text-gray-300 tabular-nums">${minAmount}</span>
                 <span className="text-[8px] font-black text-gray-300 tabular-nums">${Math.min(maxAmount, balance).toLocaleString()}</span>
              </div>
        </div>
        </div>
      </section>

      {/* 2. مصفوفة نافذة التنفيذ (Duration Grid) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="h-8 w-8 rounded-xl bg-orange-50 text-[#f9a885] flex items-center justify-center shadow-inner">
              <Clock size={16} />
           </div>
           <div className="text-right">
              <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-normal leading-none">نافذة التنفيذ</h4>
              <p className="text-[7px] font-bold text-gray-400 uppercase mt-1">Temporal Nodes</p>
           </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
           {durations.map((d) => (
             <button
               key={d.label}
               onClick={() => onDurationChange(d.seconds)}
               className={cn(
                 "h-12 rounded-2xl font-black text-[10px] transition-all duration-500 border flex flex-col items-center justify-center gap-0.5 relative overflow-hidden",
                 duration === d.seconds 
                   ? "bg-[#002d4d] border-[#002d4d] text-[#f9a885] shadow-lg scale-[1.02]" 
                   : "bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:bg-gray-50"
               )}
             >
                {duration === d.seconds && (
                  <motion.div layoutId="active-node-glow" className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20" />
                )}
                <span className="relative z-10 tabular-nums">{d.label}</span>
                <span className={cn("text-[6px] uppercase tracking-widest relative z-10", duration === d.seconds ? "text-[#f9a885]/40" : "text-gray-300")}>Node</span>
             </button>
           ))}
        </div>
      </section>

      {/* تذييل الميثاق */}
      <div className="flex items-center justify-center gap-6 opacity-20 pt-4 border-t border-gray-50">
         <div className="flex items-center gap-2">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-widest">Authorized Execution</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-200" />
         <div className="flex items-center gap-2">
            <Coins size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-widest">Precision Yield Core</span>
         </div>
      </div>

    </div>
  );
}
