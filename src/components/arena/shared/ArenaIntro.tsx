
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArenaIntroProps {
  icon: any;
  title: string;
  onComplete: () => void;
}

/**
 * @fileOverview Cinematic Fusion Reactor v8000.0 - Sovereign Liquid Edition
 * محرك انصهار سينمائي يدمج بين فيزياء السوائل المورفية ودوران اللوجو المعتمد على القصور الذاتي.
 * التعديلات: تصغير اسم اللعبة، إضافة حلقات الصدمة، وإضافة التوقيع السيادي في الأسفل.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  const [stardust, setStardust] = useState<{ x: number; y: number; scale: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate stardust client-side only to avoid hydration mismatch
    const generated = [...Array(40)].map(() => ({
      x: Math.random() * 1000 - 500,
      y: Math.random() * 1000 - 500,
      scale: Math.random() * 0.5,
      duration: 3 + Math.random() * 3
    }));
    setStardust(generated);

    const timer = setTimeout(onComplete, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const letters = title.split("");
  const luxuryEasing = [0.16, 1, 0.3, 1];

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        scale: 1.5,
        filter: "blur(60px)",
        opacity: 0,
        transition: { duration: 1.2, ease: "easeInOut" }
      }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden font-body select-none"
    >
      {/* 1. Digital Stardust - سديم البيانات المجهري */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {stardust.map((star, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: star.x, 
              y: star.y,
              scale: star.scale
            }}
            animate={{ 
              opacity: [0, 0.4, 0],
              x: "+=30",
              y: "-=30",
            }}
            transition={{ 
              duration: star.duration, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute h-0.5 w-0.5 bg-[#002d4d] rounded-full"
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        
        {/* 2. The Liquid Metamorphosis Reactor - مفاعل التحول السائل */}
        <div className="relative h-64 w-64 md:h-72 md:w-72 flex items-center justify-center">
          
          {/* Atmosphere Glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-80px] bg-gradient-to-tr from-blue-500/10 via-transparent to-[#f9a885]/10 rounded-full blur-[100px]"
          />

          {/* Morphing Liquid Fluid - سائل يتغير شكله دورياً */}
          <motion.div
            animate={{ 
              borderRadius: [
                "40% 60% 70% 30% / 40% 40% 60% 60%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 70% 70% 30% / 50% 60% 40% 50%",
                "40% 60% 70% 30% / 40% 40% 60% 60%"
              ],
              rotate: 360,
              scale: [1, 1.05, 0.95, 1]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 border border-[#002d4d]/5 bg-gradient-to-br from-[#002d4d]/[0.02] to-transparent backdrop-blur-2xl shadow-[inset_0_0_40px_rgba(0,45,77,0.03)]"
          />

          {/* 3. The Central Logic - الهوية المورفية */}
          <div className="relative z-10">
            {/* Phase 1: Namix Cinematic Rotation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1.1, 0.8],
                rotate: [0, 720],
                filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(20px)"]
              }}
              transition={{ 
                duration: 2.8, 
                times: [0, 0.2, 0.8, 1],
                ease: [0.34, 1.56, 0.64, 1]
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="h-4 w-4 rounded-full bg-[#002d4d]" />
                <div className="h-4 w-4 rounded-full bg-[#f9a885]" />
                <div className="h-4 w-4 rounded-full bg-[#f9a885]" />
                <div className="h-4 w-4 rounded-full bg-[#002d4d]" />
              </div>
            </motion.div>

            {/* Flash Metamorphosis - ومضة الانصهار */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 2, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ delay: 2.5, duration: 0.8, ease: "easeOut" }}
              className="absolute inset-[-40px] bg-gradient-to-r from-white via-blue-50 to-white rounded-full blur-2xl z-20"
            />

            {/* Phase 2: Sovereign Icon Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, filter: "blur(30px)", y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: "blur(0px)",
                y: 0
              }}
              transition={{ delay: 2.7, duration: 1.5, ease: luxuryEasing }}
              className="text-[#002d4d]"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon size={80} strokeWidth={1} />
              </motion.div>
            </motion.div>
          </div>

          {/* Quantum Shockwave Rings - حلقات الصدمة */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.5, 3], opacity: [0, 0.3, 0] }}
            transition={{ delay: 2.7, duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-[0.5px] border-blue-200/40"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.5, 2.5], opacity: [0, 0.2, 0] }}
            transition={{ delay: 2.9, duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-[0.5px] border-[#f9a885]/30"
          />
        </div>

        {/* 4. Cinematic LTR Typography - تصغير الخط */}
        <div className="mt-16 flex items-center justify-center gap-2.5" dir="ltr">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ x: -20, opacity: 0, filter: "blur(15px)", scale: 0.8 }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ 
                duration: 1, 
                delay: 3.2 + i * 0.08, 
                ease: luxuryEasing 
              }}
              className={cn(
                "text-base md:text-lg font-black text-[#002d4d] tracking-[0.15em]",
                letter === " " ? "w-4" : ""
              )}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Dynamic Light Rail */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "180px", opacity: 0.15 }}
          transition={{ duration: 2.5, delay: 4 }}
          className="h-[0.5px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent mt-6 shadow-[0_0_15px_#f9a885]"
        />
      </div>

      {/* 5. Sovereign Signature Footer - التوقيع السيادي الفخم */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ delay: 4.2, duration: 1.5, ease: luxuryEasing }}
        className="absolute bottom-12 flex flex-col items-center gap-4 select-none pointer-events-none"
      >
        <div className="flex items-center gap-8">
           <motion.div initial={{ width: 0 }} animate={{ width: "40px" }} transition={{ delay: 4.5, duration: 1.5 }} className="h-[0.5px] bg-gradient-to-r from-transparent to-gray-300" />
           <p className="text-[8px] font-black uppercase tracking-[1.2em] text-[#002d4d] ml-[1.2em]">NAMIX PROTOCOL</p>
           <motion.div initial={{ width: 0 }} animate={{ width: "40px" }} transition={{ delay: 4.5, duration: 1.5 }} className="h-[0.5px] bg-gradient-to-l from-transparent to-gray-300" />
        </div>
        <p className="text-[6px] font-bold text-gray-300 uppercase tracking-widest">Authorized Execution Environment</p>
      </motion.div>
    </motion.div>
  );
}
