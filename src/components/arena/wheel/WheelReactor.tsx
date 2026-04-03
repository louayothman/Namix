"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Activity, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface WheelReactorProps {
  rotation: number;
  isSpinning: boolean;
  result: number | null;
  gameState: 'idle' | 'won' | 'lost';
  segments: number[];
}

/**
 * @fileOverview مفاعل عجلة الحظ المطور v3.0
 * تم نقل السهم للأعلى ملامساً للعجلة، ونقل حاوية النتائج للأسفل لضمان الرؤية الكاملة.
 */
export function WheelReactor({ rotation, isSpinning, result, gameState, segments }: WheelReactorProps) {
  const segmentAngle = 360 / segments.length;

  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-4 relative font-body select-none overflow-hidden gap-10">
      {/* خلفية تقنية خافتة */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <Activity size={300} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002d4d]" />
      </div>

      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        
        {/* السهم النخبوي المطور - في القمة ملامس تماماً للحافة */}
        <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
           <motion.div 
             animate={isSpinning ? { 
               y: [0, 5, 0],
               scaleY: [1, 0.9, 1]
             } : {}}
             transition={{ repeat: Infinity, duration: 0.1 }}
             className="relative flex flex-col items-center"
           >
              {/* تصميم السهم الذهبي الحاد */}
              <div className="w-1.5 h-10 bg-gradient-to-b from-[#002d4d] to-[#f9a885] rounded-full shadow-2xl" />
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[20px] border-t-[#f9a885] mt-[-8px] drop-shadow-[0_8px_15px_rgba(249,168,133,0.6)]" />
           </motion.div>
        </div>

        {/* جسم العجلة الاحترافي */}
        <motion.div 
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 5, 
            ease: [0.45, 0.05, 0.55, 0.95] 
          }}
          className="relative w-full h-full rounded-full border-[12px] border-[#002d4d] shadow-[0_40px_80px_-20px_rgba(0,45,77,0.4)] overflow-hidden bg-white"
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
              const isStandard = val > 0 && val < 5;

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
                    y="16"
                    transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                    fill={val === 0 ? "#cbd5e1" : isJackpot ? "#f9a885" : "#64748b"}
                    fontSize="4.5"
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
          
          {/* المركز الزجاجي الفخم */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-xl border-[4px] border-[#002d4d] shadow-2xl flex items-center justify-center z-20">
                <Zap size={22} className={cn("transition-all duration-500", isSpinning ? "text-[#f9a885] animate-pulse" : "text-[#002d4d]")} />
             </div>
          </div>
        </motion.div>
      </div>

      {/* حاوية النتائج - أسفل الدائرة بشكل متناسق */}
      <div className="h-32 w-full flex flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {gameState !== 'idle' && !isSpinning ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "p-6 rounded-[32px] shadow-2xl border-2 border-white flex items-center gap-5 w-full max-w-[300px]",
                gameState === 'won' ? "bg-emerald-600" : "bg-orange-500"
              )}
            >
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                {gameState === 'won' ? <CheckCircle2 size={24} className="text-white"/> : <RotateCcw size={24} className="text-white"/>}
              </div>
              <div className="text-right space-y-0.5">
                <h2 className="text-base font-black text-white leading-tight uppercase">
                  {gameState === 'won' ? 'فوز نخبوي' : 'حظاً أوفر'}
                </h2>
                <p className="text-[11px] font-bold text-white/80 leading-relaxed">
                  {gameState === 'won' ? `استحقاق ربح بمقدار x${result}` : 'لم يحالفك التوفيق هذه الدورة.'}
                </p>
              </div>
            </motion.div>
          ) : isSpinning ? (
            <motion.div 
              key="spinning"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 opacity-40"
            >
               <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-[#002d4d]"
                    />
                  ))}
               </div>
               <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.3em]">تحليل المسار الرقمي...</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-20">
               <Zap size={16} className="text-[#002d4d]" />
               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#002d4d]">Ready for Initiation</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
