
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function CrashMultiplier({ multiplier, state }: { multiplier: number, state: 'waiting' | 'running' | 'crashed' }) {
  return (
    <div className="relative z-30 text-center select-none font-body tracking-normal">
      <AnimatePresence mode="wait">
        {state === 'running' && (
          <motion.div
            key="running"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-8xl md:text-[120px] font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] leading-none">
              {multiplier.toFixed(2)}x
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
