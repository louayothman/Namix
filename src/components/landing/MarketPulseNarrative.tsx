
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketPulseNarrativeProps {
  texts: string[];
}

/**
 * @fileOverview مُحرك السرد الطبيعي v3.0 - Natural Odometer Edition
 * تبسيط الحركة لتكون انسيابية بنمط العداد (Slide Up) مع تمييز الكلمات الجوهرية.
 */
export function MarketPulseNarrative({ texts }: MarketPulseNarrativeProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [texts.length]);

  // مصفوفة النصوص مع تحديد الكلمة المميزة يدوياً لضمان الدقة الجمالية
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
        <span className="text-[#f9a885] font-black">
          {item.highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="relative h-[120px] md:h-[180px] flex flex-col justify-center text-right font-body overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.23, 1, 0.32, 1] // فيزياء حركة طبيعية (Ease Out)
          }}
          className="absolute inset-0 flex items-center justify-end"
        >
          <p className="text-2xl md:text-4xl lg:text-5xl font-black text-[#002d4d] leading-[1.4] tracking-tight">
            {renderText(processedTexts[index])}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
