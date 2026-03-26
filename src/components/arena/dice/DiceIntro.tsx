
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

interface DiceIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview DiceIntro - مفاعل الأوركسترا السينمائية v500.0
 * تنفيذ تسلسل: رسم الإطارات -> النقاط -> شعار ناميكس -> دوران متزامن معاكس -> تحول الأيقونة -> ارتقاء -> آلة كاتبة (EN).
 */
export function DiceIntro({ onComplete }: DiceIntroProps) {
  const [phase, setPhase] = useState<'drawing' | 'rotating' | 'transforming' | 'naming' | 'finishing'>('drawing');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('rotating'), 1500),
      setTimeout(() => setPhase('transforming'), 4500),
      setTimeout(() => setPhase('naming'), 5500),
      setTimeout(() => setPhase('finishing'), 8000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const gameName = "NEXUS DICE";

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* الحاوية المركزية للمفاعل السينمائي */}
        <motion.div 
          animate={{ y: phase === 'naming' || phase === 'finishing' ? -50 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center w-72 h-72"
        >
          {/* الإطارات الدائرية والنقاط التناظرية - دوران معاكس */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: phase === 'rotating' ? [0, -720] : 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <svg width="280" height="280" viewBox="0 0 100 100" className="overflow-visible">
              {/* الإطار المركزي - زيادة السماكة */}
              <motion.circle
                cx="50" cy="50" r="32"
                fill="none" stroke="#002d4d" strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              {/* الإطار الخارجي - زيادة السماكة */}
              <motion.circle
                cx="50" cy="50" r="44"
                fill="none" stroke="#f9a885" strokeWidth="0.4"
                strokeDasharray="2 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
              />
              
              {/* النقاط التناظرية الأربعة */}
              <g>
                {[0, 90, 180, 270].map((angle, i) => (
                  <motion.circle
                    key={i}
                    cx={50 + 38 * Math.cos((angle * Math.PI) / 180)}
                    cy={50 + 38 * Math.sin((angle * Math.PI) / 180)}
                    r="1.2"
                    fill="#002d4d"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: phase === 'rotating' ? 0.8 : 0.2 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  />
                ))}
              </g>
            </svg>
          </motion.div>

          {/* شعار ناميكس / أيقونة اللعبة - دوران أصلي */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === 'transforming' || phase === 'naming' || phase === 'finishing' ? (
                <motion.div
                  key="game-icon"
                  initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                  animate={{ scale: 1.3, opacity: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-[#002d4d] relative"
                >
                  <Dices size={48} className="drop-shadow-[0_0_20px_rgba(0,45,77,0.3)]" />
                  {/* نبضة طاقة عند التحول */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-blue-400 rounded-full blur-xl"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="namix-logo"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: phase === 'rotating' ? [0, 720] : 0
                  }}
                  transition={{ 
                    scale: { duration: 0.8, ease: "easeOut" },
                    rotate: { duration: 3, ease: "easeInOut" }
                  }}
                  className="grid grid-cols-2 gap-1.5 p-0 bg-transparent border-none shadow-none"
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-[#002d4d]" />
                  <div className="h-3.5 w-3.5 rounded-full bg-[#f9a885]" />
                  <div className="h-3.5 w-3.5 rounded-full bg-[#f9a885]" />
                  <div className="h-3.5 w-3.5 rounded-full bg-[#002d4d]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* اسم اللعبة بالإنجليزية - انميشن الآلة الكاتبة مع شيمر (LTR) */}
        <AnimatePresence>
          {(phase === 'naming' || phase === 'finishing') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center justify-center relative"
              dir="ltr"
            >
              <div className="flex">
                {gameName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, ease: "easeOut" }}
                    className="text-[#002d4d] font-black text-[10px] tracking-[0.25em] inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
              {/* تأثير الشيمر النهائي */}
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg] pointer-events-none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* التذييل السيادي - شعار ناميكس والاسم بحجم نانو */}
      <div className="absolute bottom-16 flex items-center gap-2.5 opacity-20 select-none scale-[0.65] grayscale">
         <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
         </div>
         <span className="text-[11px] font-black text-[#002d4d] tracking-[0.5em] uppercase" style={{ fontFamily: 'sans-serif' }}>namix</span>
      </div>

      {/* بوابة العبور النهائية */}
      <AnimatePresence>
        {phase === 'finishing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onAnimationComplete={() => setTimeout(onComplete, 800)}
            className="absolute inset-0 bg-white pointer-events-none z-[210]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
