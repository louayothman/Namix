
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود المثلثي v21.0 - Liquid Triangle Edition
 * - المنحنى: يبدأ من الصفر (0, 100) ويتجه للحافة اليمنى بزاوية ميل 35 درجة.
 * - الفيزياء: انحناء بسيط جداً (Slight Curvature) يوحي بالثبات والزخم السائل.
 * - المحاور: ديناميكية (2x / 10s) تتمدد وتنزلق مع السعر.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الزمن المنقضي بناءً على المعادلة الأساسية
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // عدسة الرؤية الديناميكية: تبدأ بـ 2x و 10 ثوانٍ وتتمدد آلياً
  const maxMult = useMemo(() => {
    const base = 2.0;
    return multiplier < base * 0.8 ? base : multiplier / 0.8;
  }, [multiplier]);

  const maxTime = useMemo(() => {
    const base = 10.0;
    return elapsed < base * 0.8 ? base : elapsed / 0.8;
  }, [elapsed]);

  // إحداثيات النقطة الحالية (النسبة المئوية داخل الحاوية)
  const currentX = (elapsed / maxTime) * 100;
  const currentHeightPercent = ((multiplier - 1) / (maxMult - 1)) * 100;
  const currentY = 100 - currentHeightPercent;

  // توليد علامات المحور الصادي (Y) على اليسار
  const yTicks = useMemo(() => {
    const step = (maxMult - 1) / 4;
    return [1, 1 + step, 1 + step * 2, 1 + step * 3, maxMult];
  }, [maxMult]);

  // توليد علامات المحور السيني (X) في الأسفل
  const xTicks = useMemo(() => {
    const step = maxTime / 5;
    return [0, step, step * 2, step * 3, step * 4, maxTime];
  }, [maxTime]);

  /**
   * خوارزمية الوتر المثلثي المنحني:
   * الهدف: زاوية ميل تقترب من 35 درجة عند النهاية.
   * نستخدم Quadratic Bezier بحيث تكون نقطة التحكم (CP) منخفضة لتعطي البداية المسطحة والانحناء البسيط.
   */
  const pathData = useMemo(() => {
    if (state === 'waiting') return "";
    
    const startX = 0;
    const startY = 100;
    
    // نقطة تحكم تجعل المنحنى ينساب "تحت" الوتر المثلثي وبانحناء بسيط
    const cpX = currentX * 0.6;
    const cpY = 100; 

    return `M ${startX} ${startY} Q ${cpX} ${cpY}, ${currentX} ${currentY}`;
  }, [currentX, currentY, state]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-white font-body select-none">
      
      {/* Grid & Axis Labels */}
      <div className="absolute inset-0 p-8 md:p-12">
        
        {/* Y Axis (Left Side) - المضاعفات صعوداً */}
        <div className="absolute left-2 inset-y-12 flex flex-col justify-between items-start opacity-30 z-20">
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

        {/* X Axis (Bottom) - الثواني يميناً */}
        <div className="absolute bottom-2 inset-x-12 flex justify-between items-end opacity-30 z-20">
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

        {/* Drawing Area */}
        <div className="relative w-full h-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="liquidTriangleGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {state !== 'waiting' && (
              <>
                {/* المنحنى السائل بزاوية ميل مدروسة */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke="url(#liquidTriangleGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
                
                {/* نقطة الارتكاز (The Tip Dot) */}
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

          {/* شبكة نانوية خلفية رقيقة جداً */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
             <div className="w-full h-full grid grid-cols-5 grid-rows-4">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="border-[0.5px] border-gray-200" />
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Side Label */}
      <div className="absolute bottom-6 left-2 opacity-[0.05] rotate-[-90deg] origin-bottom-left">
         <p className="text-[7px] font-black uppercase tracking-[0.6em] text-[#002d4d]">NAMIX SOVEREIGN MOMENTUM</p>
      </div>
    </div>
  );
}
