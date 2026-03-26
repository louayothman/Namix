
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

interface MinesIntroProps {
  onComplete: () => void;
}

export function MinesIntro({ onComplete }: MinesIntroProps) {
  const [showIcon, setShowIcon] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#002d4d] flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center gap-8">
        <svg width="100" height="100" viewBox="0 0 100 100" className="relative z-10 overflow-visible">
          {/* رسم الجوهرة ضوئياً */}
          <motion.path
            d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z"
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
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 1.5, duration: 1 }}
            onAnimationComplete={() => setShowIcon(true)}
          />

          <AnimatePresence>
            {showIcon && (
              <motion.g
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <foreignObject x="30" y="30" width="40" height="40">
                  <div className="flex items-center justify-center h-full w-full">
                    <Gem className="text-[#f9a885]" size={32} />
                  </div>
                </foreignObject>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        <div className="relative h-6 flex items-center justify-center">
           <motion.span
             initial={{ opacity: 0, y: 5 }}
             animate={{ opacity: showIcon ? 1 : 0, y: 0 }}
             transition={{ delay: 3, duration: 0.8 }}
             className="text-white font-black text-[10px] tracking-[0.4em] uppercase"
           >
             Sovereign Mines
           </motion.span>
        </div>
      </div>

      <div className="absolute bottom-12 flex items-center gap-2 opacity-40">
         <Logo size="sm" className="brightness-200 scale-75" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5 }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
}
