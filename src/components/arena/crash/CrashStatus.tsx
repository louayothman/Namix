
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, ShieldCheck, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 font-body tracking-normal">
      <AnimatePresence mode="wait">
        {state === 'waiting' && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 1.1 }}
            className="px-10 py-5 bg-white/90 backdrop-blur-2xl border border-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center gap-3 min-w-[240px]"
          >
             <div className="flex items-center gap-4">
                <div className="relative">
                   <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin duration-[4s]">
                      <Clock size={20} />
                   </div>
                   <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-md" />
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Next Launch In</p>
                   <p className="text-2xl font-black text-[#002d4d] tabular-nums leading-none">{timer}s</p>
                </div>
             </div>
             
             {/* Progress Rail */}
             <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1 shadow-inner p-0.5">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: timer, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full"
                />
             </div>
             <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] animate-pulse">Accepting Bets...</p>
          </motion.div>
        )}

        {state === 'running' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-4 px-8 py-3.5 bg-[#002d4d] rounded-full border border-white/10 shadow-2xl shadow-blue-900/40"
          >
             <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] relative z-10" />
             </div>
             <div className="flex items-center gap-3">
                <Rocket size={14} className="text-[#f9a885] animate-bounce" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Protocol Active</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
