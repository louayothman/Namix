
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مُفاعل النبض السينمائي v4.0 - Neural Constellation Edition
 * - خلفية: نقاط متحركة عشوائياً متصلة بخطوط بروتوبلازمية نحيفة.
 * - أيقونات: أوركسترا حركية (1 -> إزاحة 2 -> رفع 3 -> إزاحة 4 -> تلاشي كلي).
 * - نصوص: سرد استراتيجي بفيزياء دخول وخروج سينمائية (Blur + Slide).
 */

const STRATEGIC_TEXTS = [
  "محفظة رقمية آمنة تجمع أصولك في مكان واحد موثوق.",
  "تداول فوري مبني على السرعة والدقة في التنفيذ.",
  "عقود استثمارية مرنة تدعم قراراتك المالية الذكية.",
  "إيداع مباشر بتجربة سلسة وموثوقة على مدار الساعة.",
  "سحب فوري يعكس مفهوم السيولة دون تأخير.",
  "ميزات متقدمة صُممت لمستوى أعلى من الاحتراف المالي.",
  "هوية استثنائية تعكس شخصية كل مستخدم داخل المنصة."
];

const ASSET_GROUPS = [
  ["BTC", "ETH", "SOL", "BNB"],
  ["XRP", "ADA", "AVAX", "DOT"],
  ["LINK", "MATIC", "TRX", "LTC"],
  ["DOGE", "SHIB", "UNI", "BCH"],
  ["NEAR", "KAS", "ATOM", "ETC"]
];

/**
 * NeuralBackground - محرك الجسيمات والخطوط المترابطة
 */
const NeuralBackground = () => {
  const points = useMemo(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <svg className="w-full h-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* الخطوط النحيفة جداً التي تربط النقاط */}
        {points.map((p, i) => (
          points.slice(i + 1, i + 4).map((p2, j) => (
            <motion.line
              key={`line-${i}-${j}`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke="#002d4d"
              strokeWidth="0.05"
              initial={{ opacity: 0 }}
              animate={{ 
                x1: [`${p.x}%`, `${p.x + 5}%`, `${p.x}%`],
                y1: [`${p.y}%`, `${p.y - 5}%`, `${p.y}%`],
                x2: [`${p2.x}%`, `${p2.x - 5}%`, `${p2.x}%`],
                y2: [`${p2.y}%`, `${p2.y + 5}%`, `${p2.y}%`],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          ))
        ))}
      </svg>

      {/* النقاط العائمة */}
      {points.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1 w-1 bg-[#f9a885] rounded-full blur-[0.5px]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

export function MarketPulse() {
  const [textIndex, setTextIndex] = useState(0);
  const [groupIndex, setGroupIndex] = useState(0);
  const [animStep, setAnimStep] = useState(0); // 1 to 5 steps

  // محرك النصوص - 4 ثواني لدورة مريحة
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % STRATEGIC_TEXTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // أوركسترا الأيقونات - دورة كاملة كل 12 ثانية
  useEffect(() => {
    const sequence = async () => {
      setAnimStep(1); // ظهور 1
      await new Promise(r => setTimeout(r, 2000));
      setAnimStep(2); // 1 يمين، ظهور 2
      await new Promise(r => setTimeout(r, 2000));
      setAnimStep(3); // 1+2 أعلى، ظهور 3
      await new Promise(r => setTimeout(r, 2000));
      setAnimStep(4); // 3 يمين، ظهور 4
      await new Promise(r => setTimeout(r, 3000));
      setAnimStep(5); // تلاشي كلي انسيابي
      await new Promise(r => setTimeout(r, 2000));
      
      setAnimStep(0);
      setGroupIndex((prev) => (prev + 1) % ASSET_GROUPS.length);
    };

    const interval = setInterval(sequence, 12000);
    sequence();
    return () => clearInterval(interval);
  }, []);

  const currentIcons = ASSET_GROUPS[groupIndex];

  // إحداثيات الشبكة التكتيكية
  const positions = {
    step1: { x: 0, y: 0 },
    step2_1: { x: 60, y: 0 },
    step2_2: { x: -60, y: 0 },
    step3_1: { x: 60, y: -60 },
    step3_2: { x: -60, y: -60 },
    step3_3: { x: 0, y: 60 },
    step4_3: { x: 60, y: 60 },
    step4_4: { x: -60, y: 60 },
  };

  return (
    <section className="w-full py-32 md:py-52 relative overflow-hidden select-none font-body" dir="rtl">
      <NeuralBackground />
      
      <div className="container mx-auto px-8 md:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-24 lg:gap-40">
          
          {/* الجانب الأيمن: السرد النصي السينمائي */}
          <div className="flex-1 space-y-6 text-right order-2 lg:order-1">
             <div className="relative min-h-[160px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={textIndex}
                    initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(15px)" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-2xl md:text-4xl lg:text-5xl font-black text-[#002d4d] leading-[1.4] tracking-tight">
                      {STRATEGIC_TEXTS[textIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
             </div>
             
             {/* مؤشر التقدم النانوي */}
             <div className="w-32 h-[1px] bg-gray-100 relative overflow-hidden">
                <motion.div 
                  key={textIndex}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="absolute inset-y-0 right-0 bg-[#f9a885]" 
                />
             </div>
          </div>

          {/* الجانب الأيسر: مفاعل الأيقونات الفيزيائي */}
          <div className="flex-1 flex items-center justify-center order-1 lg:order-2">
             <div className="relative h-72 w-72 md:h-96 md:w-96 flex items-center justify-center">
                
                <AnimatePresence>
                   {animStep >= 1 && animStep < 5 && (
                     <motion.div
                       key={`icon-1-${groupIndex}`}
                       initial={{ scale: 0, opacity: 0, filter: "blur(10px)" }}
                       animate={
                         animStep === 1 ? { scale: 1.2, opacity: 1, x: 0, y: 0, filter: "blur(0px)" } :
                         animStep === 2 ? { scale: 1, x: positions.step2_1.x, y: 0 } :
                         { scale: 1, x: positions.step3_1.x, y: positions.step3_1.y }
                       }
                       exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)", transition: { duration: 1 } }}
                       transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                       className="absolute inset-0 flex items-center justify-center"
                     >
                        <CryptoIcon name={currentIcons[0]} size={90} className="md:size-[110px]" />
                     </motion.div>
                   )}

                   {animStep >= 2 && animStep < 5 && (
                     <motion.div
                       key={`icon-2-${groupIndex}`}
                       initial={{ scale: 0, opacity: 0, x: 0 }}
                       animate={
                         animStep === 2 ? { scale: 1.2, opacity: 1, x: positions.step2_2.x, y: 0 } :
                         { scale: 1, x: positions.step3_2.x, y: positions.step3_2.y }
                       }
                       exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)", transition: { duration: 1 } }}
                       transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                       className="absolute inset-0 flex items-center justify-center"
                     >
                        <CryptoIcon name={currentIcons[1]} size={90} className="md:size-[110px]" />
                     </motion.div>
                   )}

                   {animStep >= 3 && animStep < 5 && (
                     <motion.div
                       key={`icon-3-${groupIndex}`}
                       initial={{ scale: 0, opacity: 0, y: 100 }}
                       animate={
                         animStep === 3 ? { scale: 1.2, opacity: 1, x: 0, y: positions.step3_3.y } :
                         { scale: 1, x: positions.step4_3.x, y: positions.step4_3.y }
                       }
                       exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)", transition: { duration: 1 } }}
                       transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                       className="absolute inset-0 flex items-center justify-center"
                     >
                        <CryptoIcon name={currentIcons[2]} size={90} className="md:size-[110px]" />
                     </motion.div>
                   )}

                   {animStep >= 4 && animStep < 5 && (
                     <motion.div
                       key={`icon-4-${groupIndex}`}
                       initial={{ scale: 0, opacity: 0, x: 0, y: 60 }}
                       animate={{ scale: 1.2, opacity: 1, x: positions.step4_4.x, y: positions.step4_4.y }}
                       exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)", transition: { duration: 1 } }}
                       transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                       className="absolute inset-0 flex items-center justify-center"
                     >
                        <CryptoIcon name={currentIcons[3]} size={90} className="md:size-[110px]" />
                     </motion.div>
                   )}
                </AnimatePresence>

                {/* هالة المركز المتوهجة */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.2, 1],
                       opacity: [0.05, 0.1, 0.05]
                     }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="w-64 h-64 bg-[#f9a885] rounded-full blur-[80px]"
                   />
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
