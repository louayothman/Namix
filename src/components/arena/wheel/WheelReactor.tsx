
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
 * WheelReactor - مفاعل الدوران النخبوي v1.0
 * تصميم عصري يعتمد على تدرجات الألوان والهندسة المتقدمة.
 */
export function WheelReactor({ rotation, isSpinning, result, gameState, segments }: WheelReactorProps) {
  const segmentAngle = 360 / segments.length;

  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-4 relative font-body select-none overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <Activity size={300} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002d4d]" />
      </div>

      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center pt-8">
        
        {/* المؤشر العلوي الثابت */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
           <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#002d4d] drop-shadow-lg" />
           <motion.div 
             animate={isSpinning ? { y: [0, 5, 0] } : {}}
             transition={{ repeat: Infinity, duration: 0.2 }}
             className="h-2 w-2 rounded-full bg-[#f9a885] mt-1 shadow-[0_0_10px_#f9a885]" 
           />
        </div>

        {/* جسم المفاعل الدوار */}
        <motion.div 
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full rounded-full border-8 border-[#002d4d] shadow-[0_0_60px_rgba(0,45,77,0.15)] overflow-hidden bg-white"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((val, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = (i + 1) * segmentAngle;
              const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const isAccent = val > 1.2;
              const isLoss = val === 0;

              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={isLoss ? "#f9fafb" : isAccent ? "#002d4d" : "#f1f5f9"}
                    stroke="#e2e8f0"
                    strokeWidth="0.2"
                  />
                  <text
                    x="50"
                    y="20"
                    transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                    fill={isLoss ? "#cbd5e1" : isAccent ? "#f9a885" : "#64748b"}
                    fontSize="5"
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
          
          {/* القلب المورفي للمفاعل */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-16 w-16 rounded-full bg-white border-4 border-[#002d4d] shadow-2xl flex items-center justify-center z-20">
                <Zap size={24} className={cn("transition-all duration-500", isSpinning ? "text-[#f9a885] animate-pulse" : "text-[#002d4d]")} />
             </div>
          </div>
        </motion.div>

        {/* شاشة النتائج العائمة */}
        <AnimatePresence>
          {gameState !== 'idle' && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className={cn(
                "p-8 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-4 border-white text-center space-y-4 w-64",
                gameState === 'won' ? "bg-emerald-600" : "bg-red-600"
              )}>
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto shadow-inner">
                  {gameState === 'won' ? <CheckCircle2 size={32} className="text-white"/> : <RotateCcw size={32} className="text-white"/>}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white leading-none uppercase">
                    {gameState === 'won' ? 'اكتساب ناجح' : 'عطل فني'}
                  </h2>
                  <p className="text-[13px] font-bold text-white/80 leading-relaxed">
                    {gameState === 'won' ? `المضاعف المكتسب: x${result}` : 'فشل بروتوكول الدوران.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center gap-3 opacity-30">
         <Activity size={12} className="text-[#002d4d] animate-pulse" />
         <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#002d4d]">Liquid Core Pulse</span>
      </div>
    </section>
  );
}
