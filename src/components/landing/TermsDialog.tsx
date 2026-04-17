
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
  ShieldCheck, 
  ChevronLeft,
  Gavel,
  ScrollText,
  Loader2,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NebulaBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#f9a885]">
    <div className="absolute top-[-30%] right-[-20%] w-[120%] h-[120%] bg-white/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-white/10 rounded-full blur-[120px]" />
  </div>
);

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
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
            
            <div className="w-1/2 bg-[#f9a885] p-4 md:p-10 relative overflow-hidden flex flex-col items-center justify-center border-l border-black/5">
               <NebulaBackground />
               
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-[60px] animate-pulse" />
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                     <Gavel className="h-32 w-32 md:h-56 md:w-56 text-[#002d4d] drop-shadow-[0_0_40px_rgba(0,45,77,0.2)]" strokeWidth={1} />
                     <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                       transition={{ duration: 3, repeat: Infinity }}
                       className="absolute inset-[-10px] rounded-full border border-[#002d4d]/10"
                     />
                  </motion.div>
               </div>

               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#002d4d] font-black text-[7px] md:text-[9px] uppercase tracking-normal">
                     <ShieldCheck size={10} />
                     Legal Agreement
                  </div>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right group/header">
                  <div className="relative inline-flex items-center justify-start">
                     <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5 transition-all duration-700 pointer-events-none text-blue-600">
                        <FileText size={80} className="md:size-[120px]" />
                     </div>
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">الشروط والأحكام</DialogTitle>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-start opacity-40">
                     <div className="h-1 w-1 rounded-full bg-[#f9a885] animate-pulse" />
                     <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-normal">Institutional Compliance Protocol</p>
                  </div>
               </div>

               {isLoading ? (
                 <div className="py-10 flex flex-col items-center gap-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-normal">Syncing Ledger...</p>
                 </div>
               ) : (
                 <div className="space-y-5 md:space-y-10">
                    <div className="space-y-1.5 md:space-y-2">
                       <h4 className="text-[11px] md:text-xl font-black text-blue-600 leading-tight tracking-normal">
                          ميثاق الاستخدام والمسؤولية القانونية
                       </h4>
                       <div className="h-0.5 w-8 md:w-12 bg-[#f9a885] rounded-full" />
                    </div>
                    
                    <div className="max-h-[150px] md:max-h-[200px] overflow-y-auto pr-1 scrollbar-none">
                      <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right whitespace-pre-wrap">
                         {legal?.termsAndConditions || "يرجى قراءة شروط وأحكام استخدام منصة ناميكس بعناية."}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                       {[
                         { title: "عقد ملزم", color: "text-red-600", bg: "bg-red-50" },
                         { title: "وضوح مالي", color: "text-emerald-600", bg: "bg-emerald-50" },
                         { title: "أمان قانوني", color: "text-blue-600", bg: "bg-blue-50" }
                       ].map((item, i) => (
                         <div key={i} className={cn("flex flex-col items-center justify-center p-2 md:p-4 rounded-xl md:rounded-[24px]", item.bg)}>
                            <span className={cn("text-[6px] md:text-[10px] font-black text-center leading-tight tracking-normal", item.color)}>{item.title}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               <div className="pt-6 border-t border-gray-50 mt-auto flex justify-start">
                  <Button onClick={() => onOpenChange(false)} className="h-10 md:h-14 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[9px] md:text-sm shadow-xl active:scale-95 group transition-all">
                     لقد قرأت الشروط
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
