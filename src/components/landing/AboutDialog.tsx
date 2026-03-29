
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
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft,
  Globe,
  Info,
  Zap
} from "lucide-react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Nebula Background for the visual part of the dialog
 */
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

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const db = useFirestore();
  const legalDocRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: legal, isLoading } = useDoc(legalDocRef);
  
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetch("https://lottie.host/e59fd659-3235-4f06-abcd-9fa78aa7c343/s1p1hhWsj1.json")
        .then(res => res.json())
        .then(data => setAnimationData(data))
        .catch(err => console.error("Lottie Load Error:", err));
    }
  }, [open]);

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
                     <Sparkles size={10} />
                     Future Intelligence
                  </div>
                  <p className="text-blue-100/30 text-[6px] md:text-[8px] font-bold uppercase tracking-widest">Namix Engine v1.0</p>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right group/header">
                  <div className="relative inline-flex items-center justify-start">
                     {/* Watermark Icon */}
                     <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5 group-hover/header:opacity-15 group-hover/header:rotate-12 transition-all duration-700 pointer-events-none text-blue-600">
                        <Info size={80} className="md:size-[120px]" />
                     </div>
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">من نحن</DialogTitle>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-start opacity-40">
                     <div className="h-1 w-1 rounded-full bg-[#f9a885] animate-pulse" />
                     <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Institutional Identity Protocol</p>
                  </div>
               </div>

               {isLoading ? (
                 <div className="py-10 flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">جاري جلب الميثاق المعتمد...</p>
                 </div>
               ) : (
                 <div className="space-y-5 md:space-y-10 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <div className="space-y-1.5 md:space-y-2">
                       <h4 className="text-[11px] md:text-xl font-black text-blue-600 leading-tight">
                          {legal?.tagline || "حيث تحقق راحتك المالية الاحترافية"}
                       </h4>
                       <div className="h-0.5 w-8 md:w-12 bg-[#f9a885] rounded-full" />
                    </div>
                    
                    <div className="max-h-[150px] md:max-h-[200px] overflow-y-auto pr-1 scrollbar-none">
                      <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right whitespace-pre-wrap">
                         {legal?.aboutUs || "ناميكس (Namix) هي رائدتكم في الاستثمار الرقمي المتطور. نحن نوفر بيئة آمنة للمستثمرين لتنمية رؤوس أموالهم بذكاء عبر بروتوكولات حماية متقدمة."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                       {[
                         { title: "النزاهة المطلقة", color: "text-emerald-600", bg: "bg-emerald-50" },
                         { title: "النمو الوميضي", color: "text-orange-600", bg: "bg-orange-50" },
                         { title: "الريادة العالمية", color: "text-blue-600", bg: "bg-blue-50" }
                       ].map((item, i) => (
                         <div key={i} className={cn("flex flex-col items-center justify-center p-2 md:p-4 rounded-xl md:rounded-[24px] transition-all hover:shadow-lg hover:-translate-y-1 cursor-default border border-transparent hover:border-white", item.bg)}>
                            <span className={cn("text-[6px] md:text-[10px] font-black text-center leading-tight", item.color)}>{item.title}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               <div className="pt-6 border-t border-gray-50 mt-auto flex justify-start">
                  <Button onClick={() => onOpenChange(false)} className="h-10 md:h-14 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[9px] md:text-sm shadow-xl active:scale-95 group transition-all">
                     إغلاق والعودة
                     <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  </Button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
