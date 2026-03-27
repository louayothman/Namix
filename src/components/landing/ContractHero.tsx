
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ShieldCheck, TrendingUp } from "lucide-react";

/**
 * @fileOverview هيرو مختبر العقود - الفخامة والاستقرار
 */
export function ContractHero() {
  return (
    <section id="contracts" className="relative min-h-screen w-full flex items-center pt-24 px-6 md:px-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Content Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-right space-y-8"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
             <ShieldCheck size={14} className="text-blue-400" />
             <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest">مختبر العقود الذكية</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
            هندسة النمو <br/> <span className="text-white/30">المستدام للأصول.</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-medium leading-loose max-w-xl">
            استثمر في عقود تشغيلية مصممة بخوارزميات ذكية تضمن لك عوائد ثابتة وحماية كاملة لرأس المال ضمن بيئة مالية سيادية.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-start">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-white text-[#0a0e17] hover:bg-[#00d1ff] font-black text-lg shadow-xl transition-all active:scale-95">
                تفعيل أول عقد
              </Button>
            </Link>
            <div className="flex items-center gap-3 text-white/20 text-[10px] font-black uppercase">
               <span>Insured By Namix</span>
               <div className="h-1 w-1 rounded-full bg-blue-500" />
               <span>Low Risk</span>
            </div>
          </div>
        </motion.div>

        {/* Simulation Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative flex justify-center"
        >
          <div className="w-[300px] h-[400px] bg-gradient-to-b from-blue-500/5 to-transparent rounded-[60px] border border-white/10 backdrop-blur-xl p-8 flex flex-col justify-between shadow-2xl relative group">
             <div className="space-y-6">
                <div className="flex justify-between items-center opacity-40">
                   <div className="h-1 w-12 bg-white rounded-full" />
                   <ShieldCheck size={16} />
                </div>
                <div className="space-y-2 text-center">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Yield</p>
                   <motion.h4 
                     animate={{ opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="text-5xl font-black text-white tabular-nums tracking-tighter"
                   >
                     +%42.5
                   </motion.h4>
                </div>
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-white/30">
                      <span>Capital Growth</span>
                      <TrendingUp size={12} className="text-emerald-500" />
                   </div>
                   <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: ["20%", "85%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute right-0 h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"
                      />
                   </div>
                </div>
             </div>
             <div className="flex items-center justify-center gap-3 opacity-20">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">Forge Node Active</span>
             </div>
             
             {/* Floating Sparks */}
             <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-10 -left-10 text-[#f9a885] opacity-20">
                <Zap size={60} />
             </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
