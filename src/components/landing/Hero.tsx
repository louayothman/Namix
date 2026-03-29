
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

/**
 * @fileOverview مُفاعل الهيرو v3.6 - Professional Edge Edition
 * تم تلوين النصوص بالبرتقالي وتطهير المصطلحات بالكامل لتعزيز الطابع المؤسسي.
 */
export function Hero({ title, subtitle, description, ctaLink = "/login" }: HeroProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch("https://lottie.host/f696eec5-3031-46db-904e-2f94a2bf999a/KlzuAzWVLt.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie Load Error:", err));
  }, []);

  return (
    <section className="relative pt-24 pb-12 md:pt-48 md:pb-32 overflow-hidden">
      
      {/* 1. Technical Grid Overlay - شبكة الهندسة التقنية */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#002d4d 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
      />

      {/* 2. Dual Energy Core - محرك الأفق الموشوري المطور */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Deep Blue Atmosphere (Left) */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[120px]" 
        />

        {/* Morphing Blue-Gray Core (Behind Text) - الرمادي الأزرقي الفخم */}
        <motion.div
          animate={{ 
            borderRadius: [
              "30% 70% 70% 30% / 30% 30% 70% 70%",
              "50% 50% 20% 80% / 25% 80% 20% 75%",
              "67% 33% 47% 53% / 37% 20% 80% 63%",
              "30% 70% 70% 30% / 30% 30% 70% 70%"
            ],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 0.95, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-10 -right-10 w-[100%] h-[100%] bg-slate-400/10 blur-[40px]"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-row items-center justify-between gap-4 md:gap-20">
          
          {/* الجانب الأيمن: المحتوى النصي */}
          <div className="w-1/2 text-right space-y-4 md:space-y-10 relative">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 md:space-y-6 relative z-10"
            >
              <div className="inline-flex items-center gap-1 md:gap-2 px-2 py-0.5 md:px-4 md:py-1.5 bg-white/40 backdrop-blur-md rounded-full border border-blue-100/50 shadow-sm w-fit mr-0 ml-auto group">
                <span className="text-[6px] md:text-[9px] font-black text-blue-600 uppercase tracking-widest group-hover:text-[#002d4d] transition-colors">
                  {subtitle || "احترافية إدارة الأصول الرقمية"}
                </span>
                <Sparkles className="h-2 w-2 md:h-3 md:w-3 text-slate-400 animate-pulse" />
              </div>
              
              <h1 className="text-xl md:text-7xl font-black text-[#002d4d] tracking-tighter leading-tight md:leading-[1.15]">
                {title || "ناميكس: حيث تلتقي التقنية بنمو الأصول."}
              </h1>
              
              <p className="text-gray-500 text-[8px] md:text-xl font-medium max-w-xl leading-relaxed md:leading-loose opacity-80">
                {description || "نحن نوفر البيئة الاستثمارية الأكثر تطوراً للنخبة، حيث تندمج القوة التقنية مع الأمان المطلق لتوليد فرص نمو لا محدودة."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-start gap-3 md:gap-6 pt-2 relative z-10"
            >
              <Link href={ctaLink}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-9 md:h-16 px-4 md:px-12 rounded-full bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-[8px] md:text-sm shadow-2xl shadow-blue-900/20 transition-all flex items-center gap-2"
                >
                  ابدأ الآن
                  <ChevronLeft className="h-3 w-3 md:h-5 md:w-5" />
                </motion.button>
              </Link>
              
              <div className="flex items-center gap-4 md:gap-8 opacity-40">
                 <div className="flex items-center gap-1 md:gap-2">
                    <ShieldCheck className="h-2.5 w-2.5 md:h-4 md:w-4 text-emerald-600" />
                    <span className="text-[6px] md:text-[10px] font-black uppercase tracking-widest text-[#f9a885]">محمي</span>
                 </div>
                 <div className="flex items-center gap-1 md:gap-2">
                    <Zap className="h-2.5 w-2.5 md:h-4 md:w-4 text-slate-400" />
                    <span className="text-[6px] md:text-[10px] font-black uppercase tracking-widest text-[#f9a885]">فوري</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* الجانب الأيسر: الرسم التفاعلي */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="w-1/2 flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-[180px] md:max-w-[500px] aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-400/5 rounded-full blur-[40px] md:blur-[100px] animate-pulse" />
              
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

      {/* 3. Floating Digital Dust - جزيئات البيانات العائمة */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 1000, 
                y: Math.random() * 500, 
                opacity: 0 
              }}
              animate={{ 
                y: [0, -40, 0],
                x: [0, 20, 0],
                opacity: [0, 0.2, 0] 
              }}
              transition={{ 
                duration: 5 + i, 
                repeat: Infinity,
                delay: i * 0.5 
              }}
              className="absolute h-1 w-1 bg-slate-300 rounded-full"
              style={{ top: `${20 + i * 15}%`, left: `${10 + i * 12}%` }}
            />
          ))}
        </div>
      )}

      {/* 4. Background Decorative Structure */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none opacity-[0.02]">
         <div className="grid grid-cols-3 gap-10 h-full max-w-6xl mx-auto">
            <div className="border-x border-gray-300" />
            <div className="border-x border-gray-300" />
            <div className="border-x border-gray-300" />
         </div>
      </div>
    </section>
  );
}
