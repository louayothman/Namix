
"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Zap } from "lucide-react";

/**
 * @fileOverview بروتوكول معايرة التشغيل - Namix Calibration Loader
 * لودر احترافي يحاكي عملية فحص النظم قبل الدخول لقمرة القيادة.
 */
export function MarketScanner() {
  return (
    <div className="relative h-48 w-full flex flex-col items-center justify-center overflow-hidden bg-white rounded-[40px] border border-gray-100 shadow-inner">
      
      {/* حلقات الطاقة الخلفية */}
      <div className="absolute inset-0 pointer-events-none">
         <motion.div 
           animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.1, 0.05] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full blur-3xl"
         />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
         {/* المفاعل المركزي */}
         <div className="relative h-20 w-20 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[2px] border-dashed border-[#002d4d]/20 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10px] border border-blue-500/10 rounded-full"
            />
            <div className="h-14 w-14 rounded-2xl bg-[#002d4d] flex items-center justify-center shadow-2xl">
               <Cpu className="h-7 w-7 text-[#f9a885] animate-pulse" />
            </div>
         </div>

         {/* نصوص المعايرة */}
         <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
               <p className="text-xs font-black text-[#002d4d] uppercase tracking-normal">بروتوكول معايرة التشغيل</p>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-40">
               <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.4em]">Initializing Core Sync...</p>
               <div className="h-0.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-full w-full bg-[#f9a885]"
                  />
               </div>
            </div>
         </div>
      </div>

      {/* لمسة تقنية في الزوايا */}
      <div className="absolute top-6 left-8 opacity-10">
         <ShieldCheck size={40} className="text-[#002d4d]" />
      </div>
      <div className="absolute bottom-6 right-8 opacity-10">
         <Zap size={40} className="text-[#f9a885]" />
      </div>
    </div>
  );
}
