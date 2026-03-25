
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview محرك المضاعف المدمج v8.0 - Elite Professional Scale
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
            className="space-y-2"
          >
            <h2 className="text-5xl md:text-7xl font-black text-red-500 tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              {multiplier.toFixed(2)}x
            </h2>
            <div className="flex flex-col items-center gap-1">
               <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] leading-none">Crashed</p>
               <div className="h-0.5 w-8 bg-red-100 rounded-full" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="relative">
               <h2 className={cn(
                 "text-5xl md:text-7xl font-black tabular-nums tracking-tighter transition-colors duration-500",
                 state === 'waiting' ? "text-gray-100" : "text-[#002d4d]"
               )}>
                 {multiplier.toFixed(2)}x
               </h2>
               {state === 'running' && (
                 <motion.div 
                   animate={{ opacity: [0.05, 0.15, 0.05] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-blue-500/5 blur-[60px] rounded-full" 
                 />
               )}
            </div>
            
            {state === 'running' && (
              <div className="flex items-center justify-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">In Flight...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
