
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الحالة السيادي v6.0 - Clean Strategic Positioning
 * - عداد الجولة شفاف تماماً فوق المفاعل.
 * - وضع نص "بروتوكول نشط" في الزاوية اليمنى السفلية بخط ناعم جداً.
 */
export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="font-body tracking-normal" dir="rtl">
      {/* حالة المفاعل - تظهر في الزاوية اليمنى السفلية */}
      <AnimatePresence>
        {state === 'running' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-emerald-100/30"
          >
             <ShieldCheck size={10} className="text-emerald-500" />
             <span className="text-[9px] font-black text-emerald-600/80 uppercase tracking-widest tracking-normal">بروتوكول نشط</span>
             <div className="flex items-center gap-0.5">
                {[1, 2].map(i => (
                  <div key={i} className="w-[1px] h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* العداد النقي والشفاف - يظهر في مركز المفاعل عند الانتظار */}
      <AnimatePresence>
        {state === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
             <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 opacity-30">
                   <Activity size={10} className="text-blue-400 animate-pulse" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] tracking-normal">الجولة القادمة</span>
                </div>
                <span className="text-6xl font-black text-[#002d4d] tabular-nums tracking-tighter opacity-80">{timer}s</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
