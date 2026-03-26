
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Zap, Activity, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiceReactorProps {
  lastResult: number | null;
  gameState: 'idle' | 'won' | 'lost';
  isRollOver: boolean;
  targetValue: number;
  setTargetValue: (val: number) => void;
  setIsRollOver: (val: boolean) => void;
}

/**
 * DiceReactor - مفاعل النكسوس v900.0
 * تم ضبط الحجم ليكون طبيعياً ومريحاً للهواتف بخط 13px وتطهير النصوص.
 */
export function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: DiceReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-4 relative font-body select-none overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.01]">
         <Activity size={200} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002d4d]" />
      </div>

      <AnimatePresence>
        {lastResult !== null && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            className="absolute top-[12%] z-30"
          >
            <div className={cn(
              "px-8 py-3 rounded-[24px] font-black text-2xl shadow-2xl border-4 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[320px] space-y-10 z-10 pt-12">
        <div className="relative p-8 bg-white rounded-[40px] border border-gray-100 shadow-xl">
          <div className="h-3 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner mb-8">
            <motion.div 
              animate={{ 
                left: isRollOver ? '0%' : `${targetValue}%`, 
                right: isRollOver ? `${100 - targetValue}%` : '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-500" 
            />
            <motion.div 
              animate={{ 
                left: isRollOver ? `${targetValue}%` : '0%', 
                right: '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-500" 
            />
          </div>

          <div className="relative mt-2">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20 h-10" 
             />
             
             {/* المؤشر الرقمي الطائر المطور */}
             <motion.div 
               className="absolute top-[-55px] flex flex-col items-center pointer-events-none z-30" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-white px-4 py-1.5 rounded-2xl text-[13px] font-black shadow-2xl flex items-center gap-2 tabular-nums tracking-tighter border-2 border-white/10 group">
                   <Zap size={12} className="text-[#f9a885] fill-current animate-pulse" />
                   {targetValue.toFixed(2)}
                </div>
                <ChevronUp size={16} className="text-[#002d4d] rotate-180 mt-[-4px] fill-current" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-6 font-black text-[10px] text-gray-300 uppercase tracking-widest tracking-normal">
            <span className="tabular-nums">0.00</span>
            <div className="h-[1px] flex-1 mx-4 bg-gray-50" />
            <span className="tabular-nums">100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-6 h-10 rounded-[18px] font-black text-[11px] uppercase transition-all tracking-normal", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400 hover:text-[#002d4d]"
              )}
            >
              Roll Over
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-6 h-10 rounded-[18px] font-black text-[11px] uppercase transition-all tracking-normal", 
                !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400 hover:text-[#002d4d]"
              )}
            >
              Roll Under
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
