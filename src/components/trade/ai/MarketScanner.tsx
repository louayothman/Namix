
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * @fileOverview بروتوكول معايرة التشغيل v3.0 - Odometer Text Style
 * يعرض نص NAMIX AI ثابت وبجانبه عداد نانوي لأسماء الوكلاء بحركة رأسية انسيابية.
 */
export function MarketScanner() {
  const [index, setIndex] = useState(0);
  const agentNames = [
    "Agent_Alpha: SYNCING",
    "Agent_Beta: CALIBRATING",
    "Agent_Gamma: ANALYZING",
    "Agent_Delta: READY",
    "Secure_Node: VERIFIED"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % agentNames.length);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-12 flex items-center justify-center font-body select-none">
      <div className="flex items-center gap-3">
        {/* الثابت: NAMIX AI بالبرتقالي */}
        <h2 className="text-2xl font-black text-[#f9a885] tracking-tighter">NAMIX AI</h2>
        
        <div className="h-8 w-px bg-gray-100 mx-1" />

        {/* المتغير: عداد الوكلاء النانوي */}
        <div className="h-6 overflow-hidden relative min-w-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center"
            >
              <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.2em] opacity-40">
                {agentNames[index]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
