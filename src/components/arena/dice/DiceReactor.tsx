
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiceReactorProps {
  lastResult: number | null;
  gameState: 'idle' | 'won' | 'lost';
  isRollOver: boolean;
  targetValue: number;
  setTargetValue: (val: number) => void;
  setIsRollOver: (val: boolean) => void;
}

export function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: DiceReactorProps) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 font-body">
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div initial={{ scale: 0.5, y: -20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="absolute top-[25%] z-30">
            <div className={cn(
              "px-10 py-4 rounded-2xl font-black text-4xl shadow-2xl border-2 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[300px] space-y-12">
        <div className="relative pt-16">
          {/* مسار الاحتمالات */}
          <div className="h-3 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner">
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
                right: isRollOver ? '0%' : `${100 - targetValue}%` 
              }} 
              className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700" 
            />
          </div>

          <div className="relative mt-4">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20 cursor-pointer" 
             />
             
             {/* المؤشر الرقمي الطائر */}
             <motion.div 
               className="absolute top-[-54px] flex flex-col items-center pointer-events-none" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-xl flex items-center gap-1 border border-white/10 tabular-nums shadow-blue-900/20">
                   {targetValue.toFixed(2)}
                </div>
                <ChevronDown className="text-[#002d4d] h-5 w-5 mt-[-8px]" fill="currentColor" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-8 font-black text-[9px] text-gray-300 uppercase tracking-widest px-1">
            <span>0.00</span>
            <span className="opacity-20">NEUTRAL ZONE</span>
            <span>100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-2xl border border-gray-200 shadow-inner">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-8 h-11 rounded-xl font-black text-xs transition-all", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Over
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-8 h-11 rounded-xl font-black text-xs transition-all", 
                !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Under
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
