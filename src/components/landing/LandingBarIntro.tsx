
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مُفاعل الهوية الماسي - LandingBarIntro v2.0
 * محرك بصري سينمائي: تدحرج النقاط من اليمين، انصهار سائل متناظر، لمعان كحلي للاسم.
 */

export function LandingBarIntro() {
  const [phase, setPhase] = useState<"rolling" | "displaying" | "exiting">("rolling");

  useEffect(() => {
    const cycle = async () => {
      // 1. Rolling & Forming
      setPhase("rolling");
      await new Promise(r => setTimeout(r, 3500));
      
      // 2. Displaying (Name entry + 5s stay)
      setPhase("displaying");
      await new Promise(r => setTimeout(r, 7000));
      
      // 3. Exiting (Reverse)
      setPhase("exiting");
      await new Promise(r => setTimeout(r, 3000));
      
      cycle();
    };

    cycle();
  }, []);

  // ألوان النقاط بتناظر (أبيض في الزوايا المتقابلة، برتقالي في الزوايا المتقابلة)
  // الترتيب في الشبكة 2*2: [0, 1] [2, 3]
  // 0: أبيض (عليا يسرى)، 1: برتقالي (عليا يمنى)، 2: برتقالي (سفلى يسرى)، 3: أبيض (سفلى يمنى)
  const dotColors = ["#ffffff", "#f9a885", "#f9a885", "#ffffff"];
  
  const luxuryEasing = [0.16, 1, 0.3, 1];

  return (
    <div className="relative flex items-center h-12 overflow-hidden select-none" dir="rtl">
      <AnimatePresence mode="wait">
        {phase !== "exiting" ? (
          <div className="flex items-center gap-4">
            
            {/* 1. اسم المنصة (يسار الشبكة) */}
            <div className="relative flex items-center overflow-hidden">
              <AnimatePresence>
                {phase === "displaying" && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="overflow-hidden whitespace-nowrap relative"
                  >
                    <h1 
                      className="text-white font-black text-2xl md:text-3xl tracking-tighter relative"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      {"NAMIX".split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className="relative inline-block"
                        >
                          {char}
                          {/* تأثير اللمعان الكحلي على الأحرف فقط */}
                          <motion.span
                            animate={{ 
                              left: ["-100%", "200%"],
                              opacity: [0, 1, 0]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              repeatDelay: 3,
                              delay: 1.5
                            }}
                            className="absolute inset-0 bg-[#002d4d] mix-blend-multiply pointer-events-none blur-[2px]"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </motion.span>
                      ))}
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. شبكة النقاط (يمين الاسم) */}
            <motion.div
              layout
              className="relative flex items-center justify-center"
            >
              <motion.div 
                className={cn(
                  "grid gap-1.5 transition-all duration-1000",
                  phase === "rolling" ? "grid-cols-4" : "grid-cols-2"
                )}
                animate={phase === "displaying" ? {
                  rotate: [0, 180, 360, 180, 0],
                } : {}}
                transition={{
                  rotate: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut", // يحقق التباطؤ والتسارع
                  }
                }}
              >
                {dotColors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 400, opacity: 0 }}
                    animate={
                      phase === "rolling" 
                        ? { x: 0, opacity: 1, backgroundColor: color } 
                        : { x: 0, opacity: 1, backgroundColor: color }
                    }
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ 
                      x: { delay: i * 0.25, duration: 1.5, ease: luxuryEasing },
                      opacity: { delay: i * 0.25, duration: 0.5 }
                    }}
                    className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full shadow-lg"
                  />
                ))}
              </motion.div>
            </motion.div>

          </div>
        ) : (
          /* خروج عكسي كامل */
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            className="flex items-center gap-4"
          >
             {/* العناصر تخرج هنا برمجياً عبر AnimatePresence أعلاه */}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .shimmer-text {
          background: linear-gradient(
            to right,
            transparent 0%,
            #002d4d 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
