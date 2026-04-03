
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
 * @fileOverview مفاعل عجلة الحظ المطور v7.0 - Pro Navigation Edition
 * تم دمج السهم كجزء هيكلي من الإطار العلوي، وإضافة نقاط زينة حول المحيط.
 */
export function WheelReactor({ rotation, isSpinning, result, gameState, segments }: WheelReactorProps) {
  const segmentAngle = 360 / segments.length;

  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-2 relative font-body select-none overflow-hidden gap-2">
      {/* خلفية تقنية خافتة */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <Activity size={200} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002d4d]" />
      </div>

      <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
        
        {/* السهم الهيكلي العلوي - يظهر كجزء مدمج يلامس العجلة */}
        <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
           <motion.div 
             animate={isSpinning ? { 
               y: [0, 2, 0],
               scaleY: [1, 0.95, 1]
             } : {}}
             transition={{ repeat: Infinity, duration: 0.1 }}
             className="relative drop-shadow-xl"
           >
              {/* جسم السهم المثلثي الاحترافي */}
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-red-600 rounded-sm" />
              {/* لمسة لمعان للسهم */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-white/20 rounded-full" />
           </motion.div>
        </div>

        {/* الإطار الخارجي المزين بالنقاط */}
        <div className="absolute inset-[-12px] rounded-full border-[10px] border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.1)] z-10">
           {[...Array(12)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-2 h-2 rounded-full bg-gray-200 shadow-inner"
               style={{
                 top: `${50 + 46 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                 left: `${50 + 46 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                 transform: 'translate(-50%, -50%)'
               }}
             />
           ))}
        </div>

        {/* جسم العجلة الدوارة */}
        <motion.div 
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 5, 
            ease: [0.44, -0.2, 0, 1.13] 
          }}
          className="relative w-full h-full rounded-full border-[6px] border-[#002d4d] shadow-2xl overflow-hidden bg-white z-20"
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
                    fill={val === 0 ? "#ffffff" : isJackpot ? "#002d4d" : (i % 2 === 0 ? "#f8fafc" : "#f1f5f9")}
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
                    {val === 0 ? "LOST" : `x${val}`}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* مركز ناميكس النقي - اللوغو الرسمي */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-14 w-14 rounded-full bg-white shadow-2xl flex items-center justify-center z-30 border-[3px] border-gray-50">
                <motion.div 
                  animate={isSpinning ? { rotate: 360 } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
                  <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                  <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                  <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
                </motion.div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* حاوية النتائج */}
      <div className="h-16 w-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {gameState !== 'idle' && !isSpinning ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "p-3.5 rounded-[24px] shadow-lg border-2 border-white flex items-center gap-3 w-full max-w-[220px]",
                gameState === 'won' ? "bg-emerald-600" : "bg-orange-500"
              )}
            >
              <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {gameState === 'won' ? <CheckCircle2 size={18} className="text-white"/> : <RotateCcw size={18} className="text-white"/>}
              </div>
              <div className="text-right">
                <h2 className="text-[11px] font-black text-white leading-none uppercase">
                  {gameState === 'won' ? 'استحقاق نخبوي' : 'حظاً أوفر'}
                </h2>
                <p className="text-[9px] font-bold text-white/80 mt-1">
                  {gameState === 'won' ? `ربح بمضاعف x${result}` : 'لم يحالفك التوفيق.'}
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
               <div className="flex gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-[#002d4d]"
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
