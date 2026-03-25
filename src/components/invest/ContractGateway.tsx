
"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ShieldCheck, 
  Award,
  ChevronUp,
  Target,
  Sparkles,
  Zap,
  MousePointerClick
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, animate, AnimatePresence } from "framer-motion";

/**
 * @fileOverview بوابة العقود السيادية v2000.0 - Enhanced Navigation Edition
 * تم تكبير مؤشرات التمرير السفلية لضمان تجربة مستخدم أكثر وضوحاً وحيوية.
 */

interface Plan {
  id: string;
  title: string;
  profitPercent: number;
  durationValue: number;
  durationUnit: string;
  min: number;
  max: number;
  features?: string[];
  isPopular?: boolean;
  isFlash?: boolean;
  isScheduled?: boolean;
  launchTime?: string;
}

interface ContractGatewayProps {
  plans: Plan[];
  onSelect: (plan: Plan) => void;
  now: Date;
}

/**
 * محرك العداد الرقمي المطور - يدعم الفواصل العشرية بالأخضر الزمردي
 */
function AnimatedProfit({ value, active }: { value: number, active: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplayValue(0);
      return;
    }
    
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest)
    });

    return () => controls.stop();
  }, [value, active]);

  return (
    <div className="relative z-10 flex items-center justify-center">
      <span className="text-4xl font-black text-emerald-500 tabular-nums tracking-tighter">
        %{displayValue.toFixed(2)}
      </span>
    </div>
  );
}

export function ContractGateway({ plans, onSelect, now }: ContractGatewayProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    direction: "rtl",
    align: "center", 
    containScroll: "trimSnaps",
    loop: false,
    skipSnaps: false
  });

  const onSelectScroll = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelectScroll();
    emblaApi.on("select", onSelectScroll);
    emblaApi.on("reInit", onSelectScroll);
  }, [emblaApi, onSelectScroll]);

  const getUnitLabel = (unit: string) => {
    switch(unit) {
      case 'minutes': return 'دقيقة';
      case 'hours': return 'ساعة';
      default: return 'يوم';
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full font-body" dir="rtl">
      
      <div className="flex items-stretch gap-0">
        
        {/* شريط الهوية السيادي الجانبي - مصغر */}
        <div className="flex flex-col items-center justify-center gap-2 shrink-0 w-8 opacity-[0.1] select-none">
           <span className="text-[6px] font-black text-[#002d4d] uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
             NAMIX SOVEREIGN
           </span>
           <div className="w-[0.5px] h-16 bg-gradient-to-b from-[#002d4d] via-[#f9a885] to-transparent" />
        </div>

        {/* Embla Viewport */}
        <div className="flex-1 overflow-hidden" ref={emblaRef}>
          <div className="flex items-center">
            {plans.map((plan, i) => {
              const isActive = selectedIndex === i;
              const isNotYetLaunched = plan.isScheduled && new Date(plan.launchTime!) > now;

              return (
                <div key={plan.id} className="flex-[0_0_80vw] md:flex-[0_0_320px] min-w-0 px-2 py-4">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => !isNotYetLaunched && onSelect(plan)}
                    disabled={isNotYetLaunched}
                    className="w-full text-right outline-none block"
                  >
                    <Card className={cn(
                      "border-none rounded-[48px] overflow-hidden bg-white relative transition-all duration-1000 h-[460px] flex flex-col shadow-none border border-gray-100",
                      isActive 
                        ? "opacity-100 ring-[1px] ring-gray-100" 
                        : "opacity-40 grayscale-[0.8] scale-95",
                      plan.isPopular && isActive && "ring-1 ring-[#f9a885]/20"
                    )}>
                      
                      {/* Neon Glow Overlay */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                              "absolute inset-0 pointer-events-none z-0",
                              plan.isPopular ? "bg-gradient-to-br from-[#f9a885]/5 to-transparent" : "bg-gradient-to-br from-emerald-500/5 to-transparent"
                            )}
                          />
                        )}
                      </AnimatePresence>

                      {/* Header Section - Compact */}
                      <div className="p-6 pb-2 relative z-10">
                         <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col items-start gap-1.5">
                               {plan.isPopular && isActive && (
                                 <Badge className="bg-[#f9a885] text-[#002d4d] border-none font-black text-[7px] px-2 py-0.5 rounded-md shadow-lg shadow-orange-900/10 animate-in zoom-in duration-500">
                                    PREMIUM
                                 </Badge>
                               )}
                               {plan.isFlash && isActive && (
                                 <Badge className="bg-red-50 text-white border-none font-black text-[7px] px-2 py-0.5 rounded-md animate-pulse shadow-lg shadow-red-900/20">FLASH</Badge>
                               )}
                            </div>
                            {isNotYetLaunched ? (
                              <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md uppercase tracking-widest">
                                 PLAN
                              </Badge>
                            ) : (
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                            )}
                         </div>
                         
                         <div className="space-y-0.5">
                            <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">Protocol Node</p>
                            <h3 className="text-base font-black text-[#002d4d] leading-none">{plan.title}</h3>
                         </div>
                      </div>

                      {/* Core Content - Compressed */}
                      <CardContent className="p-6 pt-0 flex-1 flex flex-col relative z-10">
                         
                         {/* Profit Core - Compact Emerald Center */}
                         <div className="p-6 bg-gray-50/50 rounded-[36px] border border-gray-100 shadow-inner space-y-2 text-center mb-5 relative overflow-hidden group/profit">
                            {/* سهم صاعد شفاف يتحرك خلف الأرقام */}
                            <motion.div 
                              animate={isActive ? { y: [5, -5, 5] } : {}}
                              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                              className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none"
                            >
                               <ChevronUp size={120} strokeWidth={3} />
                            </motion.div>

                            <div className="space-y-0 relative z-10">
                               <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mb-0.5">صافي العائد</p>
                               <AnimatedProfit value={plan.profitPercent} active={isActive} />
                            </div>
                            
                            <div className="flex justify-center relative z-10">
                               <div className="h-5 px-3 bg-white/80 rounded-full flex items-center gap-1.5 border border-gray-100 shadow-sm backdrop-blur-md">
                                  <Clock className="h-2.5 w-2.5 text-blue-500" />
                                  <span className="text-[9px] font-black text-[#002d4d]">دورة {plan.durationValue} {getUnitLabel(plan.durationUnit)}</span>
                               </div>
                            </div>
                         </div>

                         {/* Parameters - Tightened */}
                         <div className="space-y-3 px-1 mb-5">
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-1.5 text-gray-400">
                                  <Target size={10} className="opacity-30" />
                                  <span className="text-[8px] font-black uppercase tracking-widest">الحد الأدنى</span>
                               </div>
                               <span className="text-sm font-black text-[#002d4d] tabular-nums tracking-tighter">${plan.min.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-1.5 text-gray-400">
                                  <Zap size={10} className="opacity-30" />
                                  <span className="text-[8px] font-black uppercase tracking-widest">الحد الأقصى</span>
                               </div>
                               <span className="text-sm font-black text-[#002d4d] tabular-nums tracking-tighter">
                                  {plan.max >= 9999999 ? "مفتوح" : `$${plan.max.toLocaleString()}`}
                                </span>
                            </div>
                         </div>

                         {/* Separator Line */}
                         <div className="px-1 mb-5">
                            <div className={cn(
                              "h-[1px] bg-gray-100 rounded-full transition-all duration-1000",
                              isActive ? "w-full bg-gradient-to-r from-transparent via-[#f9a885]/30 to-transparent" : "w-3"
                            )} />
                         </div>

                         {/* Features List - Denser spacing */}
                         <div className="flex-1 space-y-2 px-1 overflow-y-auto scrollbar-none">
                            {plan.features ? plan.features.map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                 <div className="h-1 w-1 rounded-full bg-blue-500/20 shrink-0" />
                                 <span className="text-[9px] font-bold text-gray-500 leading-tight">{feat}</span>
                              </div>
                            )) : (
                              <div className="flex items-center gap-2 text-emerald-600/40">
                                 <ShieldCheck size={12} />
                                 <span className="text-[8px] font-black uppercase">Capital Shield Active</span>
                              </div>
                            )}
                         </div>

                         {/* Subtle Activation Hint - Iconized */}
                         <div className="mt-4 flex justify-center shrink-0 opacity-20 group-hover:opacity-100 transition-opacity">
                            <MousePointerClick size={14} className="text-[#002d4d] animate-pulse" />
                         </div>
                      </CardContent>

                      {/* Background Award Badge - Static & Subtle */}
                      <div className="absolute -bottom-12 -left-12 opacity-[0.02] pointer-events-none transition-all duration-1000 group-hover:rotate-6 group-hover:scale-105">
                         <Award size={220} />
                      </div>
                    </Card>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Dots - Enhanced & Larger v2000 */}
      <div className="flex items-center justify-center gap-3 pb-6">
         {plans.map((_, idx) => (
           <button
             key={idx}
             onClick={() => emblaApi?.scrollTo(idx)}
             className={cn(
               "h-1.5 transition-all duration-700 rounded-full",
               selectedIndex === idx 
                ? "w-10 bg-[#002d4d] shadow-[0_0_10px_rgba(0,45,77,0.3)]" 
                : "w-1.5 bg-gray-200"
             )}
           />
         ))}
      </div>
    </div>
  );
}
