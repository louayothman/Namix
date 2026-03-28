
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مكون الهوية المركزية المحدث v51.0
 * يدير حركة الدخول السائلة والتموضع المتوازن (الشعار يسار الاسم).
 */
export function SovereignIntro() {
  const name = "NAMIX";

  return (
    <div className="flex items-center gap-4 md:gap-8 select-none" dir="ltr">
      {/* 1. The Sovereign Logo - الشعار (أبيض وبرتقالي) - يتموضع على اليسار */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center shrink-0"
      >
        <div className="grid grid-cols-2 gap-1.5 md:gap-3">
          <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_15px_rgba(249,168,133,0.4)]" />
          <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_15px_rgba(249,168,133,0.4)]" />
          <div className="w-3 h-3 md:w-6 md:h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        </div>
        
        {/* Soft Aura Glow */}
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white/10 rounded-full blur-2xl -z-10"
        />
      </motion.div>

      {/* 2. The Sovereign Name - الاسم (ظهور سائل) */}
      <motion.div 
        initial={{ opacity: 0, x: 10, filter: "blur(5px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
        className="flex items-center"
      >
        <h1 className="text-3xl md:text-7xl font-black text-white tracking-tighter leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {name}
        </h1>
      </motion.div>
    </div>
  );
}
