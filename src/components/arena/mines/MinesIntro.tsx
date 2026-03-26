
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem } from "lucide-react";

interface MinesIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview SOVEREIGN MINES INTRO v1200.0
 * محرك الأوركسترا السينمائية: رسم متزامن، ومضة تبديل الهوية، وخروج عكسي متسلسل.
 */
export function MinesIntro({ onComplete }: MinesIntroProps) {
  // phases: 'initial' | 'drawing' | 'points' | 'logo_entry' | 'rotating' | 'flash_swap' | 'rising_typing' | 'stable' | 'exit_typing' | 'exit_lowering_flash' | 'exit_rotate' | 'exit_points' | 'exit_drawing'
  const [phase, setPhase] = useState('initial');
  const gameName = "SOVEREIGN MINES";

  useEffect(() => {
    const sequence = async () => {
      // --- Entry Sequence ---
      setPhase('drawing'); await new Promise(r => setTimeout(r, 1200));
      setPhase('points'); await new Promise(r => setTimeout(r, 600));
      setPhase('logo_entry'); await new Promise(r => setTimeout(r, 800));
      setPhase('rotating'); await new Promise(r => setTimeout(r, 2500));
      setPhase('flash_swap'); await new Promise(r => setTimeout(r, 400));
      setPhase('rising_typing'); await new Promise(r => setTimeout(r, 2000));
      setPhase('stable'); await new Promise(r => setTimeout(r, 1500));
      
      // --- Reverse Exit Sequence ---
      setPhase('exit_typing'); await new Promise(r => setTimeout(r, 1000));
      setPhase('exit_lowering_flash'); await new Promise(r => setTimeout(r, 800));
      setPhase('exit_rotate'); await new Promise(r => setTimeout(r, 1200));
      setPhase('exit_points'); await new Promise(r => setTimeout(r, 500));
      setPhase('exit_drawing'); await new Promise(r => setTimeout(r, 1200));
      
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const fluidTransition = { duration: 0.9, ease: [0.76, 0, 0.24, 1] };
  const isRising = phase === 'rising_typing' || phase === 'stable' || phase === 'exit_typing';
  const showIcon = phase === 'flash_swap' || isRising || phase === 'exit_typing';
  
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل الهندسي المركزي */}
        <motion.div 
          animate={{ 
            y: isRising ? -40 : 0,
            scale: isRising ? 0.9 : 1
          }}
          transition={fluidTransition}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات والنقاط التناظرية */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: (phase === 'rotating' || phase === 'flash_swap' || phase === 'exit_rotate') ? 360 : 0,
              opacity: phase === 'exit_drawing' ? 0 : 1
            }}
            transition={{ 
              rotate: { duration: 2.5, ease: "easeInOut" },
              opacity: { duration: 0.8 }
            }}
          >
            <svg width="220" height="220" viewBox="0 0 100 100">
              {/* الإطار المركزي */}
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exit_drawing' ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              {/* الإطار الخارجي */}
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none" stroke="#002d4d" strokeWidth="0.4"
                opacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exit_drawing' ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
              />
              
              {/* النقاط التناظرية الصافية */}
              {(phase !== 'initial' && phase !== 'drawing' && phase !== 'exit_drawing' && phase !== 'exit_points') && [0, 90, 180, 270].map((angle, i) => {
                const x = 50 + 36 * Math.cos((angle * Math.PI) / 180);
                const y = 50 + 36 * Math.sin((angle * Math.PI) / 180);
                return (
                  <motion.circle
                    key={i} cx={x} cy={y} r="1.2" fill="#002d4d"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  />
                );
              })}
            </svg>
          </motion.div>

          {/* محرك ومضة تبديل الهوية */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showIcon ? (
                <motion.div
                  key="game-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-[#002d4d]"
                >
                  <Gem size={48} strokeWidth={1.5} />
                </motion.div>
              ) : (phase === 'logo_entry' || phase === 'rotating') && (
                <motion.div
                  key="namix-logo"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: phase === 'rotating' ? -360 : 0
                  }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ 
                    rotate: { duration: 2.5, ease: "easeInOut" },
                    scale: { duration: 0.5 }
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

            {/* عنصر الومضة (Flash) */}
            <AnimatePresence>
              {(phase === 'flash_swap' || phase === 'exit_lowering_flash') && (
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

        {/* اسم اللعبة - Typewriter LTR بالإنجليزية */}
        <div className="h-12 flex items-center justify-center overflow-hidden" dir="ltr">
          <AnimatePresence>
            {(phase === 'rising_typing' || phase === 'stable') && (
              <motion.div className="flex relative mt-[-20px]">
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
                {/* خط الشيمر الفاخر */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg] pointer-events-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ختم ناميكس الصغير في الأسفل */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: phase.startsWith('exit') ? 0 : 0.15 }}
        className="absolute bottom-12 flex items-center gap-2 grayscale pointer-events-none"
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
