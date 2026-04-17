
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
 * @fileOverview مُفاعل الترحيب المينيماليست v18.0 - Portfolio Focused
 * لغة استثمارية عالمية تركز على "المحفظة" والنمو المباشر.
 */
export function Hero({ title, description, ctaLink = "/login" }: HeroProps) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-6 font-body">
      
      <div className="max-w-4xl space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Label Node */}
          <div className="flex items-center justify-center gap-3">
             <div className="h-[0.5px] w-8 bg-[#002d4d]/10" />
             <span className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.4em] mr-[-0.4em]">Integrated Digital Asset Hub</span>
             <div className="h-[0.5px] w-8 bg-[#002d4d]/10" />
          </div>

          {/* Core Title - Bold & Precise */}
          <h1 className="text-4xl md:text-7xl font-black text-[#002d4d] tracking-tight leading-[1.15]">
            {title || (
              <>
                ناميكس | <span className="text-[#f9a885] drop-shadow-sm">محفظتك الرقمية</span> المتكاملة للنمو والتداول
              </>
            )}
          </h1>
          
          {/* Elite Description */}
          <p className="text-gray-400 text-base md:text-xl font-bold max-w-2xl mx-auto leading-[2.2] md:leading-[2.5] opacity-90 px-4">
            {description || "اختبر الكفاءة الفائقة في إدارة استثماراتك. ناميكس توفر لك منصة موحدة تجمع بين سرعة التداول الفوري وحلول تنمية الأصول الموثوقة، لضمان مستقبل مالي مستقر ومربح في عالم الأصول الرقمية."}
          </p>
        </motion.div>

        {/* Action Hub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center justify-center pt-6 w-full max-w-md mx-auto"
        >
          <Link href={ctaLink} className="w-full">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-16 w-full rounded-full bg-[#002d4d] text-white font-black text-sm md:text-base shadow-2xl hover:bg-[#001d33] transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
              <span>ابدأ رحلتك الاستثمارية الآن</span>
              <ArrowRight className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Confidence Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16 pt-12"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
