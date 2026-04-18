
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل الجسيمات والشبكة العصبية v1.0
 * يولد نقاطاً تسبح بحركة عشوائية متصلة بخطوط بروتوبلازمية نحيفة جداً.
 */
export function MarketPulseBackground() {
  const points = useMemo(() => 
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* شبكة الخطوط المترابطة */}
      <svg className="w-full h-full opacity-[0.1]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {points.map((p, i) => (
          points.slice(i + 1, i + 5).map((p2, j) => (
            <motion.line
              key={`line-${i}-${j}`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke="#002d4d"
              strokeWidth="0.05"
              initial={{ opacity: 0 }}
              animate={{ 
                x1: [`${p.x}%`, `${p.x + 4}%`, `${p.x}%`],
                y1: [`${p.y}%`, `${p.y - 4}%`, `${p.y}%`],
                x2: [`${p2.x}%`, `${p2.x - 4}%`, `${p2.x}%`],
                y2: [`${p2.y}%`, `${p2.y + 4}%`, `${p2.y}%`],
                opacity: [0.1, 0.5, 0.1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          ))
        ))}
      </svg>

      {/* الجسيمات المتوهجة */}
      {points.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1 w-1 bg-[#f9a885] rounded-full blur-[0.5px]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ 
            x: [0, 60, -60, 0],
            y: [0, -60, 60, 0],
            opacity: [0.2, 0.7, 0.2]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
