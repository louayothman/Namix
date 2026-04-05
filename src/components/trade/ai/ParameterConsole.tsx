
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Wallet, Clock, Coins, ShieldCheck, TrendingUp } from "lucide-react";
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
 * @fileOverview قُمرة المعايير التكتيكية v3.0 - Institutional Minimalism (Wing Design)
 * تقسيم الواجهة إلى جناحين: الأيمن للسيولة والأيسر للزمن مع الوحدات الكاملة.
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
    <div className="space-y-8 font-body text-right select-none" dir="rtl">
      
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* الجناح الأيمن: هندسة السيولة (Liquidity Wing) */}
        <section className="flex-1 space-y-4">
           <div className="flex items-center gap-2 px-3">
              <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                 <Wallet size={12} />
              </div>
              <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-normal">حقن السيولة</h4>
           </div>

           <div className="p-6 bg-white rounded-[40px] border border-gray-100 shadow-sm space-y-6 transition-all hover:shadow-xl group">
              <div className="flex flex-col items-center gap-1.5">
                 <div className="relative inline-flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-gray-200">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      step="0.01"
                      onChange={(e) => onAmountChange(Number(e.target.value))}
                      className="bg-transparent border-none text-center font-black text-4xl text-[#002d4d] tabular-nums tracking-tighter w-full max-w-[160px] outline-none"
                    />
                 </div>
                 <div className="h-0.5 w-6 bg-[#f9a885] rounded-full group-hover:w-12 transition-all duration-700" />
              </div>

              <div className="px-2 space-y-3">
                 <Slider 
                   value={[amount]} 
                   min={minAmount} 
                   max={Math.min(maxAmount, balance)} 
                   step={0.01}
                   onValueChange={(vals) => onAmountChange(vals[0])}
                   className="[&>span]:bg-[#002d4d]"
                 />
                 <div className="flex justify-between items-center text-[7px] font-black text-gray-300 uppercase tracking-widest px-1">
                    <span>Balance: ${balance.toFixed(2)}</span>
                    <span>Min: ${minAmount}</span>
                 </div>
              </div>
           </div>
        </section>

        {/* الجناح الأيسر: درجات السلم الزمني (Temporal Ladder) */}
        <section className="flex-1 space-y-4">
           <div className="flex items-center gap-2 px-3">
              <div className="h-6 w-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                 <Clock size={12} />
              </div>
              <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-normal">نافذة الاستحقاق</h4>
           </div>

           <div className="bg-gray-50/50 p-2 rounded-[40px] border border-gray-100 shadow-inner h-full flex flex-col gap-2">
              {durations.map((d, i) => {
                const isActive = duration === d.seconds;
                // محاكاة درجات السلم: الأطول زمنياً تظهر بمساحة أو وزن بصري أكبر
                return (
                  <button
                    key={i}
                    onClick={() => onDurationChange(d.seconds)}
                    className={cn(
                      "w-full h-11 rounded-[22px] px-5 flex items-center justify-between transition-all duration-500 relative overflow-hidden group/item active:scale-[0.98]",
                      isActive 
                        ? "bg-[#002d4d] text-[#f9a885] shadow-lg" 
                        : "bg-white text-gray-400 hover:bg-white/80 border border-gray-50"
                    )}
                  >
                    <span className="text-[10px] font-black tracking-normal z-10">{d.label}</span>
                    <div className="flex items-center gap-2 z-10">
                       {isActive && <TrendingUp size={10} className="animate-pulse" />}
                       <span className={cn("text-[7px] font-black uppercase tracking-widest", isActive ? "text-[#f9a885]/40" : "text-gray-200")}>
                         Tier {i + 1}
                       </span>
                    </div>
                    {isActive && (
                      <motion.div layoutId="active-step" className="absolute inset-0 bg-white/5 skew-x-12 translate-x-4" />
                    )}
                  </button>
                );
              })}
           </div>
        </section>
      </div>

      {/* تذييل الميثاق */}
      <div className="flex items-center justify-center gap-8 opacity-20 select-none pt-2">
         <div className="flex items-center gap-2">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-widest">Authorized Console</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-2">
            <Coins size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-widest">Precision Yield Core</span>
         </div>
      </div>

    </div>
  );
}
