
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
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO, differenceInMilliseconds } from "date-fns";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

/**
 * @fileOverview مُفاعل مدار الطاقة الدوار v18.0 - Orbital Energy Edition
 * يحول الاستثمارات إلى حلقات طاقة دائرية رشيقة ومثالية للهواتف.
 * تم معالجة حجم الأرباح اللحظية وتطهير النصوص من "السيادة".
 */

function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === "$" || digit === ",") {
    return <span className="inline-block px-0.5">{digit}</span>;
  }

  const num = parseInt(digit);
  if (isNaN(num)) return <span className="inline-block">{digit}</span>;

  return (
    <div className="relative h-[18px] w-[9px] overflow-hidden inline-block leading-none">
      <motion.div
        animate={{ y: -num * 18 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-0 left-0 flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[18px] flex items-center justify-center font-black">
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
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-body" dir="rtl">
      {/* Header Module */}
      <div className="flex items-center justify-between px-4">
        <div className="space-y-0.5 text-right">
          <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            مُفاعل النمو النشط
          </h3>
          <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest tracking-normal">Active Inflow Matrix</p>
        </div>
        <Badge className="bg-gray-100 text-[#002d4d] border-none font-black text-[7px] rounded-full px-3 py-1 shadow-inner">
          {investments.length} UNITS RUNNING
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayInvestments.map((inv, idx) => {
          const { percent, accrued } = getProgressData(inv.startTime, inv.endTime, inv.expectedProfit);
          const totalReturn = inv.amount + inv.expectedProfit;
          const accruedStr = accrued.toFixed(3);
          
          // Orbital Gauge Constants
          const radius = 36;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (percent / 100) * circumference;

          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-sm rounded-[36px] bg-white border border-gray-50 overflow-hidden relative group transition-all duration-500 hover:shadow-xl hover:border-blue-50">
                <CardContent className="p-5 flex items-center gap-5 relative z-10">
                  
                  {/* The Orbital Energy Gauge */}
                  <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
                    <svg className="h-full w-full transform -rotate-90">
                      {/* Background Rail */}
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-gray-50"
                      />
                      {/* Active Progress Path */}
                      <motion.circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                        className={cn(
                          "transition-colors duration-1000",
                          percent >= 100 ? "text-emerald-500" : "text-blue-600"
                        )}
                      />
                    </svg>
                    
                    {/* Center Icon Node */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className={cn(
                         "h-12 w-12 rounded-[18px] flex items-center justify-center shadow-inner transition-all duration-500",
                         percent >= 100 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                       )}>
                          <Zap size={20} className={cn(percent >= 100 && "fill-current animate-pulse")} />
                       </div>
                    </div>

                    {/* Progress Indicator Shimmer */}
                    {percent < 100 && (
                      <div className="absolute inset-0 rounded-full border border-blue-100 opacity-20 animate-ping" />
                    )}
                  </div>

                  {/* Identity & Yield Stream */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex justify-between items-start">
                       <div className="text-right">
                          <h4 className="font-black text-xs text-[#002d4d] leading-none tracking-tight truncate max-w-[120px]">{inv.planTitle}</h4>
                          <p className="text-[7px] font-bold text-gray-300 uppercase tracking-tighter mt-1">ID: {inv.id.slice(-6).toUpperCase()}</p>
                       </div>
                       <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[6px] px-1.5 py-0.5 rounded-md">
                          %{inv.profitPercent} YIELD
                       </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-10 bg-gray-50/80 rounded-2xl border border-gray-100 shadow-inner flex items-center justify-between px-4">
                          <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Live Stream</span>
                          <div className="flex items-center text-[15px] font-black text-emerald-600 tabular-nums tracking-tighter h-[18px]" dir="ltr">
                            <span className="mr-0.5">+</span>
                            <span className="mr-0.5 text-[10px] opacity-40">$</span>
                            {accruedStr.split("").map((char, i) => (
                              <AnimatedDigit key={i} digit={char} />
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Vertical Data Matrix */}
                  <div className="w-[80px] md:w-[100px] border-r border-gray-100 pr-4 space-y-3 shrink-0">
                     <div className="space-y-0.5">
                        <p className="text-[7px] font-black text-gray-300 uppercase leading-none">Capital</p>
                        <p className="text-[11px] font-black text-[#002d4d] tabular-nums">${inv.amount.toLocaleString()}</p>
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[7px] font-black text-gray-300 uppercase leading-none">Settlement</p>
                        <div className="flex items-center gap-1.5">
                           <Clock size={8} className="text-blue-400" />
                           <p className="text-[9px] font-bold text-[#002d4d] tabular-nums">{new Date(inv.endTime).toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric' })}</p>
                        </div>
                     </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-center pt-1">
         <Link href="/my-investments">
            <Button variant="ghost" className="h-10 px-8 rounded-full bg-white border border-gray-100 text-gray-400 font-black text-[9px] shadow-sm transition-all active:scale-95 group">
               سجل المفاعل الكامل 
               <ChevronLeft size={14} className="mr-2 transition-transform group-hover:-translate-x-1" />
            </Button>
         </Link>
      </div>
    </div>
  );
}
