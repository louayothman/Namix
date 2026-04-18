
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * @fileOverview مُفاعل الهوية الدورانية v2.0 - Optimized Clarity & Positioning
 * يجسد أيقونة ناميكس العملاقة في زوايا الشاشة، تدور بتزامن مع التمرير بوضوح معزز.
 */

export function MarketPulseBackground() {
  const { scrollY } = useScroll();
  
  // محرك الدوران: دورة كاملة لكل 3000 بكسل تمرير لضمان حركة وقورة وهادئة
  const rotation = useTransform(scrollY, [0, 3000], [0, 360]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const DotGrid = () => (
    <div className="grid grid-cols-2 gap-8 md:gap-16">
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#002d4d] shadow-xl" />
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#f9a885] shadow-xl" />
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#f9a885] shadow-xl" />
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#002d4d] shadow-xl" />
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#fcfdfe]">
      
      {/* 1. الأيقونة العلوية يميناً */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute -top-[10%] -right-[15%] md:-top-[15%] md:-right-[20%] opacity-[0.06] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* 2. الأيقونة السفلية يساراً - تم رفعها لتكون أعلى الفوتر وبوضوح أكبر */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute bottom-[10%] -left-[15%] md:bottom-[20%] md:-left-[20%] opacity-[0.06] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* طبقة تنقية لضمان تباين النصوص (بدون ضبابية) */}
      <div className="absolute inset-0 bg-white/10" />
    </div>
  );
}
