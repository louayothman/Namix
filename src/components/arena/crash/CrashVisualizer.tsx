
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود التفاعلي v60.0 - Namix Elite Rocket & Nano Dust
 * - صاروخ فخم بتصميم عصري وألوان ناميكس (أزرق داكن وبرتقالي ذهبي).
 * - تأثير انهيار هادئ (غبار نانوي) بكثافة قليلة جداً لضمان الفخامة البصرية.
 * - غيوم رشيقة ومحاور ديناميكية تتبع المسار بدقة.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الزمن المنقضي بناءً على المعادلة (1.07^t)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // عدسة الرؤية الديناميكية
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  // إحداثيات الصاروخ (0-100%)
  const currentX = (elapsed / maxTime) * 100;
  const currentY = 100 - ((multiplier - 1) / (maxMult - 1)) * 100;

  // حساب زاوية ميل الصاروخ بناءً على اتجاه المتجه
  const angle = useMemo(() => {
    if (state === 'waiting') return -45;
    const dx = 0.5 * currentX;
    const dy = currentY - 100;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  }, [currentX, currentY, state]);

  const cloudMatrix = [
    { top: '8%', delay: 0, duration: 45, scale: 0.6 },
    { top: '18%', delay: 5, duration: 55, scale: 0.4 },
    { top: '28%', delay: 12, duration: 50, scale: 0.5 },
    { top: '38%', delay: 2, duration: 60, scale: 0.35 },
    { top: '12%', delay: 18, duration: 48, scale: 0.55 },
    { top: '45%', delay: 8, duration: 52, scale: 0.45 }
  ];

  const yTicks = useMemo(() => {
    const ticks = [];
    const step = (maxMult - 1) / 3;
    for (let i = 0; i <= 3; i++) ticks.push(1 + step * i);
    return ticks;
  }, [maxMult]);

  const xTicks = useMemo(() => {
    const ticks = [];
    const step = maxTime / 5;
    for (let i = 0; i <= 5; i++) ticks.push(step * i);
    return ticks;
  }, [maxTime]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-blue-100 via-blue-50 to-white font-body select-none">
      
      {/* 1. Atmospheric Small Clouds */}
      <div className="absolute inset-0 z-0">
        {cloudMatrix.map((cloud, i) => (
          <motion.div 
            key={i}
            initial={{ left: '120%' }}
            animate={{ left: '-40%' }}
            transition={{ duration: cloud.duration, repeat: Infinity, ease: "linear", delay: cloud.delay }}
            className="absolute will-change-transform"
            style={{ top: cloud.top, scale: cloud.scale }}
          >
            <div className="w-16 h-6 bg-gradient-to-r from-gray-200 via-white to-gray-50 rounded-full blur-[2px] opacity-80" />
            <div className="w-8 h-8 bg-white rounded-full absolute -top-2 left-3 blur-[2px] opacity-90" />
          </motion.div>
        ))}
      </div>

      {/* 2. Axis Labels */}
      <div className="absolute inset-0 p-8 md:p-12 z-10">
        <div className="absolute left-2 inset-y-12 flex flex-col-reverse justify-between items-start opacity-30 z-20" dir="ltr">
          {yTicks.map((tick, i) => (
            <motion.span key={i} layout className="text-[8px] font-black text-[#002d4d] tabular-nums">
              {tick.toFixed(1)}x
            </motion.span>
          ))}
        </div>
        <div className="absolute bottom-2 inset-x-12 flex justify-between items-end opacity-30 z-20" dir="ltr">
          {xTicks.map((tick, i) => (
            <motion.span key={i} layout className="text-[8px] font-black text-[#002d4d] tabular-nums">
              {Math.round(tick)}s
            </motion.span>
          ))}
        </div>

        {/* 3. Rocket Execution Area */}
        <div className="relative w-full h-full">
          <AnimatePresence>
            {state === 'running' && (
              <motion.div
                key="active-rocket"
                initial={false}
                animate={{ 
                  left: `${currentX}%`, 
                  top: `${currentY}%`,
                  rotate: angle
                }}
                transition={{ type: "tween", ease: "linear", duration: 0.05 }}
                className="absolute w-14 h-14 -ml-7 -mt-7 z-50 flex items-center justify-center"
              >
                {/* Elite Rocket Design - Namix Colors */}
                <div className="relative">
                  <svg width="28" height="42" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                    {/* Main Sleek Body (Dark Blue Namix) */}
                    <path d="M14 0C14 0 6 8 6 22V34C6 34 10 32 14 32C18 32 22 34 22 34V22C22 8 14 0 14 0Z" fill="#002d4d" />
                    <path d="M14 0C14 0 10 8 10 22V32H14V0Z" fill="white" opacity="0.1" />
                    
                    {/* Nose Cone Accent */}
                    <path d="M14 0C14 0 11 4 11 8H17C17 4 14 0 14 0Z" fill="#f9a885" />
                    
                    {/* Fins (Orange Namix) */}
                    <path d="M6 28L0 38L6 34V28Z" fill="#f9a885" />
                    <path d="M22 28L28 38L22 34V28Z" fill="#f9a885" />
                    
                    {/* Luxurious Window */}
                    <circle cx="14" cy="16" r="3" fill="#f9a885" fillOpacity="0.2" stroke="#f9a885" strokeWidth="0.5" />
                  </svg>

                  {/* Refined Thruster Flame */}
                  <motion.div
                    animate={{ 
                      scaleY: [1, 1.3, 1],
                      opacity: [0.7, 0.9, 0.7]
                    }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                    className="absolute top-[92%] left-1/2 -translate-x-1/2 w-3 h-6 bg-gradient-to-b from-[#f9a885] to-transparent rounded-full blur-[1px] origin-top"
                  />
                </div>
              </motion.div>
            )}

            {state === 'crashed' && (
              <motion.div
                key="nano-dust"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ left: `${currentX}%`, top: `${currentY}%` }}
                className="absolute w-10 h-10 -ml-5 -mt-5 z-[60] flex items-center justify-center"
              >
                {/* Subtle Nano Dust Effect */}
                <div className="relative w-full h-full">
                   <motion.div 
                     initial={{ scale: 0.5, opacity: 0.5 }}
                     animate={{ scale: 2, opacity: 0 }}
                     transition={{ duration: 0.8 }}
                     className="absolute inset-0 bg-gray-400 rounded-full blur-md" 
                   />
                   <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{ 
                            scale: [0, 1, 0.5], 
                            x: (i % 2 === 0 ? 1 : -1) * 15, 
                            y: (i < 2 ? 1 : -1) * 15,
                            opacity: [0, 0.4, 0]
                          }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className="w-1.5 h-1.5 bg-gray-300 rounded-full blur-[1px]"
                        />
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 left-3 opacity-[0.03] rotate-[-90deg] origin-bottom-left z-20">
         <p className="text-[6px] font-black uppercase tracking-[0.8em] text-[#002d4d] tracking-normal">NAMIX SOVEREIGN HORIZON</p>
      </div>
    </div>
  );
}
