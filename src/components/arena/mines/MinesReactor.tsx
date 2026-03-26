
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Bomb, CheckCircle2, RotateCcw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinesReactorProps {
  grid: any[];
  gameState: 'idle' | 'playing' | 'won' | 'lost';
  onTileClick: (idx: number) => void;
  betAmount: string;
  currentMultiplier: number;
}

/**
 * MinesReactor - مفاعل مناجم السيولة v7.0
 * تم اعتماد حجم خط 13px للتغذية الراجعة وتطهير النصوص العربية.
 */
export function MinesReactor({ grid, gameState, onTileClick, betAmount, currentMultiplier }: MinesReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-6 relative select-none font-body">
      
      {/* نبض استخباراتي خلفي */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]">
         <div className="h-full w-full bg-[radial-gradient(circle,#002d4d_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="relative w-full max-w-[340px] aspect-square bg-white rounded-[40px] p-5 border border-gray-50 shadow-2xl overflow-hidden group">
        
        {/* شبكة العقد الاستراتيجية */}
        <div className="grid grid-cols-5 gap-2.5 h-full relative z-10">
          {grid.map((tile, i) => (
            <motion.button
              key={i}
              whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.94 } : {}}
              onClick={() => onTileClick(i)}
              className={cn(
                "aspect-square rounded-[18px] shadow-sm transition-all duration-500 flex items-center justify-center border-[1.5px]",
                tile.status === 'hidden' && "bg-gray-50 border-gray-100 hover:bg-white hover:border-[#002d4d]/20 hover:shadow-md",
                tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-xl",
                tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-2xl scale-105" : 
                tile.status === 'mine' ? "bg-red-50/10 text-red-100 border-red-50 opacity-20" : ""
              )}
            >
              <AnimatePresence mode="wait">
                {tile.status === 'gem' && (
                  <motion.div key="gem" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                    <Gem size={22} className="fill-current drop-shadow-[0_0_8px_rgba(249,168,133,0.4)]" />
                  </motion.div>
                )}
                {tile.status === 'mine' && (
                  <motion.div key="mine" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Bomb size={22} className="fill-current" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* طبقة التغذية الراجعة الفورية */}
        <AnimatePresence>
          {(gameState === 'won' || gameState === 'lost') && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                className={cn(
                  "p-8 rounded-[44px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] border-[3px] border-white/20 text-center space-y-5 w-full", 
                  gameState === 'won' ? "bg-emerald-600/95" : "bg-red-600/95"
                )}
              >
                <div className="h-16 w-16 rounded-[24px] bg-white/20 flex items-center justify-center mx-auto shadow-inner border border-white/20">
                  {gameState === 'won' ? <CheckCircle2 size={36} className="text-white"/> : <RotateCcw size={36} className="text-white"/>}
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-lg font-black text-white tracking-normal leading-none">{gameState === 'won' ? 'استخراج ناجح' : 'عطل تقني'}</h2>
                  <p className="text-[13px] font-bold text-white/80 tracking-normal leading-relaxed">
                    {gameState === 'won' ? `تم حقن $${(Number(betAmount) * currentMultiplier).toFixed(2)} في محفظتك.` : 'اصطدمت بعقدة معطلة في الشبكة.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-2.5 opacity-20">
         <Activity size={10} className="text-[#002d4d] animate-pulse" />
         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#002d4d]">Matrix Stream Active</span>
      </div>
    </section>
  );
}
