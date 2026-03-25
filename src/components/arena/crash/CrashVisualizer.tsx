
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الأفق السماوي v35.0 - True Cloud Edition
 * - الخلفية: تدرج سماوي نقي بدون خطوط شبكية.
 * - الغيوم: 8 غيوم ركامية (وليست خطوط) واضحة، تتحرك من اليمين لليسار بسرعة محسنة.
 * - المحاور: X (0-10s بـ 5 محطات) و Y (1-4x) على اليسار والأسفل بنقاء تام.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الزمن المنقضي بناءً على المعادلة (1.07^t)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // عدسة الرؤية الديناميكية (ثابتة عند 10s و 4x وتتمدد لاحقاً)
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  // إحداثيات النقطة الحالية (المنحنى يبدأ من 0, 100)
  const currentX = (elapsed / maxTime) * 100;
  const currentY = 100 - ((multiplier - 1) / (maxMult - 1)) * 100;

  // محطات المحور الصادي (3 مستويات فوق الأساس)
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (maxMult - 1) / 3;
    for (let i = 0; i <= 3; i++) {
      ticks.push(1 + step * i);
    }
    return ticks;
  }, [maxMult]);

  // محطات المحور السيني (5 محطات بفاصل 2 ثانية)
  const xTicks = useMemo(() => {
    const ticks = [];
    const step = maxTime / 5;
    for (let i = 0; i <= 5; i++) {
      ticks.push(step * i);
    }
    return ticks;
  }, [maxTime]);

  const pathData = useMemo(() => {
    if (state === 'waiting') return "";
    // رسم منحنى Quadratic Bezier انسيابي طبيعي
    const cpX = currentX * 0.5;
    const cpY = 100; 
    return `M 0 100 Q ${cpX} ${cpY}, ${currentX} ${currentY}`;
  }, [currentX, currentY, state]);

  // محرك السحب الركامية: تموضع علوي، أحجام متنوعة، سرعات محسنة
  const clouds = [
    { top: '5%', delay: 0, duration: 25, scale: 1.2 },
    { top: '12%', delay: 4, duration: 30, scale: 0.9 },
    { top: '20%', delay: 8, duration: 22, scale: 1.1 },
    { top: '28%', delay: 12, duration: 35, scale: 0.8 },
    { top: '35%', delay: 2, duration: 28, scale: 1.3 },
    { top: '42%', delay: 15, duration: 32, scale: 1.0 },
    { top: '18%', delay: 20, duration: 26, scale: 0.7 },
    { top: '30%', delay: 25, duration: 38, scale: 1.4 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-blue-200 via-blue-50 to-white font-body select-none">
      
      {/* 1. Atmospheric Cloud Matrix - True Cloud Shapes */}
      <div className="absolute inset-0 z-0">
        {clouds.map((cloud, i) => (
          <motion.div 
            key={i}
            initial={{ x: '150%' }}
            animate={{ x: '-150%' }}
            transition={{ 
              duration: cloud.duration, 
              repeat: Infinity, 
              ease: "linear", 
              delay: cloud.delay 
            }}
            className="absolute will-change-transform"
            style={{ top: cloud.top, scale: cloud.scale }}
          >
            {/* تصميم السحابة: كتلة بيضاء متدرجة مع تمويه ناعم */}
            <div className="w-24 h-10 bg-gradient-to-r from-gray-200 via-white to-gray-50 rounded-full blur-[3px] shadow-sm opacity-80" />
            <div className="w-12 h-12 bg-white rounded-full absolute -top-4 left-4 blur-[4px] opacity-90" />
            <div className="w-10 h-10 bg-gray-50 rounded-full absolute -top-2 left-10 blur-[4px] opacity-80" />
          </motion.div>
        ))}
      </div>

      {/* 2. Axis Labels (No Grid Lines) */}
      <div className="absolute inset-0 p-8 md:p-12 z-10">
        
        {/* Y Axis (Left Side) */}
        <div className="absolute left-2 inset-y-12 flex flex-col-reverse justify-between items-start opacity-40 z-20" dir="ltr">
          {yTicks.map((tick, i) => (
            <motion.span 
              key={i} 
              layout
              className="text-[8px] font-black text-[#002d4d] tabular-nums"
            >
              {tick.toFixed(1)}x
            </motion.span>
          ))}
        </div>

        {/* X Axis (Bottom) */}
        <div className="absolute bottom-2 inset-x-12 flex justify-between items-end opacity-40 z-20" dir="ltr">
          {xTicks.map((tick, i) => (
            <motion.span 
              key={i} 
              layout
              className="text-[8px] font-black text-[#002d4d] tabular-nums"
            >
              {Math.round(tick)}s
            </motion.span>
          ))}
        </div>

        {/* 3. Drawing Area */}
        <div className="relative w-full h-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="liquidNaturalGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* تم إزالة كافة الخطوط الشبكية للحصول على مظهر كريستالي نقي */}

            {state !== 'waiting' && (
              <>
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke="url(#liquidNaturalGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
                
                {/* رأس السهم السائل (The Tip Dot) */}
                <motion.circle
                  cx={currentX}
                  cy={currentY}
                  r="1.5"
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="shadow-md"
                />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* 4. Side Brand Label */}
      <div className="absolute bottom-10 left-3 opacity-[0.05] rotate-[-90deg] origin-bottom-left z-20">
         <p className="text-[6px] font-black uppercase tracking-[0.8em] text-[#002d4d] tracking-normal">NAMIX SOVEREIGN HORIZON</p>
      </div>
    </div>
  );
}
