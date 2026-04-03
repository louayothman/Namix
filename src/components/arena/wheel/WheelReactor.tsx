
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface WheelReactorProps {
  rotation: number;
  isSpinning: boolean;
  result: number | null;
  gameState: 'idle' | 'won' | 'lost';
  segments: number[];
}

/**
 * @fileOverview مفاعل عجلة الحظ المطور v6.0 - Precise Navigation Edition
 * تم تصغير القطر لضمان الظهور الكامل، وتثبيت السهم العلوي، ودمج شعار ناميكس في المركز.
 */
export function WheelReactor({ rotation, isSpinning, result, gameState, segments }: WheelReactorProps) {
  const segmentAngle = 360 / segments.length;

  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-2 relative font-body select-none overflow-hidden gap-4">
      {/* خلفية تقنية خافتة */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <Activity size={200} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002d4d]" />
      </div>

      <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
        
        {/* السهم العلوي - مصمم بأسلوب احترافي ملامس للحافة */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
           <motion.div 
             animate={isSpinning ? { 
               y: [0, 3, 0],
               scaleY: [1, 0.9, 1]
             } : {}}
             transition={{ repeat: Infinity, duration: 0.1 }}
             className="relative"
           >
              {/* جسم السهم الهندسي */}
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-red-600 drop-shadow-[0_4px_8px_rgba(220,38,38,0.4)]" />
              <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-1.5 h-4 bg-red-700 rounded-full opacity-20" />
           </motion.div>
        </div>

        {/* جسم العجلة الاحترافي */}
        <motion.div 
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 5, 
            ease: [0.44, -0.2, 0, 1.13] // Cubic Bezier انسيابي
          }}
          className="relative w-full h-full rounded-full border-[8px] border-[#002d4d] shadow-[0_20px_50px_-10px_rgba(0,45,77,0.3)] overflow-hidden bg-white"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((val, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = (i + 1) * segmentAngle;
              const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const isJackpot = val >= 5;

              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={val === 0 ? "#ffffff" : isJackpot ? "#002d4d" : "#f8fafc"}
                    stroke="#e2e8f0"
                    strokeWidth="0.1"
                  />
                  <text
                    x="50"
                    y="14"
                    transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                    fill={val === 0 ? "#cbd5e1" : isJackpot ? "#f9a885" : "#64748b"}
                    fontSize="4"
                    fontWeight="900"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {val === 0 ? "TRY" : `x${val}`}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* مركز ناميكس النقي المطور */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-12 w-12 rounded-full bg-white shadow-2xl flex items-center justify-center z-20 border-2 border-gray-50">
                <motion.div 
                  animate={isSpinning ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="grid grid-cols-2 gap-1"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                </motion.div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* حاوية النتائج - أسفل الدائرة بشكل متناسق */}
      <div className="h-20 w-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {gameState !== 'idle' && !isSpinning ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "p-4 rounded-[24px] shadow-lg border-2 border-white flex items-center gap-3 w-full max-w-[240px]",
                gameState === 'won' ? "bg-emerald-600" : "bg-orange-500"
              )}
            >
              <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {gameState === 'won' ? <CheckCircle2 size={18} className="text-white"/> : <RotateCcw size={18} className="text-white"/>}
              </div>
              <div className="text-right">
                <h2 className="text-xs font-black text-white leading-none uppercase">
                  {gameState === 'won' ? 'فوز نخبوي' : 'حظاً أوفر'}
                </h2>
                <p className="text-[9px] font-bold text-white/80 mt-1">
                  {gameState === 'won' ? `استحقاق ربح x${result}` : 'لم يحالفك التوفيق.'}
                </p>
              </div>
            </motion.div>
          ) : isSpinning ? (
            <motion.div 
              key="spinning"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-1.5 opacity-30"
            >
               <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="h-1 w-1 rounded-full bg-[#002d4d]"
                    />
                  ))}
               </div>
               <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest">تحليل المسار...</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
