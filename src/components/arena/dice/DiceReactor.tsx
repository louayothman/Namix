
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Zap, Activity } from "lucide-react";
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
 * DiceReactor - مفاعل نكسوس المطور v7.0
 * تم اعتماد حجم خط 13px للمؤشر الطائر وتطهير النصوص العربية.
 */
export function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: DiceReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-6 relative font-body select-none overflow-hidden">
      
      {/* سديم خلفي تفاعلي */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
         >
            <Activity size={300} className="text-[#002d4d]" />
         </motion.div>
      </div>

      {/* النتيجة اللحظية الطائرة */}
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div 
            initial={{ scale: 0.5, y: 40, opacity: 0 }} 
            animate={{ scale: 1.1, y: -10, opacity: 1 }} 
            className="absolute top-[12%] z-30"
          >
            <div className={cn(
              "px-8 py-3 rounded-[28px] font-black text-2xl shadow-2xl border-[3px] border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[360px] space-y-10 z-10">
        <div className="relative pt-12">
          
          {/* مسار الاحتمالات السيادي */}
          <div className="h-3 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner border border-gray-100">
            <motion.div 
              animate={{ 
                left: isRollOver ? '0%' : `${targetValue}%`, 
                right: isRollOver ? `${100 - targetValue}%` : '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]" 
            />
            <motion.div 
              animate={{ 
                left: isRollOver ? `${targetValue}%` : '0%', 
                right: '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]" 
            />
          </div>

          <div className="relative mt-5">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20 cursor-pointer h-10" 
             />
             
             {/* المؤشر الرقمي الطائر - حجم 13px */}
             <motion.div 
               className="absolute top-[-50px] flex flex-col items-center pointer-events-none z-30" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-white px-4 py-1.5 rounded-xl text-[13px] font-black shadow-2xl flex items-center gap-2 border border-white/10 tabular-nums tracking-tighter">
                   <Zap size={12} className="text-[#f9a885] fill-current" />
                   {targetValue.toFixed(2)}
                </div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#002d4d] mt-[-1px]" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-6 font-black text-[9px] text-gray-300 uppercase tracking-widest px-2">
            <span className="bg-gray-50 px-2.5 py-0.5 rounded-lg border border-gray-100">0.00</span>
            <span className="opacity-10 flex items-center gap-2">Nexus Node Calibration <Activity size={8} /></span>
            <span className="bg-gray-50 px-2.5 py-0.5 rounded-lg border border-gray-100">100.00</span>
          </div>
        </div>

        {/* وضعية الرهان التفاعلية */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-6 h-10 rounded-[18px] font-black text-[11px] uppercase transition-all tracking-normal", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Roll Over
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-6 h-10 rounded-[18px] font-black text-[11px] uppercase transition-all tracking-normal", 
                !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "text-gray-400 hover:text-gray-600"
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
