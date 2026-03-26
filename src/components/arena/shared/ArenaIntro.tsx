
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
 * NamixGrid - شبكة النقاط السيادية 2*2 فقط
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
 * @fileOverview محرك الأوركسترا الميكانيكية v1800.0 - Synchronized Plotter
 * - حركات متداخلة (Overlap) لضمان عدم توقف المحرك.
 * - ومضة محصورة في الشعار/الأيقونة فقط.
 * - ارتقاء كافٍ لمنع تداخل الاسم مع الإطارات.
 * - خروج عكسي متسلسل دقيق.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  const [phase, setPhase] = useState<"plotting" | "logo" | "rotating" | "switching" | "ascending" | "exiting">("plotting");

  useEffect(() => {
    // سلسلة الحركات المتداخلة (Start next before previous ends)
    const timers = [
      setTimeout(() => setPhase("logo"), 1000),      // يبدأ ظهور الشعار قبل انتهاء رسم الإطارات
      setTimeout(() => setPhase("rotating"), 1600),  // دوران ميكانيكي
      setTimeout(() => setPhase("switching"), 3600), // ومضة التبديل (محصورة في القلب)
      setTimeout(() => setPhase("ascending"), 3800), // ارتقاء وطباعة متزامنة
      setTimeout(() => {
        setPhase("exiting"); 
        setTimeout(onComplete, 2500); 
      }, 6500)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  const isExiting = phase === "exiting";

  // إعدادات المسار الميكانيكي
  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({ 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.2, ease: "easeInOut", delay: i * 0.3 }
    }),
    exit: (i: number) => ({ 
      pathLength: 0, 
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut", delay: 0.6 - (i * 0.2) }
    })
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({ 
      scale: 1, 
      opacity: 0.4,
      transition: { delay: 0.8 + i * 0.1, duration: 0.4, ease: "backOut" }
    }),
    exit: (i: number) => ({ 
      scale: 0, 
      opacity: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-white overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* المكون الميكانيكي الرئيسي (الإطارات والأيقونة) */}
        <motion.div
          animate={{ 
            y: (phase === "ascending" && !isExiting) ? -80 : 0, // ارتقاء كافٍ لمنع التداخل
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
          }}
          className="relative flex items-center justify-center"
        >
          {/* الإطارات المتزامنة */}
          <svg width="260" height="260" className="rotate-[-90deg] shrink-0">
            <motion.circle
              cx="130" cy="130" r="55"
              fill="none" stroke="#f1f5f9" strokeWidth="1.5"
              variants={circleVariants}
              custom={0}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
            />
            <motion.circle
              cx="130" cy="130" r="90"
              fill="none" stroke="#f1f5f9" strokeWidth="2"
              variants={circleVariants}
              custom={1}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
            />
          </svg>

          {/* النقاط التناظرية الميكانيكية */}
          <motion.div
            animate={{ 
              rotate: (phase === "rotating" || phase === "switching" || phase === "ascending") 
                ? (isExiting ? 0 : -360) 
                : 0,
              transition: { duration: 2.5, ease: [0.76, 0, 0.24, 1] }
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={dotVariants}
                initial="hidden"
                animate={isExiting ? "exit" : "visible"}
                className="absolute w-2 h-2 bg-[#002d4d] rounded-full"
                style={{
                  top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 72}px)`,
                  left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 72}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </motion.div>

          {/* قلب المفاعل: تبديل الهوية مع ومضة محصورة */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative flex items-center justify-center h-24 w-24">
              
              <AnimatePresence mode="wait">
                {(phase === "logo" || phase === "rotating") && !isExiting && (
                  <motion.div
                    key="namix-dots"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotate: 360 // دوران متزامن
                    }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ 
                      opacity: { duration: 0.6 },
                      scale: { duration: 0.6, ease: "backOut" },
                      rotate: { duration: 2.5, ease: [0.76, 0, 0.24, 1] }
                    }}
                  >
                    <NamixGrid size={32} />
                  </motion.div>
                )}

                {(phase === "switching" || phase === "ascending" || isExiting) && phase !== "logo" && (
                  <motion.div
                    key="game-icon"
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-[#002d4d]"
                  >
                    <Icon size={56} strokeWidth={1.5} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ومضة التحول المحصورة في القلب فقط */}
              <AnimatePresence>
                {(phase === "switching" || (isExiting && phase === "ascending")) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 bg-white rounded-full z-20 shadow-[0_0_40px_white]"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* محرك الآلة الكاتبة (Typewriter) في مساحة آمنة */}
        <div className="absolute top-[60%] w-full flex flex-col items-center">
          <AnimatePresence>
            {(phase === "ascending" || isExiting) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="flex overflow-hidden px-10" dir="ltr">
                  {title.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ 
                        width: isExiting ? 0 : "auto", 
                        opacity: isExiting ? 0 : 1 
                      }}
                      transition={{ 
                        delay: isExiting ? (title.length - i) * 0.03 : i * 0.05, 
                        duration: 0.3,
                        ease: "easeInOut"
                      }}
                      className="text-[12px] font-black text-[#002d4d] uppercase tracking-[0.4em] whitespace-pre"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isExiting ? 0 : 50 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ختم ناميكس الصامت */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 0.1 }}
        className="absolute bottom-16 flex flex-col items-center gap-3 grayscale select-none"
      >
        <NamixGrid size={16} />
        <p className="text-[8px] font-black uppercase tracking-[0.8em]">Sovereign Network</p>
      </motion.div>
    </motion.div>
  );
}
