
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
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  Sparkles, 
  ChevronLeft,
  Globe,
  Info,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview نافذة "من نحن" المحدثة v1.1 - No Lottie
 * استبدال الرسم المتحرك الثقيل بكرة أرضية نانوية متوهجة لضمان سرعة الصفحة.
 */

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
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-[#f9a885]/10" />
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <motion.div 
                    animate={{ y: [0, -15, 0], rotate: 360 }}
                    transition={{ y: { duration: 6, repeat: Infinity }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }}
                    className="relative"
                  >
                     <Globe className="h-32 w-32 md:h-56 md:w-56 text-[#f9a885] drop-shadow-[0_0_30px_rgba(249,168,133,0.3)]" strokeWidth={1} />
                  </motion.div>
               </div>
               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#f9a885] font-black text-[7px] md:text-[9px] uppercase tracking-widest">
                     <Sparkles size={10} />
                     Sovereign Identity Node
                  </div>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right">
                  <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none">من نحن</DialogTitle>
                  <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-40">Institutional Identity Protocol</p>
               </div>

               {isLoading ? (
                 <div className="py-10 flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <p className="text-[8px] font-black text-gray-300 uppercase">Loading Protocol...</p>
                 </div>
               ) : (
                 <div className="space-y-5 md:space-y-10">
                    <h4 className="text-[11px] md:text-xl font-black text-blue-600 leading-tight">
                       {legal?.tagline || "حيث تحقق راحتك المالية الاحترافية"}
                    </h4>
                    <div className="max-h-[150px] md:max-h-[200px] overflow-y-auto pr-1 scrollbar-none">
                      <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right whitespace-pre-wrap">
                         {legal?.aboutUs || "ناميكس هي رائدتكم في الاستثمار الرقمي المتطور."}
                      </p>
                    </div>
                 </div>
               )}

               <div className="pt-6 border-t border-gray-50 mt-auto flex justify-start">
                  <Button onClick={() => onOpenChange(false)} className="h-10 md:h-14 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[9px] md:text-sm shadow-xl transition-all">
                     إغلاق والعودة
                  </Button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
