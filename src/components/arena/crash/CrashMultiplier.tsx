
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview محرك المضاعف المدمج v10.0 - Clean Modern Scale
 * تم تطهير التصميم ليكون نقيّاً بأسلوب ناميكس (Navy Blue) مع أحجام خطوط احترافية.
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
            className="space-y-1"
          >
            <h2 className="text-6xl md:text-8xl font-black text-red-500 tabular-nums tracking-tighter drop-shadow-sm leading-none">
              {multiplier.toFixed(2)}x
            </h2>
            <div className="flex items-center justify-center gap-2">
               <div className="h-[1px] w-4 bg-red-100" />
               <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] leading-none">Crashed</p>
               <div className="h-[1px] w-4 bg-red-100" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <h2 className={cn(
              "text-6xl md:text-8xl font-black tabular-nums tracking-tighter transition-colors duration-500 leading-none",
              state === 'waiting' ? "text-gray-100" : "text-[#002d4d]"
            )}>
              {multiplier.toFixed(2)}x
            </h2>
            {state === 'running' && (
              <div className="flex items-center justify-center gap-2">
                 <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">In Flight...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
