
"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Radar, Activity, Zap } from "lucide-react";

interface BiasHeaderProps {
  bias: 'Long' | 'Short' | 'Neutral';
}

/**
 * PulseRadarScanner - رادار الاستخبارات النبضي
 * يحاكي أجهزة الرصد المتقدمة بمسح شعاعي وحلقات صدمة لونية.
 */
function PulseRadarScanner({ bias }: { bias: string }) {
  const isLong = bias === 'Long';
  const isShort = bias === 'Short';
  
  const accentColor = isLong ? "text-emerald-500" : isShort ? "text-red-500" : "text-blue-500";
  const bgColor = isLong ? "bg-emerald-500/10" : isShort ? "bg-red-500/10" : "bg-blue-500/10";

  return (
    <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
      {/* 1. شعاع المسح الراداري (Scanning Beam) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: isLong ? 2 : isShort ? 4 : 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,45,77,0.05)_180deg,currentColor_360deg)] opacity-20"
        style={{ color: isLong ? '#10b981' : isShort ? '#ef4444' : '#3b82f6' }}
      />

      {/* 2. حلقات الصدمة (Shockwave Rings) */}
      <motion.div
        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={cn("absolute inset-2 rounded-full border border-current opacity-30", accentColor)}
      />

      {/* 3. القلب المركزي التفاعلي */}
      <div className={cn("h-9 w-9 rounded-2xl flex items-center justify-center shadow-inner relative z-10 transition-colors duration-1000", bgColor)}>
         <AnimatePresence mode="wait">
            <motion.div
              key={bias}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={accentColor}
            >
               {isLong ? <TrendingUp size={18} /> : isShort ? <TrendingDown size={18} /> : <Radar size={18} />}
            </motion.div>
         </AnimatePresence>
      </div>

      {/* جزيئات البيانات العشوائية */}
      <div className="absolute inset-0">
         {[...Array(3)].map((_, i) => (
           <motion.div
             key={i}
             animate={{ 
               opacity: [0, 1, 0],
               scale: [0, 1.5, 0],
               x: Math.random() * 20 - 10,
               y: Math.random() * 20 - 10
             }}
             transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
             className={cn("absolute h-0.5 w-0.5 rounded-full bg-current", accentColor)}
             style={{ top: '50%', left: '50%' }}
           />
         ))}
      </div>
    </div>
  );
}

function TrendingUp({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 7 13.5 16 8.5 11 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function TrendingDown({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 17 13.5 8 8.5 13 2 7" /><polyline points="16 17 22 17 22 11" />
    </svg>
  );
}

import { AnimatePresence } from "framer-motion";

export function BiasHeader({ bias }: BiasHeaderProps) {
  const labelMap = {
    Long: 'صعود استراتيجي',
    Short: 'هبوط استراتيجي',
    Neutral: 'تذبذب عرضي'
  };

  const textMap = {
    Long: 'text-emerald-500',
    Short: 'text-red-500',
    Neutral: 'text-gray-400'
  };

  const badgeMap = {
    Long: 'bg-emerald-500 text-white',
    Short: 'bg-red-500 text-white',
    Neutral: 'bg-gray-100 text-gray-400'
  };

  return (
    <section className="flex items-center justify-between px-3 font-body select-none" dir="rtl">
      <div className="flex items-center gap-4">
        {/* الرادار التكتيكي في الجهة المقابلة */}
        <PulseRadarScanner bias={bias} />
        
        <div className="space-y-0.5 text-right">
          <div className="flex items-center gap-2">
            <h4 className={cn("text-xl font-black tracking-normal transition-colors duration-1000", textMap[bias])}>
              {labelMap[bias]}
            </h4>
            <Badge className={cn("font-black text-[8px] px-2 py-0.5 border-none shadow-sm transition-all duration-1000 tracking-normal", badgeMap[bias])}>
              {bias.toUpperCase()}
            </Badge>
          </div>
          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none tracking-normal">Market Intelligence Bias</p>
        </div>
      </div>
      
      <div className="opacity-10">
         <Zap size={14} className="text-[#002d4d]" />
      </div>
    </section>
  );
}
