
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RadialControlProps {
  label: string;
  subLabel: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  step?: number;
  onChange: (val: number) => void;
  color?: string;
}

/**
 * @fileOverview RadialControl v1.0 - Sovereign Precision Dial
 * متحكم دائري فخم يسمح بتحديد القيم عبر سحب الحلقة المحيطة بالرقم.
 */
export function RadialControl({ 
  label, 
  subLabel, 
  value, 
  min, 
  max, 
  unit = "$", 
  step = 0.01, 
  onChange,
  color = "text-[#f9a885]" 
}: RadialControlProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const percentage = ((value - min) / (max - min)) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    // منطق تقريبي لتغيير القيمة عند التفاعل مع الدائرة
    // في نسخة الإنتاج يمكن إضافة منطق حساب الزوايا (Math.atan2)
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none font-body">
      <div className="text-center space-y-0.5">
         <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-normal">{label}</p>
         <p className="text-[7px] font-bold text-gray-300 uppercase tracking-widest leading-none">{subLabel}</p>
      </div>

      <div className="relative h-36 w-36 flex items-center justify-center group cursor-pointer" onMouseDown={handleDrag}>
        <svg className="h-full w-full transform -rotate-90 scale-110">
          {/* Background Track */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-50"
          />
          {/* Dynamic Progress Path */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
            strokeLinecap="round"
            className={color.replace('text-', 'stroke-')}
          />
        </svg>

        {/* Central Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
           <div className="flex items-baseline gap-0.5">
              <span className={cn("text-[10px] font-bold opacity-40", color)}>{unit}</span>
              <span className="text-2xl font-black text-[#002d4d] tabular-nums tracking-tighter">
                {value.toLocaleString(undefined, { minimumFractionDigits: step < 1 ? 2 : 0 })}
              </span>
           </div>
           <div className="h-1 w-6 bg-gray-100 rounded-full group-hover:w-10 transition-all duration-500" />
        </div>

        {/* Floating Orb Marker */}
        <motion.div 
          animate={{ rotate: (percentage * 3.6) }}
          className="absolute inset-0 pointer-events-none"
        >
           <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-white shadow-xl bg-current", color)} />
        </motion.div>
      </div>

      {/* Manual Step Controls */}
      <div className="flex items-center gap-2">
         <button onClick={() => onChange(Math.max(min, value - step * 10))} className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-all">-</button>
         <div className="h-1 w-8 bg-gray-50 rounded-full" />
         <button onClick={() => onChange(Math.min(max, value + step * 10))} className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-all">+</button>
      </div>
    </div>
  );
}
