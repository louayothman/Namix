
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

/**
 * @fileOverview هيرو مختبر العقود - إصدار النقاء
 * يركز على الأمان والنمو في بيئة بيضاء صلبة.
 */
export function ContractHero() {
  return (
    <section id="contracts" className="relative min-h-screen w-full flex items-center pt-24 px-6 md:px-24 bg-white overflow-hidden">
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Content Side */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-right space-y-8"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
             <ShieldCheck size={14} className="text-blue-600" />
             <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">مختبر العقود التشغيلية</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-[#002d4d] leading-[1.1] tracking-tight">
            هندسة العوائد <br/> <span className="text-gray-300">بثبات وأمان.</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg font-medium leading-loose max-w-xl">
            استمتع بنمو مستدام لأصولك عبر عقود تشغيلية ذكية مصممة لضمان الاستقرار المالي وحماية رأس المال في كل دورة عمل.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-start">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-[#002d4d] text-white hover:bg-[#001d33] font-black text-lg shadow-xl active:scale-95 transition-all">
                ابدأ رحلة النمو
              </Button>
            </Link>
            <div className="flex items-center gap-3 text-gray-300 text-[10px] font-black uppercase">
               <Sparkles size={14} className="text-[#f9a885]" />
               <span>Low Risk Matrix</span>
            </div>
          </div>
        </motion.div>

        {/* Simulation Side */}
        <div className="relative flex justify-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="w-full max-w-[340px] p-10 bg-gray-50 rounded-[64px] border border-gray-100 shadow-inner space-y-8"
           >
              <div className="flex justify-between items-center px-2">
                 <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
                 <ShieldCheck className="text-blue-600" size={24} />
              </div>
              <div className="text-center space-y-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Yield Node</p>
                 <h4 className="text-5xl font-black text-[#002d4d] tabular-nums tracking-tighter">+%48.5</h4>
              </div>
              <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                    <span>Capital Flow</span>
                    <TrendingUp size={14} className="text-emerald-500" />
                 </div>
                 <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["30%", "90%"] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                 </div>
              </div>
           </motion.div>
        </div>

      </div>
    </section>
  );
}
