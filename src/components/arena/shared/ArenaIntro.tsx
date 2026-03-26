
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
 * @fileOverview محرك الأوركسترا السينمائية v2100.0 - Precision Plotter
 * تم ضبط تموضع النقاط بدقة مجهرية بين الإطارات وتنفيذ بروتوكول التداخل الميكانيكي.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  const [stage, setStage] = useState<'drawing' | 'rotating' | 'swapping' | 'lifting' | 'exit'>('drawing');

  useEffect(() => {
    // سلسلة الحركات المتداخلة (تداخل 300ms لضمان الاستمرارية الميكانيكية)
    const t1 = setTimeout(() => setStage('rotating'), 1500);
    const t2 = setTimeout(() => setStage('swapping'), 3500);
    const t3 = setTimeout(() => setStage('lifting'), 3800);
    const t4 = setTimeout(() => setStage('exit'), 7000);
    const t5 = setTimeout(onComplete, 10000);

    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, [onComplete]);

  const transition = { duration: 1.5, ease: [0.76, 0, 0.24, 1] };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل المركزي */}
        <motion.div
          animate={
            stage === 'lifting' ? { y: -120 } : 
            stage === 'exit' ? { y: -120 } : 
            { y: 0 }
          }
          transition={transition}
          className="relative h-40 w-40 flex items-center justify-center"
        >
          {/* الإطارات الدائرية المسحوبة ضوئياً */}
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            {/* الإطار المركزي r=45 */}
            <motion.circle
              cx="80" cy="80" r="45"
              fill="none" stroke="#f1f5f9" strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: stage === 'exit' ? 0 : 1,
                rotate: stage === 'rotating' ? -360 : 0
              }}
              transition={{ 
                pathLength: { duration: 1.5, ease: "easeInOut" },
                rotate: { duration: 3, ease: [0.76, 0, 0.24, 1] }
              }}
            />
            {/* الإطار الخارجي r=65 */}
            <motion.circle
              cx="80" cy="80" r="65"
              fill="none" stroke="#f1f5f9" strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: stage === 'exit' ? 0 : 1,
                rotate: stage === 'rotating' ? -180 : 0
              }}
              transition={{ 
                pathLength: { duration: 1.8, ease: "easeInOut", delay: 0.2 },
                rotate: { duration: 3, ease: [0.76, 0, 0.24, 1] }
              }}
            />
          </svg>

          {/* النقاط التناظرية - متموضعة بدقة بين الإطارين (r=55) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={stage === 'rotating' ? { rotate: -360 } : { rotate: 0 }}
              transition={{ duration: 3, ease: [0.76, 0, 0.24, 1] }}
              className="relative h-[110px] w-[110px]"
            >
              {[0, 90, 180, 270].map((angle) => (
                <motion.div
                  key={angle}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: stage === 'exit' ? 0 : 1, 
                    opacity: stage === 'exit' ? 0 : 1 
                  }}
                  transition={{ delay: 0.8 + angle/400 }}
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${angle}deg) translateY(-55px) translateX(-50%)`
                  }}
                  className="h-1 w-1 rounded-full bg-[#002d4d]/10 shadow-sm"
                />
              ))}
            </motion.div>
          </div>

          {/* قلب الهوية - الوميض والتبديل */}
          <div className="relative z-10 h-16 w-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === 'drawing' || stage === 'rotating' ? (
                <motion.div
                  key="namix-grid"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, rotate: stage === 'rotating' ? 360 : 0 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ 
                    opacity: { duration: 0.8 },
                    rotate: { duration: 3, ease: [0.76, 0, 0.24, 1] }
                  }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-[#002d4d]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#002d4d]" />
                </motion.div>
              ) : (
                <motion.div
                  key="game-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-[#002d4d]"
                >
                  <Icon size={44} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* الوميض الموضعي (The Central Flash) */}
            <AnimatePresence>
              {stage === 'swapping' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2.5], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-white rounded-full blur-md z-20"
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* الهوية النصية - محرك الآلة الكاتبة */}
        <div className="absolute top-24 w-full flex justify-center">
          <AnimatePresence>
            {stage === 'lifting' && (
              <motion.div 
                className="flex items-center gap-1.5 py-4"
                dir="ltr"
              >
                {title.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ 
                      delay: i * 0.06,
                      exit: { delay: (title.length - i) * 0.03 }
                    }}
                    className="text-[12px] font-black text-[#002d4d] uppercase tracking-[0.25em] select-none"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* الختم السيادي المجهري */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 select-none"
      >
        <p className="text-[7px] font-black uppercase tracking-[0.8em] text-[#002d4d]">Namix Universal</p>
        <div className="flex gap-1.5">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="h-1 w-1 rounded-full bg-gray-200" />
           ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
