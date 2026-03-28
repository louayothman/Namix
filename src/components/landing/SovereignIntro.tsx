"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * @fileOverview مكون الهوية المركزية v1.0
 * يدير حركة الالة الكاتبة للاسم ووميض الشعار.
 */
export function SovereignIntro() {
  const name = "NAMIX";
  const nameChars = name.split("");

  return (
    <div className="flex items-center gap-6 md:gap-10 select-none">
      {/* 1. The Sovereign Logo - الشعار (أبيض وبرتقالي) */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_20px_rgba(249,168,133,0.5)]" />
          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#f9a885] shadow-[0_0_20px_rgba(249,168,133,0.5)]" />
          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
        </div>
        
        {/* Shine Flash Effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute inset-0 bg-white rounded-full blur-2xl z-20"
        />
      </motion.div>

      {/* 2. The Sovereign Name - الاسم (آلة كاتبة) */}
      <div className="flex items-center" dir="ltr">
        {nameChars.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 1 + i * 0.15,
              duration: 0.5,
              ease: "easeOut"
            }}
            className="text-4xl md:text-7xl font-black text-white tracking-tighter"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {char}
          </motion.span>
        ))}
        {/* Cursor Blinker */}
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-1 h-8 md:h-14 bg-[#f9a885] ml-2 rounded-full"
        />
      </div>
    </div>
  );
}
