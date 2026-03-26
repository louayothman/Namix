
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

interface DiceIntroProps {
  onComplete: () => void;
}

export function DiceIntro({ onComplete }: DiceIntroProps) {
  const [showIcon, setShowIcon] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#002d4d] flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center gap-12">
        <svg width="100" height="100" viewBox="0 0 100 100" className="relative z-10 overflow-visible">
          {/* رسم مسارات النرد */}
          <motion.path
            d="M30 30 L70 30 L70 70 L30 70 Z M40 40 L40 40 M60 60 L60 60"
            fill="none"
            stroke="#f9a885"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="2 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ delay: 2, duration: 1.2 }}
            onAnimationComplete={() => setShowIcon(true)}
          />

          <AnimatePresence>
            {showIcon && (
              <motion.g
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1, filter: "brightness(1.3)" }}
                transition={{ duration: 0.8 }}
              >
                <foreignObject x="30" y="30" width="40" height="40">
                  <div className="flex items-center justify-center h-full w-full">
                    <Dices className="text-[#f9a885] drop-shadow-[0_0_15px_rgba(249,168,133,0.5)]" size={32} />
                  </div>
                </foreignObject>
                
                <motion.path
                  d="M50 15 L52 22 L58 24 L52 26 L50 33 L48 26 L42 24 L48 22 Z"
                  fill="#f9a885"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        <div className="relative h-6 flex items-center justify-center">
           <motion.span
             initial={{ opacity: 0 }}
             animate={{ opacity: showIcon ? 1 : 0 }}
             transition={{ delay: 3.2, duration: 1 }}
             className="text-white font-black text-[10px] tracking-[0.4em] uppercase"
           >
             Nexus Dice
           </motion.span>
           <motion.div 
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: [0, 100], opacity: [0, 1, 0] }}
             transition={{ delay: 4.5, duration: 1 }}
             className="absolute h-20 w-[1px] bg-gradient-to-b from-[#f9a885] to-transparent"
           />
        </div>
      </div>

      <div className="absolute bottom-12 flex items-center gap-2.5 opacity-20">
         <Logo size="sm" className="brightness-200" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5 }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
}
