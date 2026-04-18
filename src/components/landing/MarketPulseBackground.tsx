
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * @fileOverview مُفاعل الهوية الدورانية v2.2 - Strategic Symmetry Protocol
 * تم تصغير الشعارات للنصف ورفع الشعار السفلي ليكون فوق منطقة الفوتر بوضوح ونقاء.
 */

export function MarketPulseBackground() {
  const { scrollY } = useScroll();
  
  // محرك الدوران: دورة كاملة رصينة متزامنة مع التمرير
  const rotation = useTransform(scrollY, [0, 4000], [0, 360]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const DotGrid = () => (
    <div className="grid grid-cols-2 gap-4 md:gap-8">
      <div className="w-24 h-24 md:w-[200px] md:h-[200px] rounded-full bg-[#002d4d] shadow-xl" />
      <div className="w-24 h-24 md:w-[200px] md:h-[200px] rounded-full bg-[#f9a885] shadow-xl" />
      <div className="w-24 h-24 md:w-[200px] md:h-[200px] rounded-full bg-[#f9a885] shadow-xl" />
      <div className="w-24 h-24 md:w-[200px] md:h-[200px] rounded-full bg-[#002d4d] shadow-xl" />
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#fcfdfe]">
      
      {/* 1. الأيقونة السيادية العلوية (يمين) */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute -top-[5%] -right-[8%] md:-top-[10%] md:-right-[12%] opacity-[0.06] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* 2. الأيقونة السيادية السفلية (يسار) - متموضعة فوق الفوتر */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute bottom-[12%] -left-[8%] md:bottom-[18%] md:-left-[12%] opacity-[0.06] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* طبقة تصفية النقاء */}
      <div className="absolute inset-0 bg-white/10" />
    </div>
  );
}
