
"use client";

import React, { useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  introText?: string;
  introOpacity: any;
  scrollY: any;
}

/**
 * @fileOverview مكون الهوية المركزية v100.0 - Axial Rotation Engine
 * الشعار يدور حول مركزه الفيزيائي بناءً على سرعة واتجاه التمرير.
 * النص يختفي تماماً بآلية Fade ولا يتأثر بالدوران.
 */
export function SovereignIntro({ introText, introOpacity, scrollY }: SovereignIntroProps) {
  const [mounted, setMounted] = useState(false);

  // دوران الشعار حول مركزه: 360 درجة لكل 500 بكسل تمرير
  const logoRotate = useTransform(scrollY, [0, 1000], [0, 720]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center select-none gap-12" dir="ltr">
      
      {/* 1. The Namix Core Identity - دوران محوري فقط */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center gap-6"
      >
        {/* الشعار الدوار حول مركزه */}
        <motion.div 
          style={{ rotate: logoRotate }}
          className="relative shrink-0"
        >
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.15)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.3)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.3)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.15)]" />
          </div>
        </motion.div>

        {/* الاسم المصاحب للشعار */}
        <h1 className="text-4xl md:text-6xl font-black text-[#002d4d] tracking-tighter leading-none select-none">
          NAMIX
        </h1>
      </motion.div>

      {/* 2. Intro Text - تلاشي نقي عند التمرير */}
      <motion.div
        style={{ opacity: introOpacity }}
        initial={{ opacity: 0, filter: "blur(15px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="text-center px-8"
      >
        <h3 className="text-xl md:text-3xl font-black bg-gradient-to-b from-[#002d4d] via-[#004d77] to-[#002d4d] bg-clip-text text-transparent tracking-tight leading-relaxed max-w-xl" dir="rtl">
          {introText || "ناميكس: بوابتك السيادية نحو الاقتصاد الرقمي المتطور."}
        </h3>
        
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
