
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود السائل v15.0 - Dynamic Tracking Edition
 * - المحاور تبدأ ثابتة (2x / 10s) لترك المنحنى يتحرك تدريجياً.
 * - يبدأ التمدد (Zoom-out) فقط عند وصول المنحنى لـ 80% من المساحة.
 * - المنحنى يتبع مساراً أسياً نقياً بتدرج لوني وبدون توهج.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الزمن المنقضي بناءً على معادلة اللعبة (mult = 1.07^t)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // منطق تتبع الكاميرا: تبدأ بحدود دنيا وتتمدد فقط عند الحاجة لضمان الاحساس بالصعود
  const currentMaxY = useMemo(() => {
    const base = 2.0;
    if (multiplier < base * 0.8) return base;
    return multiplier / 0.8;
  }, [multiplier]);

  const currentMaxX = useMemo(() => {
    const base = 10.0;
    if (elapsed < base * 0.8) return base;
    return elapsed / 0.8;
  }, [elapsed]);

  // إحداثيات النقطة الحالية بالنسبة المئوية
  const currentX = (elapsed / currentMaxX) * 100;
  const currentY = 100 - ((multiplier - 1) / (currentMaxY - 1)) * 100;

  // توليد علامات المحاور الديناميكية (الجهة اليمنى)
  const yTicks = useMemo(() => {
    const step = (currentMaxY - 1) / 4;
    return [1, 1 + step, 1 + step * 2, 1 + step * 3, currentMaxY];
  }, [currentMaxY]);

  const xTicks = useMemo(() => {
    const step = currentMaxX / 5;
    return [0, step, step * 2, step * 3, step * 4, currentMaxX];
  }, [currentMaxX]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-white font-body select-none">
      
      {/* Grid & Axis Labels */}
      <div className="absolute inset-0 p-6 md:p-10">
        
        {/* Y Axis (Right Side) - التسميات تتحرك وتتغير مع السعر */}
        <div className="absolute right-2 inset-y-10 flex flex-col justify-between items-end opacity-30 z-20">
          {yTicks.slice().reverse().map((tick, i) => (
            <motion.span 
              key={i} 
              layout
              className="text-[9px] font-black text-gray-400 tabular-nums"
            >
              {tick.toFixed(1)}x
            </motion.span>
          ))}
        </div>

        {/* X Axis (Bottom) - التسميات الزمنية */}
        <div className="absolute bottom-2 inset-x-10 flex justify-between items-end opacity-30 z-20">
          {xTicks.map((tick, i) => (
            <motion.span 
              key={i} 
              layout
              className="text-[9px] font-black text-gray-400 tabular-nums"
            >
              {Math.round(tick)}s
            </motion.span>
          ))}
        </div>

        {/* The Dynamic Curve Display Area */}
        <div className="relative w-full h-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* تدرج لوني سائل نقي - Emerald to Blue */}
              <linearGradient id="curveLiquidGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {state !== 'waiting' && (
              <>
                {/* المنحنى السائل: يبدأ أفقياً ويتسارع انحناؤه للأعلى تدريجياً */}
                <motion.path
                  d={`M 0 100 Q ${currentX * 0.5} 100, ${currentX} ${currentY}`}
                  fill="none"
                  stroke="url(#curveLiquidGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
                
                {/* نقطة الارتكاز الصلبة (The Precision Tip) */}
                <motion.circle
                  cx={currentX}
                  cy={currentY}
                  r="1.2"
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="shadow-sm"
                />
              </>
            )}
          </svg>

          {/* خطوط الشبكة الرقيقة جداً */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
             <div className="w-full h-full grid grid-cols-5 grid-rows-4">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="border-[0.5px] border-gray-300" />
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Watermark Label */}
      <div className="absolute bottom-4 left-6 opacity-[0.05]">
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[#002d4d]">Namix Sovereign Momentum</p>
      </div>
    </div>
  );
}
