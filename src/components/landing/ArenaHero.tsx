
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target, Gem, Sparkles, Trophy, Dices } from "lucide-react";

/**
 * @fileOverview هيرو ساحة المغامرة - التفاعل والمتعة
 */
export function ArenaHero() {
  return (
    <section id="arena" className="relative min-h-screen w-full flex items-center px-6 md:px-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" />
      </div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Content Side */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-right space-y-8"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f9a885]/10 rounded-full border border-[#f9a885]/20">
             <Trophy size={14} className="text-[#f9a885]" />
             <span className="text-[#f9a885] font-black text-[10px] uppercase tracking-widest">ساحة المغامرة التفاعلية</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
            المخاطرة الذكية <br/> <span className="text-white/30 text-purple-400/40">متعة الربح.</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-medium leading-loose max-w-xl">
            استمتع بتجربة استثمارية تفاعلية فريدة. ألعاب عادلة برمجياً تتيح لك اختبار استراتيجياتك ومضاعفة أرباحك بلمسة من الجرأة والمرح.
          </p>
          <div className="pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-16 rounded-2xl bg-gradient-to-r from-[#f9a885] to-[#ff8c5a] text-[#0a0e17] hover:brightness-110 font-black text-lg shadow-2xl transition-all active:scale-95">
                دخول الساحة
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Simulation Side */}
        <div className="relative flex justify-center items-center h-[400px]">
           {/* Floating Floating Gems & Dice */}
           <motion.div 
             animate={{ 
               y: [0, -30, 0],
               rotate: [0, 10, -10, 0]
             }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 right-10 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
           >
              <Gem size={80} strokeWidth={1} />
           </motion.div>

           <motion.div 
             animate={{ 
               y: [0, 40, 0],
               rotate: [0, -20, 20, 0]
             }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-10 left-10 text-[#f9a885] drop-shadow-[0_0_20px_rgba(249,168,133,0.5)]"
           >
              <Dices size={100} strokeWidth={1} />
           </motion.div>

           <div className="relative z-10 text-center space-y-4">
              <div className="h-32 w-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center relative">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 rounded-full border-t-2 border-[#f9a885] opacity-40"
                 />
                 <Target size={48} className="text-white/20" />
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Provably Fair Matrix</p>
           </div>
        </div>

      </div>
    </section>
  );
}
