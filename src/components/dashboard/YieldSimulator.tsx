
"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Car, 
  Plane, 
  Briefcase, 
  Zap, 
  Target, 
  ShieldCheck, 
  ChevronLeft,
  Ship,
  Gem,
  Award,
  Plus,
  Minus,
  TrendingUp
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
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة المطور
 * تم إضافة select-none ومنع الأحداث لمنع ظهور التحديد الأزرق أو الكرسر.
 */
function AnimatedDigit({ digit, colorClass = "text-[#002d4d]" }: { digit: string, colorClass?: string }) {
  const isNumber = !isNaN(parseInt(digit)) && isFinite(Number(digit));
  
  if (!isNumber) {
    return <span className={cn("inline-block px-0.5 align-baseline select-none", colorClass)}>{digit}</span>;
  }
  
  const num = parseInt(digit);
  
  return (
    <div className="relative h-[1.2em] w-[0.6em] overflow-hidden inline-flex flex-col select-none pointer-events-none align-baseline leading-none">
      <motion.div
        animate={{ y: `-${num * 10}%` }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="flex flex-col items-center w-full h-[1000%] absolute top-0 left-0"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className={cn("h-[10%] flex items-center justify-center font-black w-full", colorClass)}>
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function YieldSimulator({ marketingConfig, calcAmount, onAmountChange, onIncrement, onDecrement }: YieldSimulatorProps) {
  const router = useRouter();
  const ratio = marketingConfig?.simulatorRatio || 45;
  const amountValue = parseInt(calcAmount || "0");
  const goals = useMemo(() => marketingConfig?.simulatorGoals || [], [marketingConfig]);

  const { monthlyProfit, annualProfit } = useMemo(() => {
    const monthly = (amountValue * ratio) / 100;
    return {
      monthlyProfit: Math.floor(monthly),
      annualProfit: Math.floor(monthly * 12)
    };
  }, [amountValue, ratio]);

  const getIcon = useCallback((iconName: string, size = 12) => {
    const iconMap: Record<string, any> = { Plane, Car, Briefcase, Home, Target, Ship, Gem, Award };
    const IconComp = iconMap[iconName] || Target;
    return <IconComp size={size} />;
  }, []);

  return (
    <div className="relative py-1 font-body tracking-normal select-none" dir="rtl">
      <Card className="border-none shadow-xl rounded-[40px] bg-white overflow-hidden border border-gray-100 relative group flex flex-col max-w-2xl mx-auto">
        
        {/* Header - Compact Internal */}
        <div className="px-6 pt-5 pb-1 flex items-center justify-between relative z-30">
           <div className="space-y-0 text-right">
              <div className="flex items-center gap-2 text-blue-500 font-black text-[7px] uppercase tracking-normal">
                <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                Yield Simulation
              </div>
              <h3 className="text-sm font-black text-[#002d4d] tracking-normal">محاكي التوقع الرقمي</h3>
           </div>
           <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[6px] px-2 py-0.5 rounded-full">V22.0</Badge>
        </div>

        {/* Output Section - Side-by-Side Result Matrix */}
        <div className="px-6 py-3 grid grid-cols-2 gap-3 relative z-10 border-b border-gray-50">
           {/* Monthly Flow Node */}
           <div className="p-3 bg-gray-50/50 rounded-[24px] border border-gray-100 shadow-inner flex flex-col items-center text-center space-y-0.5">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none">التدفق الشهري</p>
              <div className="flex items-center text-xl font-black text-blue-600 tabular-nums tracking-tighter h-[1.2em] leading-none" dir="ltr">
                 <span className="text-xs mr-0.5 opacity-30 select-none">$</span>
                 {monthlyProfit.toLocaleString().split("").map((char, i) => (
                   <AnimatedDigit key={i} digit={char} colorClass="text-blue-600" />
                 ))}
              </div>
           </div>

           {/* Annual Yield Node */}
           <div className="p-3 bg-emerald-50/30 rounded-[24px] border border-emerald-100/20 shadow-inner flex flex-col items-center text-center space-y-0.5">
              <p className="text-[7px] font-black text-emerald-600/40 uppercase tracking-widest leading-none">العائد السنوي</p>
              <div className="flex items-center text-xl font-black text-emerald-600 tabular-nums tracking-tighter h-[1.2em] leading-none" dir="ltr">
                 <span className="text-xs mr-0.5 opacity-30 select-none">$</span>
                 {annualProfit.toLocaleString().split("").map((char, i) => (
                   <AnimatedDigit key={i} digit={char} colorClass="text-emerald-600" />
                 ))}
              </div>
           </div>
        </div>

        {/* Goals Grid - Ultra Dense for No-Scroll Mobile */}
        <div className="px-6 py-2.5 bg-white relative z-20 border-b border-gray-50 overflow-x-auto scrollbar-none">
           <div className="flex items-center justify-between gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-8">
              {goals.map((goal: any) => {
                const isReached = annualProfit >= goal.target;
                return (
                  <div key={goal.id} className="flex flex-col items-center gap-1 shrink-0">
                     <div className={cn(
                       "h-7 w-7 rounded-[12px] flex items-center justify-center transition-all duration-700",
                       isReached ? "bg-[#f9a885] text-[#002d4d] shadow-md" : "bg-gray-50 text-gray-200 opacity-30"
                     )}>
                        {getIcon(goal.icon, 12)}
                     </div>
                     <p className={cn("text-[5px] font-black uppercase text-center leading-none tracking-normal", isReached ? "text-[#002d4d]" : "text-gray-300")}>
                        {goal.labelAr}
                     </p>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Input Control Section - Dark Base */}
        <div className="p-5 bg-[#002d4d] text-white relative z-30 shrink-0">
           <div className="max-w-sm mx-auto space-y-4">
              <div className="text-center space-y-1.5">
                 <Label className="text-[8px] font-black text-blue-200/30 uppercase tracking-widest">حقن رأس المال (Capital)</Label>
                 <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={onDecrement}
                      className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 transition-all active:scale-90 outline-none"
                    >
                       <Minus size={14} />
                    </button>
                    
                    <div className="flex items-center text-3xl font-black tabular-nums tracking-tighter h-[1.2em] leading-none select-none" dir="ltr">
                       <span className="text-lg font-bold text-[#f9a885] mr-1">$</span>
                       {amountValue.toLocaleString().split("").map((char, i) => (
                         <AnimatedDigit key={i} digit={char} colorClass="text-white" />
                       ))}
                    </div>

                    <button 
                      onClick={onIncrement}
                      className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#f9a885] hover:text-[#002d4d] transition-all active:scale-90 outline-none"
                    >
                       <Plus size={14} />
                    </button>
                 </div>
              </div>

              <div className="flex flex-row items-center justify-between gap-3">
                 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/5">
                    <ShieldCheck size={10} className="text-emerald-400" />
                    <span className="text-[6.5px] font-black text-blue-100/40 uppercase tracking-normal">Secured Protocol</span>
                 </div>
                 <Button 
                   onClick={() => router.push('/invest')}
                   className="h-10 px-6 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[9px] shadow-xl active:scale-95 transition-all group"
                 >
                    بدء التشغيل
                    <ChevronLeft className="mr-1 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                 </Button>
              </div>
           </div>
        </div>

      </Card>
    </div>
  );
}
