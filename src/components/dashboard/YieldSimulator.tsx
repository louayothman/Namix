
"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
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
  Sparkles,
  Target,
  ShieldCheck,
  ChevronLeft,
  Ship,
  Gem,
  Award,
  Plus,
  Minus,
  TrendingUp,
  Cpu,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface YieldSimulatorProps {
  marketingConfig: any;
  calcAmount: string;
  onAmountChange: (val: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة بدقة نانوية
 */
function AnimatedDigit({ digit, colorClass = "text-white" }: { digit: string, colorClass?: string }) {
  if (digit === "." || digit === "$" || digit === ",") {
    return <span className={cn("inline-block px-0.5", colorClass)}>{digit}</span>;
  }
  const num = parseInt(digit);
  if (isNaN(num)) return <span className={cn("inline-block", colorClass)}>{digit}</span>;
  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden inline-block leading-none">
      <motion.div
        animate={{ y: -num * 100 + "%" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute top-0 left-0 flex flex-col items-center w-full h-[1000%]"
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

/**
 * NebulaEffect - سديم البيانات الضوئي
 */
const NebulaEffect = ({ intensity }: { intensity: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ duration: 20 / intensity, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-blue-500/20 rounded-full blur-[100px]" 
    />
    <motion.div 
      animate={{ 
        scale: [1.2, 1, 1.2],
        rotate: [360, 270, 180, 90, 0],
        opacity: [0.2, 0.5, 0.2]
      }}
      transition={{ duration: 25 / intensity, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-20%] left-[-10%] w-[100%] h-[100%] bg-[#f9a885]/20 rounded-full blur-[100px]" 
    />
  </div>
);

export function YieldSimulator({ marketingConfig, calcAmount, onAmountChange, onIncrement, onDecrement }: YieldSimulatorProps) {
  const router = useRouter();
  const ratio = marketingConfig?.simulatorRatio || 45;
  const amountValue = parseInt(calcAmount || "0");
  
  const intensity = useMemo(() => Math.max(1, amountValue / 1000), [amountValue]);
  const goals = useMemo(() => marketingConfig?.simulatorGoals || [], [marketingConfig]);

  const { monthlyProfit, annualProfit } = useMemo(() => {
    const monthly = (amountValue * ratio) / 100;
    return {
      monthlyProfit: Math.floor(monthly),
      annualProfit: Math.floor(monthly * 12)
    };
  }, [amountValue, ratio]);

  const getIcon = useCallback((iconName: string, size = 14) => {
    const iconMap: Record<string, any> = { Plane, Car, Briefcase, Home, Target, Ship, Gem, Award };
    const IconComp = iconMap[iconName] || Target;
    return <IconComp size={size} />;
  }, []);

  return (
    <div className="relative py-4 font-body tracking-normal" dir="rtl">
      <Card className="border-none shadow-2xl rounded-[64px] bg-white overflow-hidden border border-gray-100 relative group min-h-[650px] flex flex-col">
        
        {/* INTERNAL HEADER - الصغير والمدمج */}
        <div className="px-10 pt-10 pb-2 flex items-center justify-between relative z-30 bg-transparent">
           <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-normal">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Growth Prediction Terminal
              </div>
              <h3 className="text-xl font-black text-[#002d4d] tracking-normal">محاكي التوقع الرقمي</h3>
           </div>
           <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner">LIVE ENGINE</Badge>
        </div>

        {/* UPPER: The Hologram Area - عرض العوائد جنباً إلى جنب */}
        <div className="relative flex-1 p-8 flex flex-col items-center justify-center overflow-hidden border-b border-gray-50 bg-gradient-to-b from-gray-50/20 to-white">
           <NebulaEffect intensity={intensity} />
           
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-t from-blue-500/10 via-blue-500/5 to-transparent blur-[40px] opacity-40 pointer-events-none" />

           <div className="relative z-10 flex flex-col items-center gap-12 w-full">
              
              {/* Results Matrix - الجريان الجانبي */}
              <div className="grid grid-cols-2 gap-8 md:gap-20 w-full max-w-2xl px-4">
                 
                 {/* Monthly Flow Node */}
                 <div className="flex flex-col items-center text-center space-y-3 group/node">
                    <p className="text-[9px] font-black text-blue-600/40 uppercase tracking-widest leading-none">التدفق الشهري</p>
                    <div className="flex items-center text-3xl md:text-5xl font-black text-blue-600 tabular-nums tracking-tighter drop-shadow-[0_10px_20px_rgba(59,130,246,0.1)] h-[1.2em]" dir="ltr">
                       <span className="text-xl mr-1.5 opacity-30">$</span>
                       {monthlyProfit.toLocaleString().split("").map((char, i) => (
                         <AnimatedDigit key={i} digit={char} colorClass="text-blue-600" />
                       ))}
                    </div>
                    <div className="h-0.5 w-8 bg-blue-100 rounded-full group-hover/node:w-16 transition-all duration-700" />
                 </div>

                 {/* Annual Yield Node */}
                 <div className="flex flex-col items-center text-center space-y-3 group/node">
                    <p className="text-[9px] font-black text-emerald-600/40 uppercase tracking-widest leading-none">العائد السنوي</p>
                    <div className="flex items-center text-3xl md:text-5xl font-black text-emerald-600 tabular-nums tracking-tighter drop-shadow-[0_10px_20px_rgba(16,185,129,0.1)] h-[1.2em]" dir="ltr">
                       <span className="text-xl mr-1.5 opacity-30">$</span>
                       {annualProfit.toLocaleString().split("").map((char, i) => (
                         <AnimatedDigit key={i} digit={char} colorClass="text-emerald-600" />
                       ))}
                    </div>
                    <div className="h-0.5 w-8 bg-emerald-100 rounded-full group-hover/node:w-16 transition-all duration-700" />
                 </div>

              </div>

              {/* Dynamic Spark Label */}
              <div className="flex items-center gap-3 px-6 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-lg">
                 <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </div>
                 <span className="text-[10px] font-black text-[#002d4d] tracking-normal">عوائد تشغيلية مبنية على كفاءة المحرك</span>
              </div>
           </div>
        </div>

        {/* MIDDLE: Goal Hub - مصفوفة الأهداف */}
        <div className="px-8 md:px-12 py-8 bg-white relative z-20 border-b border-gray-50">
           <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {goals.map((goal: any) => {
                const isReached = annualProfit >= goal.target;
                return (
                  <div key={goal.id} className="flex flex-col items-center gap-3 group/goal">
                     <motion.div 
                       animate={isReached ? { 
                         scale: [1, 1.1, 1],
                         boxShadow: ["0 0 0px #f9a885", "0 0 20px #f9a885", "0 0 0px #f9a885"]
                       } : {}}
                       transition={{ duration: 2, repeat: Infinity }}
                       className={cn(
                         "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-700",
                         isReached ? "bg-[#f9a885] text-[#002d4d] shadow-lg" : "bg-gray-50 text-gray-200 opacity-40 grayscale"
                       )}
                     >
                        {getIcon(goal.icon, 20)}
                     </motion.div>
                     <p className={cn("text-[7px] font-black uppercase text-center leading-none tracking-normal", isReached ? "text-[#002d4d]" : "text-gray-300")}>
                        {goal.labelAr}
                     </p>
                  </div>
                );
              })}
           </div>
        </div>

        {/* BOTTOM: The Control Base - التحكم برأس المال مع عداد منزلق */}
        <div className="p-8 md:p-12 bg-[#002d4d] text-white relative z-30 shrink-0">
           <div className="max-w-md mx-auto space-y-10">
              <div className="text-center space-y-4">
                 <Label className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">حقن رأس المال (Capital Injection)</Label>
                 <div className="flex items-center justify-center gap-8">
                    <motion.button 
                      whileTap={{ scale: 0.8 }} 
                      onClick={onDecrement}
                      className="h-14 w-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 transition-all shadow-xl active:scale-90 outline-none"
                    >
                       <Minus size={24} />
                    </motion.button>
                    
                    <div className="flex-1 flex flex-col items-center justify-center">
                       <div className="flex items-center text-5xl font-black tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(249,168,133,0.3)] h-[1.2em]" dir="ltr">
                          <span className="text-2xl font-bold text-[#f9a885] mr-2">$</span>
                          {amountValue.toLocaleString().split("").map((char, i) => (
                            <AnimatedDigit key={i} digit={char} colorClass="text-white" />
                          ))}
                       </div>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.8 }} 
                      onClick={onIncrement}
                      className="h-14 w-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#f9a885] hover:text-[#002d4d] transition-all shadow-xl active:scale-90 outline-none"
                    >
                       <Plus size={24} />
                    </motion.button>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                 <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-[20px] border border-white/5 backdrop-blur-md">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span className="text-[9px] font-black text-blue-100/60 uppercase tracking-normal">Capital Guard Active</span>
                 </div>
                 <Button 
                   onClick={() => router.push('/invest')}
                   className="w-full sm:w-auto h-14 px-10 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-xs shadow-2xl active:scale-95 transition-all group"
                 >
                    انطلق لمختبر العقود
                    <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                 </Button>
              </div>
           </div>
        </div>

      </Card>

      {/* Global Brand Footer */}
      <div className="mt-8 flex flex-col items-center gap-4 opacity-20 select-none pb-4">
         <p className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.8em] mr-[-0.8em]">Namix Simulation Hub v20.0</p>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
         </div>
      </div>
    </div>
  );
}
