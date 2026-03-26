
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
 * @fileOverview Sovereign Liquid Reactor v5000.0 - Cinematic Edition
 * انترو سينمائي فائق الفخامة يعتمد على حركة السوائل العضوية والارتقاء الجسيمي.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // تقسيم العنوان إلى حروف للحصول على انميشن "الآلة الكاتبة الراقية"
  const letters = title.split("");

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      {/* 1. Digital Stardust - جسيمات السديم الرقمي */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * 1000 - 500, 
              y: Math.random() * 1000 - 500 
            }}
            animate={{ 
              opacity: [0, 0.3, 0],
              y: "-=100",
              x: "+=20"
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute h-1 w-1 bg-blue-400/20 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* 2. The Plasma Reactor - المفاعل السائل العضوي */}
      <div className="relative flex flex-col items-center">
        
        <div className="relative h-56 w-56 flex items-center justify-center">
          
          {/* Outer Fluid Glow - الوميض السائل الخارجي */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-40px] bg-gradient-to-tr from-blue-500/10 via-transparent to-orange-500/10 rounded-full blur-[60px]"
          />

          {/* Morphing Blob Ring - حلقة البلازما العضوية */}
          <motion.div
            animate={{ 
              borderRadius: [
                "42% 58% 70% 30% / 45% 45% 55% 55%",
                "70% 30% 46% 54% / 30% 39% 61% 70%",
                "30% 70% 70% 30% / 67% 30% 70% 33%",
                "42% 58% 70% 30% / 45% 45% 55% 55%"
              ],
              rotate: [0, 120, 240, 360],
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-0 border-[2px] border-[#002d4d]/10 bg-gradient-to-tr from-[#002d4d]/[0.02] to-blue-500/[0.05] backdrop-blur-md shadow-inner"
          />

          {/* Identity Focus Reveal - انبثاق الهوية الضوئي */}
          <motion.div
            initial={{ filter: "blur(30px)", opacity: 0, scale: 0.4 }}
            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="text-[#002d4d] relative z-10"
          >
            <motion.div
              animate={{ 
                y: [0, -4, 0],
                filter: ["drop-shadow(0 0 0px transparent)", "drop-shadow(0 10px 20px rgba(0,45,77,0.1))", "drop-shadow(0 0 0px transparent)"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon size={72} strokeWidth={1.2} />
            </motion.div>
          </motion.div>

          {/* Core Pulse Ring - نبضة النواة المركزية */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.8, 1.5], opacity: [0, 0.4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-blue-200/30"
          />
        </div>

        {/* 3. High-End Staggered Typography - أوركسترا الحروف المتتالية */}
        <div className="mt-16 flex items-center justify-center gap-[4px] md:gap-2">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ 
                duration: 0.8, 
                delay: 1.2 + i * 0.08, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={cn(
                "text-[14px] md:text-lg font-black text-[#002d4d] tracking-normal",
                letter === " " ? "w-2 md:w-4" : ""
              )}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Cinematic Shimmer Line - خط البريق السينمائي */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "140px", opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 2.5 }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent mt-4"
        />
      </div>

      {/* 4. Sovereign Micromark - الختم السيادي المجهري */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-12 flex flex-col items-center gap-4 select-none pointer-events-none"
      >
        <div className="flex items-center gap-3">
           <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-200" />
           <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Namix Intelligence Hub</p>
           <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-200" />
        </div>
        <div className="flex gap-2.5">
           {[...Array(3)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
               className="h-1.5 w-1.5 rounded-full bg-blue-500/20" 
             />
           ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
