
"use client";

import React, { useState, useEffect } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

interface MarketPulseIconReactorProps {
  iconGroups: string[][];
}

/**
 * @fileOverview أوركسترا الأيقونات التراكمية v1.0
 * يطبق الحركة الفيزيائية (1 -> يمين 2 -> فوق 3 -> يمين 4) مع تلاشي انسيابي.
 */
export function MarketPulseIconReactor({ iconGroups }: MarketPulseIconReactorProps) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      setStep(1); // ظهور 1
      await new Promise(r => setTimeout(r, 1800));
      setStep(2); // إزاحة 1، دخول 2
      await new Promise(r => setTimeout(r, 1800));
      setStep(3); // رفع 1+2، دخول 3
      await new Promise(r => setTimeout(r, 1800));
      setStep(4); // إزاحة 3، دخول 4
      await new Promise(r => setTimeout(r, 2500));
      setStep(5); // تلاشي كلي
      await new Promise(r => setTimeout(r, 1500));
      
      setStep(0);
      setGroupIndex((prev) => (prev + 1) % iconGroups.length);
    };

    const interval = setInterval(sequence, 10000);
    sequence();
    return () => clearInterval(interval);
  }, [iconGroups.length]);

  const currentSet = iconGroups[groupIndex];

  // إحداثيات الشبكة الفيزيائية
  const pos = {
    step1: { x: 0, y: 0 },
    step2_1: { x: 55, y: 0 },
    step2_2: { x: -55, y: 0 },
    step3_1: { x: 55, y: -55 },
    step3_2: { x: -55, y: -55 },
    step3_3: { x: 0, y: 55 },
    step4_3: { x: 55, y: 55 },
    step4_4: { x: -55, y: 55 },
  };

  const springConfig = { type: "spring", stiffness: 120, damping: 25 };

  return (
    <div className="relative h-72 w-72 md:h-96 md:w-96 flex items-center justify-center select-none">
      <AnimatePresence>
        {step >= 1 && step < 5 && (
          <motion.div
            key={`icon1-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, filter: "blur(15px)" }}
            animate={
              step === 1 ? { scale: 1.2, opacity: 1, x: 0, y: 0, filter: "blur(0px)" } :
              step === 2 ? { scale: 1, x: pos.step2_1.x, y: 0 } :
              { scale: 1, x: pos.step3_1.x, y: pos.step3_1.y }
            }
            exit={{ scale: 0.2, opacity: 0, filter: "blur(40px)", transition: { duration: 1.2 } }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[0]} size={90} className="md:size-[110px]" />
          </motion.div>
        )}

        {step >= 2 && step < 5 && (
          <motion.div
            key={`icon2-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, x: 0 }}
            animate={
              step === 2 ? { scale: 1.2, opacity: 1, x: pos.step2_2.x, y: 0 } :
              { scale: 1, x: pos.step3_2.x, y: pos.step3_2.y }
            }
            exit={{ scale: 0.2, opacity: 0, filter: "blur(40px)", transition: { duration: 1.2 } }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[1]} size={90} className="md:size-[110px]" />
          </motion.div>
        )}

        {step >= 3 && step < 5 && (
          <motion.div
            key={`icon3-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={
              step === 3 ? { scale: 1.2, opacity: 1, x: 0, y: pos.step3_3.y } :
              { scale: 1, x: pos.step4_3.x, y: pos.step4_3.y }
            }
            exit={{ scale: 0.2, opacity: 0, filter: "blur(40px)", transition: { duration: 1.2 } }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[2]} size={90} className="md:size-[110px]" />
          </motion.div>
        )}

        {step >= 4 && step < 5 && (
          <motion.div
            key={`icon4-${groupIndex}`}
            initial={{ scale: 0, opacity: 0, x: 0, y: 60 }}
            animate={{ scale: 1.2, opacity: 1, x: pos.step4_4.x, y: pos.step4_4.y }}
            exit={{ scale: 0.2, opacity: 0, filter: "blur(40px)", transition: { duration: 1.2 } }}
            transition={springConfig}
            className="absolute"
          >
            <CryptoIcon name={currentSet[3]} size={90} className="md:size-[110px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* هالة المركز الوميضية */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="w-80 h-80 bg-[#f9a885] rounded-full blur-[100px]"
        />
      </div>
    </div>
  );
}
