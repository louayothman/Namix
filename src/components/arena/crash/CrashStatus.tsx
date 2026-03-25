
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Timer } from "lucide-react";

export function CrashStatus({ state, timer, multiplier }: { state: 'waiting' | 'running' | 'crashed', timer: number, multiplier?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none font-body flex items-center justify-center">
      <AnimatePresence mode="wait">
        {state === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-4"
          >
             <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                <Timer className="text-[#f9a885] animate-pulse" size={32} />
             </div>
             <div className="text-center space-y-1">
                <p className="text-blue-200/60 font-black text-[10px] uppercase tracking-[0.4em]">Next Flight In</p>
                <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{timer}s</span>
             </div>
          </motion.div>
        )}

        {state === 'crashed' && (
          <motion.div
            key="crashed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
             <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-xl px-10 py-6 rounded-[40px] shadow-2xl flex flex-col items-center gap-2">
                <AlertTriangle className="text-red-500 mb-2" size={40} />
                <h3 className="text-red-500 font-black text-xl uppercase tracking-widest">Protocol Crashed</h3>
                <span className="text-5xl font-black text-white tabular-nums tracking-tighter">@{multiplier?.toFixed(2)}x</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
