
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem } from "lucide-react";

interface MinesIntroProps {
  onComplete: () => void;
}

export function MinesIntro({ onComplete }: MinesIntroProps) {
  const [showIconGlow, setShowIconGlow] = useState(false);
  const [showNameGlow, setShowNameGlow] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center gap-12">
        {/* محرك الرسم الضوئي */}
        <svg width="120" height="120" viewBox="0 0 100 100" className="relative z-10 overflow-visible" dir="ltr">
          {/* شريط المسار الضوئي الذي يرسم الأيقونة */}
          <motion.path
            d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z"
            fill="none"
            stroke="#002d4d"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            onAnimationComplete={() => setShowIconGlow(true)}
          />
          
          {/* رسم الإطار الدائري */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f9a885"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.5, duration: 1.5, ease: "linear" }}
          />

          {/* الأيقونة المركزية التي تتفاعل بعد الرسم */}
          <AnimatePresence>
            {showIconGlow && (
              <motion.g
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <foreignObject x="30" y="30" width="40" height="40">
                  <div className="flex items-center justify-center h-full w-full">
                    <Gem className="text-[#002d4d] drop-shadow-[0_0_15px_rgba(0,45,77,0.3)]" size={32} />
                  </div>
                </foreignObject>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* رسم الاسم */}
        <div className="relative h-8 flex items-center justify-center">
           <motion.div 
             className="relative"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 3 }}
           >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onAnimationComplete={() => setShowNameGlow(true)}
                className="text-[#002d4d] font-black text-xs tracking-[0.4em] uppercase"
              >
                Sovereign Mines
              </motion.span>
              
              {showNameGlow && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute -bottom-2 h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
                />
              )}
           </motion.div>
        </div>
      </div>

      {/* ختم ناميكس الصغير في الأسفل */}
      <div className="absolute bottom-12 flex items-center gap-2 opacity-30 select-none">
         <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
            <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
         </div>
         <span className="text-[10px] font-black text-[#002d4d] tracking-widest uppercase">namix</span>
      </div>

      {/* الشريط الضوئي العائد للأسفل للاختفاء */}
      <motion.div 
        className="absolute bottom-0 w-[1px] bg-[#f9a885]"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: ["0vh", "100vh", "0vh"], opacity: [0, 1, 0] }}
        transition={{ duration: 4.5, times: [0, 0.5, 1], ease: "easeInOut" }}
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
}
