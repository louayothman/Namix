
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { History, LayoutGrid, Clock } from "lucide-react";

/**
 * @fileOverview سجل جولات الكراش الاحترافي v10.0
 * محاكاة دقيقة للصورة المرفقة: شريط علوي يضم كبسولات النتائج مع نقاط ملونة وأيقونات تحكم.
 */
export function CrashHistory({ results }: { results: number[] }) {
  const getDotColor = (val: number) => {
    if (val >= 10) return "bg-yellow-400";
    if (val >= 2) return "bg-emerald-500";
    return "bg-orange-500";
  };

  return (
    <div className="w-full bg-gray-100/50 backdrop-blur-md rounded-[20px] p-1.5 flex items-center justify-between font-body tracking-normal overflow-hidden border border-gray-200/50 shadow-sm" dir="ltr">
      {/* Results Feed */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none px-2 flex-1">
        {results.slice(0, 10).map((res, i) => (
          <motion.div
            key={i}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-1.5 shrink-0"
          >
            <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", getDotColor(res))} />
            <span className="text-[11px] font-black text-[#002d4d] tabular-nums tracking-tighter">
              {res.toFixed(2)}x
            </span>
          </motion.div>
        ))}
      </div>

      {/* Control Icons */}
      <div className="flex items-center gap-1 pl-2 border-l border-gray-200 ml-2">
         <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-[#002d4d] transition-all">
            <Clock size={14} />
         </button>
         <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-[#002d4d] transition-all">
            <LayoutGrid size={14} />
         </button>
      </div>
    </div>
  );
}
