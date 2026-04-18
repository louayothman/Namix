"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * @fileOverview مفاعل الجسيمات المترابطة v2.0 - Hydration Guarded
 */
export function MarketPulseBackground() {
  const [points, setPoints] = useState<{id: number, x: number, y: number, duration: number}[]>([]);

  useEffect(() => {
    // توليد النقاط في بيئة العميل فقط لضمان سلامة الهيدريشن
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 20 + Math.random() * 20
    }));
    setPoints(generated);
  }, []);

  if (points.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.4]">
      <svg className="w-full h-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {points.map((p, i) => (
          points.slice(i + 1, i + 4).map((p2, j) => (
            <motion.line
              key={`line-${i}-${j}`}
              x1={`${p.x}%`} y1={`${p.y}%`}
              x2={`${p2.x}%`} y2={`${p2.y}%`}
              stroke="#002d4d"
              strokeWidth="0.05"
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          ))
        ))}
      </svg>

      {points.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1 w-1 bg-[#f9a885] rounded-full blur-[0.5px]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ 
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
