
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الحالة السيادي v4.0 - Screenshot Simulation
 * وضع حالة الشبكة في الزاوية اليمنى السفلية بأسلوب ناعم.
 */
export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="flex items-center gap-2 font-body tracking-normal" dir="rtl">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm transition-opacity duration-500",
        state === 'waiting' ? "opacity-0" : "opacity-100"
      )}>
         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">حالة الشبكة</span>
         <div className="flex items-center gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn("w-[2px] rounded-full bg-emerald-500 animate-pulse", i === 1 ? "h-2" : i === 2 ? "h-3" : "h-2.5")} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
         </div>
      </div>

      <AnimatePresence>
        {state === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
             <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] animate-pulse">Next Round</span>
                <span className="text-6xl font-black text-[#002d4d] tabular-nums tracking-tighter">{timer}s</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
