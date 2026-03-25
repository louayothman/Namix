
"use client";

import { motion } from "framer-motion";
import { History, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function CrashHistory({ results }: { results: number[] }) {
  return (
    <div className="space-y-5 font-body tracking-normal">
      <div className="flex items-center justify-between px-3">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#002d4d] shadow-inner">
               <History className="h-4 w-4" />
            </div>
            <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">نتائج الساحة</h4>
         </div>
         <div className="flex items-center gap-2 px-3 py-1 bg-blue-50/50 rounded-full border border-blue-100">
            <Sparkles size={10} className="text-blue-500 animate-pulse" />
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Global Feed</span>
         </div>
      </div>

      <div className="flex flex-wrap gap-2.5 px-1">
        {results.map((res, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "px-4 py-2 rounded-2xl font-black text-[12px] tabular-nums shadow-sm border transition-all hover:scale-110 cursor-default",
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
