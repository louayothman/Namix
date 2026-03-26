
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

interface DiceIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview NEXUS DICE INTRO v1300.0
 * محرك الأوركسترا السينمائية: تلاشي دخول الشعار، ومضة تبديل الهوية، وخروج عكسي متسلسل.
 */
export function DiceIntro({ onComplete }: DiceIntroProps) {
  // phases: 'initial' | 'drawing' | 'dots' | 'fade_logo' | 'rotating' | 'flash_swap' | 'elevating' | 'stable' | 'exit_typing' | 'exit_flash_down' | 'exit_rotate' | 'exit_erase'
  const [phase, setPhase] = useState('initial');
  const gameName = "NEXUS DICE";

  useEffect(() => {
    const sequence = async () => {
      setPhase('drawing'); await new Promise(r => setTimeout(r, 1000));
      setPhase('dots'); await new Promise(r => setTimeout(r, 500));
      setPhase('fade_logo'); await new Promise(r => setTimeout(r, 800));
      setPhase('rotating'); await new Promise(r => setTimeout(r, 2200));
      setPhase('flash_swap'); await new Promise(r => setTimeout(r, 400));
      setPhase('elevating'); await new Promise(r => setTimeout(r, 1800));
      setPhase('stable'); await new Promise(r => setTimeout(r, 1200));
      
      // Reverse Exit Sequence
      setPhase('exit_typing'); await new Promise(r => setTimeout(r, 1000));
      setPhase('exit_flash_down'); await new Promise(r => setTimeout(r, 800));
      setPhase('exit_rotate'); await new Promise(r => setTimeout(r, 1200));
      setPhase('exit_erase'); await new Promise(r => setTimeout(r, 1000));
      
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const isElevated = phase === 'elevating' || phase === 'stable' || phase === 'exit_typing';
  const showIcon = phase === 'flash_swap' || isElevated;
  const isRotating = phase === 'rotating' || phase === 'exit_rotate';

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل الهندسي المركزي */}
        <motion.div 
          animate={{ 
            y: isElevated ? -35 : 0,
            scale: isElevated ? 0.85 : 1
          }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات والنقاط */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: isRotating ? (phase.startsWith('exit') ? 0 : 360) : 0,
              opacity: phase === 'exit_erase' ? 0 : 1
            }}
            transition={{ rotate: { duration: 2.2, ease: "easeInOut" }, opacity: { duration: 0.8 } }}
          >
            <svg width="220" height="220" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exit_erase' ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none" stroke="#002d4d" strokeWidth="0.4"
                opacity="0.15"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exit_erase' ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
              />
              
              {(phase !== 'initial' && phase !== 'drawing' && phase !== 'exit_erase') && [0, 90, 180, 270].map((angle, i) => {
                const x = 50 + 36 * Math.cos((angle * Math.PI) / 180);
                const y = 50 + 36 * Math.sin((angle * Math.PI) / 180);
                return (
                  <motion.circle
                    key={i} cx={x} cy={y} r="1.2" fill="#002d4d"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  />
                );
              })}
            </svg>
          </motion.div>

          {/* محرك الومضة والتبديل */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showIcon ? (
                <motion.div
                  key="game-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-[#002d4d]"
                >
                  <Dices size={44} strokeWidth={1.5} />
                </motion.div>
              ) : (phase === 'fade_logo' || phase === 'rotating' || phase === 'exit_flash_down') && (
                <motion.div
                  key="namix-logo"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    rotate: isRotating ? (phase.startsWith('exit') ? 0 : -360) : 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    opacity: { duration: 0.6 },
                    rotate: { duration: 2.2, ease: "easeInOut" }
                  }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ومضة التبديل */}
            <AnimatePresence>
              {(phase === 'flash_swap' || phase === 'exit_flash_down') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 2.5, 3] }}
                  className="absolute inset-0 bg-white rounded-full z-20 blur-xl"
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* اسم اللعبة - الآلة الكاتبة LTR */}
        <div className="h-10 flex items-center justify-center overflow-hidden" dir="ltr">
          <AnimatePresence>
            {(phase === 'elevating' || phase === 'stable') && (
              <motion.div className="flex relative mt-[-15px]">
                {gameName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 5 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="text-[#002d4d] font-black text-[12px] tracking-[0.3em] inline-block whitespace-pre"
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ختم ناميكس السفلي */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: phase.startsWith('exit') ? 0 : 0.15 }}
        className="absolute bottom-10 flex items-center gap-2 grayscale pointer-events-none"
      >
         <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
         </div>
         <span className="text-[8px] font-black text-[#002d4d] tracking-[0.4em] uppercase">namix</span>
      </motion.div>
    </div>
  );
}
