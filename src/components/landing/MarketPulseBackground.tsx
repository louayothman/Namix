
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * @fileOverview مُفاعل الهوية الدورانية v1.0 - Sovereign Dual-Rotation Motif
 * يجسد أيقونة ناميكس العملاقة في زوايا الشاشة، تدور بتزامن رياضي مع حركة التمرير.
 * يرمز للثبات المؤسساتي والسيادة التقنية للمنصة.
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
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#002d4d] shadow-2xl" />
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#f9a885] shadow-2xl" />
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#f9a885] shadow-2xl" />
      <div className="w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-[#002d4d] shadow-2xl" />
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#fcfdfe]">
      
      {/* 1. الأيقونة العلوية يميناً - تبرز الهوية في قمة الصفحة */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute -top-[15%] -right-[15%] md:-top-[25%] md:-right-[25%] opacity-[0.03] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* 2. الأيقونة السفلية يساراً - توازن بصري في قاعدة الصفحة */}
      <motion.div 
        style={{ rotate: rotation }}
        className="absolute -bottom-[15%] -left-[15%] md:-bottom-[25%] md:-left-[25%] opacity-[0.03] flex items-center justify-center transition-opacity duration-1000"
      >
         <DotGrid />
      </motion.div>

      {/* طبقة التنعيم النهائية */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40" />
    </div>
  );
}
