
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

interface ArenaIntroProps {
  icon: any;
  title: string;
  onComplete: () => void;
}

/**
 * NamixDots - شبكة النقاط السيادية 2*2
 */
const NamixDots = ({ className, size = 20 }: { className?: string, size?: number }) => {
  const dotSize = size / 2.5;
  const gap = size / 5;
  return (
    <div 
      className={cn("grid grid-cols-2 shrink-0", className)} 
      style={{ gap: `${gap}px` }}
    >
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#f9a885" }} />
      <div className="rounded-full" style={{ width: dotSize, height: dotSize, backgroundColor: "#002d4d" }} />
    </div>
  );
};

/**
 * @fileOverview محرك الأوركسترا الميكانيكية v1600.0 - Sovereign Sequential Engine
 * هندسة حركية متصلة تبدأ كل حركة قبل انتهاء سابقتها.
 * الخروج بترتيب عكسي دقيق (عنصر تلو الآخر).
 * شعار ناميكس يقتصر على شبكة النقاط 2*2 داخل الإطارات.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  // مراحل الحالة: idle -> plotting -> logo_fade -> rotating -> switching -> ascending -> active -> exiting
  const [phase, setPhase] = useState<"plotting" | "logo_fade" | "rotating" | "switching" | "ascending" | "exiting">("plotting");

  useEffect(() => {
    // سلسلة الدخول (Staggered Overlap)
    const timers = [
      setTimeout(() => setPhase("logo_fade"), 800), // يبدأ ظهور الشعار أثناء رسم الإطارات
      setTimeout(() => setPhase("rotating"), 1400), // يبدأ الدوران
      setTimeout(() => setPhase("switching"), 3000), // ومضة التبديل
      setTimeout(() => setPhase("ascending"), 3200), // ارتقاء وطباعة
      setTimeout(() => {
        // بدء الخروج العكسي بعد مدة عرض
        setPhase("exiting");
        setTimeout(onComplete, 2500); // إجمالي وقت الهندسة العكسية
      }, 5500)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  // إعدادات المسار (Paths)
  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.2, ease: "easeInOut" }
    },
    exit: { 
      pathLength: 0, 
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut", delay: 0.4 }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({ 
      scale: 1, 
      opacity: 0.3,
      transition: { delay: 0.5 + i * 0.1, duration: 0.4 }
    }),
    exit: (i: number) => ({ 
      scale: 0, 
      opacity: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  const isExiting = phase === "exiting";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-white overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* المكون الميكانيكي الرئيسي */}
        <motion.div
          animate={{ 
            y: (phase === "ascending" && !isExiting) ? -40 : 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="relative flex items-center justify-center"
        >
          {/* الإطارات المتزامنة */}
          <svg width="240" height="240" className="rotate-[-90deg]">
            <motion.circle
              cx="120" cy="120" r="50"
              fill="none" stroke="#f1f5f9" strokeWidth="1"
              variants={circleVariants}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
            />
            <motion.circle
              cx="120" cy="120" r="85"
              fill="none" stroke="#f1f5f9" strokeWidth="1.5"
              variants={circleVariants}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
            />
          </svg>

          {/* النقاط التناظرية */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={dotVariants}
              initial="hidden"
              animate={isExiting ? "exit" : "visible"}
              className="absolute w-1.5 h-1.5 bg-[#002d4d] rounded-full"
              style={{
                top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 68}px)`,
                left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 68}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* الدوران المعاكس */}
          <motion.div
            animate={{ 
              rotate: (phase === "rotating" || phase === "switching" || phase === "ascending") ? -360 : 0,
              transition: { duration: 2, ease: "easeInOut" }
            }}
            className="absolute inset-0 pointer-events-none"
          />

          {/* المركز: تبديل الهوية */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {(phase === "logo_fade" || phase === "rotating") && !isExiting && (
                <motion.div
                  key="namix-dots"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: 360 
                  }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ 
                    opacity: { duration: 0.6 },
                    rotate: { duration: 2, ease: "easeInOut" }
                  }}
                >
                  <NamixDots size={32} />
                </motion.div>
              )}

              {(phase === "switching" || phase === "ascending" || isExiting) && phase !== "logo_fade" && (
                <motion.div
                  key="game-icon"
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1 
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-[#002d4d]"
                >
                  <Icon size={48} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ومضة التحول (The Flash Switch) */}
            <AnimatePresence>
              {(phase === "switching" || (isExiting && phase === "ascending")) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-white rounded-full z-20 shadow-[0_0_50px_white]"
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* اسم اللعبة (Typewriter LTR) */}
        <div className="absolute top-[60%] w-full flex flex-col items-center gap-3">
          <AnimatePresence>
            {(phase === "ascending" || isExiting) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex overflow-hidden px-4" dir="ltr">
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
                        duration: 0.3 
                      }}
                      className="text-[12px] font-black text-[#002d4d] uppercase tracking-[0.3em] whitespace-pre"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isExiting ? 0 : 40 }}
                  transition={{ duration: 0.5 }}
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
        animate={{ opacity: isExiting ? 0 : 0.15 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 grayscale select-none"
      >
        <Logo size="sm" />
        <p className="text-[7px] font-black uppercase tracking-[0.6em]">Sovereign Network</p>
      </motion.div>
    </motion.div>
  );
}
