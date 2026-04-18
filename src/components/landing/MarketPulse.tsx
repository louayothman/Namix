
"use client";

import React, { useState, useEffect } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview مفاعل الهوية المزدوج v1.0 - Sovereign Dual Reactor
 * - اليمين: نصوص استراتيجية متغيرة كل 4 ثوانٍ.
 * - اليسار: أيقونات أصول رقمية تتغير كل 2 ثانية مع هالة ضوئية.
 */

const STRATEGIC_TEXTS = [
  "محفظة رقمية آمنة تجمع أصولك في مكان واحد موثوق.",
  "تداول فوري مبني على السرعة والدقة في التنفيذ.",
  "عقود استثمارية مرنة تدعم قراراتك المالية الذكية.",
  "إيداع مباشر بتجربة سلسة وموثوقة على مدار الساعة.",
  "سحب فوري يعكس مفهوم السيولة دون تأخير.",
  "ميزات متقدمة صُممت لمستوى أعلى من الاحتراف المالي.",
  "هوية استثنائية تعكس شخصية كل مستخدم داخل المنصة."
];

const ASSET_NODES = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOT", "LINK", "MATIC", "TRX", "LTC"
];

export function MarketPulse() {
  const [textIndex, setTextIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % STRATEGIC_TEXTS.length);
    }, 4000);

    const iconTimer = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % ASSET_NODES.length);
    }, 2000);

    return () => {
      clearInterval(textTimer);
      clearInterval(iconTimer);
    };
  }, []);

  return (
    <section className="w-full py-20 md:py-32 relative overflow-hidden select-none font-body" dir="rtl">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* الجانب الأيمن: محرك النصوص الاستراتيجية */}
          <div className="flex-1 space-y-10 text-right order-2 lg:order-1">
             <div className="flex items-center gap-3 pr-2">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                   <ShieldCheck size={20} />
                </div>
                <div className="space-y-0.5">
                   <p className="text-[10px] font-black text-[#f9a885] uppercase tracking-[0.3em]">Operational Pillars</p>
                   <h3 className="text-xl font-black text-[#002d4d]">ركائز ناميكس</h3>
                </div>
             </div>

             <div className="relative min-h-[120px] md:min-h-[150px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={textIndex}
                    initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    <p className="text-xl md:text-3xl lg:text-4xl font-black text-[#002d4d] leading-[1.4] md:leading-tight tracking-tight">
                      {STRATEGIC_TEXTS[textIndex]}
                    </p>
                    
                    {/* مؤشر التقدم النانوي */}
                    <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                       <motion.div 
                         key={`progress-${textIndex}`}
                         initial={{ width: 0 }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 4, ease: "linear" }}
                         className="h-full bg-[#f9a885]"
                       />
                    </div>
                  </motion.div>
                </AnimatePresence>
             </div>

             <div className="flex items-center gap-6 opacity-30 pt-4">
                <div className="flex items-center gap-2">
                   <Zap size={12} className="text-[#002d4d]" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Quantum Execution</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-gray-400" />
                <div className="flex items-center gap-2">
                   <Sparkles size={12} className="text-[#002d4d]" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Sovereign Protocol</span>
                </div>
             </div>
          </div>

          {/* الجانب الأيسر: بوابة الأصول الوميضية */}
          <div className="flex-1 flex items-center justify-center order-1 lg:order-2">
             <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center">
                
                {/* الهالة الكهرومغناطيسية المتحركة */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-[0.5px] border-dashed border-[#8899AA]/20"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20px] rounded-full border-[0.5px] border-dashed border-[#f9a885]/10"
                />

                {/* توهج الخلفية المتفاعل */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-[#f9a885]/5 rounded-full blur-3xl animate-pulse" />

                {/* حاوية الأيقونة المركزية */}
                <div className="relative z-10 h-40 w-40 md:h-56 md:w-56 bg-white/40 backdrop-blur-3xl rounded-[56px] border border-white shadow-[0_32px_64px_-16px_rgba(0,45,77,0.1)] flex items-center justify-center group overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                   
                   <AnimatePresence mode="wait">
                      <motion.div
                        key={iconIndex}
                        initial={{ opacity: 0, scale: 0.5, rotate: -20, filter: "blur(15px)" }}
                        animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.5, rotate: 20, filter: "blur(15px)" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10"
                      >
                         <CryptoIcon name={ASSET_NODES[iconIndex]} size={100} className="md:size-[140px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]" />
                      </motion.div>
                   </AnimatePresence>

                   {/* ومضة البيانات النانوية */}
                   <motion.div 
                     animate={{ 
                       x: ['100%', '-100%'],
                       y: ['100%', '-100%']
                     }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12"
                   />
                </div>

                {/* تفاصيل العقد - تسمية العملة الحالية */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                   <AnimatePresence mode="wait">
                      <motion.div
                        key={iconIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <Badge className="bg-[#002d4d] text-white border-none font-black text-[10px] px-6 py-1.5 rounded-full shadow-xl tracking-[0.2em]">
                           {ASSET_NODES[iconIndex]}
                        </Badge>
                        <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Global Asset Node</span>
                      </motion.div>
                   </AnimatePresence>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Signature */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-[0.05] pointer-events-none">
         <p className="text-[10px] font-black uppercase tracking-[1.5em] text-[#002d4d] mr-[-1.5em]">SYSTEM PULSE</p>
      </div>
    </section>
  );
}
