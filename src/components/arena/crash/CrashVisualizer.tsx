
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الأجواء السيادية v150.0 - Unified Rocket Assembly (Vercel Ready)
 * - حاوية موحدة للصاروخ واللهب لضمان الالتحام الفيزيائي التام عبر transform.
 * - غيوم ضخمة ملونة (6 سحب) تغطي كامل مساحة المفاعل بحركة مستقلة.
 * - ألوان معدنية فضية مزرقة مع شعار ناميكس (2*2).
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الإحداثيات بناءً على المضاعف (مسار Bezier افتراضي)
  const elapsed = useMemo(() => Math.log(multiplier) / 0.055, [multiplier]);
  const progressX = Math.min(5 + (elapsed / 15) * 85, 90);
  const progressY = Math.max(90 - (Math.log(multiplier) / Math.log(10)) * 80, 10);

  // دوران الصاروخ بناءً على حدة الصعود
  const rotation = useMemo(() => {
    const angle = (Math.log(multiplier) / Math.log(15)) * -80;
    return Math.max(angle, -80);
  }, [multiplier]);

  // هندسة السحب البانورامية - 6 غيوم بتدرجات فريدة
  const clouds = useMemo(() => [
    { id: 1, top: '15%', size: 220, dur: 35, color: 'from-gray-200 to-white' },
    { id: 2, top: '40%', size: 280, dur: 50, color: 'from-blue-50 to-gray-100' },
    { id: 3, top: '65%', size: 190, dur: 30, color: 'from-gray-300 to-gray-50' },
    { id: 4, top: '85%', size: 240, dur: 60, color: 'from-white to-blue-50' },
    { id: 5, top: '25%', size: 170, dur: 40, color: 'from-gray-100 to-white' },
    { id: 6, top: '75%', size: 210, dur: 45, color: 'from-gray-200 to-gray-50' }
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-blue-500 via-blue-400 to-white font-body select-none">
      
      {/* طبقة الغيوم البانورامية - حركة مستقلة 100% */}
      <div className="absolute inset-0 z-0">
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            initial={{ left: "150%" }}
            animate={{ left: "-150%" }}
            transition={{ 
              duration: cloud.dur, 
              repeat: Infinity, 
              ease: "linear",
              delay: cloud.id * -7
            }}
            style={{ 
              top: cloud.top,
              width: cloud.size,
              height: cloud.size / 2.5
            }}
            className="absolute"
          >
             <div className={cn(
               "w-full h-full rounded-full blur-[2px] shadow-sm bg-gradient-to-br opacity-60",
               cloud.color
             )} />
          </motion.div>
        ))}
      </div>

      {/* المحاور الاستراتيجية النانوية */}
      <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between opacity-20">
        <div className="flex flex-col justify-between h-[85%] text-[8px] font-black text-[#002d4d] uppercase tracking-widest">
          <span>10.00x</span><span>5.00x</span><span>2.00x</span><span>1.00x</span>
        </div>
        <div className="flex justify-between items-end pr-12 text-[8px] font-black text-[#002d4d] uppercase tracking-widest">
          <span>0s</span><span>2s</span><span>4s</span><span>6s</span><span>8s</span><span>10s</span>
        </div>
      </div>

      <div className="relative w-full h-full z-40">
        <AnimatePresence>
          {state === 'running' && (
            <motion.div
              key="rocket-assembly"
              style={{ 
                left: `${progressX}%`, 
                top: `${progressY}%`, 
                rotate: rotation 
              }}
              animate={{ 
                x: multiplier > 5 ? [0, 1, -1, 0] : 0,
                y: multiplier > 5 ? [0, -1, 1, 0] : 0,
                scale: multiplier > 8 ? [1, 1.03, 1] : 1
              }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="absolute w-28 h-28 -ml-14 -mt-14 flex items-center justify-center will-change-transform"
            >
              {/* تجميعة الصاروخ الموحدة: الهيكل + اللهب */}
              <div className="relative flex flex-col items-center">
                
                {/* 1. هيكل الصاروخ الفضي الأزرقي المصقول */}
                <div className="relative w-16 h-20">
                  <svg viewBox="0 0 40 60" fill="none" className="drop-shadow-2xl">
                    <defs>
                      <linearGradient id="silverBlueMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="50%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                    </defs>
                    {/* الأجنحة */}
                    <path d="M10 40L0 55L10 50V40Z" fill="#002d4d" />
                    <path d="M30 40L40 55L30 50V40Z" fill="#002d4d" />
                    {/* الجسم الرئيسي */}
                    <path d="M20 0C20 0 5 15 5 35V50H35V35C35 15 20 0 20 0Z" fill="url(#silverBlueMetal)" />
                    {/* فوهة المحرك */}
                    <rect x="18" y="45" width="4" height="5" fill="#1e293b" />
                    
                    {/* شعار ناميكس الرسمي (2*2) */}
                    <g transform="translate(16, 25) scale(0.4)">
                      <circle cx="0" cy="0" r="4" fill="#002d4d" />
                      <circle cx="12" cy="0" r="4" fill="#f9a885" />
                      <circle cx="0" cy="12" r="4" fill="#f9a885" />
                      <circle cx="12" cy="12" r="4" fill="#002d4d" />
                    </g>
                  </svg>
                </div>

                {/* 2. لهب المحرك: مرتبط هيكلياً عبر Transform والنسب المئوية */}
                <div className="absolute left-1/2 bottom-0 pointer-events-none origin-top" style={{ transform: 'translate(-50%, 75%)' }}>
                  <motion.div
                    animate={{ 
                      scaleY: [1, 1.6, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 0.05, repeat: Infinity }}
                    className="flex flex-col items-center"
                  >
                    <div className={cn(
                      "w-6 h-14 bg-gradient-to-b from-blue-400 via-[#f9a885] to-transparent rounded-full blur-[1px]",
                      multiplier > 5 && "from-orange-400 via-red-600"
                    )} />
                    <div className="w-2.5 h-7 bg-white/80 absolute top-0 rounded-full blur-[2px]" />
                  </motion.div>
                </div>

              </div>
            </motion.div>
          )}

          {state === 'crashed' && (
            <motion.div
              key="crash-dust"
              style={{ left: `${progressX}%`, top: `${progressY}%` }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-16 h-16 -ml-8 -mt-8 flex items-center justify-center"
            >
               <div className="relative w-full h-full">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 0.5 }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 60, 
                        y: (Math.random() - 0.5) * 60,
                        opacity: 0,
                        scale: 0.2
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute w-1 h-1 bg-gray-400 rounded-full blur-[0.5px]"
                    />
                  ))}
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [0.15, 0] }}
                    className="absolute inset-0 bg-gray-200 rounded-full blur-xl"
                  />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
