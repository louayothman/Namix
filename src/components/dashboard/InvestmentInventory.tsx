
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock,
  ShieldCheck,
  ChevronLeft,
  Rocket,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO, differenceInMilliseconds } from "date-fns";
import Link from "next/link";
import React, { useMemo } from "react";
import { SafeInvestmentTrigger } from "./SafeInvestmentTrigger";

function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === "$" || digit === ",") return <span className="inline-block px-0.5">{digit}</span>;
  const num = parseInt(digit);
  if (isNaN(num)) return <span className="inline-block">{digit}</span>;
  return (
    <div className="relative h-[18px] w-[9px] overflow-hidden inline-block leading-none">
      <motion.div animate={{ y: -num * 18 }} transition={{ type: "spring", stiffness: 400, damping: 35 }} className="absolute top-0 left-0 flex flex-col items-center">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[18px] flex items-center justify-center font-normal text-white">{n}</div>
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
  const displayInvestments = useMemo(() => {
    if (!investments) return [];
    return investments.filter(inv => {
      // إظهار العقود النشطة فقط (والتي ستبقى نشطة لـ 5 ثوانٍ بعد انتهائها بسبب تأخير المعالجة)
      if (inv.status === 'active') return true;
      return false;
    }).slice(0, 5);
  }, [investments, now]);

  if (isLoading) return null;
  if (!investments || displayInvestments.length === 0) return <SafeInvestmentTrigger />;

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
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between px-4">
        <div className="space-y-0.5 text-right">
          <h3 className="text-sm font-normal text-[#002d4d] flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
            محرك النمو النشط
          </h3>
          <p className="text-[8px] text-gray-400 uppercase tracking-widest">Active Growth Matrix</p>
        </div>
        <Badge className="bg-gray-100 text-[#002d4d] border-none font-normal text-[8px] rounded-full px-3 py-1">
          {displayInvestments.length} وحدات تشغيلية
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {displayInvestments.map((inv) => {
            const { percent, accrued } = getProgressData(inv.startTime, inv.endTime, inv.expectedProfit);
            const isCompleted = percent >= 100;
            const accruedStr = accrued.toFixed(3);
            const circumference = 2 * Math.PI * 36;
            const strokeDashoffset = circumference - (percent / 100) * circumference;

            return (
              <motion.div key={inv.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                <Card className={cn("border-none shadow-xl rounded-[36px] bg-[#8899AA] text-white overflow-hidden relative group")}>
                  <CardContent className="p-5 flex items-center gap-5 relative z-10">
                    <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="3" fill="transparent" className="opacity-10" />
                        <motion.circle cx="40" cy="40" r="36" stroke={isCompleted ? "#10b981" : "#f9a885"} strokeWidth="3" fill="transparent" strokeDasharray={circumference} animate={{ strokeDashoffset }} transition={{ duration: 1 }} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                         {isCompleted ? <CheckCircle2 size={28} className="text-emerald-400" /> : <Rocket size={26} className="text-white transform -rotate-45" />}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2.5 min-w-0">
                      <div className="text-right">
                        <h4 className="text-[13px] font-normal truncate max-w-[140px] text-white">{inv.planTitle}</h4>
                        <p className="text-[8px] text-white/40 uppercase mt-1">المعرف: {inv.id.slice(-6).toUpperCase()}</p>
                      </div>
                      <div className="flex-1 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between px-4">
                        <span className="text-[8px] text-white/40 uppercase">عائد %{inv.profitPercent}</span>
                        <div className="flex items-center text-[15px] font-normal tabular-nums tracking-tighter" dir="ltr">
                          <span className="mr-0.5">+</span>
                          <span className="mr-0.5 text-[10px] opacity-40">$</span>
                          {accruedStr.split("").map((char, i) => <AnimatedDigit key={i} digit={char} />)}
                        </div>
                      </div>
                    </div>

                    <div className="w-[85px] md:w-[110px] border-r border-white/10 pr-4 space-y-3 shrink-0">
                       <div className="space-y-0.5">
                          <p className="text-[8px] text-white/30 uppercase">رأس المال</p>
                          <p className="text-[11px] font-normal text-white tabular-nums">${inv.amount.toLocaleString()}</p>
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[8px] text-[#f9a885]/60 uppercase">صافي الربح</p>
                          <p className="text-[11px] font-normal text-[#f9a885] tabular-nums">${inv.expectedProfit.toLocaleString()}</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
         <Link href="/my-investments">
            <button className="h-10 px-8 rounded-full bg-white border border-gray-100 text-gray-400 font-normal text-[10px] shadow-sm transition-all active:scale-95 flex items-center gap-2">
               سجل المحرك الكامل 
               <ChevronLeft size={14} />
            </button>
         </Link>
      </div>
    </div>
  );
}
