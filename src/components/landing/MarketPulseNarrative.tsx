
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketPulseNarrativeProps {
  texts: string[];
}

/**
 * @fileOverview مُحرك السرد السينمائي v1.0
 * يدير ظهور الجمل الاستراتيجية بفيزياء انسيابية (Blur + Slide).
 */
export function MarketPulseNarrative({ texts }: MarketPulseNarrativeProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [texts.length]);

  return (
    <div className="relative min-h-[160px] md:min-h-[220px] flex flex-col justify-center text-right font-body">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20, filter: "blur(20px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -20, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-black text-[#002d4d] leading-[1.5] tracking-tight">
            {texts[index]}
          </p>
          
          {/* مؤشر التقدم النانوي */}
          <div className="w-24 h-[1.5px] bg-gray-100 relative overflow-hidden rounded-full">
            <motion.div 
              key={`bar-${index}`}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="absolute inset-y-0 right-0 bg-[#f9a885] shadow-[0_0_8px_#f9a885]" 
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
