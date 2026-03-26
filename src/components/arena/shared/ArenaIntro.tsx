
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
 * @fileOverview Cinematic Fusion Reactor v6000.0 - Sovereign Edition
 * انترو ملحمي يدمج بين فيزياء السوائل الرقمية وفخامة العرض النخبوي.
 * تم دمج شبكة ناميكس كبذرة طاقة أولية مع حركة حروف LTR.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const letters = title.split("");

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        scale: 2,
        filter: "blur(40px)",
        opacity: 0,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      {/* 1. Digital Stardust Background - جسيمات الطاقة المجهرية */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * 800 - 400, 
              y: Math.random() * 800 - 400,
              scale: Math.random() * 0.5
            }}
            animate={{ 
              opacity: [0, 0.2, 0],
              x: "+=50",
              y: "-=50",
              rotate: 360
            }}
            transition={{ 
              duration: 4 + Math.random() * 2, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute h-1 w-1 bg-[#002d4d]/10 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        
        {/* 2. The Liquid Plasma Core - مفاعل البلازما السائل */}
        <div className="relative h-64 w-64 flex items-center justify-center">
          
          {/* External Atmosphere Glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-60px] bg-gradient-to-tr from-blue-500/10 via-transparent to-[#f9a885]/10 rounded-full blur-[80px]"
          />

          {/* Morphing Liquid Ring */}
          <motion.div
            animate={{ 
              borderRadius: [
                "42% 58% 70% 30% / 45% 45% 55% 55%",
                "70% 30% 46% 54% / 30% 39% 61% 70%",
                "30% 70% 70% 30% / 67% 30% 70% 33%",
                "42% 58% 70% 30% / 45% 45% 55% 55%"
              ],
              rotate: 360,
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-0 border-[1.5px] border-[#002d4d]/5 bg-[#002d4d]/[0.01] backdrop-blur-xl shadow-inner"
          />

          {/* 3. The Metamorphosis Engine - محرك التبديل الذري */}
          <div className="relative z-10">
            {/* Phase 1: Namix Grid Pulse (The Seed) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1.1, 0.8],
                filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(20px)"]
              }}
              transition={{ 
                duration: 2.5, 
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut" 
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="h-4 w-4 rounded-full bg-[#002d4d]" />
                <div className="h-4 w-4 rounded-full bg-[#f9a885]" />
                <div className="h-4 w-4 rounded-full bg-[#f9a885]" />
                <div className="h-4 w-4 rounded-full bg-[#002d4d]" />
              </div>
            </motion.div>

            {/* Radiant Switch Flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ delay: 2.2, duration: 0.6, ease: "easeOut" }}
              className="absolute inset-[-20px] bg-white rounded-full blur-xl z-20"
            />

            {/* Phase 2: Sovereign Icon Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 2.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#002d4d]"
            >
              <motion.div
                animate={{ 
                  y: [0, -6, 0],
                  filter: ["drop-shadow(0 0 0px transparent)", "drop-shadow(0 15px 30px rgba(0,45,77,0.15))", "drop-shadow(0 0 0px transparent)"]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon size={84} strokeWidth={1} />
              </motion.div>
            </motion.div>
          </div>

          {/* Radiant Expansion Rings */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.8, 1.8], opacity: [0, 0.3, 0] }}
            transition={{ delay: 2.4, duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-blue-200/40"
          />
        </div>

        {/* 4. Cinematic LTR Typography - أوركسترا الحروف من اليسار إلى اليمين */}
        <div className="mt-20 flex items-center justify-center gap-2" dir="ltr">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ x: -20, opacity: 0, filter: "blur(15px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ 
                duration: 1, 
                delay: 2.8 + i * 0.08, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={cn(
                "text-lg md:text-xl font-black text-[#002d4d] tracking-widest",
                letter === " " ? "w-4" : ""
              )}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Dynamic Light Beam */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "180px", opacity: 0.15 }}
          transition={{ duration: 2, delay: 3.5 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent mt-6 shadow-[0_0_15px_#f9a885]"
        />
      </div>

      {/* 5. Sovereign Signature - الختم السيادي المجهري */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 4 }}
        className="absolute bottom-16 flex flex-col items-center gap-4 select-none pointer-events-none"
      >
        <div className="flex items-center gap-4">
           <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-gray-200" />
           <p className="text-[9px] font-black uppercase tracking-[0.8em] text-[#002d4d]">NAMIX PROTOCOL</p>
           <div className="h-[0.5px] w-12 bg-gradient-to-l from-transparent to-gray-200" />
        </div>
      </motion.div>
    </motion.div>
  );
}
