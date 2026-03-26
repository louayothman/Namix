
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

interface DiceIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview NEXUS DICE MECHANICAL INTRO v1400.0
 * محرك ميكانيكي متصل: تداخل الحركات، دخول انسيابي للهوية، ووميض حصري للتحول.
 */
export function DiceIntro({ onComplete }: DiceIntroProps) {
  // phases: 'drawing' | 'points' | 'namix_entry' | 'rotating' | 'flash_swap' | 'lift_type' | 'exit'
  const [phase, setPhase] = useState('initial');
  const gameName = "NEXUS DICE";

  useEffect(() => {
    const sequence = async () => {
      setPhase('drawing');
      await new Promise(r => setTimeout(r, 800)); 
      
      setPhase('points');
      await new Promise(r => setTimeout(r, 400)); 
      
      setPhase('namix_entry');
      await new Promise(r => setTimeout(r, 600)); 
      
      setPhase('rotating');
      await new Promise(r => setTimeout(r, 2000)); 
      
      setPhase('flash_swap');
      await new Promise(r => setTimeout(r, 300)); 
      
      setPhase('lift_type');
      await new Promise(r => setTimeout(r, 2500)); 
      
      setPhase('exit');
      await new Promise(r => setTimeout(r, 2200));
      
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const isLifted = phase === 'lift_type';
  const isExiting = phase === 'exit';
  const showIcon = phase === 'flash_swap' || isLifted;
  const isNamixActive = phase === 'namix_entry' || phase === 'rotating';

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل الهندسي المركزي */}
        <motion.div 
          animate={{ 
            y: isLifted ? -35 : (isExiting ? 0 : 0),
            scale: isLifted ? 0.85 : (isExiting ? 0.7 : 1),
            opacity: isExiting ? 0 : 1
          }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات والنقاط - الحركة الدورانية المعاكسة */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: (phase === 'rotating' || isLifted) ? 360 : 0,
            }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          >
            <svg width="220" height="220" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none" stroke="#002d4d" strokeWidth="0.4"
                opacity="0.15"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : (phase !== 'initial' ? 1 : 0) }}
                transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
              />
              
              {/* النقاط التناظرية */}
              <AnimatePresence>
                {(phase !== 'initial' && phase !== 'drawing' && !isExiting) && [0, 90, 180, 270].map((angle, i) => {
                  const x = 50 + 36 * Math.cos((angle * Math.PI) / 180);
                  const y = 50 + 36 * Math.sin((angle * Math.PI) / 180);
                  return (
                    <motion.circle
                      key={i} cx={x} cy={y} r="1.2" fill="#002d4d"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                    />
                  );
                })}
              </AnimatePresence>
            </svg>
          </motion.div>

          {/* محرك الهوية: تلاشي ناميكس -> ومضة -> أيقونة اللعبة */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showIcon && !isExiting ? (
                <motion.div
                  key="game-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-[#002d4d]"
                >
                  <Dices size={44} strokeWidth={1.5} />
                </motion.div>
              ) : isNamixActive && (
                <motion.div
                  key="namix-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: phase === 'rotating' ? -360 : 0
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

            {/* الومضة التفاعلية الحصرية للتبديل */}
            <AnimatePresence>
              {phase === 'flash_swap' && (
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

        {/* اسم اللعبة - LTR Typewriter */}
        <div className="h-10 flex items-center justify-center overflow-hidden" dir="ltr">
          <AnimatePresence>
            {isLifted && !isExiting && (
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
                {/* Shimmer Effect */}
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

      {/* ختم ناميكس السفلي - Grayscale الصامت */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 0.15 }}
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
