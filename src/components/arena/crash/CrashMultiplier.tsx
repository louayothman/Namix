
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview محرك المضاعف المدمج v12.0 - Optimized Compact Edition
 * - تصميم نقي يتناسب مع الحاوية متوسطة الارتفاع.
 * - تطهير كامل من تباعد الحروف العربية.
 */
export function CrashMultiplier({ multiplier, state }: { multiplier: number, state: 'waiting' | 'running' | 'crashed' }) {
  return (
    <div className="relative z-20 text-center select-none font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {state === 'crashed' ? (
          <motion.div
            key="crashed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-1"
          >
            <h2 className="text-6xl md:text-7xl font-black text-red-500 tabular-nums tracking-tighter drop-shadow-xl leading-none">
              {multiplier.toFixed(2)}x
            </h2>
            <div className="flex items-center justify-center gap-3 opacity-60">
               <div className="h-[1px] w-4 bg-red-200 rounded-full" />
               <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">انفجار البروتوكول</p>
               <div className="h-[1px] w-4 bg-red-200 rounded-full" />
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
              "text-6xl md:text-8xl font-black tabular-nums tracking-tighter transition-all duration-500 leading-none",
              state === 'waiting' ? "text-gray-100" : "text-[#002d4d] drop-shadow-sm"
            )}>
              {multiplier.toFixed(2)}x
            </h2>
            {state === 'running' && (
              <div className="flex items-center justify-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                 <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">معالجة النمو الاستراتيجي</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
