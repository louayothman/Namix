
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, ChevronUp, ChevronDown, Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة لنمط العداد
 * يضمن تحرك الأرقام بشكل عمودي عند التحديث لتعزيز الشعور بالواقعية.
 */
function AnimatedDigit({ digit }: { digit: string }) {
  const isNumber = !isNaN(parseInt(digit));
  if (!isNumber) return <span className="inline-block px-0.5">{digit}</span>;

  const num = parseInt(digit);

  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden inline-flex flex-col leading-none">
      <motion.div
        animate={{ y: `-${num * 10}%` }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="flex flex-col items-center w-full h-[1000%] absolute top-0 left-0"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[10%] flex items-center justify-center font-black">
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function MockPortfolioCard() {
  const [balance, setBalance] = useState(12450.00);
  const [yieldValue, setYieldValue] = useState(840.42);

  // زيادة نانوية تلقائية لإضفاء حيوية مستمرة على المحرك
  useEffect(() => {
    const interval = setInterval(() => {
      setYieldValue(prev => prev + 0.001);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleActionTrigger = () => {
    // محاكاة تدفق سيولة عند الضغط لتشغيل العداد
    setBalance(prev => prev + Math.floor(Math.random() * 120) + 40);
    setYieldValue(prev => prev + (Math.random() * 0.5));
  };

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="w-full max-w-[320px] bg-[#8899AA] rounded-[40px] p-8 text-white shadow-[0_40px_100px_-15px_rgba(136,153,170,0.4)] relative overflow-hidden group select-none mb-10"
    >
      {/* Sovereign Watermark */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
         <Wallet size={140} />
      </div>

      <div className="space-y-10 relative z-10">
        <div className="flex items-center justify-between">
           <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner">
              <ShieldCheck size={20} className="text-[#f9a885]" />
           </div>
           <Badge className="bg-emerald-500/20 text-emerald-300 border-none font-black text-[7px] px-2.5 py-0.5 rounded-full tracking-widest uppercase">
              Live Core
           </Badge>
        </div>

        <div className="space-y-2">
           <div className="flex items-center text-[36px] font-black tabular-nums tracking-tighter" dir="ltr">
              <span className="text-xl mr-1.5 opacity-30">$</span>
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split("").map((char, i) => (
                <AnimatedDigit key={i} digit={char} />
              ))}
           </div>
           <div className="flex items-center gap-2 text-emerald-300">
              <TrendingUp size={12} className="animate-pulse" />
              <div className="flex items-center text-[11px] font-black tabular-nums" dir="ltr">
                 <span>+$</span>
                 {yieldValue.toFixed(2).split("").map((char, i) => (
                   <AnimatedDigit key={i} digit={char} />
                 ))}
                 <span className="ml-1 opacity-60">Today</span>
              </div>
           </div>
        </div>

        {/* أزرار العمليات التفاعلية - Interactive Node Matrix */}
        <div className="grid grid-cols-2 gap-4 pt-2">
           <motion.button 
             whileHover={{ scale: 1.04, y: -2 }}
             whileTap={{ scale: 0.94 }}
             onClick={handleActionTrigger}
             className="h-14 rounded-2xl bg-white text-[#002d4d] flex items-center justify-center gap-3 shadow-xl transition-all border-none outline-none group/btn relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[#f9a885]/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              <ChevronDown size={20} className="text-[#f9a885] relative z-10" />
              <span className="text-[12px] font-black relative z-10">استلام</span>
           </motion.button>

           <motion.button 
             whileHover={{ scale: 1.04, y: -2 }}
             whileTap={{ scale: 0.94 }}
             onClick={handleActionTrigger}
             className="h-14 rounded-2xl bg-white/10 text-white backdrop-blur-xl border border-white/10 flex items-center justify-center gap-3 transition-all group/btn outline-none"
           >
              <ChevronUp size={20} className="text-white relative z-10" />
              <span className="text-[12px] font-black relative z-10">إرسال</span>
           </motion.button>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-white/10 rounded-full blur-[1px]" />
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 font-body overflow-hidden" dir="rtl">
      
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-24 relative z-10 py-16 md:py-24">
        
        {/* RIGHT SIDE: Strategic Copy */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 space-y-10 text-center lg:text-right"
        >
          <div className="flex items-center justify-center lg:justify-start gap-4">
             <div className="h-[0.5px] w-10 bg-[#002d4d]/20" />
             <span className="text-[11px] font-black text-blue-600/40 uppercase tracking-[0.5em] mr-[-0.5em]">Unified Asset Hub</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002d4d] tracking-tight leading-[1] max-w-4xl">
            ناميكس | <span className="text-[#f9a885] drop-shadow-sm">محفظتك الرقمية</span> المتكاملة للنمو
          </h1>
          
          <p className="text-gray-400 text-lg md:text-2xl font-bold max-w-2xl lg:mr-0 mx-auto leading-[2.2] md:leading-[2.5] opacity-90">
            اختبر الكفاءة الفائقة في إدارة استثماراتك. ناميكس توفر لك منصة موحدة تجمع بين سرعة التداول الفوري وحلول تنمية الأصول الموثوقة، المصممة لضمان نمو مستدام.
          </p>
        </motion.div>

        {/* LEFT SIDE: Dynamic Identity Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-auto lg:shrink-0 flex flex-col items-center lg:items-start"
        >
          {/* محاكي المحفظة الحيوي */}
          <MockPortfolioCard />

          <Link href="/login" className="w-full sm:w-[320px]">
            <motion.button 
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="h-20 w-full rounded-full bg-[#002d4d] text-white font-black text-lg shadow-2xl hover:bg-[#001d33] transition-all flex items-center justify-center gap-8 relative overflow-hidden group border-none outline-none"
            >
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
              <span>سجل الآن مجاناً</span>
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#f9a885] transition-colors duration-500">
                <ArrowRight className="h-6 w-6 rotate-180 transition-transform group-hover:-translate-x-1 text-white" />
              </div>
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
