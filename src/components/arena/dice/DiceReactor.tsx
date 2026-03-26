
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Zap, Activity } from "lucide-react";
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
 * DiceReactor - مفاعل النكسوس v800.0
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
            className="absolute top-[15%] z-30"
          >
            <div className={cn(
              "px-6 py-2 rounded-2xl font-black text-xl shadow-xl border-2 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[320px] space-y-8 z-10 pt-10">
        <div className="relative">
          <div className="h-2.5 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner">
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

          <div className="relative mt-4">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20 h-8" 
             />
             
             <motion.div 
               className="absolute top-[-45px] flex flex-col items-center pointer-events-none z-30" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-white px-3 py-1 rounded-lg text-[13px] font-black shadow-lg flex items-center gap-1.5 tabular-nums tracking-tighter border border-white/10">
                   <Zap size={10} className="text-[#f9a885] fill-current" />
                   {targetValue.toFixed(2)}
                </div>
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#002d4d] mt-[-1px]" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-4 font-black text-[9px] text-gray-300 uppercase tracking-widest tracking-normal">
            <span>0.00</span>
            <span className="opacity-20">Nexus Calibrator</span>
            <span>100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-5 h-9 rounded-xl font-black text-[11px] uppercase transition-all tracking-normal", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-md" : "text-gray-400"
              )}
            >
              Roll Over
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-5 h-9 rounded-xl font-black text-[11px] uppercase transition-all tracking-normal", 
                !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-md" : "text-gray-400"
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
