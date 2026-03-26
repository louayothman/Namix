
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

interface DiceIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview DiceIntro - محرك الافتتاحية السينمائية المتطور v400.0
 * تنفيذ تسلسل: رسم الإطارات -> النقاط -> شعار ناميكس -> دوران متعاكس -> تحول الأيقونة -> الآلة الكاتبة.
 */
export function DiceIntro({ onComplete }: DiceIntroProps) {
  const [phase, setPhase] = useState<'drawing' | 'rotating' | 'transforming' | 'naming' | 'finishing'>('drawing');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('rotating'), 2500),
      setTimeout(() => setPhase('transforming'), 5500),
      setTimeout(() => setPhase('naming'), 6500),
      setTimeout(() => setPhase('finishing'), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const gameName = "نكسوس الاحتمالات";

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* الحاوية المركزية للمفاعل السينمائي */}
        <motion.div 
          animate={{ y: phase === 'naming' || phase === 'finishing' ? -40 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات الدائرية والنقاط التناظرية */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: phase === 'rotating' ? [0, -720] : 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <svg width="240" height="240" viewBox="0 0 100 100" className="overflow-visible">
              {/* الإطار الداخلي */}
              <motion.circle
                cx="50" cy="50" r="30"
                fill="none" stroke="#002d4d" strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              {/* الإطار الخارجي */}
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none" stroke="#f9a885" strokeWidth="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
              />
              
              {/* النقاط التناظرية الأربعة */}
              <AnimatePresence>
                {(phase !== 'drawing' || true) && (
                  <g>
                    {[0, 90, 180, 270].map((angle, i) => (
                      <motion.circle
                        key={i}
                        cx={50 + 36 * Math.cos((angle * Math.PI) / 180)}
                        cy={50 + 36 * Math.sin((angle * Math.PI) / 180)}
                        r="1.2"
                        fill="#002d4d"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.4 }}
                        transition={{ delay: 1.8 + i * 0.1 }}
                      />
                    ))}
                  </g>
                )}
              </AnimatePresence>
            </svg>
          </motion.div>

          {/* شعار ناميكس / أيقونة اللعبة */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === 'transforming' || phase === 'naming' || phase === 'finishing' ? (
                <motion.div
                  key="game-icon"
                  initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="text-[#002d4d] drop-shadow-[0_0_20px_rgba(0,45,77,0.2)]"
                >
                  <Dices size={42} className="fill-current" />
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
                  className="grid grid-cols-2 gap-1.5 p-2 bg-white/50 backdrop-blur-sm rounded-xl"
                >
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* اسم اللعبة - انميشن الآلة الكاتبة */}
        <AnimatePresence>
          {(phase === 'naming' || phase === 'finishing') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex flex-row-reverse items-center justify-center"
            >
              {gameName.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, display: "none" }}
                  animate={{ opacity: 1, display: "inline-block" }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-[#002d4d] font-black text-sm tracking-normal"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* التذييل السيادي */}
      <div className="absolute bottom-12 flex items-center gap-2 opacity-30 select-none scale-75">
         <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
         </div>
         <span className="text-[10px] font-black text-[#002d4d] tracking-[0.4em] uppercase">namix</span>
      </div>

      {/* بوابة العبور النهائية */}
      <AnimatePresence>
        {phase === 'finishing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onAnimationComplete={() => setTimeout(onComplete, 1000)}
            className="absolute inset-0 bg-white pointer-events-none z-[210]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
