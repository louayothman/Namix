
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SovereignIntroProps {
  introText?: string;
  introOpacity: any;
  logoRotate: any;
}

/**
 * @fileOverview مكون الانترو v68.0 - Independent Axial Rotation
 * الشعار يدور حول مركزه الفيزيائي بحرية، بينما يختفي النص بـ Fade نقي دون تأثر بالدوران.
 */
export function SovereignIntro({ introText, introOpacity, logoRotate }: SovereignIntroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col items-center justify-center select-none gap-12" dir="ltr">
      
      {/* 1. The Namix Logo - Axial Rotation Only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        {/* الدوران يطبق على الشعار فقط حول نقطة الصفر الخاصة به */}
        <motion.div 
          style={{ rotate: logoRotate }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.15)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.3)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.3)]" />
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#002d4d] shadow-[0_0_20px_rgba(0,45,77,0.15)]" />
          </div>
        </motion.div>
      </motion.div>

      {/* 2. Intro Text - Static Fade Logic */}
      <motion.div
        style={{ opacity: introOpacity }}
        initial={{ opacity: 0, filter: "blur(15px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="text-center px-8"
      >
        {/* نص متدرج بالكحلي الماسي كما طلب المشرف */}
        <h3 className="text-xl md:text-3xl font-black bg-gradient-to-b from-[#002d4d] via-[#004d77] to-[#002d4d] bg-clip-text text-transparent tracking-tight leading-relaxed max-w-xl" dir="rtl">
          {introText || "ناميكس: بوابتك السيادية نحو الاقتصاد الرقمي المتطور."}
        </h3>
        
        {/* خط ديكوري سائل */}
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
