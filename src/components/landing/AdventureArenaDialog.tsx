
"use client";

import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogPortal,
  DialogOverlay
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft,
  Zap,
  Rocket,
  Gamepad2,
  Trophy
} from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NebulaBackground = () => {
  const [particles, setParticles] = useState<{ x: number; y: number; s: number; d: number }[]>([]);

  useEffect(() => {
    const p = [...Array(30)].map(() => ({
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
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 360]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-30%] right-[-20%] w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.35, 0.15],
          rotate: [360, 0]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-[#f9a885]/10 rounded-full blur-[100px]" 
      />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -120, 0],
            x: [0, i % 2 === 0 ? 60 : -60, 0],
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: p.d, 
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          style={{ 
            top: `${p.y}%`, 
            left: `${p.x}%`, 
            width: p.s, 
            height: p.s 
          }}
        />
      ))}
    </div>
  );
};

interface AdventureArenaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdventureArenaDialog({ open, onOpenChange }: AdventureArenaDialogProps) {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetch("https://lottie.host/81bc7923-ca33-404d-9987-d2a4a554ea68/IjSB51w5Mx.json")
        .then(res => res.json())
        .then(data => setAnimationData(data))
        .catch(err => console.error("Lottie Load Error:", err));
    }
  }, [open]);

  const handleAction = () => {
    const session = localStorage.getItem("namix_user");
    onOpenChange(false);
    if (session) {
      router.push("/arena");
    } else {
      router.push("/login");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[900px] w-[95vw] overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(0,45,77,0.3)] outline-none font-body" 
          dir="rtl"
        >
          <div className="flex flex-row min-h-[450px] md:min-h-[550px]">
            
            <div className="w-1/2 bg-[#001a2d] p-4 md:p-10 relative overflow-hidden flex flex-col items-center justify-center border-l border-white/5">
               <NebulaBackground />
               
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-[40px] md:blur-[80px] animate-pulse" />
                  {animationData ? (
                    <Lottie animationData={animationData} loop={true} className="w-full h-full scale-110" />
                  ) : (
                    <Loader2 className="h-8 w-8 animate-spin text-[#f9a885] opacity-20" />
                  )}
               </div>

               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#f9a885] font-black text-[7px] md:text-[9px] uppercase tracking-[0.3em]">
                     <Rocket size={10} />
                     Entertainment Arena
                  </div>
                  <p className="text-blue-100/30 text-[6px] md:text-[8px] font-bold uppercase tracking-widest">Namix Interactive Hub</p>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right group/header">
                  <div className="relative inline-flex items-center justify-start">
                     <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5 group-hover/header:opacity-15 group-hover/header:rotate-12 transition-all duration-700 pointer-events-none text-orange-500">
                        <Gamepad2 size={80} className="md:size-[120px]" />
                     </div>
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">ساحة المغامرة</DialogTitle>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-start opacity-40">
                     <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                     <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest tracking-normal">Interactive Experience Node</p>
                  </div>
               </div>

               <div className="space-y-5 md:space-y-10 animate-in fade-in slide-in-from-left-4 duration-1000">
                  <div className="space-y-1.5 md:space-y-2 text-right">
                     <h4 className="text-[11px] md:text-xl font-black text-orange-600 leading-tight tracking-normal">
                        ترفيه ذكي.. عوائد استراتيجية
                     </h4>
                     <div className="h-0.5 w-8 md:w-12 bg-blue-100 rounded-full" />
                  </div>
                  
                  <div className="max-h-[150px] md:max-h-[200px] overflow-y-auto pr-1 scrollbar-none">
                    <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right whitespace-pre-wrap tracking-normal">
                       اكتشف بُعداً جديداً من التفاعل في ساحة المغامرة لناميكس. نقدم لك ألعاباً مبنية على بروتوكولات الشفافية المطلقة، حيث يلتقي الترفيه بالذكاء الاستراتيجي. استمتع بتجارب فريدة مثل 'Sovereign Mines' و 'Nexus Dice' المصممة لتمنحك لحظات من الحماس مع ضمان عدالة النتائج عبر محركاتنا التقنية المتقدمة.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                     {[
                       { title: "عدالة مطلقة", color: "text-emerald-600", bg: "bg-emerald-50" },
                       { title: "تفاعل لحظي", color: "text-blue-600", bg: "bg-blue-50" },
                       { title: "جوائز حصرية", color: "text-orange-600", bg: "bg-orange-50" }
                     ].map((item, i) => (
                       <div key={i} className={cn("flex flex-col items-center justify-center p-2 md:p-4 rounded-xl md:rounded-[24px] transition-all hover:shadow-lg hover:-translate-y-1 cursor-default border border-transparent hover:border-white", item.bg)}>
                          <span className={cn("text-[6px] md:text-[10px] font-black text-center leading-tight tracking-normal", item.color)}>{item.title}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-50 mt-auto flex flex-col gap-3">
                  <Button onClick={handleAction} className="h-10 md:h-16 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] md:text-lg shadow-xl active:scale-95 group transition-all">
                     ابدأ المغامرات
                     <ChevronLeft className="mr-2 h-4 w-4 md:h-6 md:w-6 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                  <button onClick={() => onOpenChange(false)} className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors text-center tracking-normal">إغلاق</button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
