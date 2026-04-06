"use client";

import { Target, Zap, ShieldCheck, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface IntelligenceMetricsProps {
  scorecard: {
    momentum: number;
    liquidity: number;
    volatility: number;
  };
}

/**
 * @fileOverview مصفوفة الاستحقاق المسطحة v2.0
 * تم تحويل المكون ليكون "مسطحاً" (Flat) ليتم دمجه داخل بطاقات أخرى بسلاسة.
 */
export function IntelligenceMetrics({ scorecard }: IntelligenceMetricsProps) {
  const metrics = [
    { label: "الزخم", val: `${scorecard.momentum}%`, icon: Zap, color: "text-orange-500" },
    { label: "السيولة", val: `${scorecard.liquidity}%`, icon: Target, color: "text-blue-500" },
    { label: "الاستقرار", val: `${scorecard.volatility}%`, icon: ShieldCheck, color: "text-emerald-500" },
    { label: "الارتباط", val: "SYNC", icon: Waves, color: "text-purple-500" }
  ];

  return (
    <div className="bg-gray-50/40 rounded-[32px] border border-gray-100 overflow-hidden shadow-inner font-body tracking-normal" dir="rtl">
      <div className="grid grid-cols-4 divide-x divide-x-reverse divide-gray-100/50">
        {metrics.map((m, i) => (
          <motion.div 
            key={i} 
            whileHover={{ backgroundColor: "rgba(255,255,255,0.5)" }}
            className="relative h-20 flex flex-col items-center justify-center gap-1 group overflow-hidden transition-all"
          >
            {/* Background Icon Bloom */}
            <div className={cn(
              "absolute -bottom-2 -right-2 opacity-[0.02] pointer-events-none transition-all duration-700 group-hover:opacity-[0.06] group-hover:scale-110",
              m.color
            )}>
               <m.icon size={60} strokeWidth={1} />
            </div>

            <div className="relative z-10 text-center space-y-0.5">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none tracking-normal">
                {m.label}
              </p>
              <p className={cn("text-[12px] font-black tabular-nums tracking-tighter leading-none transition-colors duration-500", m.color)}>
                {m.val}
              </p>
            </div>
            
            {/* Tiny Indicator Icon */}
            <div className={cn("relative z-10 opacity-10 group-hover:opacity-100 transition-opacity mt-1", m.color)}>
               <m.icon size={8} strokeWidth={3} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
