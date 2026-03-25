
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function CrashMultiplier({ multiplier, state }: { multiplier: number, state: 'waiting' | 'running' | 'crashed' }) {
  return (
    <div className="relative z-20 text-center select-none">
      <AnimatePresence mode="wait">
        {state === 'crashed' ? (
          <motion.div
            key="crashed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="space-y-2"
          >
            <h2 className="text-6xl md:text-8xl font-black text-red-500 tabular-nums tracking-tighter drop-shadow-2xl">
              {multiplier.toFixed(2)}x
            </h2>
            <p className="text-sm font-black text-red-400 uppercase tracking-[0.4em]">Crashed / انفجار</p>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <h2 className={cn(
              "text-7xl md:text-9xl font-black tabular-nums tracking-tighter drop-shadow-2xl transition-colors duration-500",
              state === 'waiting' ? "text-gray-200" : "text-[#002d4d]"
            )}>
              {multiplier.toFixed(2)}x
            </h2>
            {state === 'running' && (
              <div className="flex items-center justify-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em]">Scaling Profit...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
