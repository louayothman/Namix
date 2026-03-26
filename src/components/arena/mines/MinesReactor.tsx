
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
 * MinesReactor - مفاعل مناجم السيولة v6.0
 * تم ملء المساحة وتحديث الخطوط لـ 16px مع مصفوفة عقد ذكية.
 */
export function MinesReactor({ grid, gameState, onTileClick, betAmount, currentMultiplier }: MinesReactorProps) {
  return (
    <section className="flex-1 w-full flex flex-col items-center justify-center p-6 relative select-none font-body">
      
      {/* نبض استخباراتي خلفي */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
         <div className="h-full w-full bg-[radial-gradient(circle,#002d4d_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative w-full max-w-[380px] aspect-square bg-white rounded-[48px] p-6 border border-gray-100 shadow-2xl overflow-hidden group">
        
        {/* شبكة العقد الاستراتيجية */}
        <div className="grid grid-cols-5 gap-3 h-full relative z-10">
          {grid.map((tile, i) => (
            <motion.button
              key={i}
              whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.92 } : {}}
              onClick={() => onTileClick(i)}
              className={cn(
                "aspect-square rounded-[22px] shadow-sm transition-all duration-500 flex items-center justify-center border-2",
                tile.status === 'hidden' && "bg-gray-50 border-gray-100 hover:bg-white hover:border-[#002d4d]/30 hover:shadow-lg",
                tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-xl shadow-blue-900/20",
                tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-2xl" : 
                tile.status === 'mine' ? "bg-red-50/20 text-red-100 border-red-50 opacity-30" : ""
              )}
            >
              <AnimatePresence mode="wait">
                {tile.status === 'gem' && (
                  <motion.div key="gem" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                    <Gem size={28} className="fill-current drop-shadow-[0_0_10px_rgba(249,168,133,0.5)]" />
                  </motion.div>
                )}
                {tile.status === 'mine' && (
                  <motion.div key="mine" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Bomb size={28} className="fill-current" />
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
              className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-white/10 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.8, y: 30 }} 
                animate={{ scale: 1, y: 0 }} 
                className={cn(
                  "p-10 rounded-[56px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-4 border-white/30 text-center space-y-6 w-full", 
                  gameState === 'won' ? "bg-emerald-600/95" : "bg-red-600/95"
                )}
              >
                <div className="h-20 w-20 rounded-[32px] bg-white/20 flex items-center justify-center mx-auto shadow-inner border border-white/20">
                  {gameState === 'won' ? <CheckCircle2 size={48} className="text-white"/> : <RotateCcw size={48} className="text-white"/>}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-normal">{gameState === 'won' ? 'استخراج ناجح' : 'عطل فني'}</h2>
                  <p className="text-base font-bold text-white/80 tracking-normal leading-relaxed">
                    {gameState === 'won' ? `تم حقن $${(Number(betAmount) * currentMultiplier).toFixed(2)} في محفظتك.` : 'اصطدمت بعقدة معطلة في الشبكة الميكرونية.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-3 opacity-30">
         <Activity size={12} className="text-[#002d4d] animate-pulse" />
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#002d4d]">Matrix Node Active</span>
      </div>
    </section>
  );
}
