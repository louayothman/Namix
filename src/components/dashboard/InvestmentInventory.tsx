
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Clock,
  ShieldCheck,
  ChevronLeft,
  TrendingUp,
  Zap,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO, differenceInMilliseconds } from "date-fns";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

/**
 * @fileOverview مُفاعل الحجرات السائلة v15.0 - Liquid Chamber Edition
 * يحول الاستثمارات إلى خزانات طاقة زجاجية تمتلئ بالسيولة تدريجياً.
 * تم تطهير النصوص من "السيادة" وتثبيت انسيابية الخط العربي.
 */

function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === "$" || digit === ",") {
    return <span className="inline-block px-0.5">{digit}</span>;
  }

  const num = parseInt(digit);
  if (isNaN(num)) return <span className="inline-block">{digit}</span>;

  return (
    <div className="relative h-[22px] w-[11px] overflow-hidden inline-block leading-none">
      <motion.div
        animate={{ y: -num * 22 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-0 left-0 flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[22px] flex items-center justify-center font-black">
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface InvestmentInventoryProps {
  investments: any[] | null;
  isLoading: boolean;
  now: Date;
}

export function InvestmentInventory({ investments, isLoading, now }: InvestmentInventoryProps) {
  if (isLoading || !investments || investments.length === 0) {
    return null;
  }

  const displayInvestments = investments.slice(0, 3);

  const getProgressData = (startTime: string, endTime: string, expectedProfit: number) => {
    try {
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      const totalMs = differenceInMilliseconds(end, start);
      const elapsedMs = differenceInMilliseconds(now, start);
      const percent = Math.min(Math.max(Math.floor((elapsedMs / totalMs) * 100), 0), 100);
      const accrued = (Math.min(Math.max(elapsedMs / totalMs, 0), 1) * expectedProfit);
      return { percent, accrued };
    } catch (e) { return { percent: 0, accrued: 0 }; }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-body" dir="rtl">
      {/* Dynamic Reactor Header */}
      <div className="flex items-center justify-between px-4">
        <div className="space-y-0.5 text-right">
          <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
            مُفاعل النمو الحي
          </h3>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] tracking-normal">Operational Inflow Matrix</p>
        </div>
        <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[8px] rounded-full px-4 py-1.5 shadow-lg uppercase tracking-widest">
          {investments.length} Active Nodes
        </Badge>
      </div>

      <div className="flex items-stretch gap-4">
        
        {/* The Liquid Chamber Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayInvestments.map((inv, idx) => {
            const { percent, accrued } = getProgressData(inv.startTime, inv.endTime, inv.expectedProfit);
            const totalReturn = inv.amount + inv.expectedProfit;
            const accruedStr = accrued.toFixed(3);
            
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Card className="border-none shadow-sm rounded-[44px] bg-white border border-gray-100/50 overflow-hidden relative group h-full flex flex-col transition-all duration-700 hover:shadow-2xl">
                  
                  {/* Digital Liquid Fill Effect - The "Liquid Chamber" */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${percent}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/[0.04] z-0 pointer-events-none"
                  >
                    {/* Glowing Surface Line */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
                    
                    {/* Internal Flow Shimmer */}
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/[0.02] to-transparent skew-x-[-20deg]"
                    />
                  </motion.div>

                  <CardContent className="p-7 relative z-10 flex-1 flex flex-col justify-between space-y-8">
                    
                    {/* Top Identity & Status */}
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-[18px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shrink-0">
                             <Zap size={20} className={cn(percent >= 100 ? "text-emerald-500" : "text-[#002d4d]/40")} />
                          </div>
                          <div className="text-right">
                             <h4 className="font-black text-[13px] text-[#002d4d] leading-none tracking-tight">{inv.planTitle}</h4>
                             <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-1.5">ID: {inv.id.slice(-6).toUpperCase()}</p>
                          </div>
                       </div>
                       <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[7px] px-2 py-0.5 rounded-md">
                          %{inv.profitPercent} YIELD
                       </Badge>
                    </div>

                    {/* Central Accumulation Node */}
                    <div className="space-y-4 text-center">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Accrued Yield</p>
                          <div className="flex items-center justify-center text-3xl font-black text-emerald-600 tabular-nums tracking-tighter h-[32px]" dir="ltr">
                            <span className="mr-1">+</span>
                            <span className="mr-0.5 text-emerald-300/50">$</span>
                            {accruedStr.split("").map((char, i) => (
                              <AnimatedDigit key={i} digit={char} />
                            ))}
                          </div>
                       </div>
                       
                       <div className="p-4 bg-gray-50/50 rounded-[28px] border border-gray-100/50 flex items-center justify-between shadow-inner">
                          <div className="text-right space-y-0.5">
                             <p className="text-[7px] font-black text-gray-300 uppercase leading-none">Capital</p>
                             <p className="text-xs font-black text-[#002d4d] tabular-nums">${inv.amount.toLocaleString()}</p>
                          </div>
                          <div className="h-6 w-[1px] bg-gray-200" />
                          <div className="text-left space-y-0.5">
                             <p className="text-[7px] font-black text-gray-300 uppercase leading-none">Target</p>
                             <p className="text-xs font-black text-[#002d4d] tabular-nums">${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                          </div>
                       </div>
                    </div>

                    {/* Footer: Progress & Date */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Clock size={12} className="text-blue-400" />
                          <p className="text-[9px] font-bold text-gray-400 tabular-nums">{new Date(inv.endTime).toLocaleDateString('ar-EG')}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-emerald-600 tabular-nums">%{percent}</span>
                          <div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${percent}%` }}
                               className="h-full bg-emerald-500 rounded-full"
                             />
                          </div>
                       </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tactical Identity Rail - Side Strip */}
        <div className="hidden md:flex flex-col items-center justify-center gap-4 shrink-0 px-2 opacity-[0.15] select-none">
           <span className="text-[7px] font-black text-[#002d4d] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">
             NAMIX PROTOCOL
           </span>
           <div className="w-[0.5px] flex-1 bg-gradient-to-b from-[#002d4d] via-emerald-500/20 to-transparent rounded-full" />
        </div>

      </div>

      {/* Global Action: Explore All Assets */}
      <div className="flex justify-center pt-2">
         <Link href="/my-investments">
            <Button variant="ghost" className="h-12 px-10 rounded-full bg-white border border-gray-100 hover:bg-[#002d4d] hover:text-white text-gray-400 font-black text-[10px] shadow-sm transition-all active:scale-95 group">
               سجل العقود الكامل 
               <ChevronLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            </Button>
         </Link>
      </div>
    </div>
  );
}
