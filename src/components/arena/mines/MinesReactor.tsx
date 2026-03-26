
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
 * MinesReactor - مفاعل السيادة v900.0
 * تم ضبط الحجم ليكون طبيعياً ومريحاً للهواتف بخط 13px وتطهير النصوص.
 */
export function MinesReactor({ grid, gameState, onTileClick, betAmount, currentMultiplier }: MinesReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-4 relative select-none font-body">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]">
         <div className="h-full w-full bg-[radial-gradient(circle,#002d4d_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="relative w-full max-w-[320px] aspect-square bg-white rounded-[32px] p-4 border border-gray-100 shadow-xl overflow-hidden group">
        {/* Glow behind grid */}
        <div className="absolute inset-0 bg-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="grid grid-cols-5 gap-2 h-full relative z-10">
          {grid.map((tile, i) => (
            <motion.button
              key={i}
              whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.92 } : {}}
              onClick={() => onTileClick(i)}
              className={cn(
                "aspect-square rounded-[14px] shadow-sm transition-all duration-500 flex items-center justify-center border",
                tile.status === 'hidden' && "bg-gray-50 border-gray-100 hover:border-[#002d4d]/20",
                tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-lg",
                tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 scale-105" : 
                tile.status === 'mine' ? "bg-red-50/10 text-red-100 opacity-20" : ""
              )}
            >
              <AnimatePresence mode="wait">
                {tile.status === 'gem' && (
                  <motion.div key="gem" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                    <Gem size={20} className="fill-current" />
                  </motion.div>
                )}
                {tile.status === 'mine' && (
                  <motion.div key="mine" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Bomb size={20} className="fill-current" />
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
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} 
                className={cn(
                  "p-6 rounded-[28px] shadow-2xl border-2 border-white/20 text-center space-y-4 w-full", 
                  gameState === 'won' ? "bg-emerald-600" : "bg-red-600"
                )}
              >
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto">
                  {gameState === 'won' ? <CheckCircle2 size={28} className="text-white"/> : <RotateCcw size={28} className="text-white"/>}
                </div>
                <div className="space-y-1">
                  <h2 className="text-[13px] font-black text-white leading-none tracking-normal uppercase">
                    {gameState === 'won' ? 'استخراج ناجح' : 'عطل تقني مفاجئ'}
                  </h2>
                  <p className="text-[11px] font-bold text-white/80 leading-relaxed tracking-normal">
                    {gameState === 'won' ? `تم حقن $${(Number(betAmount) * currentMultiplier).toFixed(2)} في رصيدك.` : 'اصطدمت بعقدة معطلة في الشبكة.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-2 opacity-20">
         <Activity size={10} className="text-[#002d4d]" />
         <span className="text-[10px] font-black uppercase tracking-[0.4em] tracking-normal">Matrix Grid Synchronized</span>
      </div>
    </section>
  );
}
