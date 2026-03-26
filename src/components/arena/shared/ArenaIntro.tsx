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
const NamixGrid = ({ size = 32 }: { size?: number }) => {
  const dotSize = size / 2.5;
  const gap = size / 5;
  return (
    <div className="grid grid-cols-2 shrink-0" style={{ gap: `${gap}px` }}>
      <div className="rounded-full bg-[#002d4d]" style={{ width: dotSize, height: dotSize }} />
      <div className="rounded-full bg-[#f9a885]" style={{ width: dotSize, height: dotSize }} />
      <div className="rounded-full bg-[#f9a885]" style={{ width: dotSize, height: dotSize }} />
      <div className="rounded-full bg-[#002d4d]" style={{ width: dotSize, height: dotSize }} />
    </div>
  );
};

/**
 * @fileOverview محرك الأوركسترا الميكانيكية v2000.0 - Synchronized Plotter
 * سيمفونية بصرية مبرمجة بدقة مجهرية تعكس فخامة الهوية المؤسسية لناميكس.
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  // Phases: plotting -> logo -> rotating -> switching -> ascending -> hold -> exit_name -> descend -> switch_back -> rotate_back -> exit_final
  const [phase, setPhase] = useState<string>("plotting");

  useEffect(() => {
    // تسلسل الدخول مع تداخل 300ms لضمان الاستمرارية الميكانيكية
    const introTimers = [
      setTimeout(() => setPhase("logo"), 900),      // يبدأ الشعار قبل انتهاء الرسم
      setTimeout(() => setPhase("rotating"), 1100),  // يبدأ الدوران قبل استقرار الشعار
      setTimeout(() => setPhase("switching"), 3300), // الومضة فور توقف الدوران
      setTimeout(() => setPhase("ascending"), 3400), // الارتقاء المتزامن مع الومضة
    ];

    // بروتوكول الخروج العكسي المتسلسل
    const exitTimers = [
      setTimeout(() => setPhase("exit_name"), 6500),    // 1. مسح الاسم أولاً
      setTimeout(() => setPhase("descend"), 6800),      // 2. العودة للمركز
      setTimeout(() => setPhase("switch_back"), 7500),  // 3. الومضة العكسية للهوية
      setTimeout(() => setPhase("rotate_back"), 7800),  // 4. الدوران الختامي
      setTimeout(() => {
        setPhase("exit_final");                         // 5. التلاشي النهائي
        setTimeout(onComplete, 1200); 
      }, 8800)
    ];

    return () => [...introTimers, ...exitTimers].forEach(clearTimeout);
  }, [onComplete]);

  const showGameIcon = ["switching", "ascending", "exit_name", "descend"].includes(phase);
  const isAscended = ["ascending", "exit_name"].includes(phase);
  const isFinalExit = phase === "exit_final";

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: i * 0.2 }
    }),
    exit: {
      pathLength: 0,
      opacity: 0,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-white overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* المفاعل الميكانيكي الرئيسي */}
        <motion.div
          animate={{
            y: isAscended ? -120 : 0,
            rotate: ["rotating", "switching", "ascending", "exit_name", "rotate_back"].includes(phase) ? (phase === "rotate_back" ? 0 : 360) : 0,
            transition: { 
              y: { duration: 1, ease: [0.76, 0, 0.24, 1] },
              rotate: { duration: 2.5, ease: [0.76, 0, 0.24, 1] }
            }
          }}
          className="relative flex items-center justify-center"
        >
          {/* الإطارات الدائرية (Synchronized Drawing) */}
          <svg width="280" height="280" className="rotate-[-90deg] shrink-0">
            <motion.circle
              cx="140" cy="140" r="60"
              fill="none" stroke="#f1f5f9" strokeWidth="1.5"
              variants={circleVariants}
              custom={0}
              initial="hidden"
              animate={isFinalExit ? "exit" : "visible"}
            />
            <motion.circle
              cx="140" cy="140" r="100"
              fill="none" stroke="#f1f5f9" strokeWidth="2"
              variants={circleVariants}
              custom={1}
              initial="hidden"
              animate={isFinalExit ? "exit" : "visible"}
            />
          </svg>

          {/* النقاط الاستراتيجية (Counter-Rotation Logic) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: phase === "plotting" ? 0 : (isFinalExit ? 0 : 1), 
                  opacity: phase === "plotting" ? 0 : (isFinalExit ? 0 : 0.4),
                  rotate: ["rotating", "switching", "ascending", "exit_name", "rotate_back"].includes(phase) ? (phase === "rotate_back" ? 0 : -720) : 0
                }}
                transition={{ 
                  scale: { delay: 0.8 + i * 0.1 },
                  rotate: { duration: 2.5, ease: [0.76, 0, 0.24, 1] }
                }}
                className="absolute w-2 h-2 bg-[#002d4d] rounded-full"
                style={{
                  top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 80}px)`,
                  left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 80}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>

          {/* المركز: تبديل الهوية مع الومضة الموضعية */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-24 w-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!showGameIcon ? (
                  <motion.div
                    key="namix-dots"
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
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 bg-white rounded-full z-20 shadow-[0_0_40px_white]"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* طبقة النص: الآلة الكاتبة في مساحة بيضاء صافية تماماً */}
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

      {/* التوقيع السيادي الصامت في الأسفل */}
      <motion.div 
        animate={{ opacity: isFinalExit ? 0 : 0.1 }}
        className="absolute bottom-16 flex flex-col items-center gap-3 grayscale select-none"
      >
        <div className="grid grid-cols-2 gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#002d4d]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#f9a885]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#f9a885]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#002d4d]" />
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.8em]">Namix Sovereign Desk</p>
      </motion.div>
    </motion.div>
  );
}