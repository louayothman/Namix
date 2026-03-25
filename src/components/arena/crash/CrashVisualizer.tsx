
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود التفاعلي v50.0 - Namix Sovereign Rocket
 * - استبدال الخط بصاروخ تفاعلي يتبع مساراً فيزيائياً متسارعاً.
 * - محرك دفع ناري (Thruster) ينبض أثناء الطيران.
 * - تأثير انفجار (Explosion) عند حدوث الانهيار.
 * - المحاور والغيوم تظل كإطار مرجعي سيادي.
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

  // حساب زاوية ميل الصاروخ بناءً على اتجاه المتجه (Vector Angle)
  // النقطة السابقة التقريبية لخلق اتجاه
  const angle = useMemo(() => {
    if (state === 'waiting') return -45;
    const dx = 0.5 * currentX;
    const dy = currentY - 100;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  }, [currentX, currentY, state]);

  const cloudMatrix = [
    { top: '8%', delay: 0, duration: 22, scale: 0.8 },
    { top: '18%', delay: 5, duration: 28, scale: 0.6 },
    { top: '28%', delay: 12, duration: 25, scale: 0.7 },
    { top: '38%', delay: 2, duration: 32, scale: 0.5 },
    { top: '12%', delay: 18, duration: 30, scale: 0.75 },
    { top: '45%', delay: 8, duration: 26, scale: 0.65 }
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-blue-200 via-blue-50 to-white font-body select-none">
      
      {/* 1. Atmospheric Clouds */}
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
            <div className="w-20 h-8 bg-gradient-to-r from-gray-200 via-white to-gray-50 rounded-full blur-[2px] shadow-sm opacity-90" />
            <div className="w-10 h-10 bg-white rounded-full absolute -top-3 left-3 blur-[2px] opacity-95" />
            <div className="w-8 h-8 bg-gray-50 rounded-full absolute -top-1 left-8 blur-[2px] opacity-90" />
          </motion.div>
        ))}
      </div>

      {/* 2. Axis Labels (No Grid) */}
      <div className="absolute inset-0 p-8 md:p-12 z-10">
        <div className="absolute left-2 inset-y-12 flex flex-col-reverse justify-between items-start opacity-40 z-20" dir="ltr">
          {yTicks.map((tick, i) => (
            <motion.span key={i} layout className="text-[8px] font-black text-[#002d4d] tabular-nums">
              {tick.toFixed(1)}x
            </motion.span>
          ))}
        </div>
        <div className="absolute bottom-2 inset-x-12 flex justify-between items-end opacity-40 z-20" dir="ltr">
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
                className="absolute w-12 h-12 -ml-6 -mt-6 z-50 flex items-center justify-center"
              >
                {/* Rocket Body SVG */}
                <div className="relative">
                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                    {/* Main Hull */}
                    <path d="M16 0C16 0 8 10 8 20V32H24V20C24 10 16 0 16 0Z" fill="#F3F4F6" />
                    <path d="M16 0C16 0 12 10 12 20V32H16V0Z" fill="white" opacity="0.5" />
                    {/* Nose Cone */}
                    <path d="M16 0C16 0 12 5 12 10H20C20 5 16 0 16 0Z" fill="#EF4444" />
                    {/* Fins */}
                    <path d="M8 32L0 38V28L8 32Z" fill="#3B82F6" />
                    <path d="M24 32L32 38V28L24 32Z" fill="#3B82F6" />
                    {/* Window */}
                    <circle cx="16" cy="18" r="3" fill="#1E293B" />
                  </svg>

                  {/* Engine Thruster (Fire) */}
                  <motion.div
                    animate={{ 
                      scaleY: [1, 1.5, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                    className="absolute top-[90%] left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent rounded-full blur-[1px] origin-top"
                  />
                </div>
              </motion.div>
            )}

            {state === 'crashed' && (
              <motion.div
                key="explosion"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ left: `${currentX}%`, top: `${currentY}%` }}
                className="absolute w-16 h-16 -ml-8 -mt-8 z-[60] flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                   <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-40 animate-ping" />
                   <svg viewBox="0 0 100 100" className="w-full h-full">
                      <motion.path 
                        d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" 
                        fill="#F97316"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                      />
                      <circle cx="50" cy="50" r="20" fill="#EF4444" />
                   </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-10 left-3 opacity-[0.05] rotate-[-90deg] origin-bottom-left z-20">
         <p className="text-[6px] font-black uppercase tracking-[0.8em] text-[#002d4d] tracking-normal">NAMIX SOVEREIGN HORIZON</p>
      </div>
    </div>
  );
}
