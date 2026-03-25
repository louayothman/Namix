
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * @fileOverview مفاعل الكراش البصري v15.0 - Dynamic Axis Edition
 * - يبدأ المجال البصري بـ 3x كحد أقصى افتراضي.
 * - يتمدد المحور الرأسي تلقائياً عند تجاوز الـ 3x.
 * - منحنى متدرج لونياً دون توهج مشتت لنقاء بصري فائق.
 */
export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  // بروتوكول المحور الديناميكي: المجال الافتراضي يتسع لـ 3x
  const currentMax = useMemo(() => Math.max(3, multiplier), [multiplier]);
  
  // حساب الإحداثيات بناءً على المجال الحالي (0 إلى currentMax)
  // X يمثل التقدم الزمني (0-100)
  // Y يمثل القيمة (100-0) حيث 100 هي القاع و 0 هي القمة
  const progress = useMemo(() => (multiplier - 1) / (currentMax - 1), [multiplier, currentMax]);
  
  const currentX = progress * 100;
  const currentY = 100 - (progress * 100);

  // توليد خطوط الشبكة بناءً على المجال الحالي
  const gridLines = useMemo(() => {
    const lines = [];
    const step = currentMax > 10 ? 5 : 1;
    for (let i = 1; i <= currentMax + 1; i += step) {
      lines.push(i);
    }
    return lines;
  }, [currentMax]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-[#fcfdfe] font-body">
      
      {/* شبكة الإحداثيات الديناميكية الخلفية */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {gridLines.map((val) => {
          const yPos = 100 - ((val - 1) / (currentMax - 1) * 100);
          return (
            <g key={val}>
              <line x1="0" y1={yPos} x2="100" y2={yPos} stroke="#002d4d" strokeWidth="0.1" />
            </g>
          );
        })}
      </svg>

      {/* تسميات المحور الرأسي (تتحرك مع التمدد) */}
      <div className="absolute left-4 inset-y-0 flex flex-col justify-between py-10 opacity-20 select-none" dir="ltr">
        {gridLines.reverse().slice(0, 6).map((val) => (
          <span key={val} className="text-[8px] font-black text-[#002d4d] tabular-nums">
            {val.toFixed(0)}x
          </span>
        ))}
      </div>
      
      {state === 'running' && (
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            
            {/* مسار النمو النقي - متدرج لونياً وبدون توهج خارجي */}
            <motion.path
              d={`M 0 100 Q ${currentX * 0.4} 100, ${currentX} ${currentY}`}
              fill="none"
              stroke="url(#curveGradient)"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
            />
          </svg>

          {/* نواة الصعود (الصاروخ) - تتبع رأس المنحنى بدقة */}
          <div 
            className="absolute h-4 w-4 bg-white rounded-full shadow-xl z-20 border-[3px] border-blue-500 flex items-center justify-center transition-all duration-100 ease-linear"
            style={{ 
              left: `${currentX}%`, 
              top: `${currentY}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
             <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-ping" />
          </div>
        </div>
      )}

      {/* الرابط البصري مع الزاوية - علامة مائية */}
      <div className="absolute bottom-4 left-4 opacity-[0.03]">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#002d4d]">Scale: Dynamic</p>
      </div>
    </div>
  );
}
