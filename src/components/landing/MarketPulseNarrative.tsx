
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketPulseNarrativeProps {
  texts: string[];
}

/**
 * @fileOverview مُحرك السرد السينمائي المطور v2.0
 * يتميز بظهور وميضي (Shimmer) وتمييز الكلمات المفتاحية بلون ناميكس البرتقالي.
 */
export function MarketPulseNarrative({ texts }: MarketPulseNarrativeProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [texts.length]);

  // مصفوفة النصوص مع تحديد الكلمة المميزة
  const processedTexts = [
    { text: "محفظة رقمية آمنة تجمع أصولك في مكان واحد موثوق.", highlight: "آمنة" },
    { text: "تداول فوري مبني على السرعة والدقة في التنفيذ.", highlight: "السرعة" },
    { text: "عقود استثمارية مرنة تدعم قراراتك المالية الذكية.", highlight: "مرنة" },
    { text: "إيداع مباشر بتجربة سلسة وموثوقة على مدار الساعة.", highlight: "سلسة" },
    { text: "سحب فوري يعكس مفهوم السيولة دون تأخير.", highlight: "السيولة" },
    { text: "ميزات متقدمة صُممت لمستوى أعلى من الاحتراف المالي.", highlight: "الاحتراف" },
    { text: "هوية استثنائية تعكس شخصية كل مستخدم داخل المنصة.", highlight: "استثنائية" },
  ];

  const renderText = (item: typeof processedTexts[0]) => {
    const parts = item.text.split(item.highlight);
    return (
      <>
        {parts[0]}
        <span className="text-[#f9a885] drop-shadow-[0_0_8px_rgba(249,168,133,0.3)]">
          {item.highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="relative min-h-[160px] md:min-h-[220px] flex flex-col justify-center text-right font-body overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ 
            opacity: 0, 
            y: 40, 
            scale: 0.95,
            filter: "blur(20px)" 
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: "blur(0px)" 
          }}
          exit={{ 
            opacity: 0, 
            y: -60, 
            scale: 1.05,
            filter: "blur(15px)" 
          }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="relative group"
        >
          {/* تأثير اللمعان (Shimmer) العابر عند الظهور */}
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full skew-x-[-20deg] pointer-events-none z-10"
          />

          <p className="text-2xl md:text-4xl lg:text-5xl font-black text-[#002d4d] leading-[1.5] tracking-tight relative z-0">
            {renderText(processedTexts[index])}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
