
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview المضاعف السعري المركزي v12.5
 * تم تعديل المنطق ليختفي تماماً أثناء مرحلة الانتظار لترك الساحة للعداد النقي ومنع التداخل.
 */
export function CrashMultiplier({ multiplier, state }: { multiplier: number, state: 'waiting' | 'running' | 'crashed' }) {
  return (
    <div className="relative z-30 text-center select-none font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {state === 'crashed' ? (
          <motion.div
            key="crashed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-1"
          >
            <h2 className="text-6xl md:text-8xl font-black text-red-500 tabular-nums tracking-tighter drop-shadow-2xl leading-none">
              {multiplier.toFixed(2)}x
            </h2>
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-none">Protocol Crashed</p>
          </motion.div>
        ) : state === 'running' ? (
          <motion.div
            key="running"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-2"
          >
            <h2 className="text-7xl md:text-9xl font-black tabular-nums tracking-tighter text-[#002d4d] leading-none">
              {multiplier.toFixed(2)}x
            </h2>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
