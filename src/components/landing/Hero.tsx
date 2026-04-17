
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLink?: string;
}

/**
 * @fileOverview مُفاعل الهيرو الفائق v15.0 - Ultra Performance
 * استئصال Lottie نهائياً واستبدالها بمفاعل اللوجو المورفي النانوي لمنع التعليق.
 */
export function Hero({ title, description, ctaLink = "/login" }: HeroProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative pt-20 pb-8 md:pt-48 md:pb-32 overflow-hidden bg-white font-body">
      
      {/* 1. Technical Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#002d4d 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-row items-center justify-between gap-4 md:gap-20">
          
          <div className="w-1/2 text-right space-y-3 md:space-y-8 relative">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 md:space-y-5 relative z-10"
            >
              <h1 className="text-sm md:text-5xl font-black text-[#002d4d] tracking-tight leading-tight md:leading-[1.2]">
                {title ? title : (
                  <>
                    ناميكس: استثمارك <span className="text-[#f9a885] drop-shadow-[0_0_15px_rgba(249,168,133,0.3)]">الأمثل</span>
                  </>
                )}
              </h1>
              
              <p className="text-gray-500 text-[9px] md:text-lg font-medium max-w-xl leading-relaxed md:leading-loose opacity-80">
                {description || "استمتع بأعلى معايير الأمان والشفافية في إدارة أصولك الرقمية، مع بروتوكولات حماية متطورة ومحركات ذكاء اصطناعي مصممة للنخبة."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 md:gap-6 pt-1 relative z-10"
            >
              <Link href={ctaLink} className="w-full md:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 md:h-16 px-4 md:px-12 w-full md:w-auto rounded-full bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-[10px] md:text-lg shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  ابدأ الآن
                  <ChevronLeft className="h-3 w-3 md:h-5 md:w-5" />
                </motion.button>
              </Link>
              
              <div className="hidden sm:flex items-center gap-8 opacity-40 px-2">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#f9a885]">محمي</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Optimized Digital Reactor */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="w-1/2 flex justify-center md:justify-end relative"
          >
            <div className="relative w-full max-w-[160px] md:max-w-[420px] aspect-square flex items-center justify-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 rounded-full border border-dashed border-gray-100 opacity-20"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-8 rounded-full border border-dashed border-blue-50 opacity-20"
               />
               <div className="relative z-10 scale-[1.4] md:scale-[3] drop-shadow-[0_20px_50px_rgba(0,45,77,0.15)]">
                  <Logo size="lg" hideText animate={true} />
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
