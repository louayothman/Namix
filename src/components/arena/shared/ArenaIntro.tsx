
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ArenaIntroProps {
  icon: LucideIcon;
  title: string;
  onComplete: () => void;
}

/**
 * @fileOverview SOVEREIGN KINETIC INTRO v1500.0
 * محرك ميكانيكي متصل: رسم متزامن -> دوران معاكس -> ومضة تحول -> ارتقاء وطباعة -> خروج عكسي متسلسل.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  // phases: 'plotting' | 'spinning' | 'switching' | 'lifting' | 'static' | 'exit_text' | 'exit_main'
  const [phase, setPhase] = useState('initial');

  useEffect(() => {
    const sequence = async () => {
      // 1. بدء البناء (رسم الإطارات)
      setPhase('plotting');
      await new Promise(r => setTimeout(r, 1200)); 
      
      // 2. الأوركسترا الدورانية (تداخل مع نهاية البناء)
      setPhase('spinning');
      await new Promise(r => setTimeout(r, 2200)); 
      
      // 3. ومضة التحول (The Flash Switch)
      setPhase('switching');
      await new Promise(r => setTimeout(r, 400)); 
      
      // 4. الارتقاء وطباعة الاسم
      setPhase('lifting');
      await new Promise(r => setTimeout(r, 2500)); 
      
      // 5. حالة الثبات السيادي
      setPhase('static');
      await new Promise(r => setTimeout(r, 1500)); 
      
      // 6. بدء الخروج العكسي (مسح الاسم أولاً)
      setPhase('exit_text');
      await new Promise(r => setTimeout(r, 800));
      
      // 7. الخروج الميكانيكي الشامل
      setPhase('exit_main');
      await new Promise(r => setTimeout(r, 1500));
      
      onComplete();
    };
    sequence();
  }, [onComplete]);

  const isSpinning = phase === 'spinning';
  const isSwitching = phase === 'switching';
  const isLifting = phase === 'lifting' || phase === 'static' || phase === 'exit_text';
  const isExiting = phase === 'exit_main';
  const showText = isLifting && phase !== 'exit_text';

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل الهندسي المركزي */}
        <motion.div 
          animate={{ 
            y: isLifting ? -35 : 0,
            scale: isExiting ? 0.8 : 1,
            opacity: isExiting ? 0 : 1
          }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات والنقاط - محرك الرسم المتزامن */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: isSpinning ? 360 : (isExiting ? -360 : 0),
            }}
            transition={{ 
              duration: isSpinning ? 2.2 : (isExiting ? 1.2 : 0), 
              ease: [0.76, 0, 0.24, 1] 
            }}
          >
            <svg width="220" height="220" viewBox="0 0 100 100">
              {/* الإطار المركزي */}
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              {/* الإطار الخارجي */}
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none" stroke="#002d4d" strokeWidth="0.4"
                opacity="0.15"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isExiting ? 0 : 1 }}
                transition={{ delay: 0.2, duration: 1.2, ease: "easeInOut" }}
              />
              
              {/* النقاط التناظرية */}
              <AnimatePresence>
                {phase !== 'initial' && phase !== 'plotting' && !isExiting && [0, 90, 180, 270].map((angle, i) => {
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

          {/* محرك الهوية - ومضة التحول */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isLifting ? (
                <motion.div
                  key="game-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-[#002d4d]"
                >
                  <Icon size={44} strokeWidth={1.5} />
                </motion.div>
              ) : (phase === 'spinning' || phase === 'plotting') ? (
                <motion.div
                  key="namix-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: isSpinning ? -360 : 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    rotate: { duration: 2.2, ease: [0.76, 0, 0.24, 1] }
                  }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* الومضة الضوئية (The Switch Flash) */}
            <AnimatePresence>
              {isSwitching && (
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

        {/* اسم اللعبة - الآلة الكاتبة العالمية (LTR) */}
        <div className="h-10 flex items-center justify-center overflow-hidden" dir="ltr">
          <AnimatePresence>
            {showText && (
              <motion.div className="flex relative mt-[-15px]">
                {title.split("").map((char, i) => (
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
                {/* تأثير الشيمر الضوئي */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ختم ناميكس السفلي - مجهري وصامت */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 0.15 }}
        className="absolute bottom-10 flex items-center gap-2 grayscale pointer-events-none select-none"
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
