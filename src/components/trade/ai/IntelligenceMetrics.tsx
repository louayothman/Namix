
"use client";

import { Activity, Target, Zap, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RiskScorecard } from "@/lib/namix-ai-orchestrator";

interface IntelligenceMetricsProps {
  scorecard: RiskScorecard;
}

/**
 * @fileOverview بطاقة أداء المخاطر الاستخباراتية v5.0 - Risk Scorecard Edition
 * تم تحويل المقاييس لتظهر (الزخم، السيولة، التذبذب) بأسلوب نانوي فخم.
 */
export function IntelligenceMetrics({ scorecard }: IntelligenceMetricsProps) {
  const metrics = [
    { label: "الزخم", val: `${scorecard.momentum}%`, icon: Zap, color: "text-orange-500", bg: "from-orange-500/5 to-transparent" },
    { label: "السيولة", val: `${scorecard.liquidity}%`, icon: Target, color: "text-blue-500", bg: "from-blue-500/5 to-transparent" },
    { label: "الاستقرار", val: `${scorecard.volatility}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "from-emerald-500/5 to-transparent" },
    { label: "الارتباط", val: "SYNC", icon: Waves, color: "text-purple-500", bg: "from-purple-500/5 to-transparent" }
  ];

  return (
    <div className="bg-white rounded-[44px] border border-gray-100 p-2 shadow-sm font-body tracking-normal" dir="rtl">
      <div className="grid grid-cols-4 gap-2">
        {metrics.map((m, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -2 }}
            className={cn(
              "group relative overflow-hidden bg-gray-50/40 rounded-[32px] p-4 flex flex-col items-center gap-1 text-center transition-all hover:bg-white hover:shadow-xl",
              "border border-transparent hover:border-white/50"
            )}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000", m.bg)} />

            <div className="relative z-10 space-y-1">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none tracking-normal">{m.label}</p>
              <p className={cn("text-[13px] font-black tabular-nums tracking-tighter", m.color)}>
                {m.val}
              </p>
            </div>
            
            <div className={cn("mt-1 opacity-20 group-hover:opacity-100 transition-opacity", m.color)}>
               <m.icon size={10} strokeWidth={3} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
