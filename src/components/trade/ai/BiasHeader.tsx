
"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface BiasHeaderProps {
  bias: 'Long' | 'Short' | 'Neutral';
}

/**
 * TacticalScanner - ماسح الجزيئات التكتيكي
 * يظهر فقط الشعاع الدوار والجزيئات المنبعثة بدون أي أيقونات أو خلفيات مشتتة.
 */
function TacticalScanner({ bias }: { bias: string }) {
  const isLong = bias === 'Long';
  const isShort = bias === 'Short';
  
  const accentColor = isLong ? "#10b981" : isShort ? "#ef4444" : "#3b82f6";

  // توليد جزيئات ثابتة Seed لضمان استقرار الهيدريشن
  const particles = useMemo(() => [
    { delay: 0, x: 15, y: -12 },
    { delay: 0.4, x: -18, y: 15 },
    { delay: 0.8, x: 12, y: 18 },
    { delay: 1.2, x: -15, y: -15 },
    { delay: 1.6, x: 20, y: 5 },
  ], []);

  return (
    <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
      {/* 1. شعاع المسح الشعاعي النقي (Scanning Beam) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: isLong ? 2.5 : isShort ? 4.5 : 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0)_180deg,currentColor_360deg)] opacity-20"
        style={{ color: accentColor }}
      />

      {/* 2. الجزيئات المنبعثة عشوائياً (Data Particles) */}
      <div className="absolute inset-0 flex items-center justify-center">
         {particles.map((p, i) => (
           <motion.div
             key={i}
             animate={{ 
               opacity: [0, 0.8, 0],
               scale: [0, 1.2, 0],
               x: [0, p.x],
               y: [0, p.y]
             }}
             transition={{ 
               duration: 2, 
               repeat: Infinity, 
               delay: p.delay,
               ease: "easeOut"
             }}
             className="absolute h-0.5 w-0.5 rounded-full"
             style={{ backgroundColor: accentColor }}
           />
         ))}
      </div>

      {/* 3. وميض المركز الهادئ */}
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
      />
    </div>
  );
}

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
    <section className="flex items-center justify-between px-4 font-body select-none" dir="rtl">
      {/* القسم الأيمن: النص الاستراتيجي */}
      <div className="space-y-0.5 text-right">
        <div className="flex items-center gap-3 justify-end">
          <h4 className={cn("text-xl font-black tracking-normal transition-colors duration-1000", textMap[bias])}>
            {labelMap[bias]}
          </h4>
          <Badge className={cn("font-black text-[8px] px-2 py-0.5 border-none shadow-sm transition-all duration-1000 tracking-normal", badgeMap[bias])}>
            {bias.toUpperCase()}
          </Badge>
        </div>
        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none tracking-normal">Market Intelligence Bias</p>
      </div>

      {/* القسم الأيسر: الماسح التكتيكي النقي (بدون أيقونات أو رعد) */}
      <TacticalScanner bias={bias} />
    </section>
  );
}
