
"use client";

import React, { useState, useEffect } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مفاعل النبض التكنولوجي v3.0 - Sovereign Kinetic Grid
 * - يمين: نصوص استراتيجية بانسيابية نانوية.
 * - يسار: أوركسترا أيقونات (1 -> 2 -> 3 -> 4) مع بناء شبكي وفيزياء تلاشي.
 * - الخلفية: شبكة بيانات رقمية متحركة.
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
  ["NEAR", "KAS", "ATOM", "ETC"],
  ["XLM", "XMR", "FIL", "OKB"]
];

/**
 * TechBackground - الخلفية التكنولوجية النانوية
 */
const TechBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Digital Grid */}
    <div 
      className="absolute inset-0 opacity-[0.03]" 
      style={{ 
        backgroundImage: `linear-gradient(#002d4d 1px, transparent 1px), linear-gradient(90deg, #002d4d 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} 
    />
    
    {/* Floating Data Points */}
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
        animate={{ 
          opacity: [0, 0.3, 0],
          y: ["-10%", "110%"],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 10 + Math.random() * 20, 
          repeat: Infinity, 
          delay: Math.random() * 10,
          ease: "linear"
        }}
        className="absolute h-1 w-1 bg-[#f9a885] rounded-full blur-[1px]"
      />
    ))}
  </div>
);

export function MarketPulse() {
  const [textIndex, setTextIndex] = useState(0);
  const [groupIndex, setGroupIndex] = useState(0);
  const [animStep, setAnimStep] = useState(0); // 0 to 4 steps

  // محرك النصوص - 4 ثواني
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % STRATEGIC_TEXTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // محرك الأيقونات المتزامن - دورة كاملة كل 10 ثواني
  useEffect(() => {
    const sequence = async () => {
      // Step 1: Show 1
      setAnimStep(1);
      await new Promise(r => setTimeout(r, 2000));
      
      // Step 2: Show 1,2
      setAnimStep(2);
      await new Promise(r => setTimeout(r, 2000));

      // Step 3: Show 1,2,3
      setAnimStep(3);
      await new Promise(r => setTimeout(r, 2000));

      // Step 4: Show 1,2,3,4
      setAnimStep(4);
      await new Promise(r => setTimeout(r, 2500));

      // Step 5: Fade all
      setAnimStep(0);
      await new Promise(r => setTimeout(r, 1500));
      
      // Next Group
      setGroupIndex((prev) => (prev + 1) % ASSET_GROUPS.length);
    };

    const interval = setInterval(sequence, 10000);
    sequence();
    return () => clearInterval(interval);
  }, []);

  const currentIcons = ASSET_GROUPS[groupIndex];

  return (
    <section className="w-full py-24 md:py-40 relative overflow-hidden select-none font-body" dir="rtl">
      <TechBackground />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20 lg:gap-32">
          
          {/* الجانب الأيمن: محرك النصوص الاستراتيجية المنساب */}
          <div className="flex-1 space-y-8 text-right order-2 lg:order-1">
             <div className="relative min-h-[140px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={textIndex}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-2xl md:text-4xl lg:text-5xl font-black text-[#002d4d] leading-[1.3] tracking-tight">
                      {STRATEGIC_TEXTS[textIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
             </div>

             <div className="flex items-center gap-4 opacity-20">
                <div className="h-[1px] w-12 bg-[#002d4d]" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Strategic Pulse</span>
             </div>
          </div>

          {/* الجانب الأيسر: مفاعل الأيقونات الأوركسترالي */}
          <div className="flex-1 flex items-center justify-center order-1 lg:order-2">
             <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
                
                {/* المركز الإحداثي للشبكة */}
                <div className="relative w-full h-full">
                   <AnimatePresence>
                      {animStep >= 1 && (
                        <motion.div
                          key={`icon-1-${groupIndex}`}
                          initial={{ scale: 0, opacity: 0, filter: "blur(10px)" }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            filter: "blur(0px)",
                            x: animStep >= 2 ? 50 : 0, 
                            y: animStep >= 3 ? -50 : 0 
                          }}
                          exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                           <CryptoIcon name={currentIcons[0]} size={80} className="md:size-[100px]" />
                        </motion.div>
                      )}

                      {animStep >= 2 && (
                        <motion.div
                          key={`icon-2-${groupIndex}`}
                          initial={{ scale: 0, opacity: 0, x: -100 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            x: -50,
                            y: animStep >= 3 ? -50 : 0 
                          }}
                          exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                           <CryptoIcon name={currentIcons[1]} size={80} className="md:size-[100px]" />
                        </motion.div>
                      )}

                      {animStep >= 3 && (
                        <motion.div
                          key={`icon-3-${groupIndex}`}
                          initial={{ scale: 0, opacity: 0, y: 100 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            y: 50,
                            x: animStep >= 4 ? 50 : 0
                          }}
                          exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                           <CryptoIcon name={currentIcons[2]} size={80} className="md:size-[100px]" />
                        </motion.div>
                      )}

                      {animStep >= 4 && (
                        <motion.div
                          key={`icon-4-${groupIndex}`}
                          initial={{ scale: 0, opacity: 0, x: -100, y: 50 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            x: -50,
                            y: 50
                          }}
                          exit={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                           <CryptoIcon name={currentIcons[3]} size={80} className="md:size-[100px]" />
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                {/* Decorative Elements */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#002d4d]/5 scale-[1.4]"
                />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
