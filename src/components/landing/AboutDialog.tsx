
"use client";

import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
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

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * @fileOverview نافذة التعريف السيادية v1.0 - Cinematic Integrated Dialog
 * تدمج الرسوم التفاعلية والميثاق النصي في واجهة منبثقة فاخرة لصفحة الهبوط.
 */
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
        <DialogContent className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[900px] w-[95vw] md:w-full overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(0,45,77,0.3)] outline-none font-body" dir="rtl">
          
          <div className="flex flex-col md:flex-row min-h-[500px]">
            
            {/* Visual Column - Content with Animation */}
            <div className="md:w-1/2 bg-[#002d4d] p-10 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,#f9a885_0%,transparent_70%)] blur-3xl" />
               </div>
               
               <div className="relative z-10 w-full max-w-[300px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
                  {animationData ? (
                    <Lottie animationData={animationData} loop={true} className="w-full h-full" />
                  ) : (
                    <Loader2 className="h-12 w-12 animate-spin text-[#f9a885] opacity-20" />
                  )}
               </div>

               <div className="mt-8 text-center space-y-2 relative z-10">
                  <div className="flex items-center justify-center gap-3 text-[#f9a885] font-black text-[9px] uppercase tracking-[0.4em]">
                     <Sparkles size={12} />
                     Future Intelligence
                  </div>
                  <p className="text-blue-100/40 text-[10px] font-bold uppercase tracking-widest">Namix Sovereign Engine v1.0</p>
               </div>
            </div>

            {/* Content Column - Textual Data */}
            <div className="md:w-1/2 p-10 md:p-16 space-y-10 bg-white relative flex flex-col justify-center">
               <div className="space-y-4 text-right">
                  <div className="flex items-center gap-3 justify-end md:justify-start">
                     <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                        <Info size={20} />
                     </div>
                     <DialogTitle className="text-2xl md:text-3xl font-black text-[#002d4d]">من نحن</DialogTitle>
                  </div>
                  <div className="flex items-center gap-2 justify-end md:justify-start opacity-40">
                     <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Institutional Identity Protocol</p>
                  </div>
               </div>

               {isLoading ? (
                 <div className="py-12 flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري جلب الميثاق المعتمد...</p>
                 </div>
               ) : (
                 <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <div className="space-y-2">
                       <h4 className="text-xl font-black text-blue-600 leading-tight">
                          {legal?.tagline || "حيث تحقق راحتك المالية السيادية"}
                       </h4>
                       <div className="h-1 w-12 bg-[#f9a885] rounded-full" />
                    </div>
                    
                    <p className="text-gray-500 font-bold leading-[2.2] text-[14px] md:text-base text-right">
                       {legal?.aboutUs || "ناميكس (Namix) هي رائدتكم في الاستثمار الرقمي المتطور. نحن نوفر بيئة آمنة للمستثمرين لتنمية رؤوس أموالهم بذكاء عبر بروتوكولات حماية متقدمة."}
                    </p>

                    <div className="grid gap-4">
                       {[
                         { icon: ShieldCheck, title: "النزاهة المطلقة", color: "text-emerald-500" },
                         { icon: Zap, title: "النمو الوميضي", color: "text-orange-500" },
                         { icon: Globe, title: "السيادة العالمية", color: "text-blue-500" }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-4 group cursor-default">
                            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                               <item.icon size={16} className={item.color} />
                            </div>
                            <span className="text-[11px] font-black text-[#002d4d] opacity-60 group-hover:opacity-100 transition-opacity">{item.title}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               <div className="pt-8 border-t border-gray-50 mt-auto flex justify-end md:justify-start">
                  <Button onClick={() => onOpenChange(false)} className="h-14 px-10 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl active:scale-95 group transition-all">
                     إغلاق والعودة
                     <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  </Button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
