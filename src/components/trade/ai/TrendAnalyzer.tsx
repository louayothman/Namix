
"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendDirection } from "@/lib/namix-ai-engine";

interface TrendAnalyzerProps {
  trend: TrendDirection;
  confidence: number;
}

export function TrendAnalyzer({ trend, confidence }: TrendAnalyzerProps) {
  const isBullish = trend === 'bullish';
  const isBearish = trend === 'bearish';

  return (
    <div className="space-y-6 text-right tracking-normal font-body" dir="rtl">
      <div className="flex items-center justify-between px-2">
         <div className="space-y-0.5">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest tracking-normal">تحليل الاتجاه العام</h4>
            <p className="text-xl font-black text-[#002d4d] tracking-normal">
               {isBullish ? 'صعود استراتيجي' : isBearish ? 'تراجع تصحيحي' : 'تذبذب أفقي'}
            </p>
         </div>
         <div className={cn(
           "h-12 w-12 rounded-[18px] flex items-center justify-center shadow-lg transition-all duration-700",
           isBullish ? "bg-emerald-50 text-emerald-600 shadow-emerald-900/10" : 
           isBearish ? "bg-red-50 text-red-500 shadow-red-900/10" : "bg-gray-50 text-gray-400"
         )}>
            {isBullish ? <TrendingUp size={24} /> : isBearish ? <TrendingDown size={24} /> : <Activity size={24} />}
         </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-4">
         <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400 tracking-normal">
            <span>ثقة المحرك (AI Confidence)</span>
            <span className="text-blue-600 tabular-nums">%{Math.round(confidence)}</span>
         </div>
         <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-blue-600 relative"
            >
               <motion.div 
                 animate={{ x: ['100%', '-100%'] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
               />
            </motion.div>
         </div>
         <div className="flex items-center gap-2 justify-end opacity-40">
            <Zap size={10} className="text-[#f9a885]" />
            <span className="text-[7px] font-black uppercase tracking-normal">Direct Core Sync</span>
         </div>
      </div>
    </div>
  );
}
