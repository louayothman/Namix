
"use client";

import React, { useState, useEffect } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

interface MarketPulseIconReactorProps {
  iconGroups: string[][];
}

/**
 * @fileOverview أوركسترا الأيقونات التكتيكية v2.0
 * حركة فيزيائية عشوائية: تتبع، إزاحة، واستبدال متزامن.
 */
export function MarketPulseIconReactor({ iconGroups }: MarketPulseIconReactorProps) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [step, setStep] = useState(0);

  // إحداثيات عشوائية مدروسة (Up, Down, L, R)
  const coords = {
    A: { x: 60, y: -60 },
    B: { x: -60, y: -60 },
    C: { x: 60, y: 60 },
    D: { x: -60, y: 60 },
    center: { x: 0, y: 0 }
  };

  useEffect(() => {
    const sequence = async () => {
      // 1. ظهور الأولى والاتجاه عشوائياً (إلى A)
      setStep(1); 
      await new Promise(r => setTimeout(r, 1500));
      
      // 2. ظهور الثانية والاتجاه لـ B
      setStep(2); 
      await new Promise(r => setTimeout(r, 1500));
      
      // 3. ظهور الثالثة واتجاهها لمكان الأولى (A) بينما الأولى تبتعد (لـ C)
      setStep(3); 
      await new Promise(r => setTimeout(r, 1500));
      
      // 4. ظهور الرابعة واتجاهها لمكان الثانية (B) بينما الثانية تبتعد (لـ D)
      setStep(4); 
      await new Promise(r => setTimeout(r, 2500));
      
      // 5. تلاشي الأولى واستبدالها بالمجموعة التالية
      setStep(5);
      await new Promise(r => setTimeout(r, 1000));

      setStep(0);
      setGroupIndex((prev) => (prev + 1) % iconGroups.length);
    };

    const interval = setInterval(sequence, 8500);
    sequence();
    return () => clearInterval(interval);
  }, [iconGroups.length]);

  const currentSet = iconGroups[groupIndex];
  const springConfig = { type: "spring", stiffness: 100, damping: 20 };

  return (
    <div className="relative h-72 w-72 md:h-96 md:w-96 flex items-center justify-center select-none">
      <AnimatePresence>
        {/* أيقونة 1: القائد */}
        {step >= 1 && step < 5 && (
          <motion.div
            key={`i1-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={
              step === 1 ? { scale: 1.2, opacity: 1, ...coords.A } :
              step >= 3 ? { ...coords.C } : { ...coords.A }
            }
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[0]} size={80} className="md:size-[100px]" />
          </motion.div>
        )}

        {/* أيقونة 2 */}
        {step >= 2 && step < 6 && (
          <motion.div
            key={`i2-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={
              step === 2 ? { scale: 1.2, opacity: 1, ...coords.B } :
              step >= 4 ? { ...coords.D } : { ...coords.B }
            }
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[1]} size={80} className="md:size-[100px]" />
          </motion.div>
        )}

        {/* أيقونة 3: تتبع الأولى */}
        {step >= 3 && step < 6 && (
          <motion.div
            key={`i3-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{ scale: 1.2, opacity: 1, ...coords.A }}
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[2]} size={80} className="md:size-[100px]" />
          </motion.div>
        )}

        {/* أيقونة 4: تتبع الثانية */}
        {step >= 4 && step < 6 && (
          <motion.div
            key={`i4-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{ scale: 1.2, opacity: 1, ...coords.B }}
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[3]} size={80} className="md:size-[100px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* هالة المركز الوميضية */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1], 
            opacity: [0.03, 0.06, 0.03],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="w-80 h-80 bg-[#f9a885] rounded-full blur-[110px]"
        />
      </div>
    </div>
  );
}
