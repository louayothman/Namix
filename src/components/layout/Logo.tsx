
"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * NAMIX STATIC LOGO v150.0
 * شعار ناميكس الساكن مع شبكة النقاط على الجهة اليسرى وتنسيق الأبعاد بدقة.
 */
export function Logo({ className, size = 'md' }: LogoProps) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  // مقاسات النقاط والخط بناءً على الحجم المختار
  const dotSize = isSmall ? 5 : isLarge ? 12 : 9;
  const gap = isSmall ? 3 : isLarge ? 6 : 4;
  const textSize = isSmall ? "text-base" : isLarge ? "text-4xl" : "text-2xl";

  return (
    <div className={cn("flex flex-row items-center gap-3", className)} dir="ltr">
      {/* شبكة النقاط 2*2 على الجهة اليسرى */}
      <div 
        className="grid grid-cols-2 shrink-0" 
        style={{ 
          gap: `${gap}px`,
          width: (dotSize * 2) + gap,
          height: (dotSize * 2) + gap
        }}
      >
        <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
        <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
        <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
        <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
      </div>
      
      {/* اسم المنصة */}
      <div className="flex flex-col items-start select-none">
        <h1 className={cn(
          "font-black tracking-tighter text-[#002d4d] leading-none",
          textSize
        )} style={{ fontFamily: 'sans-serif' }}>
          Namix
        </h1>
      </div>
    </div>
  );
}
