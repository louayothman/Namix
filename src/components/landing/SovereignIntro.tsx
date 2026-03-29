
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  introText?: string;
  introOpacity: any;
  logoRotate: any;
}

/**
 * @fileOverview مكون الانترو السينمائي v66.0 - Independent Axial Rotation
 * يدور الشعار حول مركزه فقط، بينما يختفي النص بـ Fade دون دوران.
 */
export function SovereignIntro({ introText, introOpacity, logoRotate }: SovereignIntroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center select-none gap-12" dir="ltr">
      
      {/* 1. The Namix Logo - Axial Rotation Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: 0
        }}
        transition={{ 
          duration: 1.5,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative z-10"
      >
        {/* المكون الذي يدور حول نفسه فقط */}
        <motion.div 
          style={{ rotate: logoRotate }}
          className="relative"
        >
          {/* Logo Dots Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.15)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.3)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.3)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.15)]" />
          </div>

          {/* Dynamic Glow Aura */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-[-30px] bg-[#f9a885]/5 blur-3xl rounded-full pointer-events-none"
          />
        </motion.div>
      </motion.div>

      {/* 2. Intro Text - Static Fade Container */}
      <motion.div
        style={{ opacity: introOpacity }}
        initial={{ opacity: 0, filter: "blur(15px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="text-center px-8"
      >
        <h3 className="text-xl md:text-3xl font-black bg-gradient-to-b from-[#002d4d] via-[#004d77] to-[#002d4d] bg-clip-text text-transparent tracking-tight leading-relaxed max-w-xl drop-shadow-sm" dir="rtl">
          {introText || "ناميكس: بوابتك السيادية نحو الاقتصاد الرقمي المتطور."}
        </h3>
        
        {/* Decorative Fluid Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ delay: 1.8, duration: 1.2 }}
          className="h-[0.5px] bg-gradient-to-r from-transparent via-[#f9a885]/30 to-transparent mx-auto mt-8"
        />
      </motion.div>

    </div>
  );
}
