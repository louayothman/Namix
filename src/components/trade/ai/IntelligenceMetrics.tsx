"use client";

import { Activity, Target, Zap, ShieldCheck, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RiskScorecard } from "@/lib/namix-ai-orchestrator";

interface IntelligenceMetricsProps {
  scorecard: RiskScorecard;
}

/**
 * @fileOverview بطاقة أداء الاستخبارات المسطحة v7.0 - Flat Matrix Edition
 * تم إزالة كافة البطاقات الفرعية والخلفيات البيضاء لضمان مظهر بيانات نقي وموحد.
 */
export function IntelligenceMetrics({ scorecard }: IntelligenceMetricsProps) {
  const metrics = [
    { label: "الزخم", val: `${scorecard.momentum}%`, icon: Zap, color: "text-orange-500" },
    { label: "السيولة", val: `${scorecard.liquidity}%`, icon: Target, color: "text-blue-500" },
    { label: "الاستقرار", val: `${scorecard.volatility}%`, icon: ShieldCheck, color: "text-emerald-500" },
    { label: "الارتباط", val: "SYNC", icon: Waves, color: "text-purple-500" }
  ];

  return (
    <div className="bg-gray-50/40 rounded-[48px] border border-gray-100 overflow-hidden shadow-inner font-body tracking-normal" dir="rtl">
      <div className="grid grid-cols-4 divide-x divide-x-reverse divide-gray-100/50">
        {metrics.map((m, i) => (
          <motion.div 
            key={i} 
            whileHover="hover"
            className="relative h-20 md:h-24 flex flex-col items-center justify-center gap-1 group overflow-hidden transition-all hover:bg-white/40"
          >
            {/* الأيقونة الخلفية الضخمة والتفاعلية - شفافة جداً */}
            <motion.div
              variants={{
                hover: { scale: 1.2, rotate: 12, opacity: 0.06 }
              }}
              className={cn(
                "absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none transition-all duration-1000",
                m.color
              )}
            >
               <m.icon size={80} strokeWidth={1} />
            </motion.div>

            <div className="relative z-10 text-center space-y-0.5">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none tracking-normal">
                {m.label}
              </p>
              <p className={cn("text-[13px] font-black tabular-nums tracking-tighter leading-none transition-colors duration-500", m.color)}>
                {m.val}
              </p>
            </div>
            
            <div className={cn("relative z-10 opacity-10 group-hover:opacity-100 transition-opacity mt-1", m.color)}>
               <m.icon size={8} strokeWidth={3} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
