
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

interface DiceIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview NEXUS DICE INTRO v1000.0 - Fluid Sync Edition
 * محرك الافتتاحية السينمائية المتزامن مع حركة الخروج العكسية.
 */
export function DiceIntro({ onComplete }: DiceIntroProps) {
  const [phase, setPhase] = useState<'build' | 'rotate' | 'swap' | 'naming' | 'stable' | 'exit'>('build');
  const gameName = "NEXUS DICE";

  useEffect(() => {
    const sequence = async () => {
      // 1. رسم الإطارات والنقاط التناظرية
      await new Promise(r => setTimeout(r, 1200));
      setPhase('rotate');
      
      // 2. الدوران المتزامن المعاكس
      await new Promise(r => setTimeout(r, 2800));
      setPhase('swap');
      
      // 3. التحول للأيقونة والارتقاء + الطباعة
      await new Promise(r => setTimeout(r, 600));
      setPhase('naming');
      
      // 4. استقرار الرؤية
      await new Promise(r => setTimeout(r, 2200));
      setPhase('stable');
      
      // 5. بدء بروتوكول الخروج العكسي
      await new Promise(r => setTimeout(r, 800));
      setPhase('exit');
      
      // 6. انتهاء الانيميشن بالكامل
      await new Promise(r => setTimeout(r, 3000));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const isExiting = phase === 'exit';

  // منحنى الحركة السائل - القصور الذاتي
  const fluidTransition = { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      
      {/* هالة النبض المركزي الصامتة */}
      <AnimatePresence>
        {(phase !== 'build' && !isExiting) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.03, 0.06, 0.03],
              scale: [1, 1.1, 1]
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-64 w-64 rounded-full bg-orange-500 blur-[100px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col items-center">
        
        {/* مفاعل الهوية المركزي */}
        <motion.div 
          animate={{ 
            y: (phase === 'naming' || phase === 'stable') ? -25 : 0,
            scale: isExiting ? 0.8 : 1
          }}
          transition={fluidTransition}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات والنقاط التناظرية مع الدوران المعاكس */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: (phase === 'rotate' || phase === 'swap' || phase === 'naming' || phase === 'stable') ? -360 : 0,
              opacity: isExiting ? 0 : 1
            }}
            transition={{ 
              rotate: { 
                duration: 3, 
                ease: [0.45, 0.05, 0.55, 0.95],
                repeat: (phase === 'rotate') ? Infinity : 0
              },
              opacity: { duration: 0.8 }
            }}
          >
            <svg width="240" height="240" viewBox="0 0 100 100">
              {/* الإطار المركزي - سميك */}
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {/* الإطار الخارجي - نحيف */}
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none" stroke="#002d4d" strokeWidth="0.4"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : 1 }}
                transition={{ delay: 0.2, duration: 1.5, ease: "easeInOut" }}
              />
              
              {/* النقاط التناظرية مع نبضات الصدى السائلة */}
              {[0, 90, 180, 270].map((angle, i) => {
                const x = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                const y = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                return (
                  <g key={i}>
                    <AnimatePresence>
                      {!isExiting && (
                        <motion.circle
                          cx={x} cy={y} r="1"
                          fill="none" stroke="#002d4d" strokeWidth="0.2"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: [1, 5], opacity: [0.4, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                    <motion.circle
                      cx={x} cy={y} r="1.2"
                      fill="#002d4d"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: isExiting ? 0 : 1, opacity: isExiting ? 0 : 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    />
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* قلب الهوية: تبديل شعار ناميكس بأيقونة النرد (باللون الغامق) */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {(phase === 'swap' || phase === 'naming' || phase === 'stable') ? (
                <motion.div
                  key="icon"
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: isExiting ? 0 : 1, opacity: isExiting ? 0 : 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 45 }}
                  transition={fluidTransition}
                  className="text-[#002d4d]"
                >
                  <Dices size={42} className="drop-shadow-sm" />
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
                    default: { duration: 0.6 }
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

        {/* اسم اللعبة بنظام الطباعة العالمي LTR */}
        <div className="h-10 flex items-center justify-center overflow-hidden" dir="ltr">
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
                      delay: isExiting ? (gameName.length - i) * 0.02 : i * 0.06,
                      duration: 0.3
                    }}
                    className="text-[#002d4d] font-black text-[12px] tracking-[0.3em] inline-block whitespace-pre"
                  >
                    {char}
                  </motion.span>
                ))}
                {/* تأثير الشيمر السيادي */}
                <motion.div
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                  className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-[#f9a885]/10 to-transparent skew-x-[-25deg] pointer-events-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ختم ناميكس السفلي - مجهري */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 0.15 }}
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
