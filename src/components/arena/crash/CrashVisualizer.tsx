
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل الفضاء السيادي v110.0 - Deep Space Physics Engine
 * - نظام نجوم Parallax متعدد الطبقات.
 * - صاروخ Cyberpunk معدني متطور يتبع مسار Bezier.
 * - خطوط سرعة (Speed Lines) تظهر ديناميكياً مع المضاعف.
 * - سديم كوني متحرك في الخلفية.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب الإحداثيات بناءً على المضاعف (مسار Bezier افتراضي)
  // X من 5% إلى 90% | Y من 90% إلى 10%
  const elapsed = useMemo(() => Math.log(multiplier) / 0.055, [multiplier]);
  const progressX = Math.min(5 + (elapsed / 15) * 85, 90);
  const progressY = Math.max(90 - (Math.log(multiplier) / Math.log(10)) * 80, 10);

  // زاوية الدوران: من 0 درجة (أفقي) إلى -80 درجة (عمودي تقريباً)
  const rotation = useMemo(() => {
    const angle = (Math.log(multiplier) / Math.log(15)) * -80;
    return Math.max(angle, -80);
  }, [multiplier]);

  // توليد النجوم المبعثرة للـ Parallax
  const stars = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: 20 + Math.random() * 40
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-[#020617] font-body select-none">
      
      {/* 1. Deep Space Nebula (Animated Background) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e3a8a_0%,transparent_70%)]" 
      />

      {/* 2. Parallax Stars Layer */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ x: 0 }}
            animate={{ x: "-100vw" }}
            transition={{ 
              duration: star.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: star.id * -1
            }}
            style={{ 
              top: star.top, 
              left: "100%",
              width: star.size, 
              height: star.size 
            }}
            className="absolute bg-white rounded-full opacity-40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
        ))}
      </div>

      {/* 3. Speed Lines (Activation after 2x) */}
      <AnimatePresence>
        {state === 'running' && multiplier > 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: ["100vw", "-100vw"] }}
                transition={{ duration: 0.2 + Math.random() * 0.3, repeat: Infinity, ease: "linear" }}
                style={{ top: `${15 + i * 15}%` }}
                className="absolute h-[1px] w-20 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Axis Labels (No Grid Lines) */}
      <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between opacity-30 pointer-events-none">
        <div className="flex flex-col justify-between h-[80%] text-[8px] font-black text-blue-200 uppercase tracking-widest">
          <span>10.00x</span>
          <span>5.00x</span>
          <span>2.00x</span>
          <span>1.00x</span>
        </div>
        <div className="flex justify-between items-end pr-12 text-[8px] font-black text-blue-200 uppercase tracking-widest">
          <span>0s</span>
          <span>5s</span>
          <span>10s</span>
          <span>15s</span>
        </div>
      </div>

      {/* 5. The Cyberpunk Rocket Assembly */}
      <div className="relative w-full h-full z-40">
        <AnimatePresence>
          {state === 'running' && (
            <motion.div
              key="rocket-assembly"
              style={{ left: `${progressX}%`, top: `${progressY}%`, rotate: rotation }}
              animate={{ 
                x: multiplier > 5 ? [0, 1, -1, 0] : 0, // Vibration at high speed
                y: multiplier > 5 ? [0, -1, 1, 0] : 0
              }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="absolute w-24 h-24 -ml-12 -mt-12 flex items-center justify-center"
            >
              {/* Metallic Rocket Body (SVG) */}
              <div className="relative w-14 h-18 group">
                <svg viewBox="0 0 40 60" fill="none" className="drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <defs>
                    <linearGradient id="cyberMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="50%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <filter id="neonGlow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Rocket Fins (Neon Blue) */}
                  <path d="M10 40L0 55L10 50V40Z" fill="#3b82f6" filter="url(#neonGlow)" />
                  <path d="M30 40L40 55L30 50V40Z" fill="#3b82f6" filter="url(#neonGlow)" />
                  
                  {/* Main Body */}
                  <path d="M20 0C20 0 5 15 5 35V50H35V35C35 15 20 0 20 0Z" fill="url(#cyberMetal)" />
                  <rect x="18" y="45" width="4" height="5" fill="#1e293b" />

                  {/* Namix Logo (2*2 Dots) */}
                  <g transform="translate(16, 25) scale(0.4)">
                    <circle cx="0" cy="0" r="4" fill="#3b82f6" />
                    <circle cx="12" cy="0" r="4" fill="#f9a885" />
                    <circle cx="0" cy="12" r="4" fill="#f9a885" />
                    <circle cx="12" cy="12" r="4" fill="#3b82f6" />
                  </g>
                </svg>

                {/* Dynamic Thruster Flame */}
                <motion.div
                  animate={{ 
                    scaleY: [1, 1.5, 1],
                    opacity: [0.8, 1, 0.8],
                    filter: ["blur(1px)", "blur(3px)", "blur(1px)"]
                  }}
                  transition={{ duration: 0.05, repeat: Infinity }}
                  className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[80%] origin-top"
                >
                  <div className={cn(
                    "w-5 h-14 bg-gradient-to-b from-blue-400 via-purple-600 to-transparent rounded-full",
                    multiplier > 5 && "from-orange-400 via-red-600"
                  )} />
                  <div className="w-2 h-8 bg-white/90 absolute top-0 left-1/2 -translate-x-1/2 blur-[2px] rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Crash Impact Effect */}
          {state === 'crashed' && (
            <motion.div
              key="crash-impact"
              style={{ left: `${progressX}%`, top: `${progressY}%` }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-20 h-20 -ml-10 -mt-10 flex items-center justify-center"
            >
               <div className="relative w-full h-full">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 0.8 }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 150, 
                        y: (Math.random() - 0.5) * 150,
                        opacity: 0,
                        scale: 0.1,
                        rotate: Math.random() * 360
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-3 h-3 bg-red-500 rounded-sm blur-[1px]"
                    />
                  ))}
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    className="absolute inset-0 bg-red-600 rounded-full blur-2xl"
                  />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
