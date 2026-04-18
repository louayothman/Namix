
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * @fileOverview مُفاعل الهوية الدورانية v2.1 - Optimized Scale & Precision
 * يجسد أيقونة ناميكس العملاقة في زوايا الشاشة، تم تقليص حجمها للنصف لتعزيز الأناقة المينيماليست.
 */

export function MarketPulseBackground() {
  const { scrollY } = useScroll();
  
  // محرك الدوران: دورة كاملة لكل 3000 بكسل تمرير لضمان حركة وقورة وهادئة
  const rotation = useTransform(scrollY, [0, 3000], [0, 360]);

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
      
      {/* 1. الأيقونة العلوية يميناً */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute -top-[5%] -right-[10%] md:-top-[10%] md:-right-[15%] opacity-[0.06] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* 2. الأيقونة السفلية يساراً - تم رفعها لتكون أعلى الفوتر وبوضوح أكبر */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute bottom-[10%] -left-[10%] md:bottom-[20%] md:-left-[15%] opacity-[0.06] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* طبقة تنقية لضمان تباين النصوص (بدون ضبابية) */}
      <div className="absolute inset-0 bg-white/10" />
    </div>
  );
}
