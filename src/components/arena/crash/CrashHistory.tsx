
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview سجل جولات الكراش v4.0 - Global Feed Edition
 * تم تطهير الواجهة من كلمة سجل وتثبيت العرض لآخر 10 جولات في القمة بأسلوب نقي.
 */
export function CrashHistory({ results }: { results: number[] }) {
  return (
    <div className="w-full flex items-center gap-4 overflow-x-auto scrollbar-none font-body tracking-normal" dir="rtl">
      {/* Global Status Pill */}
      <div className="shrink-0 flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 shadow-inner">
         <Sparkles size={12} className="text-[#f9a885] animate-pulse" />
         <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-widest leading-none">Global Feed</span>
      </div>

      {/* Results Matrix */}
      <div className="flex items-center gap-2.5">
        {results.slice(0, 10).map((res, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0, x: 15 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            className={cn(
              "px-4 py-2 rounded-2xl font-black text-[11px] tabular-nums shadow-sm border transition-all hover:scale-110 cursor-default shrink-0",
              res >= 10 ? "bg-purple-100 text-purple-700 border-purple-200" :
              res >= 5 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
              res >= 2 ? "bg-blue-50 text-blue-600 border-blue-100" : 
              res >= 1.5 ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-red-50 text-red-500 border-red-100"
            )}
          >
            {res.toFixed(2)}x
          </motion.div>
        ))}
      </div>
    </div>
  );
}
