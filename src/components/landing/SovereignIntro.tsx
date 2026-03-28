
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  portalOpacity?: any;
}

/**
 * @fileOverview مكون الهوية المركزية v54.0 - Magnetic Floating Pedestal
 * تم وضع الثقب الرقمي كقاعدة (Pedestal) أسفل الهوية، مع حركة طفو جيبية.
 */
export function SovereignIntro({ portalOpacity }: SovereignIntroProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("https://lottie.host/3eb26c41-4a8c-494e-a355-183811e4d30d/xEq3PCvvEu.json")
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Portal Load Fail:", err));
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none gap-4 md:gap-8" dir="ltr">
      
      {/* 1. The Floating Identity - تسبح بحركة جيبية مستقلة */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative z-10 flex items-center gap-4 md:gap-6"
      >
        {/* The Logo (White & Orange) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative flex items-center justify-center shrink-0"
        >
          <div className="grid grid-cols-2 gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-5 md:h-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <div className="w-2.5 h-2.5 md:w-5 md:h-5 rounded-full bg-[#f9a885] shadow-[0_0_20px_rgba(249,168,133,0.5)]" />
            <div className="w-2.5 h-2.5 md:w-5 md:h-5 rounded-full bg-[#f9a885] shadow-[0_0_20px_rgba(249,168,133,0.5)]" />
            <div className="w-2.5 h-2.5 md:w-5 md:h-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          </div>
        </motion.div>

        {/* The Name (Pure White - No Slant) */}
        <motion.div 
          initial={{ opacity: 0, x: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          className="flex items-center"
        >
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-none">
            NAMIX
          </h1>
        </motion.div>
      </motion.div>

      {/* 2. The Digital Portal Base (Lottie) - تم وضعه كقاعدة تحت الهوية */}
      <motion.div 
        style={{ opacity: portalOpacity || 1 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative z-0 pointer-events-none mt-[-20px] md:mt-[-40px]"
      >
        <div className="w-[300px] h-[150px] md:w-[600px] md:h-[300px] flex items-center justify-center overflow-hidden">
          <div className="scale-[1.8] md:scale-[2.5] opacity-60">
            {animationData && (
              <Lottie 
                animationData={animationData} 
                loop={true} 
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
