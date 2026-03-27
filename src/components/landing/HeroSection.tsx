
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  MousePointerClick
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
      
      {/* Background Cinematic Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0">
         <h1 className="text-[300px] md:text-[500px] font-black italic tracking-tighter">NAMIX</h1>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Right Content Block */}
        <motion.div 
          initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10 text-center lg:text-right"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50/50 rounded-full border border-blue-100 backdrop-blur-md">
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[#002d4d] font-black text-[10px] uppercase tracking-[0.3em]">The Intelligent Growth Hub</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-[#002d4d] leading-[0.95] tracking-tighter">
            ارسم مستقبلك <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#002d4d] via-blue-600 to-[#f9a885] animate-text-shimmer">بذكاء عالمي.</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 font-medium max-w-lg mx-auto lg:ml-auto lg:mr-0 leading-[1.8] tracking-normal">
            ناميكس هي بوابتك للنظام المالي المتطور؛ حيث تلتقي التكنولوجيا المتقدمة بسهولة الاستخدام المطلقة لتمنحك رحلة نمو مستدامة.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
             <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-16 md:h-20 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-[0_20px_50px_rgba(0,45,77,0.2)] active:scale-95 transition-all group border-none">
                  ابدأ رحلتي الذكية
                  <ArrowRight size={20} className="mr-3 rotate-180 transition-transform group-hover:-translate-x-2" />
                </Button>
             </Link>
             <div className="flex items-center gap-4 px-8 h-16 md:h-20 rounded-full border border-gray-100 bg-white/50 backdrop-blur-md shadow-sm">
                <ShieldCheck size={24} className="text-emerald-500" />
                <div className="flex flex-col items-start leading-none text-right">
                   <span className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">Certified Security</span>
                   <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">بيئة استثمارية موثقة</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Left Visual Block - The Floating Device */}
        <div className="relative flex justify-center items-center h-[500px] md:h-[800px] mt-12 lg:mt-0">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute h-[600px] w-[600px] bg-gradient-to-tr from-blue-500/5 via-transparent to-[#f9a885]/10 rounded-full blur-[100px] opacity-60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 100, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[280px] h-[580px] md:w-[340px] md:h-[680px] bg-white rounded-[64px] border-[10px] border-[#002d4d]/5 shadow-[0_80px_150px_-30px_rgba(0,45,77,0.15)] overflow-hidden group"
          >
            <div className="p-8 md:p-12 space-y-12 h-full flex flex-col">
               <div className="flex justify-between items-center opacity-30">
                  <div className="h-1.5 w-14 bg-[#002d4d] rounded-full" />
                  <div className="h-5 w-5 rounded-full border-2 border-[#002d4d]" />
               </div>
               
               <div className="space-y-4 text-center pt-6">
                  <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em]">Sovereign Node</p>
                  <h3 className="text-4xl md:text-5xl font-black text-[#002d4d] tabular-nums tracking-tighter">$24,150.00</h3>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100 shadow-sm">
                     <TrendingUp size={14} className="text-emerald-500" />
                     <span className="text-[11px] font-black text-emerald-600">+18.42%</span>
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-center gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 rounded-[28px] bg-gray-50 border border-gray-100 shadow-inner p-4 flex items-center justify-between opacity-60">
                       <div className="h-8 w-8 rounded-xl bg-white" />
                       <div className="h-2 w-20 bg-gray-200 rounded-full" />
                    </div>
                  ))}
               </div>

               <div className="pt-4 flex justify-center">
                  <MousePointerClick size={24} className="text-gray-100 animate-bounce" />
               </div>
            </div>
          </motion.div>

          {/* Floating Data Nodes */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -right-16 bg-white/80 backdrop-blur-xl border border-gray-100 p-6 rounded-[36px] w-64 shadow-2xl z-20 hidden xl:block"
          >
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner"><Activity size={22} /></div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Global Pulse</p>
                   <p className="text-sm font-black text-[#002d4d] mt-1.5">Syncing Markets...</p>
                </div>
             </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[15%] -left-20 bg-[#002d4d] p-8 rounded-[44px] w-56 shadow-2xl border border-white/5 z-20 hidden xl:block"
          >
             <Sparkles size={20} className="text-[#f9a885] mb-4 animate-pulse" />
             <div className="space-y-1">
                <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Intelligence</p>
                <p className="text-lg font-black text-white">AI Analysis <br/> Active</p>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
