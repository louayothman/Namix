
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem } from "lucide-react";

interface MinesIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview SOVEREIGN MINES INTRO v1100.0
 * محرك الأوركسترا السينمائية: بناء متزامن وخروج هندسي عكسي متسلسل.
 */
export function MinesIntro({ onComplete }: MinesIntroProps) {
  // phases: 'initial' | 'circles' | 'points' | 'logo' | 'rotating' | 'swap_up' | 'typing' | 'stable' | 'exit_typing' | 'exit_down' | 'exit_rotate' | 'exit_points' | 'exit_circles'
  const [phase, setPhase] = useState('initial');
  const gameName = "SOVEREIGN MINES";

  useEffect(() => {
    const sequence = async () => {
      setPhase('circles'); await new Promise(r => setTimeout(r, 1200));
      setPhase('points'); await new Promise(r => setTimeout(r, 600));
      setPhase('logo'); await new Promise(r => setTimeout(r, 800));
      setPhase('rotating'); await new Promise(r => setTimeout(r, 2500));
      setPhase('swap_up'); 
      setPhase('typing'); await new Promise(r => setTimeout(r, 2000));
      setPhase('stable'); await new Promise(r => setTimeout(r, 1500));
      
      // بروتوكول الخروج العكسي المتسلسل
      setPhase('exit_typing'); await new Promise(r => setTimeout(r, 800));
      setPhase('exit_down'); await new Promise(r => setTimeout(r, 600));
      setPhase('exit_rotate'); await new Promise(r => setTimeout(r, 1000));
      setPhase('exit_points'); await new Promise(r => setTimeout(r, 400));
      setPhase('exit_circles'); await new Promise(r => setTimeout(r, 1000));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const fluidTransition = { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] };
  const isExiting = phase.startsWith('exit');

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      <div className="relative flex flex-col items-center">
        
        {/* مفاعل الرسم الهندسي */}
        <motion.div 
          animate={{ 
            y: (phase === 'typing' || phase === 'stable' || phase === 'exit_typing') ? -30 : 0,
          }}
          transition={fluidTransition}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات والنقاط التناظرية */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: (phase === 'rotating' || phase === 'exit_rotate') ? 360 : 0,
              opacity: phase === 'exit_circles' ? 0 : 1
            }}
            transition={{ 
              rotate: { duration: 2.5, ease: "easeInOut" },
              opacity: { duration: 0.5 }
            }}
          >
            <svg width="220" height="220" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exit_circles' ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ duration: 1.2 }}
              />
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none" stroke="#002d4d" strokeWidth="0.4"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exit_circles' ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ delay: 0.2, duration: 1.2 }}
              />
              
              {/* النقاط التناظرية */}
              {(phase !== 'initial' && phase !== 'circles' && phase !== 'exit_circles' && phase !== 'exit_points') && [0, 90, 180, 270].map((angle, i) => {
                const x = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                const y = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                return (
                  <motion.circle
                    key={i} cx={x} cy={y} r="1.2" fill="#002d4d"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                  />
                );
              })}
            </svg>
          </motion.div>

          {/* محرك الهوية المركزي */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {(phase === 'typing' || phase === 'stable' || phase === 'exit_typing') ? (
                <motion.div
                  key="icon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-[#002d4d]"
                >
                  <Gem size={42} />
                </motion.div>
              ) : (phase !== 'initial' && phase !== 'circles' && phase !== 'points' && phase !== 'exit_down' && phase !== 'exit_rotate' && phase !== 'exit_points' && phase !== 'exit_circles') && (
                <motion.div
                  key="logo"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: phase === 'rotating' ? -360 : 0
                  }}
                  transition={{ rotate: { duration: 2.5, ease: "easeInOut" } }}
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

        {/* اسم اللعبة - Typewriter LTR */}
        <div className="h-10 flex items-center justify-center overflow-hidden" dir="ltr">
          <AnimatePresence>
            {(phase === 'typing' || phase === 'stable') && (
              <motion.div className="flex relative">
                {gameName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="text-[#002d4d] font-black text-[13px] tracking-[0.3em] inline-block whitespace-pre"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ختم ناميكس السفلي */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 0.2 }}
        className="absolute bottom-10 flex items-center gap-2 grayscale"
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
