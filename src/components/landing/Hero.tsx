
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Activity, TrendingUp, Wallet, Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مُفاعل الترحيب المينيماليست v21.0 - Right Aligned with Portfolio Mockup
 * تم تحديث الزر وإضافة بطاقة تحاكي محفظة المستخدم لتعزيز الجذب البصري.
 */

function MockPortfolioCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[320px] bg-[#8899AA] rounded-[40px] p-6 text-white shadow-[0_40px_80px_-15px_rgba(136,153,170,0.4)] relative overflow-hidden group select-none mb-6"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
         <Wallet size={120} />
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
           <div className="space-y-0.5">
              <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Available Assets</p>
              <p className="text-xs font-black">المحفظة الجارية</p>
           </div>
           <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
              <ShieldCheck size={16} className="text-[#f9a885]" />
           </div>
        </div>

        <div className="space-y-1">
           <p className="text-[28px] font-black tabular-nums tracking-tighter">$12,450.00</p>
           <div className="flex items-center gap-1.5 text-emerald-300">
              <TrendingUp size={10} />
              <span className="text-[9px] font-black tabular-nums">+12.5% Today</span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
           <div className="space-y-0.5">
              <p className="text-[6px] font-black text-white/30 uppercase">Active Yield</p>
              <p className="text-[11px] font-black tabular-nums">$840.42</p>
           </div>
           <div className="space-y-0.5 text-left">
              <p className="text-[6px] font-black text-white/30 uppercase">Status</p>
              <div className="flex items-center justify-end gap-1">
                 <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                 <span className="text-[9px] font-black text-emerald-400">LIVE</span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 font-body overflow-hidden" dir="rtl">
      
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-20 relative z-10 py-12 md:py-20">
        
        {/* RIGHT SIDE: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 space-y-8 text-center lg:text-right"
        >
          <div className="flex items-center justify-center lg:justify-start gap-3">
             <div className="h-[0.5px] w-8 bg-[#002d4d]/10" />
             <span className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.4em] mr-[-0.4em]">Integrated Digital Asset Hub</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#002d4d] tracking-tight leading-[1.1] max-w-3xl">
            ناميكس | <span className="text-[#f9a885] drop-shadow-sm">محفظتك الرقمية</span> المتكاملة للنمو والتداول
          </h1>
          
          <p className="text-gray-400 text-base md:text-xl font-bold max-w-2xl lg:mr-0 mx-auto leading-[2.2] md:leading-[2.5] opacity-90">
            اختبر الكفاءة الفائقة في إدارة استثماراتك. ناميكس توفر لك منصة موحدة تجمع بين سرعة التداول الفوري وحلول تنمية الأصول الموثوقة، المصممة خصيصاً لضمان نمو مستدام وتحكم كامل في مستقبل أصولك الرقمية.
          </p>

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

        {/* LEFT SIDE: Mock Portfolio & CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full lg:w-auto lg:shrink-0 flex flex-col items-center lg:items-start"
        >
          {/* Card placed above button for large screens */}
          <MockPortfolioCard />

          <Link href="/login" className="w-full sm:w-[320px]">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-16 md:h-20 w-full rounded-full bg-[#002d4d] text-white font-black text-sm md:text-lg shadow-2xl hover:bg-[#001d33] transition-all flex items-center justify-center gap-6 relative overflow-hidden group border-none outline-none"
            >
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
              <span>سجل الآن مجاناً</span>
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#f9a885] transition-colors duration-500">
                <ArrowRight className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1 text-white" />
              </div>
            </motion.button>
          </Link>
          
          <div className="flex lg:hidden items-center gap-6 opacity-20 pt-6">
             <ShieldCheck size={12} className="text-emerald-500" />
             <Zap size={12} className="text-[#f9a885] fill-current" />
             <Activity size={12} className="text-blue-500" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
