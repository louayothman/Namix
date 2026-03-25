
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود التفاعلي v70.0 - Sovereign Flight Engine
 * - صاروخ معدني فضي أزرقي يحمل شعار ناميكس (2*2).
 * - التحام تام بين الصاروخ، لهب المحرك، والأثر النفاث.
 * - غيوم ضخمة بمتعددة الألوان تغطي كامل المفاعل.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  const currentX = (elapsed / maxTime) * 100;
  const currentY = 100 - ((multiplier - 1) / (maxMult - 1)) * 100;

  const trailPath = useMemo(() => {
    if (state === 'waiting') return "";
    let path = "M 0 100";
    const steps = 25;
    for (let i = 1; i <= steps; i++) {
      const t = (elapsed / steps) * i;
      const m = Math.pow(1.07, t);
      const px = (t / maxTime) * 100;
      const py = 100 - ((m - 1) / (maxMult - 1)) * 100;
      path += ` L ${px} ${py}`;
    }
    return path;
  }, [elapsed, maxTime, maxMult, state]);

  const angle = useMemo(() => {
    if (state === 'waiting') return -45;
    const dx = 0.5 * currentX;
    const dy = currentY - 100;
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  }, [currentX, currentY, state]);

  // مصفوفة الغيوم المطورة: ألوان مختلفة وتوزيع على كامل الارتفاع
  const cloudMatrix = [
    { top: '10%', delay: 0, duration: 35, scale: 1.2, color: 'from-gray-100 to-white' },
    { top: '25%', delay: 5, duration: 45, scale: 0.8, color: 'from-gray-200 to-gray-50' },
    { top: '45%', delay: 12, duration: 40, scale: 1.1, color: 'from-white to-gray-100' },
    { top: '60%', delay: 2, duration: 50, scale: 0.9, color: 'from-gray-100 via-white to-gray-50' },
    { top: '75%', delay: 18, duration: 38, scale: 1.3, color: 'from-gray-200 to-white' },
    { top: '88%', delay: 8, duration: 42, scale: 0.7, color: 'from-white via-gray-50 to-white' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-blue-100 via-blue-50 to-white font-body select-none">
      
      {/* 1. Atmospheric Panoramic Clouds */}
      <div className="absolute inset-0 z-0">
        {cloudMatrix.map((cloud, i) => (
          <motion.div 
            key={i}
            initial={{ left: '130%' }}
            animate={{ left: '-60%' }}
            transition={{ duration: cloud.duration, repeat: Infinity, ease: "linear", delay: cloud.delay }}
            className="absolute will-change-transform"
            style={{ top: cloud.top, scale: cloud.scale }}
          >
            <div className={cn("w-24 h-8 rounded-full blur-[2px] opacity-60 shadow-sm bg-gradient-to-r", cloud.color)} />
            <div className={cn("w-12 h-12 rounded-full absolute -top-4 left-5 blur-[2px] opacity-70 bg-gradient-to-b", cloud.color)} />
          </motion.div>
        ))}
      </div>

      {/* 2. Axis Labels - Dynamic & Precise */}
      <div className="absolute inset-0 p-8 md:p-12 z-10">
        <div className="absolute left-2 inset-y-12 flex flex-col-reverse justify-between items-start opacity-20 z-20" dir="ltr">
          {[1, 2, 3, 4].map((v) => (
            <span key={v} className="text-[8px] font-black text-[#002d4d] tabular-nums">{v.toFixed(1)}x</span>
          ))}
        </div>
        <div className="absolute bottom-2 inset-x-12 flex justify-between items-end opacity-20 z-20" dir="ltr">
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <span key={v} className="text-[8px] font-black text-[#002d4d] tabular-nums">{v}s</span>
          ))}
        </div>

        {/* 3. Flight Execution Area */}
        <div className="relative w-full h-full">
          {/* Contrail - Aligned with Rocket Base */}
          <svg className="absolute inset-0 w-full h-full overflow-visible z-30">
            <motion.path
              d={trailPath}
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50 blur-[1px]"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </svg>

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
                className="absolute w-20 h-20 -ml-10 -mt-10 z-50 flex items-center justify-center"
              >
                <div className="relative">
                  {/* Silver-Blue Metallic Rocket with Namix Seal */}
                  <svg width="44" height="60" viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                    <defs>
                      <linearGradient id="rocketMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="50%" stopColor="#f1f5f9" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                    </defs>
                    
                    {/* Main Body */}
                    <path d="M22 0C22 0 10 12 10 32V48C10 48 16 46 22 46C28 46 34 48 34 48V32C34 12 22 0 22 0Z" fill="url(#rocketMetal)" />
                    
                    {/* Namix Official Seal (2x2 Grid) */}
                    <circle cx="18" cy="26" r="2.5" fill="#002d4d" />
                    <circle cx="26" cy="26" r="2.5" fill="#f9a885" />
                    <circle cx="18" cy="34" r="2.5" fill="#f9a885" />
                    <circle cx="26" cy="34" r="2.5" fill="#002d4d" />

                    {/* Sovereign Fins */}
                    <path d="M10 38L0 56L10 50V38Z" fill="#002d4d" />
                    <path d="M34 38L44 56L34 50V38Z" fill="#002d4d" />
                    
                    {/* Nose Cone */}
                    <path d="M22 0C22 0 18 6 18 12H26C26 6 22 0 22 0Z" fill="#002d4d" opacity="0.9" />
                  </svg>

                  {/* High-Precision Thruster Flame - Locked to Base */}
                  <motion.div
                    animate={{ 
                      scaleY: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 0.06, repeat: Infinity }}
                    className="absolute top-[78%] left-1/2 -translate-x-1/2 w-5 h-10 bg-gradient-to-b from-[#f9a885] via-orange-500 to-transparent rounded-full blur-[1px] origin-top z-[-1]"
                  />
                </div>
              </motion.div>
            )}

            {state === 'crashed' && (
              <motion.div
                key="nano-dust"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ left: `${currentX}%`, top: `${currentY}%` }}
                className="absolute w-8 h-8 -ml-4 -mt-4 z-[60] flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                   <motion.div 
                     initial={{ scale: 0.5, opacity: 0.4 }}
                     animate={{ scale: 1.8, opacity: 0 }}
                     transition={{ duration: 0.6 }}
                     className="absolute inset-0 bg-gray-300 rounded-full blur-sm" 
                   />
                   <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: [0, 1, 0], 
                            x: (i % 2 === 0 ? 1 : -1) * 12, 
                            y: (i < 2 ? 1 : -1) * 12,
                            opacity: [0, 0.3, 0]
                          }}
                          transition={{ duration: 0.5, delay: i * 0.04 }}
                          className="w-1 h-1 bg-gray-200 rounded-full"
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
