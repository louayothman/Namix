
"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
 * NebulaEffect - سديم البيانات المتحرك الذي يعطي انطباع الهولوغرام
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

/**
 * HolographicValue - عرض الأرقام بتأثير نيون عائم
 */
const HolographicValue = ({ label, value, colorClass }: { label: string, value: string, colorClass: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <motion.div 
      key={value}
      initial={{ y: 10, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      className={cn("text-2xl md:text-3xl font-black tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]", colorClass)}
    >
      ${value}
    </motion.div>
  </div>
);

/**
 * @fileOverview المِسقاط الهولوغرامي v19.0 - Holographic Projector Edition
 * تصميم درامي يحول محاكي الأرباح إلى منصة إسقاط ضوئي للبيانات المستقبلية.
 * تم تطهير كافة النصوص من تباعد الحروف (tracking-normal).
 */
export function YieldSimulator({ marketingConfig, calcAmount, onAmountChange, onIncrement, onDecrement }: YieldSimulatorProps) {
  const router = useRouter();
  const ratio = marketingConfig?.simulatorRatio || 45;
  const amount = parseInt(calcAmount || "0");
  
  const intensity = useMemo(() => Math.max(1, amount / 1000), [amount]);
  const goals = useMemo(() => marketingConfig?.simulatorGoals || [], [marketingConfig]);

  const { monthlyProfit, annualProfit } = useMemo(() => {
    const monthly = (amount * ratio) / 100;
    return {
      monthlyProfit: Math.floor(monthly),
      annualProfit: Math.floor(monthly * 12)
    };
  }, [amount, ratio]);

  const getIcon = useCallback((iconName: string, size = 14) => {
    const iconMap: Record<string, any> = { Plane, Car, Briefcase, Home, Target, Ship, Gem, Award };
    const IconComp = iconMap[iconName] || Target;
    return <IconComp size={size} />;
  }, []);

  return (
    <div className="relative py-4 font-body tracking-normal" dir="rtl">
      {/* Dynamic Module Header */}
      <div className="flex items-center justify-between px-6 mb-6">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-normal">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Namix Prediction Protocol
          </div>
          <h3 className="text-xl font-black text-[#002d4d] tracking-normal">محاكي التوقع الرقمي</h3>
        </div>
        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner animate-pulse">LIVE CALIBRATION</Badge>
      </div>

      <Card className="border-none shadow-2xl rounded-[64px] bg-white overflow-hidden border border-gray-100 relative group min-h-[600px] flex flex-col">
        
        {/* UPPER: The Hologram Area (Nebula + Floating Stats) */}
        <div className="relative flex-1 p-8 md:p-12 flex flex-col items-center justify-center overflow-hidden border-b border-gray-50 bg-gradient-to-b from-gray-50/30 to-white">
           <NebulaEffect intensity={intensity} />
           
           {/* The Light Beam - الإسقاط الضوئي */}
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-t from-blue-500/10 via-blue-500/5 to-transparent blur-[40px] opacity-40 pointer-events-none" />

           <div className="relative z-10 flex flex-col items-center gap-12 w-full">
              {/* Primary Floating Result */}
              <div className="text-center space-y-2">
                 <p className="text-[10px] font-black text-blue-600/40 uppercase tracking-widest leading-none">Net Predicted Wealth</p>
                 <motion.h2 
                   key={annualProfit}
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="text-6xl md:text-7xl font-black text-[#002d4d] tabular-nums tracking-tighter drop-shadow-[0_10px_30px_rgba(0,45,77,0.1)]"
                 >
                   <span className="text-xl md:text-2xl text-gray-200 mr-2">$</span>
                   {annualProfit.toLocaleString()}
                 </motion.h2>
                 <div className="flex items-center justify-center gap-2 px-4 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-[#002d4d]">عائد سنوي متوقع</span>
                 </div>
              </div>

              {/* Secondary Floating Stats */}
              <div className="grid grid-cols-2 gap-16 md:gap-24">
                 <HolographicValue label="التدفق الشهري" value={monthlyProfit.toLocaleString()} colorClass="text-blue-600" />
                 <HolographicValue label="كفاءة المحرك" value={`%${ratio}`} colorClass="text-emerald-600" />
              </div>
           </div>
        </div>

        {/* MIDDLE: Goal Ignition Hub */}
        <div className="px-8 md:px-12 py-8 bg-white relative z-20">
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
                     <p className={cn("text-[7px] font-black uppercase text-center leading-none", isReached ? "text-[#002d4d]" : "text-gray-300")}>
                        {goal.labelAr}
                     </p>
                  </div>
                );
              })}
           </div>
        </div>

        {/* BOTTOM: The Control Base (Input) */}
        <div className="p-8 md:p-12 bg-[#002d4d] text-white relative z-30 shrink-0">
           <div className="max-w-md mx-auto space-y-8">
              <div className="text-center space-y-1">
                 <Label className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">تحميل رأس المال (Capital Injection)</Label>
                 <div className="flex items-center justify-center gap-8">
                    <motion.button 
                      whileTap={{ scale: 0.8 }} 
                      onClick={onDecrement}
                      className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 transition-all shadow-xl"
                    >
                       <Minus size={20} />
                    </motion.button>
                    
                    <div className="flex-1 flex flex-col items-center">
                       <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-[#f9a885]">$</span>
                          <span className="text-5xl font-black tabular-nums tracking-tighter">{amount.toLocaleString()}</span>
                       </div>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.8 }} 
                      onClick={onIncrement}
                      className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#f9a885] hover:text-[#002d4d] transition-all shadow-xl"
                    >
                       <Plus size={20} />
                    </motion.button>
                 </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4">
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[9px] font-black text-blue-100/60 uppercase">Verified Calculation</span>
                 </div>
                 <Button 
                   onClick={() => router.push('/invest')}
                   className="h-12 px-8 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[10px] shadow-xl active:scale-95 transition-all group"
                 >
                    تفعيل العقد المقترح
                    <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                 </Button>
              </div>
           </div>
        </div>

      </Card>

      {/* Global Brand Footer */}
      <div className="mt-8 flex flex-col items-center gap-4 opacity-20 select-none">
         <p className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.8em] mr-[-0.8em]">Namix Holographic Console v19.0</p>
         <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (<div key={i} className="h-1 w-1 rounded-full bg-gray-300" />))}
         </div>
      </div>
    </div>
  );
}
