
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

interface DiceIntroProps {
  onComplete: () => void;
}

/**
 * @fileOverview DiceIntro - أوركسترا الرسم العكسي v800.0
 * تسلسل: رسم -> دوران -> انزياح مع ظهور النرد -> طباعة -> عكس المسار بالكامل.
 */
export function DiceIntro({ onComplete }: DiceIntroProps) {
  const [phase, setPhase] = useState<'drawing' | 'rotating' | 'revealing' | 'naming' | 'exiting_name' | 'exiting_all' | 'done'>('drawing');

  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1500)); setPhase('rotating');
      await new Promise(r => setTimeout(r, 2500)); setPhase('revealing');
      await new Promise(r => setTimeout(r, 1000)); setPhase('naming');
      await new Promise(r => setTimeout(r, 2000)); setPhase('exiting_name');
      await new Promise(r => setTimeout(r, 1000)); setPhase('exiting_all');
      await new Promise(r => setTimeout(r, 1500)); setPhase('done');
    };
    sequence();
  }, []);

  useEffect(() => {
    if (phase === 'done') onComplete();
  }, [phase, onComplete]);

  const gameName = "NEXUS DICE";

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body">
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل المركزي */}
        <motion.div 
          animate={{ 
            y: (phase === 'revealing' || phase === 'naming' || phase === 'exiting_name') ? -40 : 0,
            opacity: phase === 'done' ? 0 : 1
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-64 h-64"
        >
          {/* الإطارات الدائرية */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: phase === 'rotating' ? [0, -360] : 0,
              scale: phase === 'exiting_all' ? 0.8 : 1,
              opacity: phase === 'exiting_all' ? 0 : 1
            }}
            transition={{ rotate: { duration: 2, ease: "easeInOut" }, duration: 0.5 }}
          >
            <svg width="240" height="240" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r="35"
                fill="none" stroke="#002d4d" strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exiting_all' ? 0 : 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <motion.circle
                cx="50" cy="50" r="45"
                fill="none" stroke="#f9a885" strokeWidth="0.6"
                strokeDasharray="2 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase === 'exiting_all' ? 0 : 1 }}
                transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
              />
              {[0, 90, 180, 270].map((angle, i) => (
                <motion.circle
                  key={i}
                  cx={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                  cy={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                  r="1.5"
                  fill="#002d4d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: (phase !== 'drawing' && phase !== 'exiting_all') ? 1 : 0 }}
                />
              ))}
            </svg>
          </motion.div>

          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {(phase === 'revealing' || phase === 'naming' || phase === 'exiting_name') ? (
                <motion.div
                  key="dice"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="text-[#002d4d]"
                >
                  <Dices size={42} className="drop-shadow-sm" />
                </motion.div>
              ) : (phase === 'drawing' || phase === 'rotating') ? (
                <motion.div
                  key="namix"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: phase === 'rotating' ? 360 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { duration: 2, ease: "easeInOut" } }}
                  className="grid grid-cols-2 gap-1"
                >
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885]" />
                  <div className="h-3 w-3 rounded-full bg-[#002d4d]" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="h-8 flex items-center justify-center overflow-hidden" dir="ltr">
          <AnimatePresence>
            {(phase === 'naming' || phase === 'exiting_name') && (
              <motion.div className="flex relative">
                {gameName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: phase === 'exiting_name' ? 0 : 1, 
                      width: phase === 'exiting_name' ? 0 : "auto" 
                    }}
                    transition={{ 
                      delay: phase === 'naming' ? i * 0.05 : (gameName.length - i) * 0.05,
                      duration: 0.2
                    }}
                    className="text-[#002d4d] font-black text-[12px] tracking-[0.2em] inline-block whitespace-pre"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        animate={{ opacity: phase === 'exiting_all' ? 0 : 0.2 }}
        className="absolute bottom-12 flex items-center gap-2"
      >
         <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
         </div>
         <span className="text-[10px] font-black text-[#002d4d] tracking-widest uppercase">namix</span>
      </motion.div>
    </div>
  );
}
