
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ShieldCheck, Globe, ChevronLeft } from "lucide-react";

/**
 * @fileOverview هيرو الترحيب v21.0 - إصدار النقاء والروح الحيوية
 */
export function WelcomeHero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <section id="welcome" className="relative min-h-screen w-full flex items-center justify-center pt-20 px-6 md:px-24 bg-white overflow-hidden font-body" dir="rtl">
      {/* Soft Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-50/40 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto relative z-10 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 px-5 py-2 bg-gray-50 rounded-full border border-gray-100"
        >
          <Sparkles size={14} className="text-[#f9a885]" />
          <span className="text-[#002d4d] font-black text-[11px] uppercase tracking-wide">مرحباً بك في مستقبل الاستثمار الذكي</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002d4d] leading-[1.1] tracking-tight"
        >
          ناميكس: حيث تلتقي <br />
          <span className="text-gray-200">التقنية بالثروة.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-base md:text-lg lg:text-xl font-medium leading-loose max-w-2xl mx-auto"
        >
          نحن نوفر البيئة الاستثمارية الأكثر تطوراً للنخبة، حيث تندمج القوة التقنية مع الأمان المطلق لتوليد فرص نمو لا محدودة.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-12 pt-6"
        >
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 30px 60px -12px rgba(0, 45, 77, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative h-24 px-16 rounded-[36px] bg-[#002d4d] text-white flex flex-col items-center justify-center shadow-2xl overflow-hidden group"
            >
              {/* Vitality: Living Pulse Gradient */}
              <motion.div 
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  background: [
                    "radial-gradient(circle at 0% 0%, #002d4d 0%, #003d6d 100%)",
                    "radial-gradient(circle at 100% 100%, #003d6d 0%, #002d4d 100%)",
                    "radial-gradient(circle at 0% 0%, #002d4d 0%, #003d6d 100%)"
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0"
              />

              {/* Soul: High-Velocity Shimmer */}
              <motion.div 
                initial={{ x: "-150%" }}
                animate={{ x: "250%" }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#f9a885]/15 to-transparent skew-x-[-25deg] z-10"
              />
              
              <div className="relative z-20 flex items-center gap-6">
                <div className="flex flex-col items-center leading-none">
                  <span className="text-2xl font-black group-hover:text-[#f9a885] transition-colors duration-300">
                    {isLoggedIn ? "متابعة الاستخدام" : "ابدأ رحلتك الآن"}
                  </span>
                  <span className="text-[10px] font-bold text-[#f9a885]/60 uppercase tracking-[0.4em] mt-2 group-hover:text-white transition-colors duration-300">
                    {isLoggedIn ? "Continue Journey" : "Start Now"}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-[#f9a885] group-hover:text-[#002d4d] transition-all duration-500">
                  <ChevronLeft size={24} className="transition-transform duration-500 group-hover:-translate-x-1" />
                </div>
              </div>
            </motion.button>
          </Link>

          <div className="flex items-center gap-10 text-gray-300 font-black text-[10px] uppercase tracking-widest opacity-50">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>نظام موثق</span>
            </div>
            <div className="h-4 w-px bg-gray-100" />
            <Globe size={14} />
            <div className="h-4 w-px bg-gray-100" />
            <span>سيولة عالمية</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
