
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
 * MinesReactor - مفاعل السيادة v1100.0
 * تم تحديث الأحجام لتملأ الشاشة بشكل طبيعي مع خط 13px وتطهير النصوص.
 */
export function MinesReactor({ grid, gameState, onTileClick, betAmount, currentMultiplier }: MinesReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-4 relative select-none font-body">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <div className="h-full w-full bg-[radial-gradient(circle,#002d4d_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative w-full max-w-[340px] aspect-square bg-white/80 backdrop-blur-xl rounded-[48px] p-5 border border-gray-100 shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="grid grid-cols-5 gap-3 h-full relative z-10">
          {grid.map((tile, i) => (
            <motion.button
              key={i}
              whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.9 } : {}}
              onClick={() => onTileClick(i)}
              className={cn(
                "aspect-square rounded-[18px] shadow-sm transition-all duration-500 flex items-center justify-center border-2",
                tile.status === 'hidden' && "bg-gray-50 border-gray-100 hover:border-[#002d4d]/30 hover:bg-white",
                tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-xl scale-[1.02]",
                tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 scale-110 z-20" : 
                tile.status === 'mine' ? "bg-red-50/20 text-red-200 opacity-20 border-transparent" : ""
              )}
            >
              <AnimatePresence mode="wait">
                {tile.status === 'gem' && (
                  <motion.div key="gem" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                    <Gem size={24} className="fill-current" />
                  </motion.div>
                )}
                {tile.status === 'mine' && (
                  <motion.div key="mine" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Bomb size={24} className="fill-current" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {(gameState === 'won' || gameState === 'lost') && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/20 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} 
                className={cn(
                  "p-8 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.2)] border-2 border-white/30 text-center space-y-5 w-full", 
                  gameState === 'won' ? "bg-emerald-600" : "bg-red-600"
                )}
              >
                <div className="h-16 w-16 rounded-[22px] bg-white/20 flex items-center justify-center mx-auto shadow-inner">
                  {gameState === 'won' ? <CheckCircle2 size={32} className="text-white"/> : <RotateCcw size={32} className="text-white"/>}
                </div>
                <div className="space-y-2">
                  <h2 className="text-[15px] font-black text-white leading-none tracking-normal uppercase">
                    {gameState === 'won' ? 'استخراج ناجح' : 'عطل في الشبكة'}
                  </h2>
                  <p className="text-[13px] font-bold text-white/80 leading-relaxed tracking-normal">
                    {gameState === 'won' ? `تم حقن $${(Number(betAmount) * currentMultiplier).toFixed(2)} في محفظتك.` : 'اصطدمت بعقدة بيانات معطلة.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-3 opacity-30">
         <Activity size={12} className="text-[#002d4d] animate-pulse" />
         <span className="text-[11px] font-black uppercase tracking-[0.4em] tracking-normal text-[#002d4d]">Matrix Node Active</span>
      </div>
    </section>
  );
}
