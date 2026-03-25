
"use client";

import { motion } from "framer-motion";
import { History, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function CrashHistory({ results }: { results: number[] }) {
  return (
    <div className="space-y-4 font-body">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-gray-400" />
            <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">سجل الانفجارات</h4>
         </div>
         <div className="flex items-center gap-1.5 opacity-30">
            <Activity className="h-2.5 w-2.5 text-blue-500 animate-pulse" />
            <span className="text-[7px] font-black uppercase">Live Feed</span>
         </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {results.map((res, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "px-4 py-2 rounded-2xl font-black text-[11px] tabular-nums shadow-sm border",
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
