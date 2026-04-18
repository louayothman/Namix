
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * @fileOverview مُفاعل التدفق السائل v1.0 - Liquid Flow Mesh Gradient
 * يعتمد على هالات لونية ضخمة (Blobs) تسبح بضبابية عالية خلف المحتوى.
 * يرمز للسيولة المالية وانسيابية بروتوكول ناميكس.
 */

export function MarketPulseBackground() {
  const { scrollY } = useScroll();
  
  // محرك الإزاحة المنظورية للهالات اللونية عند التمرير
  const y1 = useTransform(scrollY, [0, 2000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 150]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -100]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#fcfdfe]">
      
      {/* 1. مفاعل الكحلي السيادي - علوي يمين */}
      <motion.div 
        style={{ y: y1 }}
        animate={{ 
          scale: [1, 1.2, 0.9, 1],
          x: [0, 50, -30, 0],
          rotate: [0, 45, -45, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-10%] w-[80%] h-[70%] bg-[#002d4d]/[0.04] rounded-full blur-[120px]" 
      />

      {/* 2. مفاعل البرتقالي الدافئ - سفلي يسار */}
      <motion.div 
        style={{ y: y2 }}
        animate={{ 
          scale: [1.1, 0.8, 1.2, 1.1],
          x: [0, -60, 40, 0],
          rotate: [0, -30, 30, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-15%] w-[70%] h-[80%] bg-[#f9a885]/[0.06] rounded-full blur-[120px]" 
      />

      {/* 3. مفاعل النبض الأزرق - منتصف */}
      <motion.div 
        style={{ y: y3 }}
        animate={{ 
          scale: [0.9, 1.3, 1, 0.9],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-blue-500/[0.04] rounded-full blur-[130px]" 
      />

      {/* 4. تفاعلات نانوية رقيقة - لتعزيز ملمس السائل */}
      <div className="absolute inset-0 opacity-[0.4]">
         <div className="absolute top-[15%] right-[25%] h-1 w-1 bg-blue-500 rounded-full blur-[2px] animate-pulse" />
         <div className="absolute bottom-[30%] left-[20%] h-1.5 w-1.5 bg-[#f9a885] rounded-full blur-[3px] animate-pulse delay-1000" />
      </div>

      {/* طبقة التنعيم النهائية */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/40" />
    </div>
  );
}
