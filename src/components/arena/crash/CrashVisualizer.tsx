
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود المثلثي v22.0 - Plane Take-off & Edge Collision Edition
 * - المنحنى: يبدأ من (0, 100) ويزحف ليصدم الحافة اليمنى عند 10 ثوانٍ.
 * - الفيزياء: عند الاصطدام، يزداد الانحناء ليرتفع الرأس من 75% إلى 96% من الارتفاع.
 * - المحاور: المضاعف (يسار)، الزمن (أسفل)، وكلاهما ديناميكي 100%.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الزمن المنقضي بناءً على المعادلة الأساسية (1.07^t)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // عدسة الرؤية الديناميكية:
  // المحور السيني (الزمن): يبدأ بـ 10 ثوانٍ، ثم يثبت الرأس على الحافة اليمنى
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  
  // المحور الصادي (المضاعف): يبدأ بـ 2x، ثم يتمدد ليبقى الرأس عند ارتفاع 75% - 96%
  const maxMult = useMemo(() => {
    const base = 2.0;
    // نحافظ على الرأس عند ارتفاع معين (مثلاً 80% من المساحة) لترك مجال للصعود
    return multiplier < base * 0.8 ? base : (multiplier - 1) / 0.8 + 1;
  }, [multiplier]);

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
   * خوارزمية الإقلاع المثلثي:
   * تبدأ من (0, 100) وتستخدم نقطة تحكم تجعل البداية شبه مسطحة (Plane Take-off)
   * مع زيادة الانحناء تدريجياً لتصل للنقطة الحالية.
   */
  const pathData = useMemo(() => {
    if (state === 'waiting') return "";
    const startX = 0;
    const startY = 100;
    
    // نقطة التحكم تتبع الرأس أفقياً لضمان بداية منحنية وليست خطية
    const cpX = currentX * 0.5;
    const cpY = 100; 

    return `M ${startX} ${startY} Q ${cpX} ${cpY}, ${currentX} ${currentY}`;
  }, [currentX, currentY, state]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-white font-body select-none">
      
      {/* Grid & Axis Labels */}
      <div className="absolute inset-0 p-6 md:p-10">
        
        {/* Y Axis (Left Side) - المضاعفات صعوداً */}
        <div className="absolute left-2 inset-y-10 flex flex-col justify-between items-start opacity-20 z-20">
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

        {/* X Axis (Bottom) - الثواني يميناً */}
        <div className="absolute bottom-2 inset-x-10 flex justify-between items-end opacity-20 z-20">
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
              <linearGradient id="liquidPlaneGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {state !== 'waiting' && (
              <>
                {/* المنحنى السائل بفيزياء الإقلاع */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke="url(#liquidPlaneGradient)"
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

          {/* شبكة نانوية خلفية رقيقة جداً */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <div className="w-full h-full grid grid-cols-5 grid-rows-4">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="border-[0.5px] border-gray-100" />
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Side Label */}
      <div className="absolute bottom-6 left-2 opacity-[0.05] rotate-[-90deg] origin-bottom-left">
         <p className="text-[6px] font-black uppercase tracking-[0.8em] text-[#002d4d]">NAMIX SOVEREIGN FLIGHT</p>
      </div>
    </div>
  );
}
