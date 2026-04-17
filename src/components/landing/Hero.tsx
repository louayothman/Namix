
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

interface HeroProps {
  title?: string;
  description?: string;
  ctaLink?: string;
}

/**
 * @fileOverview مُفاعل الترحيب المينيماليست v16.0 - Professional Standard
 * محتوى نصي احترافي موحد يدعو للاستثمار والتداول المباشر.
 */
export function Hero({ title, description, ctaLink = "/login" }: HeroProps) {
  return (
    <section className="relative pt-20 pb-8 md:pt-48 md:pb-32 overflow-hidden bg-white font-body">
      
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.01]" 
           style={{ backgroundImage: 'radial-gradient(#002d4d 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} 
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          
          <div className="space-y-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-7xl font-black text-[#002d4d] tracking-tight leading-tight">
                {title || (
                  <>
                    ناميكس | استثمر في <span className="text-[#f9a885]">أصولك الرقمية</span> بثقة
                  </>
                )}
              </h1>
              
              <p className="text-gray-400 text-sm md:text-xl font-bold max-w-2xl mx-auto leading-relaxed md:leading-loose opacity-80">
                {description || "استمتع بوصول فائق للأسواق العالمية من خلال واجهة احترافية تجمع بين كفاءة التداول الفوري وحلول تنمية المال المؤتمتة."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href={ctaLink} className="w-full md:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-14 md:h-16 px-10 md:px-14 w-full md:w-auto rounded-full bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-sm md:text-lg shadow-2xl transition-all flex items-center justify-center gap-3 group"
                >
                  <span>ابدأ التداول الآن</span>
                  <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="flex items-center gap-12 pt-8"
          >
             <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#002d4d]">Secure Platform</span>
             </div>
             <div className="flex items-center gap-3">
                <Zap size={16} className="text-[#f9a885]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#002d4d]">Instant Growth</span>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
