"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل النيورون الرقمي v5.1 - Enhanced Visibility Edition
 * كل نقطة بيانات تسبح بحرية وتتصل بذكاء بأقرب جارين لها فقط.
 * تم زيادة حجم النقاط وسماكة الخطوط قليلاً لتعزيز العمق البصري.
 */

interface Point {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function MarketPulseBackground() {
  const [points, setPoints] = useState<Point[]>([]);
  const requestRef = useRef<number>(null);
  const pointsCount = 35; // عدد النقاط الأمثل للأداء والجمالية

  useEffect(() => {
    // 1. تهيئة النقاط في بيئة العميل فقط (منع خطأ الهيدريشن)
    const initialPoints = Array.from({ length: pointsCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.04, // سرعة هادئة جداً
      vy: (Math.random() - 0.5) * 0.04,
    }));
    setPoints(initialPoints);

    // 2. محرك التحديث الفيزيائي اللحظي
    const update = () => {
      setPoints((prev) =>
        prev.map((p) => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          let nvx = p.vx;
          let nvy = p.vy;

          // ارتداد تكتيكي عند الحدود
          if (nx < 0 || nx > 100) nvx *= -1;
          if (ny < 0 || ny > 100) nvy *= -1;

          return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 3. خوارزمية الربط بالجارين الأقرب (Nearest Neighbor Orchestration)
  const connections = useMemo(() => {
    if (points.length === 0) return [];
    
    return points.map((p, i) => {
      const distances = points
        .map((p2, j) => ({
          index: j,
          dist: Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2))
        }))
        .filter((d) => d.index !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2); // ارتباط ثنائي ذكي

      return distances.map(d => ({ from: i, to: d.index }));
    }).flat();
  }, [points]);

  if (points.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.45] select-none">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* طبقة الخيوط العصبية النانوية - زيادة السماكة قليلاً */}
        <g>
          {connections.map((c, idx) => (
            <line
              key={`line-${idx}`}
              x1={`${points[c.from].x}%`}
              y1={`${points[c.from].y}%`}
              x2={`${points[c.to].x}%`}
              y2={`${points[c.to].y}%`}
              stroke="#002d4d"
              strokeWidth="0.08" 
              strokeOpacity="0.3"
              strokeLinecap="round"
            />
          ))}
        </g>
        
        {/* طبقة نقاط البيانات المتوهجة - زيادة القطر قليلاً */}
        <g>
          {points.map((p) => (
            <circle
              key={`point-${p.id}`}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r="0.25" 
              fill="#f9a885"
              className="drop-shadow-[0_0_3px_rgba(249,168,133,0.9)]"
            />
          ))}
        </g>
      </svg>
      
      {/* هالة التمويه الجانبية */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-50" />
    </div>
  );
}
