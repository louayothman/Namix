
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الحالة السيادي v3.0 - Zero-Background Edition
 * تم تجريد البطاقات لجعل العداد يسبح فوق المفاعل، ونقل الحالة للزاوية اليمنى السفلية.
 */
export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {state === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          >
             <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] leading-none mb-2 animate-pulse">
                  Next Launch In
                </p>
                <div className="flex items-center gap-4">
                   <Clock size={18} className="text-blue-200 animate-spin duration-[6s]" />
                   <span className="text-5xl font-black text-[#002d4d] tabular-nums leading-none">
                     {timer}s
                   </span>
                </div>
             </div>
             
             <div className="w-32 h-[1px] bg-gray-100 relative mt-4">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: timer, ease: "linear" }}
                  className="absolute right-0 h-full bg-blue-500"
                />
             </div>
          </motion.div>
        )}

        {state === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-6 right-6 flex items-center gap-2.5 opacity-40 hover:opacity-100 transition-opacity duration-500"
          >
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
             <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-widest">بروتوكول نشط</span>
                <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Operational Node</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
