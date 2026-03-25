
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الصعود الطبيعي v80.0 - Sovereign Nano-Precision Flight
 * - صاروخ معدني فضي أزرقي فخم يحمل شعار ناميكس (2*2).
 * - التحام ميكانيكي تام للهب المحرك باستخدام transform و left: 50%.
 * - أفق سماوي كريستالي نقي خالي من الخطوط الشبكية.
 * - غيوم بانورامية ضخمة وملونة تسبح في كافة أرجاء المفاعل.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الوقت المنقضي بناءً على المضاعف (المنطق الطبيعي)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);

  // المحاور الاستراتيجية (10 ثوانٍ و 4 مضاعفات كبداية)
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  // إحداثيات الرأس (من اليسار 0 إلى اليمين 100، ومن الأسفل 100 إلى الأعلى 0)
  const currentX = (elapsed / maxTime) * 100;
  const currentY = 100 - ((multiplier - 1) / (maxMult - 1)) * 100;

  // زاوية دوران الصاروخ بناءً على ميل المنحنى الطبيعي
  const angle = useMemo(() => {
    if (state === 'waiting') return -45;
    const nextMult = Math.pow(1.07, elapsed + 0.1);
    const nextY = 100 - ((nextMult - 1) / (maxMult - 1)) * 100;
    const dy = nextY - currentY;
    const dx = 1; 
    return Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  }, [elapsed, currentY, maxMult, state]);

  // مصفوفة الغيوم البانورامية الضخمة: ألوان وتوزيع شامل
  const cloudMatrix = [
    { top: '10%', delay: 0, duration: 25, scale: 1.8, color: 'from-gray-200 via-white to-gray-50' },
    { top: '30%', delay: 5, duration: 35, scale: 1.2, color: 'from-blue-100 via-gray-50 to-white' },
    { top: '50%', delay: 12, duration: 30, scale: 1.5, color: 'from-gray-100 to-gray-200' },
    { top: '70%', delay: 2, duration: 40, scale: 1.3, color: 'from-blue-50 via-white to-gray-100' },
    { top: '85%', delay: 18, duration: 28, scale: 2.0, color: 'from-gray-200 to-gray-100' },
    { top: '5%', delay: 8, duration: 32, scale: 1.1, color: 'from-white via-blue-50 to-white' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-blue-100 via-blue-50 to-white font-body select-none">
      
      {/* 1. Atmospheric Panoramic Clouds - Full Range Flow */}
      <div className="absolute inset-0 z-0">
        {cloudMatrix.map((cloud, i) => (
          <motion.div 
            key={i}
            initial={{ left: '120%' }}
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

      {/* 2. Axis Labels - Precise Orientation */}
      <div className="absolute inset-0 p-8 md:p-12 z-10">
        {/* Y Axis - Multiplier (Left Side) */}
        <div className="absolute left-2 inset-y-12 flex flex-col-reverse justify-between items-start opacity-20 z-20" dir="ltr">
          {[1, 2, 3, 4].map((v) => (
            <span key={v} className="text-[8px] font-black text-[#002d4d] tabular-nums">{v.toFixed(1)}x</span>
          ))}
        </div>
        {/* X Axis - Seconds (Bottom Side) */}
        <div className="absolute bottom-2 inset-x-12 flex justify-between items-end opacity-20 z-20" dir="ltr">
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <span key={v} className="text-[8px] font-black text-[#002d4d] tabular-nums">{v}s</span>
          ))}
        </div>

        {/* 3. Flight Execution Area */}
        <div className="relative w-full h-full">
          <AnimatePresence>
            {state === 'running' && (
              <motion.div
                key="sovereign-rocket"
                initial={false}
                animate={{ 
                  left: `${currentX}%`, 
                  top: `${currentY}%`,
                  rotate: angle
                }}
                transition={{ type: "tween", ease: "linear", duration: 0.05 }}
                className="absolute w-24 h-24 -ml-12 -mt-12 z-50 flex items-center justify-center"
              >
                {/* Rocket Assembly Container */}
                <div className="relative flex flex-col items-center">
                  
                  {/* Silver-Blue Metallic Rocket Body with Namix Seal */}
                  <svg width="52" height="68" viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl relative z-10">
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

                  {/* Flame - Correctly Linked via Transform & Centered */}
                  <div 
                    className="absolute left-1/2 top-0 w-full z-0 pointer-events-none" 
                    style={{ transform: 'translate(-50%, 75%)' }}
                  >
                    <motion.div
                      animate={{ 
                        scaleY: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 0.08, repeat: Infinity }}
                      className="w-1/2 h-14 mx-auto bg-gradient-to-b from-[#f9a885] via-orange-500 to-transparent rounded-full blur-[1px] origin-top"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {state === 'crashed' && (
              <motion.div
                key="nano-dust-crash"
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
                     className="absolute inset-0 bg-gray-200 rounded-full blur-sm" 
                   />
                   <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: [0, 1, 0], 
                            x: (i % 2 === 0 ? 1 : -1) * 8, 
                            y: (i < 2 ? 1 : -1) * 8,
                            opacity: [0, 0.2, 0]
                          }}
                          transition={{ duration: 0.5, delay: i * 0.04 }}
                          className="w-0.5 h-0.5 bg-gray-300 rounded-full"
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
         <p className="text-[6px] font-black uppercase tracking-[0.8em] text-[#002d4d]">NAMIX SOVEREIGN HORIZON</p>
      </div>
    </div>
  );
}
