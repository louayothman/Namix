
"use client";

import { motion } from "framer-motion";
import { Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview سجل جولات الكراش v3.0 - Top Flow Edition
 * تم إزالة النصوص الزائدة وتثبيت العرض لآخر 10 جولات في القمة.
 */
export function CrashHistory({ results }: { results: number[] }) {
  return (
    <div className="w-full flex items-center gap-3 overflow-x-auto scrollbar-none font-body tracking-normal" dir="rtl">
      <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-inner">
         <Sparkles size={10} className="text-[#f9a885] animate-pulse" />
         <span className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest leading-none">Global Feed</span>
      </div>

      <div className="flex items-center gap-2">
        {results.slice(0, 10).map((res, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0, x: 10 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            className={cn(
              "px-3 py-1.5 rounded-xl font-black text-[10px] tabular-nums shadow-sm border transition-all hover:scale-110 cursor-default shrink-0",
              res >= 5 ? "bg-purple-50 text-purple-600 border-purple-100" :
              res >= 2 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
              res >= 1.5 ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-500 border-red-100"
            )}
          >
            {res.toFixed(2)}x
          </motion.div>
        ))}
      </div>
    </div>
  );
}
