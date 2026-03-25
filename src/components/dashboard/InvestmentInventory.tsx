
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Clock,
  ShieldCheck,
  ChevronLeft,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO, differenceInMilliseconds } from "date-fns";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

/**
 * AnimatedDigit - مكون الخانة الرقمية المستقلة (محرك الأرقام الذرية)
 * يقوم بتحريك الرقم عمودياً من 0 إلى 9 بناءً على القيمة
 */
function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === "$" || digit === ",") {
    return <span className="inline-block px-0.5">{digit}</span>;
  }

  const num = parseInt(digit);
  if (isNaN(num)) return <span className="inline-block">{digit}</span>;

  return (
    <div className="relative h-[24px] w-[12px] overflow-hidden inline-block leading-none">
      <motion.div
        animate={{ y: -num * 24 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-0 left-0 flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[24px] flex items-center justify-center font-black">
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

/**
 * @fileOverview مُفاعل العمليات السيادي v13.0 - Precision Yield Edition
 * تم ضبط الدقة لـ 3 فواصل عشرية للحصول على مظهر مالي أنقى وأكثر احترافية.
 */
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
      {/* Header Info */}
      <div className="flex items-center justify-between px-4">
        <div className="space-y-0.5 text-right">
          <h3 className="text-xs font-black text-[#002d4d] flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-blue-500" />
            مُفاعل الأصول النشطة
          </h3>
          <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em]">Sovereign Operational Matrix</p>
        </div>
        <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[8px] rounded-full px-4 py-1 shadow-md">
          {investments.length} NODES ACTIVE
        </Badge>
      </div>

      <div className="flex items-stretch gap-4">
        
        {/* Master Integrated Card */}
        <Card className="flex-1 border-none shadow-[0_48px_100px_-20px_rgba(0,45,77,0.15)] rounded-[56px] md:rounded-[64px] bg-white border border-gray-50 overflow-hidden relative group">
          
          {/* Sovereign Seal Icon - Persistent & Reactive */}
          <motion.div 
            variants={{
              initial: { scale: 1, opacity: 0.03, rotate: 0 },
              hover: { scale: 1.05, opacity: 0.08, rotate: 5 }
            }}
            initial="initial"
            whileHover="hover"
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute -bottom-10 -right-10 pointer-events-none text-[#002d4d] z-0"
          >
             <ShieldCheck size={280} strokeWidth={1} />
          </motion.div>

          <CardContent className="p-8 md:p-12 relative z-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
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
                    className="space-y-5 group/node"
                  >
                    {/* Header: Title & Atomic Accrued Profit */}
                    <div className="flex justify-between items-start">
                       <div className="space-y-0.5">
                          <h4 className="font-black text-sm text-[#002d4d] tracking-tight group-hover/node:text-blue-600 transition-colors">
                            {inv.planTitle}
                          </h4>
                          <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">NODE: {inv.id.slice(-6).toUpperCase()}</span>
                       </div>
                       <div className="text-left flex flex-col items-end">
                          <div className="flex items-center gap-1">
                             <div className="flex items-center text-lg font-black text-emerald-600 tabular-nums tracking-tighter overflow-hidden h-[24px]" dir="ltr">
                                <span>+</span>
                                <span>$</span>
                                {accruedStr.split("").map((char, i) => (
                                  <AnimatedDigit key={i} digit={char} />
                                ))}
                             </div>
                          </div>
                          <p className="text-[7px] font-black text-emerald-500/60 uppercase tracking-widest mt-0.5">Nano Yield Stream</p>
                       </div>
                    </div>

                    {/* Integrated Amount & Progress Row */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-[24px] border border-gray-100 shadow-inner group-hover/node:bg-white transition-all duration-500">
                       <div className="shrink-0 text-right">
                          <p className="text-[7px] font-black text-gray-400 uppercase leading-none">Capital</p>
                          <p className="text-xs font-black text-[#002d4d] tabular-nums mt-1">${inv.amount.toLocaleString()}</p>
                       </div>
                       
                       <div className="flex-1 space-y-1.5 pt-1">
                          <div className="relative h-[3.5px] w-full bg-gray-200 rounded-full overflow-hidden">
                             {/* Progress Fill */}
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${percent}%` }}
                               transition={{ duration: 2, ease: "easeOut" }}
                               className="absolute right-0 h-full bg-[#002d4d] overflow-hidden"
                             >
                                {/* WHITE Shimmer moving from RIGHT to LEFT */}
                                <motion.div 
                                  animate={{ x: ['100%', '-100%'] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                                />
                             </motion.div>
                          </div>
                          <div className="flex justify-between items-center px-0.5">
                             <span className="text-[7px] font-black text-gray-300 tabular-nums">%{percent}</span>
                             <div className="flex items-center gap-1 opacity-40">
                                <Clock size={8} className="text-[#f9a885]" />
                                <span className="text-[7px] font-bold text-gray-400 uppercase">Live Node</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Footer: Final Yield & End Time */}
                    <div className="flex justify-between items-center px-1">
                       <div className="flex items-center gap-2">
                          <Badge className="bg-blue-50 text-blue-600 border border-blue-100/50 font-black text-[8px] px-2 py-0.5 rounded-lg shadow-sm">
                             Target: ${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </Badge>
                       </div>
                       <div className="text-left">
                          <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Ends: {new Date(inv.endTime).toLocaleDateString('ar-EG')}</p>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Action: View All Nodes */}
            <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <ShieldCheck size={24} />
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-[#002d4d]">بروتوكول الأصول النشطة</p>
                     <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Sovereign Oversight Active</p>
                  </div>
               </div>
               
               <Link href="/my-investments">
                  <Button variant="ghost" className="h-12 rounded-full bg-gray-50 hover:bg-[#002d4d] hover:text-white text-gray-400 font-black text-[10px] px-10 transition-all active:scale-95 group/all">
                    عرض كافة العقود <ChevronLeft className="mr-2 h-4 w-4 group/all:-translate-x-1 transition-transform" />
                  </Button>
               </Link>
            </div>
          </CardContent>
        </Card>

        {/* NAMIX PROTOCOL Vertical Label - Side Rail (Left Side in RTL) */}
        <div className="flex flex-col items-center justify-center gap-4 shrink-0 px-1 opacity-20 select-none">
           <span className="text-[7px] font-black text-[#002d4d] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">
             NAMIX PROTOCOL
           </span>
           <div className="w-[1px] flex-1 bg-gradient-to-b from-[#002d4d] via-blue-500/20 to-transparent rounded-full" />
        </div>

      </div>
    </div>
  );
}
