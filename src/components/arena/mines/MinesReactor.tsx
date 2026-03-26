
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Bomb, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinesReactorProps {
  grid: any[];
  gameState: 'idle' | 'playing' | 'won' | 'lost';
  onTileClick: (idx: number) => void;
  betAmount: string;
  currentMultiplier: number;
}

export function MinesReactor({ grid, gameState, onTileClick, betAmount, currentMultiplier }: MinesReactorProps) {
  return (
    <section className="flex-1 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[260px] aspect-square bg-white rounded-2xl p-2.5 border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 gap-1.5 h-full relative z-10">
          {grid.map((tile, i) => (
            <motion.button
              key={i}
              whileHover={gameState === 'playing' && tile.status === 'hidden' ? { scale: 1.05 } : {}}
              whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.95 } : {}}
              onClick={() => onTileClick(i)}
              className={cn(
                "aspect-square rounded-xl shadow-sm transition-all duration-500 flex items-center justify-center border",
                tile.status === 'hidden' && "bg-gray-50 border-gray-100/50 hover:bg-white",
                tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-xl",
                tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-2xl" : 
                tile.status === 'mine' ? "bg-red-50/30 text-red-200 border-red-50 opacity-40" : ""
              )}
            >
              <AnimatePresence mode="wait">
                {tile.status === 'gem' && (
                  <motion.div key="gem" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Gem className="h-3.5 w-3.5 fill-current" />
                  </motion.div>
                )}
                {tile.status === 'mine' && (
                  <motion.div key="mine" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Bomb className="h-3.5 w-3.5 fill-current" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {(gameState === 'won' || gameState === 'lost') && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }} 
                className={cn(
                  "p-5 rounded-2xl shadow-2xl border border-white/20 text-center space-y-2", 
                  gameState === 'won' ? "bg-emerald-600/95" : "bg-red-600/95"
                )}
              >
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mx-auto">
                  {gameState === 'won' ? <CheckCircle2 size={24} className="text-white"/> : <RotateCcw size={24} className="text-white"/>}
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-[11px] font-black text-white">{gameState === 'won' ? 'استخراج ناجح' : 'عطل فني'}</h2>
                  <p className="text-[8px] font-bold text-white/80">
                    {gameState === 'won' ? `تم حقن $${(Number(betAmount) * currentMultiplier).toFixed(2)}` : 'اصطدمت بعقدة معطلة.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
