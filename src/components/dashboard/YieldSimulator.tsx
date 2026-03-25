
"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Car, 
  Plane, 
  Briefcase, 
  Zap, 
  Sparkles,
  ChevronUp,
  ChevronDown,
  Target,
  ShieldCheck,
  ChevronLeft,
  Ship,
  Gem,
  Award,
  Repeat,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface YieldSimulatorProps {
  marketingConfig: any;
  calcAmount: string;
  onAmountChange: (val: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة - مُميز بـ Memo لمنع الرندر غير الضروري
 */
const AnimatedDigit = React.memo(({ digit }: { digit: string }) => {
  if (digit === "." || digit === "$" || digit === ",") {
    return <span className="inline-block px-0.5">{digit}</span>;
  }
  const num = parseInt(digit);
  if (isNaN(num)) return <span className="inline-block">{digit}</span>;
  return (
    <div className="relative h-[20px] w-[10px] overflow-hidden inline-block leading-none">
      <motion.div
        animate={{ y: -num * 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-0 left-0 flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[20px] flex items-center justify-center font-black">
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
});

AnimatedDigit.displayName = "AnimatedDigit";

/**
 * @fileOverview محاكي النمو الاستراتيجي v17.0 - Optimized Computation Engine
 */
export function YieldSimulator({ marketingConfig, calcAmount, onAmountChange, onIncrement, onDecrement }: YieldSimulatorProps) {
  const router = useRouter();
  const ratio = marketingConfig?.simulatorRatio || 45;
  const amount = parseInt(calcAmount || "0");

  const goals = useMemo(() => marketingConfig?.simulatorGoals || [], [marketingConfig]);

  // فصل العمليات الحسابية عن الرندر الرئيسي
  const { monthlyProfit, annualProfit } = useMemo(() => {
    const monthly = (amount * ratio) / 100;
    return {
      monthlyProfit: monthly,
      annualProfit: monthly * 12
    };
  }, [amount, ratio]);

  const handleGoalClick = useCallback((planId: string) => {
    if (planId && planId !== "none") {
      router.push(`/invest?planId=${planId}`);
    } else {
      router.push('/invest');
    }
  }, [router]);

  const getIcon = useCallback((iconName: string, size = 14) => {
    const iconMap: Record<string, any> = { Plane, Car, Briefcase, Home, Target, Ship, Gem, Award };
    const IconComp = iconMap[iconName] || Target;
    return <IconComp size={size} />;
  }, []);

  return (
    <div className="relative py-1 font-body" dir="rtl">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="space-y-0">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[8px] uppercase">
            <Sparkles className="h-2.5 w-2.5 text-[#f9a885]" />
            Sovereign Yield Engine
          </div>
          <h3 className="text-[13px] font-black text-[#002d4d] leading-none">محاكي النمو الاستراتيجي</h3>
        </div>
        <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[6.5px] px-2 py-0.5 rounded-full shadow-sm">
          Precision V17.0
        </Badge>
      </div>

      <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] rounded-[48px] bg-white overflow-hidden border border-gray-50">
        <CardContent className="p-0 flex flex-col">
          <div className="p-5 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-5 space-y-2">
                 <div className="flex items-center gap-2 pr-2">
                    <p className="text-[7.5px] font-black text-gray-300 uppercase leading-none">رأس المال المستثمر</p>
                    <div className="h-[0.5px] flex-1 bg-gray-50" />
                 </div>
                 <div className="flex items-center justify-between bg-gray-50/80 rounded-[20px] p-1 border border-gray-100 shadow-inner">
                    <button onClick={onDecrement} className="h-9 w-9 rounded-[16px] bg-white text-[#002d4d] flex items-center justify-center border border-gray-100 shadow-sm active:scale-90 transition-all"><ChevronDown size={14} /></button>
                    <div className="flex items-baseline gap-1 px-2">
                      <span className="text-[#f9a885] text-[10px] font-bold">$</span>
                      <span className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">{amount.toLocaleString()}</span>
                    </div>
                    <button onClick={onIncrement} className="h-9 w-9 rounded-[16px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl active:scale-90 transition-all"><ChevronUp size={14} /></button>
                 </div>
              </div>

              <div className="md:col-span-7">
                 <div className="p-1 bg-gray-50/50 rounded-[28px] border border-gray-100 shadow-inner text-center py-3">
                    <p className="text-[8px] font-black text-[#002d4d]/40 uppercase mb-2">العائد المتوقع</p>
                    <div className="flex items-center justify-around">
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-[7.5px] font-black text-gray-400 uppercase">شهرياً</span>
                          <div className="flex items-center text-lg font-black text-[#002d4d] tabular-nums tracking-tighter h-[20px]" dir="ltr">
                            <span>+</span><span>$</span>
                            {monthlyProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }).split("").map((char, i) => <AnimatedDigit key={i} digit={char} />)}
                          </div>
                       </div>
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-[7.5px] font-black text-gray-400 uppercase">سنوياً</span>
                          <div className="flex items-center text-lg font-black text-emerald-600 tabular-nums tracking-tighter h-[20px]" dir="ltr">
                            <span>+</span><span>$</span>
                            {annualProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }).split("").map((char, i) => <AnimatedDigit key={i} digit={char} />)}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <span className="text-[7.5px] font-black text-gray-300 uppercase">أهداف استراتيجية مقترحة</span>
                 <Repeat size={9} className="text-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal: any) => {
                  const monthsNeeded = monthlyProfit > 0 ? Math.ceil(goal.target / monthlyProfit) : 0;
                  return (
                    <button 
                      key={goal.id} 
                      onClick={() => handleGoalClick(goal.linkedPlanId)}
                      className="bg-gray-50/40 border border-gray-100 rounded-[28px] p-4 flex flex-col items-start justify-between transition-all relative overflow-hidden text-right group h-[95px] active:scale-95"
                    >
                      <div className="absolute -bottom-4 -left-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 text-[#002d4d]">{getIcon(goal.icon, 85)}</div>
                      <div className="relative z-10 w-full space-y-0.5">
                         <h4 className="font-black text-[11px] text-[#002d4d] leading-none group-hover:text-blue-600 transition-colors">{goal.labelAr}</h4>
                         <p className="text-[10px] font-bold text-[#f9a885] tabular-nums tracking-tighter">${goal.target.toLocaleString()}</p>
                      </div>
                      <div className="relative z-10 flex items-center gap-1.5 text-gray-400">
                         <Clock size={10} className="opacity-40" />
                         <p className="text-[9px] font-black tabular-nums leading-none">{monthsNeeded || "—"} <span className="text-[7px] opacity-60">شهر</span></p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-[#002d4d] p-6 relative overflow-hidden">
             <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-3 text-right">
                   <div className="h-10 w-10 rounded-[16px] bg-white/10 flex items-center justify-center border border-white/20 shadow-inner"><ShieldCheck size={20} className="text-[#f9a885]" /></div>
                   <div className="space-y-0">
                      <p className="text-xs font-black text-white leading-none">بروتوكول ناميكس المعتمد</p>
                      <p className="text-[7px] font-bold text-blue-200/40 uppercase mt-1">Calibration Ratio: %{ratio}</p>
                   </div>
                </div>
                <Button onClick={() => router.push('/invest')} className="w-full sm:w-auto h-12 rounded-full bg-white text-[#002d4d] hover:bg-[#f9a885] font-black text-[11px] shadow-2xl active:scale-95 transition-all group px-8">
                  تفعيل العقد الاستراتيجي <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
