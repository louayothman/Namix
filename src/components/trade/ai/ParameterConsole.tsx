
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Wallet, Clock, Coins, Sparkles, Zap, ShieldCheck } from "lucide-react";
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
 * @fileOverview قُمرة المعايير التكتيكية - Sovereign Parameter Console
 * تم تحسين الأحجام لتناسب الموبايل وإصلاح استيرادات الأيقونات.
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
  
  const handleSliderChange = (vals: number[]) => {
    onAmountChange(vals[0]);
  };

  return (
    <div className="space-y-6 font-body text-right select-none" dir="rtl">
      
      {/* القسم 1: هندسة السيولة (Liquidity Engineering) */}
      <section className="space-y-4">
         <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2.5">
               <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  <Wallet size={14} />
               </div>
               <div className="space-y-0 text-right">
                  <h4 className="text-[10px] font-black text-[#002d4d] tracking-normal">حقن السيولة</h4>
                  <p className="text-[6px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">Liquidity Input</p>
               </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
               <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Available:</span>
               <span className="text-[9px] font-black text-[#002d4d] tabular-nums">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
         </div>

         <div className="p-6 bg-white rounded-[40px] border border-gray-100 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.05)] space-y-6 group transition-all hover:shadow-xl">
            <div className="flex flex-col items-center gap-1.5">
               <div className="relative inline-flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-gray-200">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    step="0.01"
                    onChange={(e) => onAmountChange(Number(e.target.value))}
                    className="bg-transparent border-none text-center font-black text-4xl text-[#002d4d] tabular-nums tracking-tighter w-full max-w-[200px] outline-none"
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
                 onValueChange={handleSliderChange}
                 className="[&>span]:bg-[#002d4d] cursor-pointer"
               />
               <div className="flex justify-between items-center text-[7px] font-black text-gray-300 uppercase tracking-widest px-1">
                  <span>Limit: ${maxAmount}</span>
                  <span>Min: ${minAmount}</span>
               </div>
            </div>
         </div>
      </section>

      {/* القسم 2: نافذة التنفيذ (Temporal Window) */}
      <section className="space-y-4">
         <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2.5">
               <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                  <Clock size={14} />
               </div>
               <div className="space-y-0 text-right">
                  <h4 className="text-[10px] font-black text-[#002d4d] tracking-normal">نافذة التنفيذ</h4>
                  <p className="text-[6px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">Temporal Window</p>
               </div>
            </div>
            <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[6px] px-2.5 py-0.5 rounded-full shadow-inner tracking-normal uppercase">ADMIN ONLY</Badge>
         </div>

         <div className="bg-gray-50/50 p-1 rounded-[28px] border border-gray-100 shadow-inner">
            <div className="flex items-center gap-1.5 w-full">
               {durations.map((d) => (
                 <button
                   key={d.seconds}
                   onClick={() => onDurationChange(d.seconds)}
                   className={cn(
                     "flex-1 h-12 rounded-[22px] font-black text-[10px] transition-all duration-500 relative overflow-hidden group/btn",
                     duration === d.seconds 
                       ? "bg-[#002d4d] text-[#f9a885] shadow-lg" 
                       : "bg-white text-gray-400 hover:bg-white hover:text-[#002d4d] shadow-sm border border-gray-50"
                   )}
                 >
                    {duration === d.seconds && (
                      <motion.div layoutId="active-node" className="absolute inset-0 bg-white/5 skew-x-12 translate-x-4" />
                    )}
                    <span className="relative z-10 tabular-nums">{d.label}</span>
                    {duration === d.seconds && (
                      <Zap size={6} className="absolute top-1.5 left-1.5 text-[#f9a885] fill-current animate-pulse" />
                    )}
                 </button>
               ))}
            </div>
         </div>
      </section>

      {/* تذييل المعلومات التكتيكية */}
      <div className="px-4 flex items-center justify-center gap-5 opacity-30 select-none">
         <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[6px] font-black uppercase tracking-widest">Precision Nodes Active</span>
         </div>
         <div className="flex items-center gap-1.5">
            <Sparkles size={10} className="text-[#f9a885]" />
            <span className="text-[6px] font-black uppercase tracking-widest">Calculated Risk Control</span>
         </div>
      </div>

    </div>
  );
}
