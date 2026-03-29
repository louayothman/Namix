
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  introText?: string;
  introOpacity: any;
}

/**
 * @fileOverview مكون الانترو السينمائي v65.0 - Kinetic Logo Edition
 * يظهر الشعار فقط بظهور سائل، مع نص ترحيبي متدرج يتم التحكم به من الإعدادات.
 */
export function SovereignIntro({ introText, introOpacity }: SovereignIntroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center select-none gap-10" dir="ltr">
      
      {/* 1. The Namix Logo - ظهور سينمائي سائل */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: 0
        }}
        transition={{ 
          duration: 1.5,
          ease: [0.16, 1, 0.3, 1] // Luxury Easing
        }}
        className="relative z-10"
      >
        {/* Logo Dots Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.2)]" />
          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.4)]" />
          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.4)]" />
          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.2)]" />
        </div>

        {/* Dynamic Glow Aura */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-[-40px] bg-[#f9a885]/10 blur-3xl rounded-full"
        />
      </motion.div>

      {/* 2. Intro Text - نص متدرج كحلي يختفي عند التمرير */}
      <motion.div
        style={{ opacity: introOpacity }}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 1.2 }}
        className="text-center px-8"
      >
        <h3 className="text-lg md:text-2xl font-black bg-gradient-to-b from-[#002d4d] via-[#004d77] to-[#002d4d] bg-clip-text text-transparent tracking-tight leading-relaxed max-w-lg" dir="rtl">
          {introText || "ناميكس: بوابتك السيادية نحو الاقتصاد الرقمي المتطور."}
        </h3>
        
        {/* Decorative Divider */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60px" }}
          transition={{ delay: 1.5, duration: 1 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#f9a885]/40 to-transparent mx-auto mt-6"
        />
      </motion.div>

    </div>
  );
}
