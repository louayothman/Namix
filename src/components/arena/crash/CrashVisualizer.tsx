
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * @fileOverview مفاعل الكراش البصري v17.0 - Acceleration Momentum Edition
 * - المنحنى يبدأ من الزاوية السفلية اليسرى (0, 100).
 * - يتسارع الانحناء ليصل إلى 96% من الارتفاع عند الحافة اليمنى.
 * - استخدام تدرج لوني نقي دون تشتت بصرى.
 */
export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  // بروتوكول المحور الديناميكي: المجال الافتراضي يتسع لـ 3x
  const currentMax = useMemo(() => Math.max(3, multiplier), [multiplier]);
  
  // حساب التقدم النسبي (0 إلى 1)
  const progress = useMemo(() => (multiplier - 1) / (currentMax - 1), [multiplier, currentMax]);
  
  /**
   * خوارزمية الانحناء التفاعلي المتقدمة:
   * نستخدم دالة أسية (Power function) لمحاكاة التسارع الواقعي.
   * X يمثل التقدم الزمني/السعري الأفقي.
   * Y يمثل الارتفاع الذي يزداد انحناؤه تدريجياً ليلامس سقف الـ 96% (القيمة 4 في نظام 100).
   */
  const currentX = progress * 100;
  // الانحناء يزداد مع التقدم؛ نبدأ ببطء ثم نتسارع بحدة
  const visualYProgress = Math.pow(progress, 1.8); 
  const currentY = 100 - (visualYProgress * 92 + 4); 

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
    <div className="absolute inset-0 pointer-events-none overflow-visible z-10 bg-[#fcfdfe] font-body">
      
      {/* شبكة الإحداثيات الديناميكية الخلفية */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {gridLines.map((val) => {
          const yPos = 100 - ((val - 1) / (currentMax - 1) * 100);
          return (
            <g key={val}>
              <line x1="0" y1={yPos} x2="100" y2={yPos} stroke="#002d4d" strokeWidth="0.1" />
            </g>
          );
        })}
      </svg>

      {/* تسميات المحور الرأسي الأيمن */}
      <div className="absolute right-4 inset-y-0 flex flex-col justify-between py-8 opacity-20 select-none items-end" dir="ltr">
        {gridLines.reverse().slice(0, 6).map((val) => (
          <span key={val} className="text-[8px] font-black text-[#002d4d] tabular-nums text-right">
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
            
            {/* مسار النمو التفاعلي - انحناء من الزاوية للزاوية بحد أقصى 96% ارتفاع */}
            <motion.path
              d={`M 0 100 Q ${currentX * 0.7} 100, ${currentX} ${currentY}`}
              fill="none"
              stroke="url(#curveGradient)"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </svg>

          {/* نواة الصعود (الصاروخ) */}
          <div 
            className="absolute h-3 w-3 bg-white rounded-full shadow-lg z-20 border-[2px] border-blue-500 flex items-center justify-center transition-all duration-100 ease-linear"
            style={{ 
              left: `${currentX}%`, 
              top: `${currentY}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
             <div className="h-1 w-1 bg-blue-500 rounded-full animate-ping" />
          </div>
        </div>
      )}

      {/* العلامة المائية السيادية */}
      <div className="absolute bottom-4 left-4 opacity-[0.02] select-none">
         <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Namix Momentum Engine</p>
      </div>
    </div>
  );
}
