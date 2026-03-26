
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Cpu, Zap, Activity } from "lucide-react";

export function HeroSection2() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 bg-gray-50/30 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="order-2 lg:order-1 flex justify-center"
          >
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="h-64 w-64 md:h-80 md:w-80 rounded-[64px] bg-[#002d4d] flex items-center justify-center shadow-2xl relative z-10 border border-white/10 group">
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-10">
                      <Cpu size={320} strokeWidth={0.5} className="text-white" />
                   </motion.div>
                   <Zap size={80} className="text-[#f9a885] fill-current animate-pulse" />
                </div>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="space-y-8 text-center lg:text-right order-1 lg:order-2"
            dir="rtl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
               <ShieldCheck size={14} className="text-emerald-600" />
               <span className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest">تكنولوجيا الأمان الفائق <span className="opacity-30 mx-1">•</span> Pure Security</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-[#002d4d] leading-tight tracking-tight">
              أدوات متطورة <br />
              <span className="text-blue-600">للتحليل اللحظي.</span>
            </h2>
            
            <p className="text-sm md:text-lg text-gray-400 font-medium max-w-lg mx-auto lg:mr-0 leading-relaxed">
              نظامنا الذكي يقوم بمعالجة ملايين البيانات كل ثانية ليمنحك الرؤية الأوضح لتحركات السوق بأسلوب تقني لا يضاهى.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mr-0">
               <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <p className="text-[10px] font-black text-gray-400 uppercase">Analysis</p>
                  <p className="text-sm font-black text-[#002d4d]">دقة فائقة</p>
               </div>
               <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-2">
                  <Zap className="h-5 w-5 text-[#f9a885]" />
                  <p className="text-[10px] font-black text-gray-400 uppercase">Speed</p>
                  <p className="text-sm font-black text-[#002d4d]">تنفيذ وميضي</p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
