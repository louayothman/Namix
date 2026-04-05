
"use client";

import { Activity, Target, Zap, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RiskScorecard } from "@/lib/namix-ai-orchestrator";

interface IntelligenceMetricsProps {
  scorecard: RiskScorecard;
}

/**
 * @fileOverview بطاقة أداء الاستخبارات المدمجة v6.0 - Ghost Icon Edition
 * تصميم نقي يعتمد على خلفيات أيقونية ضخمة وتفاعلية مع تطهير النصوص.
 */
export function IntelligenceMetrics({ scorecard }: IntelligenceMetricsProps) {
  const metrics = [
    { label: "الزخم", val: `${scorecard.momentum}%`, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/5" },
    { label: "السيولة", val: `${scorecard.liquidity}%`, icon: Target, color: "text-blue-500", bg: "bg-blue-500/5" },
    { label: "الاستقرار", val: `${scorecard.volatility}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/5" },
    { label: "الارتباط", val: "SYNC", icon: Waves, color: "text-purple-500", bg: "bg-purple-500/5" }
  ];

  return (
    <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-sm font-body tracking-normal" dir="rtl">
      <div className="grid grid-cols-4 divide-x divide-x-reverse divide-gray-50">
        {metrics.map((m, i) => (
          <motion.div 
            key={i} 
            whileHover="hover"
            className={cn(
              "relative h-20 md:h-24 flex flex-col items-center justify-center gap-1 group overflow-hidden transition-all hover:bg-gray-50/50",
              m.bg
            )}
          >
            {/* الأيقونة الخلفية الضخمة والتفاعلية */}
            <motion.div
              variants={{
                hover: { scale: 1.2, rotate: 12, opacity: 0.08 }
              }}
              className={cn(
                "absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none transition-all duration-1000",
                m.color
              )}
            >
               <m.icon size={80} strokeWidth={1} />
            </motion.div>

            <div className="relative z-10 text-center space-y-0.5">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none tracking-normal">
                {m.label}
              </p>
              <p className={cn("text-[13px] font-black tabular-nums tracking-tighter leading-none", m.color)}>
                {m.val}
              </p>
            </div>
            
            <div className={cn("relative z-10 opacity-20 group-hover:opacity-100 transition-opacity mt-1", m.color)}>
               <m.icon size={10} strokeWidth={3} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
