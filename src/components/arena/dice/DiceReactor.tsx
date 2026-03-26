
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
 * DiceReactor - مفاعل نكسوس المطور v6.0
 * تم ملء المساحة وتحديث الخطوط لـ 16px مع تأثيرات بصرية غامرة.
 */
export function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: DiceReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-8 relative font-body select-none overflow-hidden">
      
      {/* سديم خلفي تفاعلي */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
         >
            <Activity size={400} className="text-[#002d4d]" />
         </motion.div>
      </div>

      {/* النتيجة اللحظية الطائرة */}
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div 
            initial={{ scale: 0.5, y: 40, opacity: 0 }} 
            animate={{ scale: 1.2, y: -20, opacity: 1 }} 
            className="absolute top-[15%] z-30"
          >
            <div className={cn(
              "px-10 py-4 rounded-[32px] font-black text-4xl shadow-2xl border-4 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[400px] space-y-12 z-10">
        <div className="relative pt-16">
          
          {/* مسار الاحتمالات السيادي */}
          <div className="h-4 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner border border-gray-200">
            <motion.div 
              animate={{ 
                left: isRollOver ? '0%' : `${targetValue}%`, 
                right: isRollOver ? `${100 - targetValue}%` : '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]" 
            />
            <motion.div 
              animate={{ 
                left: isRollOver ? `${targetValue}%` : '0%', 
                right: '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]" 
            />
          </div>

          <div className="relative mt-6">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20 cursor-pointer h-10" 
             />
             
             {/* المؤشر الرقمي الطائر - سهم نانو مع بطاقة قيمة 16px */}
             <motion.div 
               className="absolute top-[-60px] flex flex-col items-center pointer-events-none z-30" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-white px-5 py-2 rounded-2xl text-base font-black shadow-2xl flex items-center gap-2 border border-white/10 tabular-nums tracking-tighter">
                   <Zap size={14} className="text-[#f9a885] fill-current" />
                   {targetValue.toFixed(2)}
                </div>
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#002d4d] mt-[-1px]" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-8 font-black text-[10px] text-gray-300 uppercase tracking-widest px-2">
            <span className="bg-gray-100 px-3 py-1 rounded-lg">0.00</span>
            <span className="opacity-20 flex items-center gap-2">Nexus Calibration <Activity size={10} /></span>
            <span className="bg-gray-100 px-3 py-1 rounded-lg">100.00</span>
          </div>
        </div>

        {/* وضعية الرهان التفاعلية */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-8 h-12 rounded-[20px] font-black text-xs uppercase transition-all tracking-normal", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Roll Over
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-8 h-12 rounded-[20px] font-black text-xs uppercase transition-all tracking-normal", 
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
