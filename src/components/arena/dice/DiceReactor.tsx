
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
 * DiceReactor - مفاعل النكسوس v1100.0
 * تم تطهير النصوص العربية واعتماد حجم الخط 13px مع تصميم زجاجي غامر.
 */
export function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: DiceReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-4 relative font-body select-none overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <Activity size={300} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002d4d]" />
      </div>

      <AnimatePresence>
        {lastResult !== null && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            className="absolute top-[10%] z-30"
          >
            <div className={cn(
              "px-10 py-4 rounded-[28px] font-black text-3xl shadow-2xl border-4 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[340px] space-y-12 z-10 pt-16">
        <div className="relative p-10 bg-white/80 backdrop-blur-xl rounded-[48px] border border-gray-100 shadow-2xl">
          <div className="h-4 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner mb-10">
            <motion.div 
              animate={{ 
                left: isRollOver ? '0%' : `${targetValue}%`, 
                right: isRollOver ? `${100 - targetValue}%` : '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-700" 
            />
            <motion.div 
              animate={{ 
                left: isRollOver ? `${targetValue}%` : '0%', 
                right: '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700" 
            />
          </div>

          <div className="relative mt-2">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20 h-12" 
             />
             
             {/* المؤشر النانوي الطائر */}
             <motion.div 
               className="absolute top-[-65px] flex flex-col items-center pointer-events-none z-30" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-white px-5 py-2 rounded-2xl text-[13px] font-black shadow-2xl flex items-center gap-2 tabular-nums tracking-tighter border-2 border-white/10 group">
                   <Zap size={14} className="text-[#f9a885] fill-current animate-pulse" />
                   {targetValue.toFixed(2)}
                </div>
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#002d4d] mt-[-2px]" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-8 font-black text-[10px] text-gray-300 uppercase tracking-widest tracking-normal">
            <span className="tabular-nums">0.00</span>
            <div className="h-px flex-1 mx-6 bg-gray-50" />
            <span className="tabular-nums">100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-2 bg-gray-100/50 backdrop-blur-md rounded-[28px] border border-white/50 shadow-inner">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-8 h-11 rounded-[20px] font-black text-[11px] uppercase transition-all tracking-normal", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "text-gray-400 hover:text-[#002d4d]"
              )}
            >
              Roll Over
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-8 h-11 rounded-[20px] font-black text-[11px] uppercase transition-all tracking-normal", 
                !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "text-gray-400 hover:text-[#002d4d]"
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
