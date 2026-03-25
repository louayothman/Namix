
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview سجل جولات الكراش v5.0 - Professional Feed Edition
 * محاكاة دقيقة لتصميم شريط النتائج في كبرى المنصات (Pills with colors).
 */
export function CrashHistory({ results }: { results: number[] }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none font-body tracking-normal" dir="ltr">
      {results.slice(0, 8).map((res, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "px-3 py-1.5 rounded-full font-black text-[10px] tabular-nums shadow-sm border transition-all shrink-0",
            res >= 10 ? "bg-purple-100 text-purple-700 border-purple-200" :
            res >= 2 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
            res >= 1.5 ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-red-50 text-red-500 border-red-100"
          )}
        >
          {res.toFixed(2)}x
        </motion.div>
      ))}
    </div>
  );
}
