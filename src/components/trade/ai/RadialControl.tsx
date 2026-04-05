
"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RadialControlProps {
  label: string;
  subLabel: string;
  value: string | number;
  percentage: number; // 0 to 100
  icon: any;
  colorClass: string;
  onDrag: (delta: number) => void;
}

/**
 * @fileOverview RadialControl v2.0 - Sovereign Precision Dial
 * متحكم دائري فخم يدعم التعديل عبر السحب الدائري أو الرأسي.
 */
export function RadialControl({ 
  label, 
  subLabel, 
  value, 
  percentage, 
  icon: Icon, 
  colorClass,
  onDrag 
}: RadialControlProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const delta = startY.current - currentY;
      onDrag(delta);
      startY.current = currentY;
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, onDrag]);

  return (
    <div className="flex flex-col items-center gap-3 select-none touch-none">
      <div className="text-center space-y-0.5">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      </div>

      <div 
        className="relative h-28 w-28 flex items-center justify-center cursor-ns-resize group"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <svg className="absolute inset-0 h-full w-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-gray-50"
          />
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            strokeLinecap="round"
            className={colorClass}
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center">
           <div className={cn("mb-1 transition-transform duration-500", isDragging ? "scale-110" : "scale-100", colorClass.replace('stroke-', 'text-'))}>
              <Icon size={14} />
           </div>
           <p className="text-sm font-black text-[#002d4d] tabular-nums tracking-tighter leading-none">{value}</p>
           <p className="text-[6px] font-bold text-gray-300 uppercase mt-1">{subLabel}</p>
        </div>

        {/* Floating Orb */}
        <motion.div 
          animate={{ rotate: (percentage * 3.6) }}
          className="absolute inset-0 pointer-events-none"
        >
           <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-white shadow-lg", colorClass.replace('stroke-', 'bg-'))} />
        </motion.div>
      </div>
    </div>
  );
}
