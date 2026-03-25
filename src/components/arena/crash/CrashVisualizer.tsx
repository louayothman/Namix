
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود الطبيعي v25.0 - Standard Axis Calibration
 * - المحور الصادي (Y): في اليسار، يعرض 3 مضاعفات (1x -> 4x) افتراضياً.
 * - المحور السيني (X): في الأسفل، يعرض 5 محطات (0s -> 10s) بفاصل 2 ثانية.
 * - المنحنى: حركة طبيعية انسيابية تنبثق من الصفر وتتبع السعر بمرونة.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الزمن المنقضي بناءً على المعادلة (1.07^t)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // عدسة الرؤية الديناميكية:
  // المحور السيني (الزمن): 5 محطات بفاصل 2 ثانية = 10 ثوانٍ افتراضياً
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  
  // المحور الصادي (المضاعف): يعرض 3 مضاعفات فوق الأساس = 4x افتراضياً
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  // إحداثيات النقطة الحالية (النسبة المئوية داخل الحاوية)
  const currentX = (elapsed / maxTime) * 100;
  const currentY = 100 - ((multiplier - 1) / (maxMult - 1)) * 100;

  // توليد علامات المحور الصادي (Y) على اليسار - 3 فترات (1x, 2x, 3x, 4x)
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (maxMult - 1) / 3;
    for (let i = 0; i <= 3; i++) {
      ticks.push(1 + step * i);
    }
    return ticks;
  }, [maxMult]);

  // توليد علامات المحور السيني (X) في الأسفل - 5 محطات بفاصل 2 ثانية
  const xTicks = useMemo(() => {
    const ticks = [];
    const step = maxTime / 5;
    for (let i = 0; i <= 5; i++) {
      ticks.push(step * i);
    }
    return ticks;
  }, [maxTime]);

  // مسار النمو الطبيعي (Quadratic Bezier)
  const pathData = useMemo(() => {
    if (state === 'waiting') return "";
    // نقطة التحكم لتحقيق انحناء طبيعي يبدأ أفقياً قليلاً ثم يتصاعد
    const cpX = currentX * 0.5;
    const cpY = 100; 
    return `M 0 100 Q ${cpX} ${cpY}, ${currentX} ${currentY}`;
  }, [currentX, currentY, state]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-white font-body select-none">
      
      {/* Grid & Axis Labels */}
      <div className="absolute inset-0 p-8 md:p-12">
        
        {/* Y Axis (Left Side) - المضاعفات */}
        <div className="absolute left-2 inset-y-12 flex flex-col justify-between items-start opacity-20 z-20" dir="ltr">
          {yTicks.slice().reverse().map((tick, i) => (
            <motion.span 
              key={i} 
              layout
              className="text-[8px] font-black text-[#002d4d] tabular-nums"
            >
              {tick.toFixed(1)}x
            </motion.span>
          ))}
        </div>

        {/* X Axis (Bottom) - الثواني (0, 2, 4, 6, 8, 10) */}
        <div className="absolute bottom-2 inset-x-12 flex justify-between items-end opacity-20 z-20" dir="ltr">
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

        {/* Drawing Area */}
        <div className="relative w-full h-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="liquidNaturalGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* شبكة نانوية متزامنة مع المحطات */}
            <g className="opacity-[0.03]">
               {xTicks.map((_, i) => (
                 <line key={`v-${i}`} x1={i * (100/5)} y1="0" x2={i * (100/5)} y2="100" stroke="#002d4d" strokeWidth="0.5" />
               ))}
               {yTicks.map((_, i) => (
                 <line key={`h-${i}`} x1="0" y1={i * (100/3)} x2="100" y2={i * (100/3)} stroke="#002d4d" strokeWidth="0.5" />
               ))}
            </g>

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
                
                {/* نقطة الارتكاز (The Tip Dot) */}
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

      {/* Side Brand Label */}
      <div className="absolute bottom-10 left-3 opacity-[0.05] rotate-[-90deg] origin-bottom-left">
         <p className="text-[6px] font-black uppercase tracking-[0.8em] text-[#002d4d]">NAMIX SOVEREIGN NODE</p>
      </div>
    </div>
  );
}
