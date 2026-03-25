
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود السائل v10.0 - مطابق للصورة المرفقة
 * يتميز بمحاور X و Y حقيقية، منحنى بارابولي دقيق، ونقطة ارتكاز في النهاية.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // نطاق العرض الديناميكي (يبدأ بـ 2.0x ويتمدد)
  const currentMaxY = useMemo(() => Math.max(2.0, multiplier * 1.1), [multiplier]);
  const currentMaxX = 10; // ثابت للثواني كما في الصورة (أو يمكن جعله ديناميكياً)

  // حساب الإحداثيات (0-100)
  const progressY = ((multiplier - 1) / (currentMaxY - 1)) * 100;
  const progressX = Math.min(100, (Math.log(multiplier) / Math.log(currentMaxY)) * 100);

  // إحداثيات النقطة الحالية
  const currentX = progressX;
  const currentY = 100 - progressY;

  // توليد علامات المحاور كما في الصورة
  const yTicks = [1.2, 1.4, 1.6, 1.8];
  const xTicks = [0, 2, 4, 6, 8];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-white font-body select-none">
      
      {/* Grid & Axis Labels */}
      <div className="absolute inset-0 p-8 md:p-12">
        {/* Y Axis (Left) */}
        <div className="absolute left-4 inset-y-8 flex flex-col justify-between items-start opacity-30">
          {yTicks.reverse().map(tick => (
            <span key={tick} className="text-[10px] font-black text-gray-400 tabular-nums">{tick.toFixed(1)}x</span>
          ))}
        </div>

        {/* X Axis (Bottom) */}
        <div className="absolute bottom-4 inset-x-8 flex justify-between items-end opacity-30 pl-4">
          {xTicks.map(tick => (
            <span key={tick} className="text-[10px] font-black text-gray-400 tabular-nums">{tick}s</span>
          ))}
        </div>

        {/* The Curve Display Area */}
        <div className="relative w-full h-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {state === 'running' && (
              <>
                {/* المنحنى السائل المتدرج */}
                <motion.path
                  d={`M 0 100 Q ${currentX * 0.5} 100, ${currentX} ${currentY}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
                
                {/* نقطة الارتكاز (التي في نهاية المنحنى بالصورة) */}
                <motion.circle
                  cx={currentX}
                  cy={currentY}
                  r="1.2"
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="shadow-lg"
                />
              </>
            )}
          </svg>

          {/* تأثير التوهج اللحظي عند النقطة */}
          {state === 'running' && (
            <div 
              className="absolute h-4 w-4 bg-emerald-500/20 rounded-full blur-md animate-pulse"
              style={{ left: `${currentX}%`, top: `${currentY}%`, transform: 'translate(-50%, -50%)' }}
            />
          )}
        </div>
      </div>

      {/* Watermark Label */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-10">
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#002d4d]">Namix Sovereign Momentum</p>
      </div>
    </div>
  );
}
