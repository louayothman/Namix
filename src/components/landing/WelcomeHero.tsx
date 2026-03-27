
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ShieldCheck, Globe, ChevronLeft } from "lucide-react";

/**
 * @fileOverview هيرو الترحيب v20.0 - إصدار النقاء والتوازن البصري
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative h-20 px-16 rounded-[32px] bg-[#002d4d] text-white flex flex-col items-center justify-center shadow-2xl shadow-blue-900/20 group overflow-hidden"
            >
              <motion.div 
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-[#f9a885]/5 blur-2xl"
              />
              
              <div className="relative z-10 flex items-center gap-5">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black">
                    {isLoggedIn ? "متابعة الاستخدام" : "ابدأ رحلتك الآن"}
                  </span>
                  <span className="text-[9px] font-bold text-[#f9a885] uppercase tracking-[0.3em] mt-1 opacity-80">
                    {isLoggedIn ? "Continue Journey" : "Start Now"}
                  </span>
                </div>
                <ChevronLeft size={24} className="group-hover:-translate-x-2 transition-transform duration-500" />
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
