
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
 * @fileOverview محرك الأوركسترا السينمائية v2100.0 - 2D Mechanical Edition
 * سيمفونية بصرية مبرمجة بدقة مجهرية لتعكس فخامة الهوية المؤسسية لناميكس.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  const [stage, setStage] = useState<'drawing' | 'rotating' | 'swapping' | 'lifting' | 'exit'>('drawing');

  useEffect(() => {
    // سلسلة الحركات الميكانيكية المتداخلة (Overlap: 300ms)
    const t1 = setTimeout(() => setStage('rotating'), 1200);
    const t2 = setTimeout(() => setStage('swapping'), 3200);
    const t3 = setTimeout(() => setStage('lifting'), 3500);
    const t4 = setTimeout(() => setStage('exit'), 7000);
    const t5 = setTimeout(onComplete, 9500);

    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, [onComplete]);

  const bezierCurve = [0.76, 0, 0.24, 1];
  const transition = { duration: 1.5, ease: bezierCurve };

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
            stage === 'exit' ? { y: 0, opacity: 0, scale: 0.8 } : { y: 0 }
          }
          transition={transition}
          className="relative h-40 w-40 flex items-center justify-center"
        >
          {/* الإطارات الدائرية الهندسية */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none">
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
                pathLength: { duration: 1.2, ease: "easeInOut" },
                rotate: { duration: 2.5, ease: bezierCurve }
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
                pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.2 },
                rotate: { duration: 2.5, ease: bezierCurve }
              }}
            />
          </svg>

          {/* النقاط التناظرية الموزعة هندسياً في المدار الأوسط (r=55) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={stage === 'rotating' ? { rotate: -360 } : { rotate: 0 }}
              transition={{ duration: 2.5, ease: bezierCurve }}
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
                  transition={{ delay: 0.6 + angle/500 }}
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${angle}deg) translateY(-55px) translateX(-50%)`
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-[#002d4d]/10 shadow-sm"
                />
              ))}
            </motion.div>
          </div>

          {/* النواة المركزية - تحول الهوية والوميض الموضعي */}
          <div className="relative z-10 h-16 w-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === 'drawing' || stage === 'rotating' ? (
                <motion.div
                  key="namix-grid"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: stage === 'rotating' ? 360 : 0 
                  }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ 
                    opacity: { duration: 0.6 },
                    rotate: { duration: 2.5, ease: bezierCurve }
                  }}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="h-3 w-3 rounded-full bg-[#002d4d] shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885] shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-[#f9a885] shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-[#002d4d] shadow-sm" />
                </motion.div>
              ) : (
                <motion.div
                  key="game-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-[#002d4d]"
                >
                  <Icon size={48} strokeWidth={1.5} className="drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* الوميض الموضعي (The Central Flash) */}
            <AnimatePresence>
              {stage === 'swapping' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 bg-white rounded-full blur-xl z-20"
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
                key="name-rail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 py-4"
                dir="ltr"
              >
                {title.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="text-[12px] font-black text-[#002d4d] uppercase tracking-[0.3em] select-none"
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
        animate={{ opacity: stage === 'exit' ? 0 : 0.15 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 select-none pointer-events-none"
      >
        <p className="text-[7.5px] font-black uppercase tracking-[0.8em] text-[#002d4d]">Namix Universal Ledger</p>
        <div className="flex gap-2">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="h-1 w-1 rounded-full bg-gray-200" />
           ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
