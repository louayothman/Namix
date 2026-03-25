
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الحالة السيادي v7.0 - Pure Centered Countdown
 * - العداد يظهر منفرداً في المركز دون أي تداخل.
 * - حالة "بروتوكول نشط" ثابتة في الزاوية لضمان استقرار المشهد.
 */
export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none font-body tracking-normal" dir="rtl">
      {/* حالة المفاعل - الزاوية اليمنى السفلية */}
      <AnimatePresence>
        {state === 'running' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-emerald-100/30"
          >
             <ShieldCheck size={10} className="text-emerald-500" />
             <span className="text-[9px] font-black text-emerald-600/80 uppercase tracking-widest">بروتوكول نشط</span>
             <div className="flex items-center gap-0.5">
                {[1, 2].map(i => (
                  <div key={i} className="w-[1px] h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* العداد المركزي النقي - يظهر فقط عند الانتظار */}
      <AnimatePresence>
        {state === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
             <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 opacity-30">
                   <div className="h-px w-8 bg-blue-400" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">الجولة القادمة</span>
                   <div className="h-px w-8 bg-blue-400" />
                </div>
                <span className="text-8xl font-black text-[#002d4d] tabular-nums tracking-tighter opacity-90 drop-shadow-sm">
                  {timer}s
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
