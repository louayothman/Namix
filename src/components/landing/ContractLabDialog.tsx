
"use client";

import React from "react";
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
  Sparkles, 
  ChevronLeft,
  Zap,
  Layers,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview نافذة مختبر العقود المحدثة v1.1 - No Lottie
 * استبدال الرسم المتحرك بمفاعل طبقات نانوي ذكي لمنع التعليق.
 */

interface ContractLabDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractLabDialog({ open, onOpenChange }: ContractLabDialogProps) {
  const router = useRouter();

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
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                     <Layers className="h-32 w-32 md:h-56 md:w-56 text-emerald-500 drop-shadow-[0_0_40px_rgba(16,185,129,0.3)]" strokeWidth={1} />
                  </motion.div>
               </div>
               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-[7px] md:text-[9px] uppercase tracking-widest">
                     <Zap size={10} className="fill-current" />
                     Sovereign Yield Engine
                  </div>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right">
                  <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none">مختبر العقود</DialogTitle>
                  <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-40">Investment Protocol Node</p>
               </div>

               <div className="space-y-5 md:space-y-10">
                  <h4 className="text-[11px] md:text-xl font-black text-emerald-600 leading-tight">هندسة الثروة عبر العقود الذكية</h4>
                  <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right">
                     مختبر العقود في ناميكس هو قلب النمو المالي للمنصة. نوفر لك بيئة استثمارية مؤتمتة بالكامل تعتمد على عقود تشغيلية ذكية تولد عوائد مستقرة.
                  </p>
               </div>

               <div className="pt-6 border-t border-gray-50 mt-auto flex justify-start">
                  <Button onClick={() => { onOpenChange(false); router.push("/login"); }} className="h-10 md:h-16 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[9px] md:text-lg shadow-xl active:scale-95 transition-all">
                     تفعيل العقود الاستثمارية
                  </Button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
