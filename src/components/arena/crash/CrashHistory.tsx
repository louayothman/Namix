
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { History } from "lucide-react";

export function CrashHistory({ results }: { results: number[] }) {
  return (
    <div className="w-full bg-[#001d33]/40 backdrop-blur-md rounded-[20px] p-2 flex items-center gap-3 overflow-hidden border border-white/5 shadow-inner" dir="ltr">
      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-200/40 shrink-0">
         <History size={14} />
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1">
        {results.map((res, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black tabular-nums shadow-sm transition-colors",
              res >= 2 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
            )}
          >
            {res.toFixed(2)}x
          </motion.div>
        ))}
      </div>
    </div>
  );
}
