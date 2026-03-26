
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
 * @fileOverview محرك الأوركسترا السينمائية v1500.0 - Sovereign Kinetic Engine
 * هندسة متكاملة لدخول وخروج العناصر بتسلسل ميكانيكي (عنصر تلو الآخر).
 */
export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  const [step, setStep] = useState<"building" | "rotating" | "swapping" | "lifted" | "exiting">("building");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("exiting");
      setTimeout(onComplete, 2500); // إجمالي وقت الخروج العكسي
    }, 4500); // مدة العرض الكلي قبل الخروج
    return () => clearTimeout(timer);
  }, [onComplete]);

  // تواقيت مراحل الدخول
  useEffect(() => {
    if (step === "building") {
      setTimeout(() => setStep("rotating"), 1200);
    }
    if (step === "rotating") {
      setTimeout(() => setStep("swapping"), 1800);
    }
    if (step === "swapping") {
      setTimeout(() => setStep("lifted"), 400);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-white overflow-hidden font-body"
    >
      <div className="relative flex flex-col items-center">
        
        {/* محرك الإطارات المتزامن */}
        <div className="relative flex items-center justify-center">
          <svg width="240" height="240" className="rotate-[-90deg]">
            {/* الإطار المركزي */}
            <motion.circle
              cx="120" cy="120" r="50"
              fill="none" stroke="#f1f5f9" strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: step === "exiting" ? 0 : 1,
                rotate: step === "rotating" ? -360 : 0
              }}
              transition={{ 
                pathLength: { duration: 1, ease: "easeInOut" },
                rotate: { duration: 2, ease: "easeInOut" }
              }}
            />
            {/* الإطار الخارجي */}
            <motion.circle
              cx="120" cy="120" r="85"
              fill="none" stroke="#f1f5f9" strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: step === "exiting" ? 0 : 1,
                rotate: step === "rotating" ? -360 : 0
              }}
              transition={{ 
                pathLength: { duration: 1.2, ease: "easeInOut", delay: 0.2 },
                rotate: { duration: 2, ease: "easeInOut" }
              }}
            />
          </svg>

          {/* النقاط التناظرية */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#002d4d] rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: step === "exiting" ? 0 : 1, 
                opacity: step === "exiting" ? 0 : 0.2,
                rotate: step === "rotating" ? -360 : 0 
              }}
              style={{
                top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 68}px)`,
                left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 68}px)`,
                transform: 'translate(-50%, -50%)'
              }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
            />
          ))}

          {/* بؤرة الهوية المركزية */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {/* شعار ناميكس في البداية */}
              {(step === "building" || step === "rotating") && (
                <motion.div
                  key="namix-logo"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    rotate: step === "rotating" ? 360 : 0
                  }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ 
                    opacity: { duration: 0.6 },
                    scale: { duration: 0.6 },
                    rotate: { duration: 2, ease: "easeInOut" }
                  }}
                >
                  <Logo size="sm" />
                </motion.div>
              )}

              {/* أيقونة اللعبة بعد الومضة */}
              {(step === "swapping" || step === "lifted" || (step === "exiting" && step !== "building")) && (
                <motion.div
                  key="game-icon"
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: step === "exiting" ? 0 : 1,
                    y: step === "lifted" ? -40 : 0 
                  }}
                  transition={{ 
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                    y: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                  }}
                  className="text-[#002d4d]"
                >
                  <Icon size={48} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ومضة التحول (The Flash) */}
            <AnimatePresence>
              {step === "swapping" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-white rounded-full z-20"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* اسم اللعبة - محرك الآلة الكاتبة */}
        <div className="absolute top-[60%] w-full flex justify-center">
          <AnimatePresence>
            {step === "lifted" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex overflow-hidden">
                  {title.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ 
                        delay: i * 0.05, 
                        duration: 0.3,
                        exit: { delay: (title.length - i) * 0.03 }
                      }}
                      className="text-[12px] font-black text-[#002d4d] uppercase tracking-[0.3em] whitespace-pre"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                {/* خيط الشيمر الفاخر */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* تذييل ناميكس الصامت */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: step === "exiting" ? 0 : 0.15 }}
        className="absolute bottom-12 flex flex-col items-center gap-2 grayscale"
      >
        <Logo size="sm" />
        <p className="text-[7px] font-black uppercase tracking-[0.6em]">Sovereign Network</p>
      </motion.div>
    </motion.div>
  );
}
