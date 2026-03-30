
"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft,
  Zap,
  Target,
  MousePointerClick,
  TrendingUp,
  Activity,
  Radar
} from "lucide-react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NebulaBackground - محرك سديم البيانات الخلفي المتطور
 */
const NebulaBackground = () => {
  const [particles, setParticles] = useState<{ x: number; y: number; s: number; d: number }[]>([]);

  useEffect(() => {
    const p = [...Array(20)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.5 + Math.random() * 1.5,
      d: 4 + Math.random() * 8
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#001a2d]">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 30, repeat: Infinity }}
        className="absolute top-[-30%] right-[-20%] w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-[#f9a885]/10 rounded-full blur-[100px]" 
      />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -80, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: p.d, repeat: Infinity, delay: i * 0.1 }}
          className="absolute rounded-full bg-white/60"
          style={{ top: `${p.y}%`, left: `${p.x}%`, width: p.s, height: p.s }}
        />
      ))}
    </div>
  );
};

interface SpotTradingGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * @fileOverview مُفاعل الإرشاد الاحترافي v4.0 - Namix Pro Style
 * تم إصلاح خطأ استيراد Badge وتثبيت هيكلة الوحدات التكنولوجية الرشيقة.
 */
export function SpotTradingGuide({ open, onOpenChange }: SpotTradingGuideProps) {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetch("https://lottie.host/cd21e4c4-bf4d-4e52-b6b1-a1a25e7863e5/fabb0ZLzCZ.json")
        .then(res => res.json())
        .then(data => setAnimationData(data))
        .catch(err => console.error("Lottie Load Error:", err));
    }
  }, [open]);

  const guideNodes = [
    { 
      title: "منطق الصفقات السريعة", 
      desc: "تحقيق الربح عبر توقع اتجاه السعر (صعوداً أو هبوطاً) في فترات زمنية قصيرة.",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    { 
      title: "رصد نبض السوق", 
      desc: "تحليل زخم الأسعار اللحظي لتحديد نقطة الدخول الأكثر دقة وأماناً.",
      icon: Target,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    { 
      title: "التنفيذ عبر NAMIX AI", 
      desc: "استخدام إشارات المحرك الذكي لتأكيد الاتجاه وإطلاق الأمر بلمسة واحدة.",
      icon: Zap,
      color: "text-[#f9a885]",
      bg: "bg-orange-50"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[850px] w-[95vw] overflow-hidden bg-white shadow-2xl outline-none font-body text-right" 
          dir="rtl"
        >
          <div className="flex flex-col md:flex-row min-h-fit md:min-h-[520px]">
             
             {/* الجانب البصري - Intelligence Node */}
             <div className="md:w-5/12 bg-[#001a2d] relative overflow-hidden flex flex-col items-center justify-center p-8 border-l border-white/5 h-[140px] md:h-auto text-center">
                <NebulaBackground />
                <div className="relative z-10 w-full max-w-[100px] md:max-w-[240px] aspect-square flex items-center justify-center mx-auto">
                   <div className="absolute inset-0 bg-white/5 rounded-full blur-[40px] animate-pulse" />
                   {animationData ? (
                     <Lottie animationData={animationData} loop={true} className="w-full h-full scale-125" />
                   ) : (
                     <Loader2 className="h-6 w-6 animate-spin text-[#f9a885] opacity-20" />
                   )}
                </div>
                <div className="hidden md:block mt-8 text-center space-y-1 relative z-10">
                   <div className="flex items-center justify-center gap-2 text-[#f9a885] font-black text-[8px] uppercase tracking-[0.3em]">
                      <Sparkles size={10} />
                      Professional Core
                   </div>
                   <p className="text-blue-100/30 text-[7px] font-bold uppercase tracking-widest">Global Data Feed</p>
                </div>
             </div>

             {/* الجانب الإرشادي - Operation Terminal */}
             <div className="w-full md:w-7/12 p-6 md:p-12 flex flex-col justify-between bg-white relative">
                
                <div className="space-y-8">
                   <div className="space-y-1.5 text-right">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-[14px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg relative overflow-hidden">
                            <Radar className="h-5 w-5 animate-pulse" />
                         </div>
                         <DialogTitle className="text-xl md:text-2xl font-black text-[#002d4d] tracking-normal">بروتوكول التداول السريع</DialogTitle>
                      </div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest pr-14">Operational Onboarding Node</p>
                   </div>

                   {/* الوحدات التكتيكية - Tactical Nodes */}
                   <div className="grid gap-3">
                      {guideNodes.map((node, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="group relative flex items-center gap-5 p-4 rounded-[28px] bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-500"
                        >
                           <div className={cn(
                             "h-11 w-11 rounded-[18px] flex items-center justify-center shrink-0 shadow-inner transition-all duration-700",
                             node.bg, node.color, "group-hover:bg-[#002d4d] group-hover:text-[#f9a885]"
                           )}>
                              <node.icon size={20} strokeWidth={2.5} />
                           </div>
                           <div className="space-y-0.5 min-w-0">
                              <h5 className="font-black text-[13px] text-[#002d4d] tracking-normal">{node.title}</h5>
                              <p className="text-[10px] font-bold text-gray-400 leading-relaxed tracking-normal line-clamp-2">{node.desc}</p>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-8 border-t border-gray-50 flex flex-col gap-4 mt-6">
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                         <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                         <span className="text-[8px] font-black text-[#002d4d] uppercase tracking-normal">Secured Connection</span>
                      </div>
                      <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[7px] px-2.5 py-0.5 rounded-full animate-pulse">ACTIVE FEED</Badge>
                   </div>
                   
                   <Button 
                     onClick={() => { onOpenChange(false); router.push("/trade"); }} 
                     className="w-full h-14 md:h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs md:text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                   >
                      <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover/btn:translate-x-[-250%] transition-transform duration-1000" />
                      <span>انطلق لغرفة التداول الاحترافية</span>
                      <MousePointerClick className="h-5 w-5 text-[#f9a885] transition-transform group-hover/btn:scale-125" />
                   </Button>
                   
                   <button 
                     onClick={() => onOpenChange(false)} 
                     className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors text-center tracking-normal"
                   >
                     إغلاق والمتابعة للمنصة
                   </button>
                </div>
             </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
