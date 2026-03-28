
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  portalOpacity?: any;
}

/**
 * @fileOverview مكون الهوية المركزية مع الثقب الرقمي v53.0
 * يعرض الهوية منبثقة من ثقب إلكتروني ثلاثي الأبعاد بمدارات رقمية.
 */
export function SovereignIntro({ portalOpacity }: SovereignIntroProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // جلب الثقب الرقمي المحدث
    fetch("https://lottie.host/3eb26c41-4a8c-494e-a355-183811e4d30d/xEq3PCvvEu.json")
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Portal Load Fail:", err));
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none" dir="ltr">
      
      {/* 1. The Digital Portal (Lottie) - الثقب الرقمي المحيط بالهوية */}
      <motion.div 
        style={{ opacity: portalOpacity || 1 }}
        className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
      >
        <div className="w-[450px] h-[450px] md:w-[900px] md:h-[900px] scale-[1.2] md:scale-[1.5] opacity-50">
          {animationData && (
            <Lottie 
              animationData={animationData} 
              loop={true} 
            />
          )}
        </div>
      </motion.div>

      {/* 2. Sovereign Identity Group - الهوية تظهر وكأنها تخرج من الثقب */}
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        
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
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-none" style={{ fontFamily: 'var(--font-body)' }}>
            NAMIX
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
