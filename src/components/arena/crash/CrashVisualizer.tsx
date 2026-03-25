
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الأفق السماوي v28.0 - Nano Clouds Edition
 * - الخلفية: تدرج سماوي فاخر.
 * - الغيوم: 4 غيوم صغيرة في النصف العلوي، رمادية متدرجة، تتحرك ببطء من اليمين لليسار.
 * - المحاور: X (0-10s بفاصل 2ث)، Y (1-4x بفاصل 1x) على اليسار.
 * - المنحنى: صعود طبيعي سائل يبدأ من (0, 100).
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الزمن المنقضي بناءً على المعادلة (1.07^t)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // عدسة الرؤية الديناميكية (الزمن ثابت عند 10 ثوانٍ في البداية)
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  
  // المحور الصادي (المضاعف): يعرض 3 مستويات فوق الأساس = 4x افتراضياً
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  // إحداثيات النقطة الحالية (النسبة المئوية داخل الحاوية)
  const currentX = (elapsed / maxTime) * 100;
  const currentY = 100 - ((multiplier - 1) / (maxMult - 1)) * 100;

  // علامات المحور الصادي (Y) على اليسار - 3 مستويات (1x, 2x, 3x, 4x)
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (maxMult - 1) / 3;
    for (let i = 0; i <= 3; i++) {
      ticks.push(1 + step * i);
    }
    return ticks;
  }, [maxMult]);

  // علامات المحور السيني (X) في الأسفل - 5 محطات بفاصل 2 ثانية
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
    const cpX = currentX * 0.5;
    const cpY = 100; 
    return `M 0 100 Q ${cpX} ${cpY}, ${currentX} ${currentY}`;
  }, [currentX, currentY, state]);

  // مصفوفة الغيوم الصغيرة في النصف العلوي
  const clouds = [
    { top: '8%', delay: 0, duration: 55, scale: 0.4 },
    { top: '18%', delay: 15, duration: 45, scale: 0.3 },
    { top: '32%', delay: 5, duration: 65, scale: 0.5 },
    { top: '44%', delay: 25, duration: 50, scale: 0.35 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-blue-200 via-blue-50 to-white font-body select-none">
      
      {/* 1. Atmospheric Cloud Engine - Small Slow Clouds in Top Half */}
      <div className="absolute inset-0 z-0">
        {clouds.map((cloud, i) => (
          <motion.div 
            key={i}
            initial={{ x: '120%' }}
            animate={{ x: '-120%' }}
            transition={{ duration: cloud.duration, repeat: Infinity, ease: "linear", delay: cloud.delay }}
            className="absolute opacity-[0.6] will-change-transform"
            style={{ top: cloud.top, scale: cloud.scale }}
          >
            <div className="w-24 h-6 bg-gradient-to-r from-gray-200 via-white to-gray-50 rounded-full blur-md shadow-sm" />
          </motion.div>
        ))}
      </div>

      {/* 2. Grid & Axis Labels */}
      <div className="absolute inset-0 p-8 md:p-12 z-10">
        
        {/* Y Axis (Left Side) - المضاعفات على اليسار */}
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

        {/* X Axis (Bottom) - الثواني في الأسفل */}
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

            {/* شبكة نانوية بيضاء متزامنة مع الأفق السماوي */}
            <g className="opacity-[0.2]">
               {xTicks.map((_, i) => (
                 <line key={`v-${i}`} x1={i * (100/5)} y1="0" x2={i * (100/5)} y2="100" stroke="white" strokeWidth="0.5" />
               ))}
               {yTicks.map((_, i) => (
                 <line key={`h-${i}`} x1="0" y1={i * (100/3)} x2="100" y2={i * (100/3)} stroke="white" strokeWidth="0.5" />
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

      {/* 4. Side Brand Label */}
      <div className="absolute bottom-10 left-3 opacity-[0.05] rotate-[-90deg] origin-bottom-left z-20">
         <p className="text-[6px] font-black uppercase tracking-[0.8em] text-[#002d4d]">NAMIX SOVEREIGN HORIZON</p>
      </div>
    </div>
  );
}
