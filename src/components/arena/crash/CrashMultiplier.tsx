
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview محرك المضاعف المدمج v9.0 - Professional Compact Scale
 * تم تصغير حجم الخط ليكون أكثر أناقة وتناسباً مع المساحة الشاسعة للمفاعل.
 */
export function CrashMultiplier({ multiplier, state }: { multiplier: number, state: 'waiting' | 'running' | 'crashed' }) {
  return (
    <div className="relative z-20 text-center select-none font-body tracking-normal">
      <AnimatePresence mode="wait">
        {state === 'crashed' ? (
          <motion.div
            key="crashed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="space-y-1"
          >
            <h2 className="text-4xl md:text-6xl font-black text-red-500 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.15)] leading-none">
              {multiplier.toFixed(2)}x
            </h2>
            <div className="flex flex-col items-center gap-1">
               <p className="text-[8px] font-black text-red-400 uppercase tracking-[0.3em] leading-none">Crashed</p>
               <div className="h-[0.5px] w-6 bg-red-100 rounded-full" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="relative">
               <h2 className={cn(
                 "text-4xl md:text-6xl font-black tabular-nums tracking-tighter transition-colors duration-500 leading-none",
                 state === 'waiting' ? "text-gray-100" : "text-[#002d4d]"
               )}>
                 {multiplier.toFixed(2)}x
               </h2>
               {state === 'running' && (
                 <motion.div 
                   animate={{ opacity: [0.05, 0.1, 0.05] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-blue-500/5 blur-[40px] rounded-full" 
                 />
               )}
            </div>
            
            {state === 'running' && (
              <div className="flex items-center justify-center gap-1.5">
                 <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">In Flight...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
