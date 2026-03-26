
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

/**
 * @fileOverview مفاعل نكسوس للاحتمالات v5.0 - Natural Mobile Scale
 * تم عكس اتجاه المسار الملون وإضافة المؤشر الرقمي الطائر بدقة ميكانيكية.
 */
export function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: DiceReactorProps) {
  return (
    <section className="flex-1 flex flex-col items-center justify-center p-6 space-y-10 font-body select-none">
      
      {/* النتيجة اللحظية الطائرة */}
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div 
            initial={{ scale: 0.5, y: 20, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            className="absolute top-[22%] z-30"
          >
            <div className={cn(
              "px-8 py-3 rounded-2xl font-black text-3xl shadow-2xl border-2 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[320px] space-y-10">
        <div className="relative pt-12">
          
          {/* مسار الاحتمالات المعكوس */}
          <div className="h-2.5 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner border border-gray-50">
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
             
             {/* المؤشر الرقمي الطائر - سهم نانو مع بطاقة قيمة */}
             <motion.div 
               className="absolute top-[-48px] flex flex-col items-center pointer-events-none z-30" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-lg flex items-center gap-1 border border-white/10 tabular-nums">
                   {targetValue.toFixed(2)}
                </div>
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#002d4d] mt-[-1px]" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-6 font-black text-[8px] text-gray-300 uppercase tracking-widest px-1">
            <span className="bg-gray-50 px-2 py-0.5 rounded-md">0.00</span>
            <span className="opacity-10">Nexus Alignment Zone</span>
            <span className="bg-gray-50 px-2 py-0.5 rounded-md">100.00</span>
          </div>
        </div>

        {/* وضعية الرهان */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-6 h-10 rounded-xl font-black text-[10px] uppercase transition-all", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-md" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Roll Over
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-6 h-10 rounded-xl font-black text-[10px] uppercase transition-all", 
                !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-md" : "text-gray-400 hover:text-gray-600"
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
