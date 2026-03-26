
"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل الهوية الماسي v3.5 - Integrated Nebula Edition
 * يتميز بنص NAMIX أبيض نقي يسبح فوق شعار شبكي سديمي مقتطع ويدور بديناميكية عالية.
 */

export function LandingBarIntro() {
  return (
    <div className="relative flex items-center h-full overflow-visible" dir="ltr">
      
      {/* 1. اسم المنصة: أبيض نقي، موضع علوي، مزاح لليسار لضمان الرؤية الكاملة */}
      <div className="relative z-20 ml-6 md:ml-12 pointer-events-none">
        <h1 
          className="text-white font-black text-2xl md:text-4xl tracking-tighter leading-none"
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          NAMIX
        </h1>
      </div>

      {/* 2. الشبكة السديمية المقتطعة: ضخمة، خلف النص، بوضعية زاوية مقتطعة */}
      <div className="absolute top-1/2 -right-10 md:-right-16 -translate-y-1/2 w-28 h-28 md:w-40 md:h-40 flex items-center justify-center z-10">
        <motion.div 
          className="grid grid-cols-2 gap-3 md:gap-5 p-2 relative opacity-95"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* توزيع الألوان المتناظر: أبيض وبرتقالي ثنائي بتوهج داخلي */}
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.25)]" />
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-[#f9a885] shadow-[0_0_25px_rgba(249,168,133,0.25)]" />
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
          
          {/* التوهج السديمي الخفي (Subtle Nebula Glow) */}
          <div className="absolute inset-[-60px] bg-gradient-to-tr from-white/5 to-transparent blur-3xl rounded-full pointer-events-none" />
        </motion.div>
      </div>

    </div>
  );
}
