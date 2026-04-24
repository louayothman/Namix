
"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  lightText?: boolean;
  hideText?: boolean;
  animate?: boolean;
}

/**
 * @fileOverview مكون الهوية البصرية - Namix Logo
 * تم إعادة الضبط للاعتماد على الهوامش الافتراضية والتباعد القياسي (gap).
 */
export function Logo({ className, size = 'md', lightText = false, hideText = false, animate = true }: LogoProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';
  
  // ضبط الأحجام بناءً على القياس المختار
  const dotSize = isSmall ? 4 : isLarge ? 10 : 7;
  const gridGap = isSmall ? 2 : isLarge ? 5 : 3;
  const textSize = isSmall ? "text-[14px]" : isLarge ? "text-[32px]" : "text-[24px]";

  return (
    <div 
      className={cn(
        "relative inline-flex items-center gap-3 group cursor-pointer leading-none", 
        className
      )} 
      dir="ltr"
    >
      {/* أيقونة المصفوفة الرباعية */}
      <div className="relative flex items-center justify-center shrink-0 overflow-hidden">
        <motion.div 
          animate={animate ? { rotate: [0, 90, 180, 270, 360] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="grid grid-cols-2" 
          style={{ gap: `${gridGap}px` }}
        >
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
        </motion.div>
      </div>
      
      {/* اسم المنصة */}
      {!hideText && (
        <span className={cn(
          "font-bold tracking-[0.2em] leading-none select-none uppercase inline-block",
          textSize,
          lightText ? "text-white" : "text-[#002d4d]"
        )}>
          NAMIX
        </span>
      )}
    </div>
  );
}
