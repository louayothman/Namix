
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Activity, CheckCircle2, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface WheelReactorProps {
  rotation: number;
  isSpinning: boolean;
  result: number | null;
  gameState: 'idle' | 'won' | 'lost';
  segments: number[];
}

/**
 * WheelReactor - عجلة الحظ النخبوية v2.0
 * تم تحديث المؤشر العلوي ليصبح سهماً عصرياً ملامساً للحواف، مع تحسين استجابة الواجهة.
 */
export function WheelReactor({ rotation, isSpinning, result, gameState, segments }: WheelReactorProps) {
  const segmentAngle = 360 / segments.length;

  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-4 relative font-body select-none overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <Activity size={300} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002d4d]" />
      </div>

      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center pt-8">
        
        {/* السهم العلوي العصري - ملامس للحافة بأسلوب فخم */}
        <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
           <motion.div 
             animate={isSpinning ? { 
               y: [0, 8, 0],
               scaleY: [1, 0.8, 1]
             } : {}}
             transition={{ repeat: Infinity, duration: 0.15 }}
             className="relative flex flex-col items-center"
           >
              {/* جسم السهم المتدرج */}
              <div className="w-1 h-8 bg-gradient-to-b from-[#002d4d] to-[#f9a885] rounded-full shadow-lg" />
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-[#f9a885] mt-[-5px] drop-shadow-[0_5px_10px_rgba(249,168,133,0.5)]" />
           </motion.div>
        </div>

        {/* جسم العجلة الدوار */}
        <motion.div 
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 5, 
            // منحنى حركة (Slow Start -> Fast -> Slow Stop)
            ease: [0.45, 0.05, 0.55, 0.95] 
          }}
          className="relative w-full h-full rounded-full border-[10px] border-[#002d4d] shadow-[0_0_80px_rgba(0,45,77,0.2)] overflow-hidden bg-white"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="gradInner" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="#f8fafc" stopOpacity="1" />
              </radialGradient>
            </defs>
            {segments.map((val, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = (i + 1) * segmentAngle;
              const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const isHighWin = val >= 5;
              const isMidWin = val > 0 && val < 5;
              const isLoss = val === 0;

              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={isLoss ? "#ffffff" : isHighWin ? "#002d4d" : "#f1f5f9"}
                    stroke="#e2e8f0"
                    strokeWidth="0.1"
                  />
                  <text
                    x="50"
                    y="18"
                    transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                    fill={isLoss ? "#cbd5e1" : isHighWin ? "#f9a885" : "#64748b"}
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
          
          {/* المركز الزجاجي الأنيق */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-14 w-14 rounded-full bg-white/90 backdrop-blur-md border-[3px] border-[#002d4d] shadow-2xl flex items-center justify-center z-20">
                <Zap size={20} className={cn("transition-all duration-500", isSpinning ? "text-[#f9a885] animate-pulse" : "text-[#002d4d]")} />
             </div>
          </div>
        </motion.div>

        {/* بطاقة النتائج المحدثة بمصطلحات احترافية */}
        <AnimatePresence>
          {gameState !== 'idle' && !isSpinning && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none px-6"
            >
              <div className={cn(
                "p-8 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border-4 border-white text-center space-y-4 w-full max-w-[260px]",
                gameState === 'won' ? "bg-emerald-600" : "bg-orange-500"
              )}>
                <div className="h-14 w-14 rounded-[22px] bg-white/20 flex items-center justify-center mx-auto shadow-inner">
                  {gameState === 'won' ? <CheckCircle2 size={32} className="text-white"/> : <RotateCcw size={32} className="text-white"/>}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white leading-none uppercase tracking-tight">
                    {gameState === 'won' ? 'فوز استثنائي' : 'حظاً أوفر'}
                  </h2>
                  <p className="text-[12px] font-bold text-white/80 leading-relaxed">
                    {gameState === 'won' ? `مبروك! تضاعفت أصولك بمقدار x${result}` : 'لم يحالفك التوفيق في هذه الدورة.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center gap-3 opacity-30">
         <Activity size={12} className="text-[#002d4d] animate-pulse" />
         <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#002d4d]">Premium Odds Engine</span>
      </div>
    </section>
  );
}
