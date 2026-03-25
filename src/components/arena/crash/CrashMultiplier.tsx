
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview محرك المضاعف العملاق v5.0 - Titan Scale
 * تم زيادة أحجام الخطوط بنسبة كبيرة لتتصدر المفاعل الصاعد.
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
            exit={{ scale: 1.5, opacity: 0 }}
            className="space-y-4"
          >
            <h2 className="text-8xl md:text-[12rem] font-black text-red-500 tabular-nums tracking-tighter drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]">
              {multiplier.toFixed(2)}x
            </h2>
            <div className="flex flex-col items-center gap-2">
               <p className="text-xl font-black text-red-400 uppercase tracking-[0.6em] leading-none">Crashed</p>
               <div className="h-1.5 w-20 bg-red-100 rounded-full" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="relative">
               <h2 className={cn(
                 "text-9xl md:text-[14rem] font-black tabular-nums tracking-tighter transition-colors duration-500",
                 state === 'waiting' ? "text-gray-100" : "text-[#002d4d]"
               )}>
                 {multiplier.toFixed(2)}x
               </h2>
               {state === 'running' && (
                 <motion.div 
                   animate={{ opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" 
                 />
               )}
            </div>
            
            {state === 'running' && (
              <div className="flex items-center justify-center gap-4">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />
                 <p className="text-sm font-black text-emerald-600 uppercase tracking-[0.5em] tracking-normal">In Flight...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
