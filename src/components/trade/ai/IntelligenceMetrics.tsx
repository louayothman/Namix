
"use client";

import { Activity, Target, Zap, Waves, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface IntelligenceMetricsProps {
  rsi: number;
  volatility: number;
  momentum: number;
}

/**
 * @fileOverview مصفوفة المقاييس الاستخباراتية v4.0 - Luxury Dynamic Edition
 * تم ترقية التصميم بلمسات زجاجية وخلفيات متدرجة ناعمة تنبض عند التفاعل.
 */
export function IntelligenceMetrics({ rsi, volatility, momentum }: IntelligenceMetricsProps) {
  const metrics = [
    { label: "RSI", val: rsi.toFixed(1), icon: Activity, color: "text-blue-500", bg: "from-blue-500/5 to-transparent" },
    { label: "تذبذب", val: volatility.toFixed(1), icon: Waves, color: "text-purple-500", bg: "from-purple-500/5 to-transparent" },
    { label: "زخم", val: momentum.toFixed(0), icon: Target, color: "text-orange-500", bg: "from-orange-500/5 to-transparent" },
    { label: "حالة", val: "OK", icon: Zap, color: "text-emerald-500", bg: "from-emerald-500/5 to-transparent" }
  ];

  return (
    <div className="bg-white rounded-[44px] border border-gray-100 p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] font-body tracking-normal" dir="rtl">
      <div className="grid grid-cols-4 gap-2">
        {metrics.map((m, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -3, scale: 1.02 }}
            className={cn(
              "group relative overflow-hidden bg-gray-50/40 rounded-[36px] p-5 flex flex-col items-center gap-2 text-center transition-all hover:bg-white hover:shadow-2xl",
              "border border-transparent hover:border-white/50"
            )}
          >
            {/* الخلفية المتدرجة الفاخرة */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000", m.bg)} />

            {/* الأيقونة كعلامة مائية خلفية ذكية */}
            <div className={cn(
              "absolute -bottom-3 -left-3 opacity-[0.04] group-hover:opacity-[0.12] transition-all duration-1000 pointer-events-none group-hover:scale-150 group-hover:rotate-12",
              m.color
            )}>
              <m.icon size={64} strokeWidth={1.2} />
            </div>

            <div className="relative z-10 space-y-1">
              <div className="flex flex-col items-center">
                 <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">{m.label}</p>
                 <div className="h-0.5 w-3 bg-gray-100 rounded-full group-hover:w-full group-hover:bg-current transition-all duration-700 mb-1" />
              </div>
              <p className={cn("text-[14px] font-black tabular-nums tracking-tighter", m.color)}>
                {m.val}
              </p>
            </div>
            
            {/* بريق التفاعل النانوي */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <Sparkles size={8} className={cn(m.color, "animate-pulse")} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
