
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ShieldCheck, Globe, ChevronLeft } from "lucide-react";

/**
 * @fileOverview هيرو الترحيب والتعريف - إصدار النقاء الرقمي v1.0
 * القسم الأول والأساسي للتعريف بهوية المنصة ورؤيتها.
 */
export function WelcomeHero() {
  return (
    <section id="welcome" className="relative min-h-screen w-full flex items-center justify-center pt-20 px-6 md:px-24 bg-white overflow-hidden">
      {/* عناصر خلفية هادئة جداً */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100"
        >
          <Sparkles size={14} className="text-[#f9a885]" />
          <span className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest">مرحباً بك في مستقبل التداول الذكي</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002d4d] leading-[1.1] tracking-tight"
        >
          ناميكس: حيث تلتقي <br />
          <span className="text-gray-300">التقنية بالثروة.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-500 text-base md:text-xl font-medium leading-loose max-w-2xl mx-auto"
        >
          نحن نوفر البيئة الاستثمارية الأكثر تطوراً للنخبة، حيث تندمج القوة التقنية مع الأمان المطلق لتوليد فرص نمو لا محدودة في قلب الاقتصاد الرقمي.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-10 pt-4"
        >
          <Link href="/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-16 px-16 rounded-2xl bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-lg shadow-xl active:scale-95 transition-all group">
              ابدأ رحلتك الآن
              <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>

          <div className="flex items-center gap-8 text-gray-300 font-black text-[10px] uppercase tracking-[0.3em] opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>نظام موثق</span>
            </div>
            <div className="h-4 w-px bg-gray-100" />
            <div className="flex items-center gap-2">
              <Globe size={14} />
              <span>سيولة عالمية</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
