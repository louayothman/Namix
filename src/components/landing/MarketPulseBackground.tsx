
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

/**
 * @fileOverview مُفاعل النيورون الرقمي الملون v9.0 - Refined Nebula Edition
 * تم تقليل الأحجام والسرعات مع إضافة تأثير ضبابي ناعم لضمان خلفية احترافية غير مشتتة.
 */

interface Point {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export function MarketPulseBackground() {
  const [points, setPoints] = useState<Point[]>([]);
  const requestRef = useRef<number>(null);
  const pointsCount = 65; // تعداد متوازن لضمان النقاء

  useEffect(() => {
    // لوني ناميكس المعتمدين
    const colors = ["#002d4d", "#f9a885"];

    const initialPoints = Array.from({ length: pointsCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.06, // سرعة هادئة جداً
      vy: (Math.random() - 0.5) * 0.06,
      color: colors[i % colors.length]
    }));
    setPoints(initialPoints);

    const update = () => {
      setPoints((prev) =>
        prev.map((p) => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          let nvx = p.vx;
          let nvy = p.vy;

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
        .slice(0, 2); 

      return distances.map(d => ({ from: i, to: d.index }));
    }).flat();
  }, [points]);

  if (points.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      <svg className="w-full h-full opacity-[0.45]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* طبقة الروابط النانوية */}
        <g style={{ filter: 'blur(0.8px)' }}>
          {connections.map((c, idx) => (
            <line
              key={`line-${idx}`}
              x1={`${points[c.from].x}%`}
              y1={`${points[c.from].y}%`}
              x2={`${points[c.to].x}%`}
              y2={`${points[c.to].y}%`}
              stroke="#002d4d"
              strokeWidth="0.12" 
              strokeOpacity="0.15"
              strokeLinecap="round"
            />
          ))}
        </g>
        {/* طبقة جزيئات البيانات */}
        <g style={{ filter: 'blur(0.5px)' }}>
          {points.map((p) => (
            <circle
              key={`point-${p.id}`}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r="0.4" 
              fill={p.color}
              className="opacity-60"
            />
          ))}
        </g>
      </svg>
      {/* طبقة تعزيز التباين اللطيفة */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
    </div>
  );
}
