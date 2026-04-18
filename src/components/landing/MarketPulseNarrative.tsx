"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview محرك السرد العدادي v5.0 - Digital Odometer Edition
 */
const TEXTS = [
  { text: "محفظة رقمية آمنة تجمع أصولك في مكان واحد موثوق.", highlight: "آمنة" },
  { text: "تداول فوري مبني على السرعة والدقة في التنفيذ.", highlight: "السرعة" },
  { text: "عقود استثمارية مرنة تدعم قراراتك المالية الذكية.", highlight: "مرنة" },
  { text: "إيداع مباشر بتجربة سلسة وموثوقة على مدار الساعة.", highlight: "سلسة" },
  { text: "سحب فوري يعكس مفهوم السيولة دون تأخير.", highlight: "السيولة" },
  { text: "ميزات متقدمة صُممت لمستوى أعلى من الاحتراف المالي.", highlight: "الاحتراف" },
  { text: "هوية استثنائية تعكس شخصية كل مستخدم داخل المنصة.", highlight: "استثنائية" }
];

export function MarketPulseNarrative() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TEXTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentItem = TEXTS[index];
  const parts = currentItem.text.split(currentItem.highlight);

  return (
    <div className="relative h-32 md:h-48 w-full overflow-hidden flex flex-col justify-center text-right select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-end"
        >
          <p className="text-xl md:text-3xl lg:text-4xl font-black text-[#002d4d] leading-[1.6]">
            {parts[0]}
            <span className="text-[#f9a885] px-2">{currentItem.highlight}</span>
            {parts[1]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
