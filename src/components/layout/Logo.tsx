
"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * NAMIX NEBULA LOGO v2.0
 * تصميم الشعار بخط إنجليزي راقي وخلفه أيقونة الشبكة بتأثير سديمي متوهج.
 */
export function Logo({ className, size = 'md' }: LogoProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const dotSize = isSmall ? 4 : isLarge ? 10 : 7;
  const gap = isSmall ? 2 : isLarge ? 5 : 3;
  const textSize = isSmall ? "text-xl" : isLarge ? "text-5xl" : "text-3xl";

  return (
    <div className={cn("relative flex items-center group cursor-pointer", className)} dir="ltr">
      {/* السديم الضوئي خلف النقاط */}
      <div className="absolute -left-2 -top-2 w-12 h-12 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* أيقونة الشبكة 2*2 - سديمية وجانبية */}
      <div className="relative mr-3 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="grid grid-cols-2" 
          style={{ gap: `${gap}px` }}
        >
          <div className="rounded-full shadow-[0_0_10px_rgba(0,45,77,0.3)]" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
          <div className="rounded-full shadow-[0_0_15px_rgba(249,168,133,0.5)]" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full shadow-[0_0_15px_rgba(249,168,133,0.5)]" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full shadow-[0_0_10px_rgba(0,45,77,0.3)]" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
        </motion.div>
        
        {/* توهج سديمي إضافي */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-[#f9a885]/20 blur-md rounded-full scale-150 opacity-40 animate-pulse" />
      </div>
      
      {/* النص الإنجليزي الراقي */}
      <h1 className={cn(
        "font-black tracking-tighter text-[#002d4d] leading-none select-none italic",
        textSize
      )} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        NAMIX
      </h1>
    </div>
  );
}
