
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
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO, differenceInMilliseconds } from "date-fns";
import Link from "next/link";
import React, { useMemo } from "react";
import { SafeInvestmentTrigger } from "./SafeInvestmentTrigger";

/**
 * @fileOverview مُفاعل الصواريخ النخبوية v3.0 - Blue Gray Edition
 * تصميم مطور يعتمد على لون المحفظة الموحد (#8899AA) مع صاروخ عائم بدون خلفية.
 * تم إضافة "دليل الاستثمار الآمن" في حال عدم وجود عقود نشطة.
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
          <div key={n} className="h-[18px] flex items-center justify-center font-black text-white">
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
        return diffSeconds >= 0 && diffSeconds <= 30;
      }
      return false;
    }).slice(0, 5);
  }, [investments, now]);

  if (isLoading) {
    return null;
  }

  // إذا لم يكن هناك عقود نشطة، اعرض زر دليل الاستثمار الآمن
  if (!investments || displayInvestments.length === 0) {
    return <SafeInvestmentTrigger />;
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
          <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2 tracking-normal">
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse shadow-[0_0_8px_#f9a885]" />
            مُفاعل النمو النشط
          </h3>
          <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest tracking-normal">Active Rocket Matrix</p>
        </div>
        <Badge className="bg-gray-100 text-[#002d4d] border-none font-black text-[7px] rounded-full px-3 py-1 shadow-inner tracking-normal">
          {displayInvestments.filter(i => i.status === 'active').length} UNITS RUNNING
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {displayInvestments.map((inv) => {
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
                  "border-none shadow-xl rounded-[36px] bg-[#8899AA] text-white overflow-hidden relative group transition-all duration-500",
                  isCompleted && "ring-2 ring-emerald-400/30"
                )}>
                  
                  {/* Watermark Background */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                     <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 text-[120px] font-black italic tracking-tighter">iX</div>
                  </div>

                  <CardContent className="p-5 flex items-center gap-5 relative z-10">
                    
                    {/* The Orbital Energy Gauge */}
                    <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke="white"
                          strokeWidth="3"
                          fill="transparent"
                          className="opacity-10"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke={isCompleted ? "#10b981" : "#f9a885"}
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={circumference}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Rocket Icon Node - NO BACKGROUND */}
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="flex items-center justify-center transition-all duration-500">
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                              >
                                <CheckCircle2 size={28} />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                              >
                                <Rocket size={26} className="transform -rotate-45" />
                              </motion.div>
                            )}
                         </div>
                      </div>
                    </div>

                    {/* Identity & Yield Stream */}
                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div className="flex justify-between items-start">
                         <div className="text-right pt-1">
                            <h4 className="font-black text-[13px] leading-tight tracking-normal truncate max-w-[140px] text-white">
                              {inv.planTitle}
                            </h4>
                            <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mt-1 tracking-normal">NODE: {inv.id.slice(-6).toUpperCase()}</p>
                         </div>
                         {isCompleted && (
                           <motion.div 
                             animate={{ scale: [1, 1.1, 1] }}
                             transition={{ repeat: Infinity, duration: 1.5 }}
                             className="bg-emerald-500 text-white font-black text-[7px] px-2 py-0.5 rounded-md shadow-lg shadow-emerald-900/30 tracking-normal"
                           >
                              COMPLETE
                           </motion.div>
                         )}
                      </div>

                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "flex-1 h-10 rounded-2xl border shadow-inner flex items-center justify-between px-4 transition-colors",
                           isCompleted ? "bg-emerald-500/20 border-emerald-400/30" : "bg-white/5 border-white/10"
                         )}>
                            <span className="text-[7.5px] font-black text-white/40 uppercase tracking-widest tracking-normal">
                              {inv.profitPercent}% Yield
                            </span>
                            <div className={cn("flex items-center text-[15px] font-black tabular-nums tracking-tighter h-[18px]", isCompleted ? "text-emerald-400" : "text-[#f9a885]")} dir="ltr">
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
                    <div className="w-[85px] md:w-[110px] border-r border-white/10 pr-4 space-y-3 shrink-0">
                       <div className="space-y-0.5">
                          <p className="text-[7px] font-black text-white/30 uppercase leading-none tracking-normal">Capital</p>
                          <p className="text-[11px] font-black text-white tabular-nums tracking-normal">${inv.amount.toLocaleString()}</p>
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[7px] font-black text-[#f9a885]/60 uppercase leading-none tracking-normal">Net Profit</p>
                          <p className="text-[11px] font-black text-[#f9a885] tabular-nums tracking-normal">${inv.expectedProfit.toLocaleString()}</p>
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[7px] font-black text-white/30 uppercase leading-none tracking-normal">Status</p>
                          <div className="flex items-center gap-1.5">
                             {isCompleted ? (
                               <Activity size={8} className="text-emerald-400" />
                             ) : (
                               <Clock size={8} className="text-white/40" />
                             )}
                             <p className={cn("text-[9px] font-bold tabular-nums tracking-normal", isCompleted ? "text-emerald-400" : "text-white")}>
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
            <button className="h-10 px-8 rounded-full bg-white border border-gray-100 text-gray-400 font-black text-[9px] shadow-sm transition-all active:scale-95 group tracking-normal">
               سجل المفاعل الكامل 
               <ChevronLeft size={14} className="mr-2 transition-transform group-hover:-translate-x-1" />
            </button>
         </Link>
      </div>
    </div>
  );
}
