
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
  Activity,
  Waves,
  Cpu
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
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة لتعزيز الشعور بالدقة الميكانيكية
 */
const AnimatedDigit = React.memo(({ digit }: { digit: string }) => {
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
});

AnimatedDigit.displayName = "AnimatedDigit";

/**
 * EnergyStream - خيوط السيولة المتحركة التي تربط بين المركز والأطراف
 */
const EnergyStream = ({ active, thickness }: { active: boolean, thickness: number }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" dir="ltr">
    <motion.path
      d="M 50% 50% Q 50% 20%, 80% 20%"
      stroke="url(#grad-orange)"
      strokeWidth={thickness}
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.2 : 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#002d4d" />
        <stop offset="100%" stopColor="#f9a885" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * @fileOverview محاكي النمو الاستراتيجي v18.0 - Yield Fusion Core Edition
 * مفاعل درامي يربط بين رأس المال والأهداف الاستراتيجية عبر نبض تكنولوجي متكامل.
 */
export function YieldSimulator({ marketingConfig, calcAmount, onAmountChange, onIncrement, onDecrement }: YieldSimulatorProps) {
  const router = useRouter();
  const ratio = marketingConfig?.simulatorRatio || 45;
  const amount = parseInt(calcAmount || "0");

  const goals = useMemo(() => marketingConfig?.simulatorGoals || [], [marketingConfig]);

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
    <div className="relative py-2 font-body tracking-normal" dir="rtl">
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.2em]">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Namix Fusion Protocol
          </div>
          <h3 className="text-xl font-black text-[#002d4d]">محاكي التدفق المالي</h3>
        </div>
        <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[8px] px-3 py-1 rounded-full shadow-lg">CORE ACTIVE</Badge>
      </div>

      <Card className="border-none shadow-2xl rounded-[64px] bg-white overflow-hidden border border-gray-100 relative group">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
           <div className="h-full w-full bg-[radial-gradient(circle_at_center,#002d4d_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <CardContent className="p-8 md:p-12 space-y-12 relative z-10">
          
          {/* Main Fusion Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Monthly Reactor */}
            <div className="lg:col-span-3 order-2 lg:order-1">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="p-6 bg-gray-50/80 rounded-[44px] border border-gray-100 shadow-inner text-center space-y-3 relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12"><Activity size={60} /></div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Monthly Yield</p>
                  <div className="flex items-center justify-center text-2xl font-black text-[#002d4d] tabular-nums tracking-tighter h-[24px]" dir="ltr">
                    <span>+</span><span>$</span>
                    {monthlyProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }).split("").map((char, i) => <AnimatedDigit key={i} digit={char} />)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-blue-500/40">
                     <Waves size={10} className="animate-pulse" />
                     <span className="text-[7px] font-black uppercase">Steady Flow</span>
                  </div>
               </motion.div>
            </div>

            {/* Center: The Core Input */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
               <div className="relative w-full max-w-[280px]">
                  {/* Energy Streams Visualization (Hidden on Mobile for clarity) */}
                  <div className="absolute inset-[-40px] hidden lg:block pointer-events-none">
                     <EnergyStream active={true} thickness={1 + (amount / 5000)} />
                  </div>

                  <div className="bg-[#002d4d] p-2 rounded-[56px] shadow-2xl relative z-10 border border-white/10 group/core">
                     <div className="absolute inset-0 bg-blue-500/10 rounded-[56px] blur-2xl animate-pulse" />
                     
                     <div className="relative z-10 bg-[#002d4d] rounded-[48px] p-8 text-center space-y-6">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-blue-200/40 uppercase tracking-[0.3em]">Capital Injection</p>
                           <div className="flex items-baseline justify-center gap-2">
                              <span className="text-[#f9a885] text-xl font-black tabular-nums">$</span>
                              <span className="text-5xl font-black text-white tabular-nums tracking-tighter">{amount.toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                           <button 
                             onClick={onDecrement}
                             className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-400 transition-all active:scale-90 shadow-lg"
                           >
                              <Minus size={20} />
                           </button>
                           <div className="h-10 w-[1px] bg-white/10" />
                           <button 
                             onClick={onIncrement}
                             className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#f9a885] hover:text-[#002d4d] transition-all active:scale-90 shadow-lg"
                           >
                              <Plus size={20} />
                           </button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center gap-2 opacity-40">
                     <Cpu size={12} className="text-[#f9a885] animate-spin duration-[4s]" />
                     <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-[0.5em]">Fusion Core Matrix</p>
                  </div>
               </div>
            </div>

            {/* Right: Annual Reactor */}
            <div className="lg:col-span-3 order-3 lg:order-3">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="p-6 bg-emerald-50/30 rounded-[44px] border border-emerald-100/50 shadow-inner text-center space-y-3 relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12"><TrendingUp size={60} /></div>
                  <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">Annual Projection</p>
                  <div className="flex items-center justify-center text-2xl font-black text-emerald-600 tabular-nums tracking-tighter h-[24px]" dir="ltr">
                    <span>+</span><span>$</span>
                    {annualProfit.toLocaleString(undefined, { maximumFractionDigits: 0 }).split("").map((char, i) => <AnimatedDigit key={i} digit={char} />)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-emerald-500/40">
                     <Sparkles size={10} className="animate-bounce" />
                     <span className="text-[7px] font-black uppercase">Max Efficiency</span>
                  </div>
               </motion.div>
            </div>

          </div>

          {/* Strategic Milestones Map */}
          <div className="space-y-8 pt-4">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-3">
                  <Target size={16} className="text-[#f9a885]" />
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">خارطة تحقيق الأهداف (Milestones)</h4>
               </div>
               <div className="h-px flex-1 mx-6 bg-gray-50" />
               <Badge variant="outline" className="text-[8px] font-black text-gray-300 border-gray-100">AI ESTIMATED</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {goals.map((goal: any) => {
                const monthsNeeded = monthlyProfit > 0 ? Math.ceil(goal.target / monthlyProfit) : 0;
                const isAchievableSoon = monthsNeeded <= 6;
                
                return (
                  <button 
                    key={goal.id} 
                    onClick={() => handleGoalClick(goal.linkedPlanId)}
                    className={cn(
                      "group p-6 rounded-[40px] border transition-all duration-700 relative overflow-hidden text-right flex flex-col justify-between h-[120px] active:scale-95",
                      isAchievableSoon ? "bg-blue-50/50 border-blue-100 hover:shadow-xl hover:bg-white" : "bg-gray-50/30 border-gray-50 hover:bg-white"
                    )}
                  >
                    <div className={cn(
                      "absolute -bottom-4 -left-4 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-150 text-[#002d4d]",
                    )}>
                       {getIcon(goal.icon, 100)}
                    </div>

                    <div className="relative z-10 space-y-1">
                       <h5 className="font-black text-[12px] text-[#002d4d] group-hover:text-blue-600 transition-colors">{goal.labelAr}</h5>
                       <p className="text-[10px] font-bold text-[#f9a885] tabular-nums tracking-tighter">${goal.target.toLocaleString()}</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-gray-100/50 pt-2 mt-auto">
                       <div className="flex items-center gap-1.5">
                          <Repeat size={10} className="text-gray-300" />
                          <span className="text-[9px] font-black text-[#002d4d] tabular-nums">{monthsNeeded || "—"} <span className="text-[7px] text-gray-400">شهر</span></span>
                       </div>
                       {isAchievableSoon && <Zap size={10} className="text-[#f9a885] animate-pulse" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strategic Bottom Strip */}
          <div className="bg-gray-50 p-8 rounded-[48px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="flex items-center gap-5 relative z-10">
                <div className="h-14 w-14 rounded-[22px] bg-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                   <ShieldCheck className="h-7 w-7 text-emerald-500" />
                </div>
                <div className="text-right space-y-1">
                   <p className="text-base font-black text-[#002d4d]">بروتوكول المعايرة الاحترافي</p>
                   <p className="text-[10px] font-bold text-gray-400 leading-relaxed">تعتمد هذه المحاكاة على كفاءة تشغيل بنسبة <span className="text-[#f9a885] font-black">%{ratio}</span> وهي قابلة للتطوير المستمر.</p>
                </div>
             </div>
             
             <Button 
               onClick={() => router.push('/invest')}
               className="h-14 px-10 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-2xl transition-all active:scale-95 group/btn"
             >
                تفعيل العقد الاستراتيجي
                <ChevronLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
             </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
