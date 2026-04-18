
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

/**
 * @fileOverview مُفاعل النيورون الرقمي المطور v12.0 - Balanced Parallax Edition
 * تم ضبط الضبابية للمستوى المتوسط (Medium Blur) مع الحفاظ على تأثير الإزاحة المنظورية (Parallax).
 * النقاط تسبح بلوني ناميكس المعتمدين وتترابط بخيوط نانوية ذكية.
 */

interface Point {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  depth: number; // معامل العمق للإزاحة المنظورية
}

export function MarketPulseBackground() {
  const [points, setPoints] = useState<Point[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const requestRef = useRef<number>(null);
  const pointsCount = 70; // كثافة متوازنة

  useEffect(() => {
    // لوني ناميكس المعتمدين
    const colors = ["#002d4d", "#f9a885"];

    const initialPoints = Array.from({ length: pointsCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.04, // حركة هادئة
      vy: (Math.random() - 0.5) * 0.04,
      color: colors[i % colors.length],
      depth: 0.1 + Math.random() * 0.9 // عمق متفاوت للتأثير المنظوري
    }));
    setPoints(initialPoints);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const update = () => {
      setPoints((prev) =>
        prev.map((p) => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          let nvx = p.vx;
          let nvy = p.vy;

          // الارتداد عند الحدود
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
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const connections = useMemo(() => {
    if (points.length === 0) return [];
    
    // ربط كل نقطة بأقرب جارين لإنشاء شبكة عصبية
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
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#fcfdfe]">
      <svg className="w-full h-full opacity-[0.6]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* تعريف الفلتر الضبابي المتوسط */}
        <defs>
          <filter id="nebulaBlurMedium" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
          </filter>
          <filter id="pointBlurMedium" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
          </filter>
        </defs>

        {/* طبقة الروابط النانوية */}
        <g filter="url(#nebulaBlurMedium)">
          {connections.map((c, idx) => {
            const p1 = points[c.from];
            const p2 = points[c.to];
            
            // حساب الإزاحة المنظورية بناءً على التمرير والعمق
            const offset1 = (scrollY * 0.01) * p1.depth;
            const offset2 = (scrollY * 0.01) * p2.depth;

            return (
              <line
                key={`line-${idx}`}
                x1={`${p1.x}%`}
                y1={`${p1.y - offset1}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y - offset2}%`}
                stroke="#002d4d"
                strokeWidth="0.12" 
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* طبقة جزيئات البيانات */}
        <g filter="url(#pointBlurMedium)">
          {points.map((p) => {
            const offset = (scrollY * 0.01) * p.depth;
            return (
              <circle
                key={`point-${p.id}`}
                cx={`${p.x}%`}
                cy={`${p.y - offset}%`}
                r={0.4 + p.depth * 0.2} 
                fill={p.color}
                fillOpacity={0.5 + p.depth * 0.3}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
