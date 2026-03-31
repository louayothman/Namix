
"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogPortal,
  DialogOverlay
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  ChevronLeft,
  Zap,
  Target,
  TrendingUp,
  Radar,
  Layers,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SafeInvestmentGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * @fileOverview مُفاعل إرشاد العقود التكتيكي v1.0 - Tactical Stack Edition
 * نافذة تعليمية تظهر عند عدم وجود استثمارات نشطة، بأسلوب البطاقات المتراكمة.
 */
export function SafeInvestmentGuide({ open, onOpenChange }: SafeInvestmentGuideProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const guideSteps = [
    {
      id: "logic",
      title: "بروتوكول العقود التشغيلية",
      subtitle: "Contract Operations",
      desc: "العقد الاستثماري هو محرك نمو مؤتمت بالكامل. بمجرد تفعيله، يبدأ نظام ناميكس بتشغيل رأس المال المخصص في قنوات السيولة العالمية لتوليد عوائد دورية ثابتة تنتهي عند حلول موعد الاستحقاق الموثق.",
      icon: Layers,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      id: "strategy",
      title: "هندسة المحفظة المتوازنة",
      subtitle: "Yield Architecture",
      desc: "لتحقيق أقصى درجات الأمان والنمو، ننصح بتفعيل عقود متعددة بمدد زمنية متفاوتة. بروتوكول حماية الأصول يضمن لك استعادة رأس المال الأصلي فور انتهاء العقد، مما يوفر لك استقراراً مالياً احترافياً.",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      id: "activation",
      title: "تفعيل الوحدات الاستثمارية",
      subtitle: "Smart Activation",
      desc: "عبر مختبر العقود، اختر الخطة التي تتماشى مع أهدافك المالية. حدد مبلغ التشغيل، أطلق بروتوكول التفعيل، وراقب نمو أرباحك اللحظي عبر المفاعل المدمج في لوحة القيادة.",
      icon: Zap,
      color: "text-[#f9a885]",
      bg: "bg-orange-50"
    }
  ];

  const handleNext = () => {
    if (activeStep < guideSteps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      onOpenChange(false);
      router.push("/invest");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setActiveStep(0), 300);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[400px] w-[92vw] overflow-hidden bg-white shadow-2xl outline-none font-body text-right" 
          dir="rtl"
        >
          {/* Top Branding Strip */}
          <div className="bg-[#002d4d] p-6 text-white relative shrink-0 flex items-center justify-between overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] -rotate-12">
                <Radar size={80} />
             </div>
             <div className="flex items-center gap-3 relative z-10">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                   <Briefcase size={20} className="text-[#f9a885]" />
                </div>
                <div className="space-y-0">
                   <DialogTitle className="text-base font-black tracking-normal leading-none">دليل الاستثمار</DialogTitle>
                   <p className="text-[7px] font-black text-blue-200/40 uppercase tracking-[0.3em] mt-1">Investment Briefing</p>
                </div>
             </div>
             <Badge className="bg-blue-500 text-white border-none font-black text-[7px] px-3 py-1 rounded-full shadow-lg">NODES READY</Badge>
          </div>

          <div className="p-8 space-y-10 bg-white min-h-[420px] flex flex-col justify-between">
            
            <div className="relative flex-1 flex items-center justify-center">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ x: 50, opacity: 0, scale: 0.9, rotate: 5 }}
                    animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ x: -100, opacity: 0, scale: 0.9, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full bg-gray-50/50 rounded-[40px] border border-gray-100 p-8 space-y-8 relative shadow-inner group"
                  >
                     <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                        {React.createElement(guideSteps[activeStep].icon, { size: 120 })}
                     </div>

                     <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                        <div className={cn(
                          "h-16 w-16 rounded-[24px] flex items-center justify-center shadow-lg transition-all duration-700 group-hover:scale-110",
                          guideSteps[activeStep].bg, guideSteps[activeStep].color
                        )}>
                           {React.createElement(guideSteps[activeStep].icon, { size: 32, strokeWidth: 2.5 })}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-xl font-black text-[#002d4d] tracking-normal">
                              {guideSteps[activeStep].title}
                           </h4>
                           <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">
                              {guideSteps[activeStep].subtitle}
                           </p>
                        </div>
                     </div>

                     <p className="text-[12px] font-bold text-gray-500 leading-[2.2] text-center px-2 tracking-normal relative z-10">
                        {guideSteps[activeStep].desc}
                     </p>
                  </motion.div>
               </AnimatePresence>

               <div className="absolute inset-0 -z-10 translate-y-3 scale-95 opacity-40 bg-gray-100 rounded-[40px] blur-[1px]" />
               <div className="absolute inset-0 -z-20 translate-y-6 scale-[0.9] opacity-20 bg-gray-200 rounded-[40px] blur-[2px]" />
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-center gap-2">
                  {guideSteps.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        activeStep === i ? "w-8 bg-[#002d4d]" : "w-1.5 bg-gray-100"
                      )} 
                    />
                  ))}
               </div>

               <Button 
                 onClick={handleNext}
                 className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 group/btn relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover/btn:translate-x-[-250%] transition-transform duration-1000" />
                  <span className="relative z-10">
                    {activeStep === guideSteps.length - 1 ? "انطلق لمختبر العقود" : "الخطوة التالية"}
                  </span>
                  <ChevronLeft className="h-5 w-5 text-[#f9a885] transition-transform group-hover/btn:-translate-x-1" />
               </Button>

               <div className="flex items-center justify-center gap-3 opacity-30">
                  <ShieldCheck size={10} className="text-emerald-500" />
                  <p className="text-[7px] font-black uppercase tracking-widest text-[#002d4d]">Professional Asset Protocol v1.0</p>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
