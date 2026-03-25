
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { CryptoIcon } from "@/lib/crypto-icons";

interface CrashVisualizerProps {
  multiplier: number;
  state: 'waiting' | 'running' | 'crashed';
}

/**
 * @fileOverview مفاعل التحليق السيادي v105.0 - Elite Physics Engine
 * - تم تنفيذ الربط الميكانيكي الموحد (Rocket + Flame) باستخدام transform.
 * - محرك سحب بانورامي (6 غيوم ملونة) تتحرك باستمرار في كامل المفاعل.
 * - صاروخ معدني فضائي يحمل شعار ناميكس (2*2).
 * - تطهير الخلفية من الخطوط الشبكية تماماً.
 */
export function CrashVisualizer({ multiplier, state }: CrashVisualizerProps) {
  // حساب التقدم الفيزيائي بناءً على النمو الأسي للمضاعف
  const elapsed = useMemo(() => Math.log(multiplier) / Math.log(1.07), [multiplier]);
  const maxTime = useMemo(() => Math.max(10, elapsed), [elapsed]);
  const maxMult = useMemo(() => Math.max(4, multiplier), [multiplier]);

  // إحداثيات الحاوية الأم للصاروخ (X من اليسار، Y من الأعلى)
  const currentX = 5 + (elapsed / maxTime) * 85;
  const currentY = 90 - ((multiplier - 1) / (maxMult - 1)) * 80;

  // زاوية الدوران: تميل من -45 درجة (أفقي) إلى -90 درجة (عمودي)
  const rotationAngle = useMemo(() => {
    if (state === 'waiting') return -45;
    const progress = Math.min((multiplier - 1) / (maxMult - 1), 1);
    return -45 - (progress * 45);
  }, [multiplier, maxMult, state]);

  // مصفوفة الغيوم البانورامية (6 غيوم بتدرجات فريدة)
  const clouds = [
    { id: 1, top: '10%', scale: 1.2, speed: 45, color: 'from-gray-100 to-white' },
    { id: 2, top: '25%', scale: 0.8, speed: 60, color: 'from-gray-200 to-gray-50' },
    { id: 3, top: '45%', scale: 1.5, speed: 35, color: 'from-blue-50 to-white' },
    { id: 4, top: '65%', scale: 1.0, speed: 50, color: 'from-gray-100 via-white to-gray-50' },
    { id: 5, top: '80%', scale: 0.7, speed: 70, color: 'from-blue-50/50 to-white' },
    { id: 6, top: '5%', scale: 1.3, speed: 40, color: 'from-gray-50 to-white' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-gradient-to-b from-[#E0F2FE] via-white to-white font-body select-none">
      
      {/* 1. Atmospheric Layers (Independent Clouds) */}
      <div className="absolute inset-0 z-0">
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            initial={{ left: "120%" }}
            animate={{ left: "-50%" }}
            transition={{ 
              duration: cloud.speed, 
              repeat: Infinity, 
              ease: "linear",
              delay: cloud.id * -5 // تنويع نقطة البداية لضمان الامتلاء
            }}
            style={{ top: cloud.top, scale: cloud.scale }}
            className="absolute"
          >
            <div className={cn(
              "w-24 h-10 rounded-full blur-[2px] shadow-sm opacity-40 bg-gradient-to-r",
              cloud.color
            )} />
            <div className={cn(
              "w-16 h-8 rounded-full blur-[2px] -mt-6 ml-4 bg-gradient-to-r opacity-60",
              cloud.color
            )} />
          </motion.div>
        ))}
      </div>

      {/* 2. Axis Infrastructure (Static labels only, no grid) */}
      <div className="absolute inset-0 z-10 px-8 py-6 flex flex-col justify-between opacity-30">
        {/* Y-Axis: Multipliers (3 tiers) */}
        <div className="flex flex-col justify-between h-[80%] text-[8px] font-black text-[#002d4d] tabular-nums">
          <span>4.00x</span>
          <span>3.00x</span>
          <span>2.00x</span>
          <span>1.00x</span>
        </div>
        {/* X-Axis: Time (5 stages) */}
        <div className="flex justify-between items-end pr-12 text-[8px] font-black text-[#002d4d] tabular-nums">
          <span>0s</span>
          <span>2s</span>
          <span>4s</span>
          <span>6s</span>
          <span>8s</span>
          <span>10s</span>
        </div>
      </div>

      {/* 3. The Rocket Assembly (Unified Container) */}
      <div className="relative w-full h-full z-30">
        <AnimatePresence>
          {state === 'running' && (
            <motion.div
              key="rocket-assembly"
              style={{ left: `${currentX}%`, top: `${currentY}%` }}
              animate={{ 
                rotate: rotationAngle,
                // اهتزاز الحاوية بالكامل عند السرعات العالية
                x: multiplier > 3 ? [0, 1, -1, 0] : 0,
                y: multiplier > 3 ? [0, -1, 1, 0] : 0
              }}
              transition={{ 
                rotate: { type: "spring", stiffness: 120, damping: 20 },
                x: { duration: 0.1, repeat: Infinity },
                y: { duration: 0.1, repeat: Infinity }
              }}
              className="absolute w-20 h-20 -ml-10 -mt-10 flex items-center justify-center"
            >
              {/* The Rocket Body */}
              <div className="relative w-12 h-16 group">
                <svg viewBox="0 0 40 60" fill="none" className="drop-shadow-[0_15px_30px_rgba(0,45,77,0.2)]">
                  <defs>
                    <linearGradient id="metallicFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="50%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>
                  
                  {/* Wings */}
                  <path d="M10 40L0 55L10 50V40Z" fill="#f9a885" />
                  <path d="M30 40L40 55L30 50V40Z" fill="#f9a885" />
                  
                  {/* Main Metallic Body */}
                  <path d="M20 0C20 0 5 15 5 35V50H35V35C35 15 20 0 20 0Z" fill="url(#metallicFoil)" />
                  <rect x="18" y="45" width="4" height="5" fill="#1e293b" />

                  {/* Namix Logo (2*2 Dots) */}
                  <g transform="translate(16, 25) scale(0.4)">
                    <circle cx="0" cy="0" r="4" fill="#002d4d" />
                    <circle cx="12" cy="0" r="4" fill="#f9a885" />
                    <circle cx="0" cy="12" r="4" fill="#f9a885" />
                    <circle cx="12" cy="12" r="4" fill="#002d4d" />
                  </g>
                </svg>

                {/* THE FLAME: Linked inside container via Transform */}
                <motion.div
                  animate={{ 
                    scaleY: [1, 1.4, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 0.05, repeat: Infinity }}
                  className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[75%] origin-top"
                >
                  <div className="w-4 h-10 bg-gradient-to-b from-[#f9a885] via-orange-500 to-transparent blur-[1px] rounded-full" />
                  <div className="w-2 h-6 bg-white/80 absolute top-0 left-1/2 -translate-x-1/2 blur-[2px] rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* 4. The Crash Impact (Dust Particles) */}
          {state === 'crashed' && (
            <motion.div
              key="crash-dust"
              style={{ left: `${currentX}%`, top: `${currentY}%` }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center"
            >
               <div className="relative w-full h-full">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 0.6 }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 60, 
                        y: (Math.random() - 0.5) * 60,
                        opacity: 0,
                        scale: 0.2
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute w-2 h-2 bg-gray-300 rounded-full blur-[1px]"
                    />
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
