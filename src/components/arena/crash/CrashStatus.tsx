
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
      <AnimatePresence mode="wait">
        {state === 'waiting' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="px-8 py-4 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[32px] shadow-2xl flex flex-col items-center gap-2 min-w-[200px]"
          >
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin duration-[3s]">
                   <Clock size={16} />
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Next Launch In</p>
                   <p className="text-lg font-black text-[#002d4d] tabular-nums leading-none">{timer}s</p>
                </div>
             </div>
             <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: timer, ease: "linear" }}
                  className="h-full bg-blue-500"
                />
             </div>
          </motion.div>
        )}

        {state === 'running' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 px-6 py-2.5 bg-[#002d4d] rounded-full border border-white/10 shadow-2xl"
          >
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
             <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Protocol Active</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
