
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  portalOpacity?: any;
}

/**
 * @fileOverview مكون الهوية المركزية مع الثقب الرقمي v52.0
 * يعرض الهوية منبثقة من ثقب إلكتروني ثلاثي الأبعاد.
 */
export function SovereignIntro({ portalOpacity }: SovereignIntroProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const name = "NAMIX";

  useEffect(() => {
    fetch("https://lottie.host/3eb26c41-4a8c-494e-a355-183811e4d30d/xEq3PCvvEu.json")
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Portal Load Fail:", err));
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none" dir="ltr">
      
      {/* 1. The Digital Portal (Lottie) - الثقب الرقمي خلف الهوية */}
      <motion.div 
        style={{ opacity: portalOpacity || 1 }}
        className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
      >
        <div className="w-[400px] h-[400px] md:w-[800px] md:h-[800px] scale-[1.5] md:scale-[2] opacity-40">
          {animationData && (
            <Lottie 
              animationData={animationData} 
              loop={true} 
            />
          )}
        </div>
      </motion.div>

      {/* 2. Sovereign Identity Group - مجموعة الهوية السيادية */}
      <div className="relative z-10 flex items-center gap-4 md:gap-8">
        {/* The Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center shrink-0"
        >
          <div className="grid grid-cols-2 gap-1.5 md:gap-3">
            <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_15px_rgba(249,168,133,0.4)]" />
            <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_15px_rgba(249,168,133,0.4)]" />
            <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          </div>
        </motion.div>

        {/* The Name */}
        <motion.div 
          initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          className="flex items-center"
        >
          <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {name}
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
