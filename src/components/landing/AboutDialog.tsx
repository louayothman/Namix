
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
  Sparkles, 
  ShieldCheck, 
  ChevronLeft,
  Globe,
  Info,
  Zap,
  Activity,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NebulaBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#001a2d]">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-30%] right-[-20%] w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-[#f9a885]/10 rounded-full blur-[100px]" 
      />
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[900px] w-[95vw] overflow-hidden bg-white shadow-2xl outline-none font-body" 
          dir="rtl"
        >
          <div className="flex flex-row min-h-[450px] md:min-h-[550px]">
            
            <div className="w-1/2 bg-[#001a2d] p-4 md:p-10 relative overflow-hidden flex flex-col items-center justify-center border-l border-white/5">
               <NebulaBackground />
               
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-[40px] md:blur-[80px] animate-pulse" />
                  <motion.div 
                    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                     <Globe className="h-32 w-32 md:h-56 md:w-56 text-[#f9a885] drop-shadow-[0_0_30px_rgba(249,168,133,0.3)]" strokeWidth={1} />
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-[-20px] border border-dashed border-white/10 rounded-full"
                     />
                  </motion.div>
               </div>

               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#f9a885] font-black text-[7px] md:text-[9px] uppercase tracking-normal">
                     <Sparkles size={10} />
                     Sovereign Identity Node
                  </div>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right group/header">
                  <div className="relative inline-flex items-center justify-start">
                     <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5 group-hover/header:opacity-15 transition-all duration-700 pointer-events-none text-blue-600">
                        <Info size={80} className="md:size-[120px]" />
                     </div>
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">من نحن</DialogTitle>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-start opacity-40">
                     <div className="h-1 w-1 rounded-full bg-[#f9a885] animate-pulse" />
                     <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-normal">Institutional Identity Protocol</p>
                  </div>
               </div>

               {isLoading ? (
                 <div className="py-10 flex flex-col items-center gap-4 text-center">
                    <div className="h-6 w-6 border-2 border-gray-100 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-normal">Loading Protocol...</p>
                 </div>
               ) : (
                 <div className="space-y-5 md:space-y-10">
                    <div className="space-y-1.5 md:space-y-2">
                       <h4 className="text-[11px] md:text-xl font-black text-blue-600 leading-tight">
                          {legal?.tagline || "حيث تحقق راحتك المالية الاحترافية"}
                       </h4>
                       <div className="h-0.5 w-8 md:w-12 bg-[#f9a885] rounded-full" />
                    </div>
                    
                    <div className="max-h-[150px] md:max-h-[200px] overflow-y-auto pr-1 scrollbar-none">
                      <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right whitespace-pre-wrap">
                         {legal?.aboutUs || "ناميكس هي رائدتكم في الاستثمار الرقمي المتطور."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                       {[
                         { title: "النزاهة المطلقة", color: "text-emerald-600", bg: "bg-emerald-50" },
                         { title: "النمو الوميضي", color: "text-orange-600", bg: "bg-orange-50" },
                         { title: "الريادة العالمية", color: "text-blue-600", bg: "bg-blue-50" }
                       ].map((item, i) => (
                         <div key={i} className={cn("flex flex-col items-center justify-center p-2 md:p-4 rounded-xl md:rounded-[24px] border border-transparent", item.bg)}>
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
