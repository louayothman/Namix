
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroProps {
  title?: string;
  description?: string;
  ctaLink?: string;
}

/**
 * @fileOverview مُفاعل الترحيب المينيماليست v20.0 - Right Aligned Portfolio
 * واجهة استثمارية عالمية بمحاذاة يمين احترافية، مخصصة للنخبة.
 */
export function Hero({ title, description, ctaLink = "/login" }: HeroProps) {
  return (
    <section className="relative w-full min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 font-body overflow-hidden" dir="rtl">
      
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-20 relative z-10 py-20">
        
        {/* RIGHT SIDE: Text & Identity */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 space-y-8 text-center lg:text-right"
        >
          {/* Label Node */}
          <div className="flex items-center justify-center lg:justify-start gap-3">
             <div className="h-[0.5px] w-8 bg-[#002d4d]/10" />
             <span className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.4em] mr-[-0.4em]">Integrated Digital Asset Hub</span>
          </div>

          {/* Core Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#002d4d] tracking-tight leading-[1.1] max-w-3xl">
            {title || (
              <>
                ناميكس | <span className="text-[#f9a885] drop-shadow-sm">محفظتك الرقمية</span> المتكاملة للنمو والتداول
              </>
            )}
          </h1>
          
          {/* Elite Description */}
          <p className="text-gray-400 text-base md:text-xl font-bold max-w-2xl lg:mr-0 mx-auto leading-[2.2] md:leading-[2.5] opacity-90">
            {description || "اختبر الكفاءة الفائقة في إدارة استثماراتك. ناميكس توفر لك منصة موحدة تجمع بين سرعة التداول الفوري وحلول تنمية الأصول الموثوقة، المصممة لضمان مستقبل مالي مستقر ومربح."}
          </p>

          {/* Confidence Indicators - Desktop Inline */}
          <div className="hidden lg:flex items-center gap-10 opacity-30 pt-4">
             <div className="flex items-center gap-2.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">Security Verified</span>
             </div>
             <div className="flex items-center gap-2.5">
                <Zap size={14} className="text-[#f9a885] fill-current" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">Fast Execution</span>
             </div>
             <div className="flex items-center gap-2.5">
                <Activity size={14} className="text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">Live Market Pulse</span>
             </div>
          </div>
        </motion.div>

        {/* LEFT SIDE: Action Hub (Desktop side-by-side) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full lg:w-auto lg:shrink-0 flex flex-col items-center gap-6"
        >
          <Link href={ctaLink} className="w-full sm:w-[320px]">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-16 md:h-20 w-full rounded-full bg-[#002d4d] text-white font-black text-sm md:text-lg shadow-2xl hover:bg-[#001d33] transition-all flex items-center justify-center gap-6 relative overflow-hidden group border-none outline-none"
            >
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
              <span>ابدأ رحلتك الآن</span>
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#f9a885] transition-colors duration-500">
                <ArrowRight className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1 text-white" />
              </div>
            </motion.button>
          </Link>
          
          {/* Mobile Only Indicators */}
          <div className="flex lg:hidden items-center gap-6 opacity-20 pt-2">
             <ShieldCheck size={12} className="text-emerald-500" />
             <Zap size={12} className="text-[#f9a885] fill-current" />
             <Activity size={12} className="text-blue-500" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
