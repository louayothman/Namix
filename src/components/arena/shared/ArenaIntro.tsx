
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
 * @fileOverview Sovereign Liquid Portal v4000.0
 * انترو سينمائي جديد كلياً يعتمد على الانسيابية السائلة والوضوح النخبوي.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      {/* 1. Background Ambient (Subtle Nodes) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#002d4d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative flex flex-col items-center">
        
        {/* 2. The Liquid Core & Icon */}
        <div className="relative h-48 w-48 flex items-center justify-center">
          
          {/* Liquid Ring - Organic Motion */}
          <motion.div
            animate={{ 
              borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 46% 54% / 30% 39% 61% 70%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
              rotate: [0, 90, 360],
              scale: [0.8, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 border-[1.5px] border-[#002d4d]/10 bg-[#002d4d]/[0.02] backdrop-blur-sm"
          />

          {/* Pulse Ring (Holographic) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeOut" }}
            className="absolute h-full w-full rounded-full border border-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          />

          {/* Game Icon - Blur to Focus */}
          <motion.div
            initial={{ filter: "blur(20px)", opacity: 0, scale: 0.5 }}
            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
            className="text-[#002d4d] relative z-10"
          >
            <Icon size={64} strokeWidth={1.2} className="drop-shadow-2xl" />
          </motion.div>
        </div>

        {/* 3. The Typography - Masked Rise */}
        <div className="mt-12 overflow-hidden h-10 flex items-center justify-center">
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-[12px] font-black text-[#002d4d] uppercase tracking-[0.6em] mb-1">
              {title}
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 1.8 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#f9a885]/40 to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* 4. Sovereign Micromark */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-12 flex flex-col items-center gap-3 select-none pointer-events-none"
      >
        <p className="text-[7px] font-black uppercase tracking-[0.8em] text-[#002d4d]">Namix Sovereign Engine</p>
        <div className="flex gap-2">
           <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
           <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
           <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
        </div>
      </motion.div>

      {/* 5. The Implosion Overlay (Pre-exit) */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 0, opacity: 0 }}
        exit={{ 
          scale: [0, 1.5, 0], 
          opacity: [0, 1, 0],
          borderRadius: ["50%", "50%", "50%"]
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-white z-[1001] pointer-events-none"
      />
    </motion.div>
  );
}
