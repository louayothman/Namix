
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
 * @fileOverview مكون الهوية البصرية v5.0 - Precision Alignment
 * تم تحديث الهيكل لضمان محاذاة هندسية مثالية بين الأيقونة والنص.
 */
export function Logo({ className, size = 'md', lightText = false, hideText = false, animate = true }: LogoProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';
  const dotSize = isSmall ? 4 : isLarge ? 10 : 7;
  const gap = isSmall ? 2 : isLarge ? 5 : 3;
  const textSize = isSmall ? "text-[14px]" : isLarge ? "text-[32px]" : "text-[24px]";

  return (
    <div className={cn("relative inline-flex items-center group cursor-pointer leading-none", className)} dir="ltr">
      <div className="relative flex items-center justify-center shrink-0">
        <motion.div 
          animate={animate ? { rotate: [0, 90, 180, 270, 360] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="grid grid-cols-2" 
          style={{ gap: `${gap}px` }}
        >
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
        </motion.div>
      </div>
      
      {!hideText && (
        <span className={cn(
          "font-normal tracking-tight leading-none select-none ml-3 inline-block align-middle",
          textSize,
          lightText ? "text-white" : "text-[#002d4d]"
        )}>
          NAMIX
        </span>
      )}
    </div>
  );
}
