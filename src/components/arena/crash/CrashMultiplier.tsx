
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview محرك المضاعف المدمج v7.0 - Precision Compact Edition
 * تم ضبط الحجم ليكون أنيقاً ومتناسباً مع الحاوية الموسعة (ليس ضخماً جداً).
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
            className="space-y-3"
          >
            <h2 className="text-6xl md:text-8xl font-black text-red-500 tabular-nums tracking-tighter drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              {multiplier.toFixed(2)}x
            </h2>
            <div className="flex flex-col items-center gap-1.5">
               <p className="text-sm font-black text-red-400 uppercase tracking-[0.4em] leading-none tracking-normal">Crashed</p>
               <div className="h-1 w-12 bg-red-100 rounded-full" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="relative">
               <h2 className={cn(
                 "text-6xl md:text-8xl font-black tabular-nums tracking-tighter transition-colors duration-500",
                 state === 'waiting' ? "text-gray-100" : "text-[#002d4d]"
               )}>
                 {multiplier.toFixed(2)}x
               </h2>
               {state === 'running' && (
                 <motion.div 
                   animate={{ opacity: [0.1, 0.3, 0.1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full" 
                 />
               )}
            </div>
            
            {state === 'running' && (
              <div className="flex items-center justify-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest tracking-normal">In Flight...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
