
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock,
  ShieldCheck,
  ChevronLeft,
  TrendingUp,
  Rocket,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO, differenceInMilliseconds } from "date-fns";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

/**
 * @fileOverview مُفاعل مدار الطاقة v20.0 - Rocket Pulse Edition
 * تحويل الأيقونات لصاروخ تكنولوجي بألوان المحفظة الموحدة.
 * تنفيذ بروتوكول التلاشي الزمني (30 ثانية) للعقود المكتملة مع إشارات بصرية حيوية.
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
  // تصفية الاستثمارات: عرض النشطة + المكتملة منذ أقل من 30 ثانية
  const displayInvestments = useMemo(() => {
    if (!investments) return [];
    return investments.filter(inv => {
      if (inv.status === 'active') return true;
      if (inv.status === 'completed' && inv.completedAt) {
        const completedTime = new Date(inv.completedAt).getTime();
        const diffSeconds = (now.getTime() - completedTime) / 1000;
        return diffSeconds >= 0 && diffSeconds <= 30; // بروتوكول الـ 30 ثانية
      }
      return false;
    }).slice(0, 5); // عرض أفضل 5 وحدات
  }, [investments, now]);

  if (isLoading || !investments || displayInvestments.length === 0) {
    return null;
  }

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
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse shadow-[0_0_8px_#f9a885]" />
            مُفاعل النمو النشط
          </h3>
          <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest tracking-normal">Active Rocket Matrix</p>
        </div>
        <Badge className="bg-gray-100 text-[#002d4d] border-none font-black text-[7px] rounded-full px-3 py-1 shadow-inner">
          {displayInvestments.filter(i => i.status === 'active').length} UNITS RUNNING
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {displayInvestments.map((inv, idx) => {
            const { percent, accrued } = getProgressData(inv.startTime, inv.endTime, inv.expectedProfit);
            const isCompleted = inv.status === 'completed';
            const accruedStr = isCompleted ? inv.expectedProfit.toFixed(3) : accrued.toFixed(3);
            
            const radius = 36;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (isCompleted ? 1 : percent / 100) * circumference;

            return (
              <motion.div
                key={inv.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                transition={{ duration: 0.5 }}
              >
                <Card className={cn(
                  "border-none shadow-sm rounded-[36px] bg-white border border-gray-50 overflow-hidden relative group transition-all duration-500 hover:shadow-xl",
                  isCompleted ? "border-emerald-100 bg-emerald-50/10" : "hover:border-blue-50"
                )}>
                  <CardContent className="p-5 flex items-center gap-5 relative z-10">
                    
                    {/* The Orbital Energy Gauge */}
                    <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke="#8899AA"
                          strokeWidth="4"
                          fill="transparent"
                          className="opacity-10"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke={isCompleted ? "#10b981" : "#f9a885"}
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={circumference}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Center Icon Node - Rocket with Bobbing Animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className={cn(
                           "h-12 w-12 rounded-[18px] flex items-center justify-center shadow-inner transition-all duration-500",
                           isCompleted ? "bg-emerald-50 text-emerald-600" : "bg-[#8899AA] text-white"
                         )}>
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                              >
                                <CheckCircle2 size={24} />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                              >
                                <Rocket size={22} className="transform -rotate-45" />
                              </motion.div>
                            )}
                         </div>
                      </div>

                      {/* Completion Pulse */}
                      {isCompleted && (
                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                      )}
                    </div>

                    {/* Identity & Yield Stream */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex justify-between items-start">
                         <div className="text-right">
                            <h4 className={cn("font-black text-xs leading-none tracking-tight truncate max-w-[120px]", isCompleted ? "text-emerald-700" : "text-[#002d4d]")}>
                              {inv.planTitle}
                            </h4>
                            <p className="text-[7px] font-bold text-gray-300 uppercase tracking-tighter mt-1">NODE: {inv.id.slice(-6).toUpperCase()}</p>
                         </div>
                         {isCompleted ? (
                           <motion.div 
                             animate={{ scale: [1, 1.1, 1] }}
                             transition={{ repeat: Infinity, duration: 1.5 }}
                             className="bg-emerald-500 text-white font-black text-[7px] px-2 py-0.5 rounded-md shadow-lg shadow-emerald-900/20"
                           >
                              COMPLETE
                           </motion.div>
                         ) : (
                           <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[6px] px-1.5 py-0.5 rounded-md">
                              %{inv.profitPercent} YIELD
                           </Badge>
                         )}
                      </div>

                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "flex-1 h-10 rounded-2xl border shadow-inner flex items-center justify-between px-4 transition-colors",
                           isCompleted ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50/80 border-gray-100"
                         )}>
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">
                              {isCompleted ? "Total Yield" : "Live Stream"}
                            </span>
                            <div className={cn("flex items-center text-[15px] font-black tabular-nums tracking-tighter h-[18px]", isCompleted ? "text-emerald-600" : "text-[#f9a885]")} dir="ltr">
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
                          <p className="text-[7px] font-black text-gray-400 uppercase leading-none">Status</p>
                          <div className="flex items-center gap-1.5">
                             {isCompleted ? (
                               <Activity size={8} className="text-emerald-500" />
                             ) : (
                               <Clock size={8} className="text-blue-400" />
                             )}
                             <p className={cn("text-[9px] font-bold tabular-nums", isCompleted ? "text-emerald-600" : "text-[#002d4d]")}>
                               {isCompleted ? "Matured" : "Running"}
                             </p>
                          </div>
                       </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-center pt-1">
         <Link href="/my-investments">
            <button className="h-10 px-8 rounded-full bg-white border border-gray-100 text-gray-400 font-black text-[9px] shadow-sm transition-all active:scale-95 group">
               سجل المفاعل الكامل 
               <ChevronLeft size={14} className="mr-2 transition-transform group-hover:-translate-x-1" />
            </button>
         </Link>
      </div>
    </div>
  );
}
