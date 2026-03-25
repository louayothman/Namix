
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الحالة السيادي v5.0 - Dynamic Positioning
 * - عداد الجولة شفاف تماماً فوق المفاعل.
 * - وضع نص "بروتوكول نشط" في الزاوية اليمنى السفلية بخط ناعم.
 */
export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="font-body tracking-normal" dir="rtl">
      {/* حالة المفاعل - تظهر في الزاوية اليمنى السفلية عند بدء الجولة */}
      <AnimatePresence>
        {state === 'running' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/50 backdrop-blur-md border border-emerald-100 shadow-sm"
          >
             <ShieldCheck size={12} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest tracking-normal">بروتوكول نشط</span>
             <div className="flex items-center gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-[1.5px] h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* العداد الشفاف - يظهر في مركز المفاعل عند الانتظار */}
      <AnimatePresence>
        {state === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
             <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                   <Activity size={12} className="text-blue-400 animate-pulse" />
                   <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em] tracking-normal">الجولة القادمة</span>
                </div>
                <span className="text-7xl font-black text-[#002d4d] tabular-nums tracking-tighter">{timer}s</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
