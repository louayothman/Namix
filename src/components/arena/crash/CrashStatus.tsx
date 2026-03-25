
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

/**
 * @fileOverview شريط الحالة السيادي v8.5 - Nano Precision Positioning
 * - العداد يظهر منفرداً في المركز بنقاء كريستالي عند الانتظار.
 * - حالة "بروتوكول نشط" استقرت في الزاوية اليمنى السفلية بخط نانو ناعم.
 */
export function CrashStatus({ state, timer }: { state: 'waiting' | 'running' | 'crashed', timer: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none font-body tracking-normal" dir="rtl">
      
      {/* حالة المفاعل - الزاوية اليمنى السفلية بخط نانوى ناعم جداً */}
      <AnimatePresence>
        {state === 'running' && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 right-6 flex items-center gap-2 opacity-40"
          >
             <ShieldCheck size={8} className="text-emerald-500" />
             <span className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest">بروتوكول نشط</span>
             <div className="flex items-center gap-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-emerald-400 animate-ping" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* العداد المركزي النقي - يظهر فقط عند الانتظار بدون أي بطاقة خلفية */}
      <AnimatePresence mode="wait">
        {state === 'waiting' && (
          <motion.div
            key="waiting-counter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
             <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] opacity-50 mb-2">الجولة القادمة</span>
                <span className="text-8xl font-black text-[#002d4d] tabular-nums tracking-tighter opacity-90">
                  {timer}s
                </span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
