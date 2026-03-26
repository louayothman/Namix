
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem } from "lucide-react";

interface MinesIntroProps {
  onComplete: () => void;
}

export function MinesIntro({ onComplete }: MinesIntroProps) {
  const [phase, setPhase] = useState<'build' | 'rotate' | 'swap' | 'naming' | 'stable' | 'exit'>('build');
  const gameName = "SOVEREIGN MINES";

  useEffect(() => {
    const sequence = async () => {
      // 1. Build Frames & Dots
      await new Promise(r => setTimeout(r, 1500));
      setPhase('rotate');
      // 2. Counter Rotation
      await new Promise(r => setTimeout(r, 3000));
      setPhase('swap');
      // 3. Swap Logo to Icon & Elevate
      await new Promise(r => setTimeout(r, 800));
      setPhase('naming');
      // 4. Typewriter naming
      await new Promise(r => setTimeout(r, 2000));
      setPhase('stable');
      // 5. Stable view
      await new Promise(r => setTimeout(r, 1000));
      setPhase('exit');
      // 6. Reverse Sequence
      await new Promise(r => setTimeout(r, 3500));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const isExiting = phase === 'exit';

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      {/* هالة النبض المركزي - تعطي عمق وفخامة */}
      <AnimatePresence>
        {(phase === 'rotate' || phase === 'swap' || phase === 'naming' || phase === 'stable') && !isExiting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.2, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute h-64 w-64 rounded-full bg-blue-500 blur-[80px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-center">
        
        {/* المفاعل الهندسي المركزي */}
        <motion.div 
          animate={{ 
            y: (phase === 'naming' || phase === 'stable') ? -30 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات والنقاط التناظرية */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: (phase === 'rotate' || phase === 'swap' || phase === 'naming' || phase === 'stable') ? -360 : 0,
            }}
            transition={{ 
              rotate: { 
                duration: 3, 
                ease: [0.45, 0.05, 0.55, 0.95],
                repeat: (phase === 'rotate') ? Infinity : 0
              } 
            }}
          >
            <svg width="240" height="240" viewBox="0 0 100 100">
              {/* الإطار المركزي */}
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              {/* الإطار الخارجي */}
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none" stroke="#f9a885" strokeWidth="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : 1 }}
                transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
              />
              
              {/* النقاط التناظرية مع نبضات الصدى */}
              {[0, 90, 180, 270].map((angle, i) => {
                const x = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                const y = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                return (
                  <g key={i}>
                    {/* نبضة الصدى */}
                    {!isExiting && (
                      <motion.circle
                        cx={x} cy={y} r={1.2}
                        fill="none" stroke="#002d4d" strokeWidth="0.2"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: [1, 4], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    )}
                    <motion.circle
                      cx={x} cy={y} r="1.2"
                      fill="#002d4d"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: isExiting ? 0 : 1, 
                        scale: isExiting ? 0 : 1 
                      }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    />
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* محتوى المركز: تبديل شعار ناميكس بالأيقونة مع تأثير انفجار الهوية */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {(phase === 'swap' || phase === 'naming' || phase === 'stable') ? (
                <motion.div
                  key="icon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isExiting ? 0 : 1.1, opacity: isExiting ? 0 : 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-[#002d4d]"
                >
                  {/* وميض التحول */}
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-emerald-400 rounded-full blur-xl -z-10"
                  />
                  <Gem size={38} className="drop-shadow-sm text-blue-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="logo"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: phase === 'rotate' ? 360 : 0
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    rotate: { duration: 3, ease: [0.45, 0.05, 0.55, 0.95] },
                    default: { duration: 0.5 }
                  }}
                  className="grid grid-cols-2 gap-1"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-[#002d4d]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#002d4d]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* اسم اللعبة بنظام الآلة الكاتبة LTR */}
        <div className="h-8 flex items-center justify-center overflow-hidden mt-2" dir="ltr">
          <AnimatePresence>
            {(phase === 'naming' || phase === 'stable') && (
              <motion.div className="flex relative">
                {gameName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: isExiting ? 0 : 1, 
                      width: isExiting ? 0 : "auto" 
                    }}
                    transition={{ 
                      delay: isExiting ? (gameName.length - i) * 0.03 : i * 0.05,
                      duration: 0.2
                    }}
                    className="text-[#002d4d] font-black text-[12px] tracking-[0.3em] inline-block whitespace-pre"
                  >
                    {char}
                  </motion.span>
                ))}
                {/* تأثير الشيمر فوق الاسم */}
                <motion.div
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                  className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-[#f9a885]/20 to-transparent skew-x-[-20deg] pointer-events-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ختم ناميكس السفلي - مصغر Grayscale */}
      <motion.div 
        animate={{ opacity: isExiting ? 0 : 0.1 }}
        className="absolute bottom-10 flex items-center gap-2 filter grayscale"
      >
         <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
         </div>
         <span className="text-[9px] font-black text-[#002d4d] tracking-[0.4em] uppercase">namix</span>
      </motion.div>
    </div>
  );
}
