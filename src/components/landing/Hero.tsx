
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import Lottie from "lottie-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLink?: string;
}

export function Hero({ title, subtitle, description, ctaLink = "/login" }: HeroProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // التحديث الجديد لرابط المحرك البصري
    fetch("https://lottie.host/f696eec5-3031-46db-904e-2f94a2bf999a/KlzuAzWVLt.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie Load Error:", err));
  }, []);

  return (
    <section className="relative pt-24 pb-12 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-row items-center justify-between gap-4 md:gap-20">
          
          {/* الجانب الأيمن: المحتوى النصي */}
          <div className="w-1/2 text-right space-y-4 md:space-y-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-3 md:space-y-6"
            >
              <div className="inline-flex items-center gap-1 md:gap-2 px-2 py-0.5 md:px-4 md:py-1.5 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                <Sparkles className="h-2 w-2 md:h-3 md:w-3 text-blue-500" />
                <span className="text-[6px] md:text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  {subtitle || "احترافية إدارة الأصول الرقمية"}
                </span>
              </div>
              
              <h1 className="text-lg md:text-7xl font-black text-[#002d4d] tracking-tighter leading-tight md:leading-[1.15]">
                {title || "ناميكس: حيث تلتقي التقنية بنمو الأصول."}
              </h1>
              
              <p className="text-gray-500 text-[8px] md:text-xl font-medium max-w-xl leading-relaxed md:leading-loose">
                {description || "نحن نوفر البيئة الاستثمارية الأكثر تطوراً للنخبة، حيث تندمج القوة التقنية مع الأمان المطلق لتوليد فرص نمو لا محدودة."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-start gap-3 md:gap-6 pt-2"
            >
              <Link href={ctaLink}>
                <button className="h-9 md:h-16 px-4 md:px-12 rounded-full bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-[8px] md:text-sm shadow-xl active:scale-95 transition-all group flex items-center gap-2">
                  ابدأ الآن
                  <ChevronLeft className="h-3 w-3 md:h-5 md:w-5 transition-transform group-hover:-translate-x-1" />
                </button>
              </Link>
              
              <div className="flex items-center gap-4 md:gap-8 opacity-60 md:opacity-100">
                 <div className="flex items-center gap-1 md:gap-2">
                    <ShieldCheck className="h-2.5 w-2.5 md:h-4 md:w-4 text-emerald-600" />
                    <span className="text-[6px] md:text-[10px] font-black text-[#002d4d]/40 uppercase tracking-widest">محمي</span>
                 </div>
                 <div className="flex items-center gap-1 md:gap-2">
                    <Zap className="h-2.5 w-2.5 md:h-4 md:w-4 text-[#f9a885]" />
                    <span className="text-[6px] md:text-[10px] font-black text-[#002d4d]/40 uppercase tracking-widest">فوري</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* الجانب الأيسر: المحرك البصري */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-1/2 flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-[180px] md:max-w-[500px] aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[40px] md:blur-[100px] animate-pulse" />
              
              {animationData ? (
                <Lottie 
                  animationData={animationData} 
                  loop={true} 
                  className="w-full h-full relative z-10"
                />
              ) : (
                <div className="h-10 w-10 md:h-20 md:w-20 border-2 md:border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin" />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none opacity-[0.03]">
         <div className="grid grid-cols-3 gap-10 h-full max-w-6xl mx-auto">
            <div className="border-x border-gray-300" />
            <div className="border-x border-gray-300" />
            <div className="border-x border-gray-300" />
         </div>
      </div>
    </section>
  );
}
