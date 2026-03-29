
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function Hero({ title, subtitle, description }: HeroProps) {
  return (
    <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]">{subtitle || "احترافية إدارة الأصول الرقمية"}</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-[#002d4d] tracking-tighter leading-[1.1]">
              {title || "ناميكس: حيث تلتقي التقنية بنمو الأصول."}
            </h1>
            
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-loose">
              {description || "نحن نوفر البيئة الاستثمارية الأكثر تطوراً للنخبة، حيث تندمج القوة التقنية مع الأمان المطلق لتوليد فرص نمو لا محدودة."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            <Link href="/login">
              <button className="h-16 px-12 rounded-full bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-sm shadow-2xl active:scale-95 transition-all group flex items-center gap-3">
                ابدأ التداول الاحترافي
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </Link>
            
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-[#002d4d]/40 uppercase tracking-widest">محمي بالكامل</span>
               </div>
               <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#f9a885]" />
                  <span className="text-[10px] font-black text-[#002d4d]/40 uppercase tracking-widest">سيولة فورية</span>
               </div>
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
