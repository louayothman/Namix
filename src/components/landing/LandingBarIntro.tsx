
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مُفاعل الهوية السينمائي - LandingBarIntro v2.0
 * محرك بصري يحاكي انصهار البيانات وتشكيل الهوية بأسلوب سائل ودوران ترددي.
 */

export function LandingBarIntro() {
  const [phase, setStep] = useState<"rolling" | "forming" | "displaying" | "exiting">("rolling");

  useEffect(() => {
    const cycle = async () => {
      // 1. Rolling & Forming: 2.5s
      setStep("rolling");
      await new Promise(r => setTimeout(r, 2500));
      
      // 2. Displaying (Includes Text Entry & 5s Stay): 7s
      setStep("displaying");
      await new Promise(r => setTimeout(r, 7000));
      
      // 3. Exiting: 2s
      setStep("exiting");
      await new Promise(r => setTimeout(r, 2000));
      
      // Restart Cycle
      cycle();
    };

    cycle();
  }, []);

  // ألوان النقاط حسب الطلب
  const dotColors = ["#ffffff", "#f9a885", "#ffffff", "#f9a885"];
  
  // إعدادات الدوران الترددي (تباطؤ -> تسارع -> تباطؤ)
  const rotationVariants = {
    oscillate: {
      rotate: [0, 360, 0, -360, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative flex items-center h-12 overflow-hidden select-none" dir="rtl">
      <AnimatePresence>
        {phase !== "exiting" && (
          <div className="flex items-center gap-3">
            
            {/* 1. شعار الشبكة المورفي */}
            <motion.div
              layout
              initial={{ x: 100 }}
              animate={
                phase === "rolling" ? { x: 40 } : 
                phase === "displaying" ? { x: 0, rotate: 0 } : {}
              }
              className="relative"
            >
              <motion.div 
                className="grid grid-cols-2 gap-1"
                animate={phase === "displaying" ? "oscillate" : {}}
                variants={rotationVariants}
              >
                {dotColors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      backgroundColor: color,
                      x: phase === "rolling" ? (i * 15) : 0,
                      y: 0
                    }}
                    exit={{ opacity: 0, scale: 0, x: 100 }}
                    transition={{ 
                      delay: i * 0.2, 
                      duration: 0.8, 
                      type: "spring", 
                      stiffness: 100 
                    }}
                    className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* 2. اسم المنصة بنمط الآلة الكاتبة */}
            <div className="relative flex items-center overflow-hidden">
              <AnimatePresence>
                {phase === "displaying" && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    exit={{ width: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <motion.h1 
                      className="text-white font-black text-xl md:text-2xl tracking-tighter italic ml-2"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      {"namix".split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                        >
                          {char.toUpperCase()}
                        </motion.span>
                      ))}
                    </motion.h1>
                    
                    {/* لمعان النص */}
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] pointer-events-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* لمسة سديمية خلفية خفيفة */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none blur-xl rounded-full" />
    </div>
  );
}
