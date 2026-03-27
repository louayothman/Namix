"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      
      {/* The Monolith Visual - Weird & Elegant */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square z-0 opacity-10">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="w-full h-full rounded-full border-[0.5px] border-white/20 relative"
         >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-4 bg-[#f9a885] rounded-full blur-md" />
         </motion.div>
      </div>

      <div className="container mx-auto text-center space-y-12 relative z-10">
        
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
             <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
             <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.3em]">Pure Intelligence Node</span>
          </div>

          <h1 className="text-white leading-none tracking-tighter">
            ارسم ثروتك <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-white via-[#f9a885] to-white animate-text-shimmer">بذكاء عالمي.</span>
          </h1>

          <p className="text-white/40 font-medium max-w-2xl mx-auto leading-relaxed md:text-xl">
            ناميكس هي تجربة نمو استثنائية؛ حيث تلتقي التكنولوجيا المتقدمة بالأناقة المطلقة لتمنحك السيادة المالية الكاملة.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col items-center gap-8"
        >
          <Link href="/login">
            <Button className="h-20 md:h-24 px-16 rounded-[32px] bg-white text-[#002d4d] hover:bg-[#f9a885] font-black text-2xl shadow-2xl active:scale-95 transition-all group border-none overflow-hidden relative">
               <span className="relative z-10">ابدأ الرحلة الآن</span>
               <Zap size={24} className="mr-4 fill-current relative z-10 transition-transform group-hover:scale-125" />
               <div className="absolute inset-0 bg-[#f9a885]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </Link>

          <div className="flex items-center gap-10 opacity-20">
             <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Secure</span>
             </div>
             <div className="h-4 w-[0.5px] bg-white" />
             <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Access</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Soul Particles */}
      <div className="absolute bottom-20 flex flex-col items-center gap-4 opacity-10 animate-bounce">
         <div className="h-12 w-[0.5px] bg-gradient-to-b from-white to-transparent" />
         <span className="text-[8px] font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">SCROLL TO DISCOVER</span>
      </div>

    </section>
  );
}