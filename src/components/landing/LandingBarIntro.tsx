
"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل الهوية الماسي v3.0 - Simplified Clipped Edition
 * يتميز بلوجو شبكي ضخم مقتطع يدور بفيزياء متغيرة، وبجانبه اسم المنصة الأبيض النقي.
 */

export function LandingBarIntro() {
  return (
    <div className="relative flex items-center h-full overflow-visible" dir="ltr">
      
      {/* 1. اسم المنصة: أبيض نقي، خط تاجوال عريض، بدون تأثيرات */}
      <div className="relative z-20 ml-4 md:ml-8">
        <h1 
          className="text-white font-black text-2xl md:text-4xl tracking-tighter leading-none"
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          NAMIX
        </h1>
      </div>

      {/* 2. الشبكة السديمية المقتطعة: ضخمة ومتموضعة في الزاوية اليمنى */}
      <div className="absolute top-1/2 -right-8 md:-right-12 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center z-10">
        <motion.div 
          className="grid grid-cols-2 gap-3 md:gap-4 p-2 relative"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut" // يحقق التسارع والتباطؤ التلقائي
          }}
        >
          {/* توزيع الألوان المتناظر: أبيض وبرتقالي */}
          <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
          <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-[#f9a885] shadow-[0_0_30px_rgba(249,168,133,0.3)]" />
          <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-[#f9a885] shadow-[0_0_30px_rgba(249,168,133,0.3)]" />
          <div className="h-8 w-8 md:h-12 md:w-12 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
          
          {/* التوهج السديمي (Nebula Glow) */}
          <div className="absolute inset-[-40px] bg-white/5 blur-3xl rounded-full pointer-events-none" />
        </motion.div>
      </div>

    </div>
  );
}
