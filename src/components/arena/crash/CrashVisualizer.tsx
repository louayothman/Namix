
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود التفاعلي v65.0 - Namix Metallic Rocket & Jet Trail
 * - صاروخ معدني فضي مزرق يحمل شعار ناميكس الرسمي.
 * - أثر نفاث أبيض (Contrail) يتبع مسار التحليق بواقعية.
 * - تصحيح دقيق لوضعية محرك الدفع النفاث.
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

  // توليد نقاط الأثر النفاث (Path)
  const trailPath = useMemo(() => {
    if (state === 'waiting') return "";
    let path = "M 0 100";
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      const t = (elapsed / steps) * i;
      const m = Math.pow(1.07, t);
      const px = (t / maxTime) * 100;
      const py = 100 - ((m - 1) / (maxMult - 1)) * 100;
      path += ` L ${px} ${py}`;
    }
    return path;
  }, [elapsed, maxTime, maxMult, state]);

  // حساب زاوية ميل الصاروخ
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

      {/* 2. Axis Labels (Simplified) */}
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

        {/* 3. Rocket Execution Area */}
        <div className="relative w-full h-full">
          {/* White Jet Trail (Contrail) */}
          <svg className="absolute inset-0 w-full h-full overflow-visible z-30">
            <motion.path
              d={trailPath}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60 blur-[1px]"
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
                className="absolute w-16 h-16 -ml-8 -mt-8 z-50 flex items-center justify-center"
              >
                <div className="relative">
                  {/* Metallic Silver-Blue Rocket Design */}
                  <svg width="36" height="52" viewBox="0 0 36 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                    <defs>
                      <linearGradient id="metallicGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="50%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#64748b" />
                      </linearGradient>
                    </defs>
                    
                    {/* Body */}
                    <path d="M18 0C18 0 8 10 8 28V42C8 42 13 40 18 40C23 40 28 42 28 42V28C28 10 18 0 18 0Z" fill="url(#metallicGrad)" />
                    
                    {/* Namix Logo (4 Dots 2x2) */}
                    <circle cx="15" cy="22" r="2.2" fill="#002d4d" />
                    <circle cx="21" cy="22" r="2.2" fill="#f9a885" />
                    <circle cx="15" cy="28" r="2.2" fill="#f9a885" />
                    <circle cx="21" cy="28" r="2.2" fill="#002d4d" />

                    {/* Fins (Namix Dark Blue) */}
                    <path d="M8 34L0 48L8 42V34Z" fill="#002d4d" />
                    <path d="M28 34L36 48L28 42V34Z" fill="#002d4d" />
                    
                    {/* Nose Tip */}
                    <path d="M18 0C18 0 14 5 14 10H22C22 5 18 0 18 0Z" fill="#002d4d" opacity="0.8" />
                  </svg>

                  {/* Corrected Thruster Flame Position */}
                  <motion.div
                    animate={{ 
                      scaleY: [1, 1.4, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 0.08, repeat: Infinity }}
                    className="absolute top-[82%] left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-[#f9a885] via-orange-400 to-transparent rounded-full blur-[1px] origin-top"
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
