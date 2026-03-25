
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل التحليق العالمي v100.0 - Cyberpunk Rocket Engine
 * - خلفية فضائية بنظام Parallax (نجوم، سديم، خطوط سرعة).
 * - صاروخ معدني تفاعلي يتبع مسار Bezier المنحني.
 * - دوران واهتزاز ديناميكي يتزايد مع قوة المضاعف.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب التقدم بناءً على المضاعف (المنطق الأسي)
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  // إحداثيات الصاروخ (X يبدأ من 5%، Y من 90%)
  const currentX = 5 + (elapsed / maxTime) * 85;
  const currentY = 90 - ((multiplier - 1) / (maxMult - 1)) * 80;

  // زاوية الدوران: تبدأ أفقية وتتجه للعمودية مع الارتفاع
  const angle = useMemo(() => {
    if (state === 'waiting') return -45;
    const progress = (multiplier - 1) / (maxMult - 1);
    return -45 - (progress * 45); // يميل من -45 إلى -90 درجة
  }, [multiplier, maxMult, state]);

  // شدة الاهتزاز تزداد مع المضاعف
  const shakeIntensity = multiplier > 5 ? 2 : multiplier > 2 ? 1 : 0;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-[#001d33] font-body select-none">
      
      {/* 1. Deep Space Layers (Parallax) */}
      <div className="absolute inset-0">
        {/* Static Stars */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        
        {/* Moving Nebula Fog */}
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-10%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] blur-[80px]"
        />

        {/* Dynamic Speed Lines (Appear after 2x) */}
        <AnimatePresence>
          {state === 'running' && multiplier > 2 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.4 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: '120%', y: `${Math.random() * 100}%` }}
                  animate={{ x: '-120%' }}
                  transition={{ 
                    duration: 0.5 / (multiplier * 0.2), 
                    repeat: Infinity, 
                    delay: Math.random() * 2,
                    ease: "linear"
                  }}
                  className="absolute h-px w-20 bg-gradient-to-r from-transparent via-blue-200 to-transparent"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Flight Trajectory Execution */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          {state === 'running' && (
            <motion.div
              key="cyber-rocket"
              style={{ left: `${currentX}%`, top: `${currentY}%` }}
              animate={{ 
                rotate: angle,
                x: [0, shakeIntensity, -shakeIntensity, 0],
                y: [0, -shakeIntensity, shakeIntensity, 0]
              }}
              transition={{ 
                rotate: { type: "spring", stiffness: 100 },
                x: { duration: 0.1, repeat: Infinity },
                y: { duration: 0.1, repeat: Infinity }
              }}
              className="absolute w-24 h-24 -ml-12 -mt-12 z-50 flex items-center justify-center"
            >
              {/* Futuristic Metallic Rocket SVG */}
              <div className="relative">
                <svg width="60" height="80" viewBox="0 0 44 60" fill="none" className="drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <defs>
                    <linearGradient id="cyberMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                    <filter id="neonGlow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Rocket Fins */}
                  <path d="M10 40L0 55L10 50V40Z" fill="#f9a885" />
                  <path d="M34 40L44 55L34 50V40Z" fill="#f9a885" />
                  
                  {/* Main Body */}
                  <path d="M22 0C22 0 10 12 10 35V50H34V35C34 12 22 0 22 0Z" fill="url(#cyberMetal)" />
                  
                  {/* Windows / Tech Details */}
                  <circle cx="22" cy="20" r="4" fill="#001d33" stroke="#f9a885" strokeWidth="1" />
                  <rect x="18" y="35" width="8" height="2" fill="#f9a885" opacity="0.5" />

                  {/* Plasma Thruster - Dynamic Scaling */}
                  <motion.path
                    animate={{ 
                      scaleY: [1, 1.5, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 0.05, repeat: Infinity }}
                    d="M15 50L22 75L29 50H15Z"
                    fill={multiplier > 5 ? "#ff00ff" : "#f9a885"}
                    filter="url(#neonGlow)"
                    style={{ originY: 0 }}
                  />
                </svg>
              </div>
            </motion.div>
          )}

          {state === 'crashed' && (
            <motion.div
              key="crash-debris"
              style={{ left: `${currentX}%`, top: `${currentY}%` }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-12 h-12 -ml-6 -mt-6 z-[60] flex items-center justify-center"
            >
               <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-40 animate-ping" />
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 100, 
                        y: (Math.random() - 0.5) * 100,
                        opacity: 0,
                        rotate: 360
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-1 h-1 bg-blue-200 rounded-full"
                    />
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Axis Labels - Cyber Style */}
      <div className="absolute bottom-2 left-12 right-12 flex justify-between items-end opacity-20 z-20">
        {[0, 2, 4, 6, 8, 10].map(v => (
          <span key={v} className="text-[8px] font-black text-white tabular-nums">{v}s</span>
        ))}
      </div>
    </div>
  );
}
