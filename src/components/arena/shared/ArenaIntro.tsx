
"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArenaIntroProps {
  icon: any;
  title: string;
  onComplete: () => void;
}

/**
 * @fileOverview Cinematic Fusion Reactor v7000.0 - Sovereign Liquid Edition
 * محرك انصهار سينمائي يدمج بين فيزياء السوائل المورفية ودوران اللوجو المعتمد على القصور الذاتي.
 * الترتيب: نبض النواة -> دوران مورفي متسارع -> ومضة انصهار -> ارتقاء وطباعة LTR.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const letters = title.split("");

  // منحنيات Bezier المخصصة للفخامة
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
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * 1000 - 500, 
              y: Math.random() * 1000 - 500,
              scale: Math.random() * 0.5
            }}
            animate={{ 
              opacity: [0, 0.4, 0],
              x: "+=30",
              y: "-=30",
            }}
            transition={{ 
              duration: 3 + Math.random() * 3, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute h-0.5 w-0.5 bg-[#002d4d] rounded-full"
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        
        {/* 2. The Liquid Metamorphosis Reactor - مفاعل التحول السائل */}
        <div className="relative h-72 w-72 flex items-center justify-center">
          
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
            {/* Phase 1: Namix Cinematic Rotation (Accelerate -> Decelerate) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1.1, 0.8],
                rotate: [0, 720], // دوران مضاعف وسينمائي
                filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(20px)"]
              }}
              transition={{ 
                duration: 2.8, 
                times: [0, 0.2, 0.8, 1],
                ease: [0.34, 1.56, 0.64, 1] // استجابة ميكانيكية حية
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="h-4 w-4 rounded-full bg-[#002d4d] shadow-[0_0_15px_rgba(0,45,77,0.2)]" />
                <div className="h-4 w-4 rounded-full bg-[#f9a885] shadow-[0_0_15px_rgba(249,168,133,0.3)]" />
                <div className="h-4 w-4 rounded-full bg-[#f9a885] shadow-[0_0_15px_rgba(249,168,133,0.3)]" />
                <div className="h-4 w-4 rounded-full bg-[#002d4d] shadow-[0_0_15px_rgba(0,45,77,0.2)]" />
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

            {/* Phase 2: Sovereign Icon Reveal with Focus Jump */}
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
                  filter: ["drop-shadow(0 0 0px transparent)", "drop-shadow(0 20px 40px rgba(0,45,77,0.15))", "drop-shadow(0 0 0px transparent)"]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon size={96} strokeWidth={1} />
              </motion.div>
            </motion.div>
          </div>

          {/* Shockwave Rings */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.5, 2.5], opacity: [0, 0.4, 0] }}
            transition={{ delay: 2.7, duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-blue-100/30"
          />
        </div>

        {/* 4. Cinematic LTR Typography - أوركسترا الحروف العالمية */}
        <div className="mt-24 flex items-center justify-center gap-3" dir="ltr">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ x: -30, opacity: 0, filter: "blur(20px)", scale: 0.8 }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ 
                duration: 1.2, 
                delay: 3.2 + i * 0.1, 
                ease: luxuryEasing 
              }}
              className={cn(
                "text-xl md:text-2xl font-black text-[#002d4d] tracking-[0.1em]",
                letter === " " ? "w-6" : ""
              )}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Dynamic Light Rail */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "240px", opacity: 0.2 }}
          transition={{ duration: 2.5, delay: 4 }}
          className="h-[0.5px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent mt-8 shadow-[0_0_20px_#f9a885]"
        />
      </div>

      {/* 5. Sovereign Signature Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 4.5 }}
        className="absolute bottom-16 flex flex-col items-center gap-5 select-none pointer-events-none"
      >
        <div className="flex items-center gap-6">
           <div className="h-[0.5px] w-16 bg-gradient-to-r from-transparent to-gray-200" />
           <p className="text-[10px] font-black uppercase tracking-[1em] text-[#002d4d] ml-[1em]">NAMIX PROTOCOL</p>
           <div className="h-[0.5px] w-16 bg-gradient-to-l from-transparent to-gray-200" />
        </div>
      </motion.div>
    </motion.div>
  );
}
