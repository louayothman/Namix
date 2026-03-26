
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
      <div className="relative w-full max-w-[320px] aspect-square bg-white rounded-2xl p-3 border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 gap-2 h-full relative z-10">
          {grid.map((tile, i) => (
            <motion.button
              key={i}
              whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.92 } : {}}
              onClick={() => onTileClick(i)}
              className={cn(
                "aspect-square rounded-xl shadow-sm transition-all duration-500 flex items-center justify-center border",
                tile.status === 'hidden' && "bg-gray-50 border-gray-100/50 hover:bg-white",
                tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-lg",
                tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-xl" : 
                tile.status === 'mine' ? "bg-red-50/20 text-red-100 border-red-50 opacity-30" : ""
              )}
            >
              <AnimatePresence mode="wait">
                {tile.status === 'gem' && (
                  <motion.div key="gem" initial={{ scale: 0 }} animate={{ scale: 1 }}>
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
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9 }} 
                animate={{ scale: 1 }} 
                className={cn(
                  "p-6 rounded-[32px] shadow-2xl border border-white/20 text-center space-y-3", 
                  gameState === 'won' ? "bg-emerald-600/95" : "bg-red-600/95"
                )}
              >
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto">
                  {gameState === 'won' ? <CheckCircle2 size={28} className="text-white"/> : <RotateCcw size={28} className="text-white"/>}
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-black text-white uppercase">{gameState === 'won' ? 'استخراج ناجح' : 'عطل فني'}</h2>
                  <p className="text-[10px] font-bold text-white/80">
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
