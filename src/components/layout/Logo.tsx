"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  lightText?: boolean;
}

export function Logo({ className, size = 'md', lightText = false }: LogoProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';
  const dotSize = isSmall ? 4 : isLarge ? 10 : 7;
  const gap = isSmall ? 2 : isLarge ? 5 : 3;
  const textSize = isSmall ? "text-[14px]" : isLarge ? "text-[32px]" : "text-[24px]";

  return (
    <div className={cn("relative flex items-center group cursor-pointer", className)} dir="ltr">
      <div className="relative mr-3 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="grid grid-cols-2" 
          style={{ gap: `${gap}px` }}
        >
          <div className="rounded-full shadow-sm" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
          <div className="rounded-full shadow-sm" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full shadow-sm" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
          <div className="rounded-full shadow-sm" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
        </motion.div>
      </div>
      
      <h1 className={cn(
        "font-normal tracking-tight leading-none select-none",
        textSize,
        lightText ? "text-white" : "text-[#002d4d]"
      )}>
        NAMIX
      </h1>
    </div>
  );
}