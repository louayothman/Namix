
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
 * NamixGrid - شبكة النقاط السيادية 2*2
 */
const NamixGrid = ({ className, size = 32 }: { className?: string, size?: number }) => {
  const dotSize = size / 2.5;
  const gap = size / 5;
  return (
    <div className={cn("grid grid-cols-2 shrink-0", className)} style={{ gap: `${gap}px` }}>
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
    </div>
  );
};

/**
 * @fileOverview محرك الأوركسترا الميكانيكية v1900.0 - Sequential Reverse Plotter
 * - تسلسل بناء ميكانيكي (إطارات -> نقاط -> هوية -> دوران -> ومضة -> ارتقاء -> طباعة).
 * - تسلسل خروج عكسي صارم (مسح الاسم -> عودة للمركز -> ومضة عكسية -> دوران -> تلاشي).
 * - معالجة تداخل النصوص عبر رفع الإزاحة الرأسية.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  const [phase, setPhase] = useState<"plotting" | "logo" | "rotating" | "switching" | "ascending" | "exit_name" | "descend" | "switch_back" | "rotate_back" | "exit_final">("plotting");

  useEffect(() => {
    // سلسلة الحركات المتداخلة للدخول
    const introTimers = [
      setTimeout(() => setPhase("logo"), 800),
      setTimeout(() => setPhase("rotating"), 1400),
      setTimeout(() => setPhase("switching"), 3400),
      setTimeout(() => setPhase("ascending"), 3600),
    ];

    // سلسلة الحركات المتداخلة للخروج (بترتيب عكسي دقيق)
    const exitTimers = [
      setTimeout(() => setPhase("exit_name"), 6500),    // 1. مسح الاسم أولاً
      setTimeout(() => setPhase("descend"), 7200),      // 2. العودة للمركز
      setTimeout(() => setPhase("switch_back"), 7800),  // 3. ومضة التبديل العكسية للهوية
      setTimeout(() => setPhase("rotate_back"), 8200),  // 4. الدوران العكسي
      setTimeout(() => {
        setPhase("exit_final");                         // 5. التلاشي النهائي
        setTimeout(onComplete, 1200); 
      }, 9500)
    ];

    return () => [...introTimers, ...exitTimers].forEach(t => clearTimeout(t));
  }, [onComplete]);

  // منطق التحقق من مراحل الخروج
  const isExiting = phase.startsWith("exit") || phase === "descend" || phase === "switch_back" || phase === "rotate_back";
  const isAscended = phase === "ascending" || phase === "exit_name";
  const showGameIcon = phase === "switching" || phase === "ascending" || phase === "exit_name" || phase === "descend";

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({ 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.2, ease: "easeInOut", delay: i * 0.3 }
    }),
    exit: { 
      pathLength: 0, 
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-white overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل الميكانيكي (الإطارات والقلب) */}
        <motion.div
          animate={{ 
            y: isAscended ? -120 : 0, // ارتقاء رأسي كافٍ لمنع التداخل
            rotate: (phase === "rotating" || phase === "switching" || phase === "ascending" || phase === "exit_name") ? 360 : (phase === "rotate_back" ? 0 : 0),
            transition: { 
              y: { duration: 1, ease: [0.76, 0, 0.24, 1] },
              rotate: { duration: 2.5, ease: [0.76, 0, 0.24, 1] }
            }
          }}
          className="relative flex items-center justify-center"
        >
          {/* الإطارات المتزامنة */}
          <svg width="280" height="280" className="rotate-[-90deg] shrink-0">
            <motion.circle
              cx="140" cy="140" r="60"
              fill="none" stroke="#f1f5f9" strokeWidth="1.5"
              variants={circleVariants}
              custom={0}
              initial="hidden"
              animate={phase === "exit_final" ? "exit" : "visible"}
            />
            <motion.circle
              cx="140" cy="140" r="100"
              fill="none" stroke="#f1f5f9" strokeWidth="2"
              variants={circleVariants}
              custom={1}
              initial="hidden"
              animate={phase === "exit_final" ? "exit" : "visible"}
            />
          </svg>

          {/* النقاط التناظرية */}
          <motion.div
            animate={{ 
              rotate: (phase === "rotating" || phase === "switching" || phase === "ascending" || phase === "exit_name") ? -720 : 0,
              transition: { duration: 3, ease: "easeInOut" }
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: phase === "exit_final" ? 0 : 1, opacity: phase === "exit_final" ? 0 : 0.4 }}
                transition={{ delay: i * 0.1 }}
                className="absolute w-2 h-2 bg-[#002d4d] rounded-full"
                style={{
                  top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 80}px)`,
                  left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 80}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </motion.div>

          {/* قلب المفاعل: تبديل الهوية مع الومضة الموضعية */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-24 w-24 flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                {!showGameIcon ? (
                  <motion.div
                    key="namix-logo"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <NamixGrid size={32} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="game-icon"
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[#002d4d]"
                  >
                    <Icon size={56} strokeWidth={1.5} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ومضة التبديل الموضعية في القلب فقط */}
              <AnimatePresence>
                {(phase === "switching" || phase === "switch_back") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-white rounded-full z-20 shadow-[0_0_40px_white]"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* محرك الاسم: مساحة آمنة في الأسفل */}
        <div className="absolute top-[65%] w-full flex justify-center">
          <AnimatePresence>
            {(phase === "ascending" || phase === "exit_name") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex overflow-hidden px-10" dir="ltr">
                  {title.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ 
                        width: phase === "exit_name" ? 0 : "auto", 
                        opacity: phase === "exit_name" ? 0 : 1 
                      }}
                      transition={{ 
                        delay: phase === "exit_name" ? (title.length - i) * 0.03 : i * 0.05, 
                        duration: 0.3 
                      }}
                      className="text-[12px] font-black text-[#002d4d] uppercase tracking-[0.4em] whitespace-pre"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: phase === "exit_name" ? 0 : 60 }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* تذييل ناميكس السيادي */}
      <motion.div 
        animate={{ opacity: isExiting ? 0 : 0.1 }}
        className="absolute bottom-16 flex flex-col items-center gap-3 grayscale select-none"
      >
        <NamixGrid size={16} />
        <p className="text-[8px] font-black uppercase tracking-[0.8em]">Sovereign Network</p>
      </motion.div>
    </motion.div>
  );
}
