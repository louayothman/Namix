
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
  Activity, 
  TrendingUp, 
  Radar,
  ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview نافذة التداول الفوري المحدثة v1.1 - No Lottie
 * استبدال الرسم المتحرك برادار نبضي نانوي لضمان سرعة الصفحة.
 */

interface SpotTradingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpotTradingDialog({ open, onOpenChange }: SpotTradingDialogProps) {
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
            
            <div className="w-1/2 bg-[#f9a885] p-4 md:p-10 relative overflow-hidden flex flex-col items-center justify-center border-l border-black/5">
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                     <TrendingUp className="h-32 w-32 md:h-56 md:w-56 text-[#002d4d] drop-shadow-[0_0_40px_rgba(0,45,77,0.2)]" strokeWidth={1} />
                  </motion.div>
               </div>
               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#002d4d] font-black text-[7px] md:text-[9px] uppercase tracking-widest">
                     <Activity size={10} />
                     Live Market Pulse
                  </div>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right">
                  <div className="relative inline-flex items-center justify-start">
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">التداول الفوري</DialogTitle>
                  </div>
                  <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-40">Direct Market Access Node</p>
               </div>

               <div className="space-y-5 md:space-y-10">
                  <h4 className="text-[11px] md:text-xl font-black text-blue-600 leading-tight">اقتناص الفرص بنبض الأسواق اللحظي</h4>
                  <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right">
                     اكتشف عالم التداول اللحظي مع ناميكس. نوفر لك إمكانية الدخول المباشر إلى الأسواق العالمية بأقل سبريد ممكن ومعالجة وميضية للأوامر.
                  </p>
               </div>

               <div className="pt-6 border-t border-gray-50 mt-auto flex justify-start">
                  <Button onClick={() => { onOpenChange(false); router.push("/login"); }} className="h-10 md:h-16 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[9px] md:text-sm shadow-xl active:scale-95 transition-all">
                     ابدأ التداول الذكي
                  </Button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
