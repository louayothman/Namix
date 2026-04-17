
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
  ShieldCheck, 
  ChevronLeft,
  Zap,
  Activity,
  Globe,
  TrendingUp,
  Radar
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NebulaBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#f9a885]">
    <div className="absolute top-[-30%] right-[-20%] w-[120%] h-[120%] bg-white/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-orange-900/5 rounded-full blur-[120px]" />
  </div>
);

interface SpotTradingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpotTradingDialog({ open, onOpenChange }: SpotTradingDialogProps) {
  const router = useRouter();

  const handleAction = () => {
    const userSession = typeof window !== "undefined" ? localStorage.getItem("namix_user") : null;
    onOpenChange(false);
    if (userSession) router.push("/trade");
    else router.push("/login");
  };

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
                    animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                     <TrendingUp className="h-32 w-32 md:h-56 md:w-56 text-[#002d4d] drop-shadow-[0_0_40px_rgba(0,45,77,0.2)]" strokeWidth={1} />
                     <motion.div 
                       animate={{ opacity: [0.1, 0.4, 0.1] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="absolute top-0 right-0"
                     >
                        <Zap size={40} className="text-white fill-[#002d4d]" />
                     </motion.div>
                  </motion.div>
               </div>

               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#002d4d] font-black text-[7px] md:text-[9px] uppercase tracking-normal">
                     <Activity size={10} />
                     Live Market Pulse
                  </div>
                  <p className="text-[#002d4d]/40 text-[6px] md:text-[8px] font-bold uppercase tracking-widest">Namix Trading Hub</p>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-16 space-y-6 md:space-y-12 bg-white relative flex flex-col justify-center">
               <div className="space-y-2 md:space-y-4 text-right group/header">
                  <div className="relative inline-flex items-center justify-start">
                     <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5 transition-all duration-700 pointer-events-none text-blue-600">
                        <Radar size={80} className="md:size-[120px]" />
                     </div>
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">التداول الفوري</DialogTitle>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-start opacity-40">
                     <div className="h-1 w-1 rounded-full bg-[#f9a885] animate-pulse" />
                     <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-normal">Direct Market Access Node</p>
                  </div>
               </div>

               <div className="space-y-5 md:space-y-10">
                  <div className="space-y-1.5 md:space-y-2 text-right">
                     <h4 className="text-[11px] md:text-xl font-black text-blue-600 leading-tight">
                        اقتناص الفرص بنبض الأسواق اللحظي
                     </h4>
                     <div className="h-0.5 w-8 md:w-12 bg-[#f9a885] rounded-full" />
                  </div>
                  
                  <div className="max-h-[150px] md:max-h-[200px] overflow-y-auto pr-1 scrollbar-none">
                    <p className="text-gray-500 font-bold leading-[1.8] md:leading-[2.2] text-[10px] md:text-sm text-right whitespace-pre-wrap">
                       اكتشف عالم التداول اللحظي مع ناميكس. نوفر لك إمكانية الدخول المباشر إلى الأسواق العالمية بأقل سبريد ممكن.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                     {[
                       { title: "سبريد نانوي", color: "text-emerald-600", bg: "bg-emerald-50" },
                       { title: "تنفيذ فوري", color: "text-blue-600", bg: "bg-blue-50" },
                       { title: "دقة فنية", color: "text-orange-600", bg: "bg-orange-50" }
                     ].map((item, i) => (
                       <div key={i} className={cn("flex flex-col items-center justify-center p-2 md:p-4 rounded-xl md:rounded-[24px]", item.bg)}>
                          <span className={cn("text-[6px] md:text-[10px] font-black text-center leading-tight", item.color)}>{item.title}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-50 mt-auto flex flex-col gap-3">
                  <Button onClick={handleAction} className="h-10 md:h-16 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] md:text-lg shadow-xl active:scale-95 group transition-all">
                     ابدأ التداول الذكي
                     <ChevronLeft className="mr-2 h-4 w-4 md:h-6 md:w-6 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                  <button onClick={() => onOpenChange(false)} className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors text-center">إغلاق</button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
