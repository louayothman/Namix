
"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  onComplete?: () => void;
}

/**
 * @fileOverview مكون الانترو الفيزيائي v60.0
 * تسلسل: رسم دوائر متتالية -> ظهور الشعار -> دوران فيزيائي متسارع -> مسح الدوائر.
 */
export function SovereignIntro({ onComplete }: SovereignIntroProps) {
  const [showLogo, setShowLogo] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    // توقيتات التسلسل
    const timerLogo = setTimeout(() => setShowLogo(true), 1200);
    const timerExpire = setTimeout(() => setIsExpiring(true), 2800);
    const timerFinish = setTimeout(() => onComplete?.(), 4000);

    return () => {
      clearTimeout(timerLogo);
      clearTimeout(timerExpire);
      clearTimeout(timerFinish);
    };
  }, [onComplete]);

  return (
    <div className="relative flex items-center justify-center select-none" dir="ltr">
      
      {/* 1. Concentric Circles - رسم الإطارات الدائرية */}
      <svg width="240" height="240" viewBox="0 0 100 100" className="absolute z-0 overflow-visible">
        {/* الدائرة الأولى */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="#002d4d"
          strokeWidth="1.5"
          fill="transparent"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: isExpiring ? 0 : 1, 
            opacity: 1,
            rotate: 0
          }}
          transition={{ 
            pathLength: { duration: 1.2, ease: "easeInOut" },
            opacity: { duration: 0.5 }
          }}
        />
        {/* الدائرة الثانية */}
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          stroke="#002d4d"
          strokeWidth="1"
          fill="transparent"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: isExpiring ? 0 : 1, 
            opacity: 0.4
          }}
          transition={{ 
            pathLength: { delay: 0.2, duration: 1.2, ease: "easeInOut" },
            opacity: { delay: 0.2, duration: 0.5 }
          }}
        />
      </svg>

      {/* 2. The Namix Logo - ظهور ودوران الشعار */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: [0, 60, 720, 720] // Ease-in -> Accel -> Hold
            }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 0.5, ease: "easeOut" },
              rotate: { 
                duration: 3, 
                times: [0, 0.2, 0.8, 1],
                ease: [0.45, 0.05, 0.55, 0.95] // Custom physics cubic-bezier
              }
            }}
            className="relative z-10"
          >
            {/* Logo Dots Grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.2)]" />
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.4)]" />
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.4)]" />
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.2)]" />
            </div>

            {/* Central Glow Pulse */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#f9a885]/20 blur-2xl rounded-full scale-150"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
