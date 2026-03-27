
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target, Gem, Trophy, Dices, Sparkles } from "lucide-react";

/**
 * @fileOverview هيرو الساحة - إصدار النقاء
 */
export function ArenaHero() {
  return (
    <section id="arena" className="relative min-h-screen w-full flex items-center px-6 md:px-24 bg-white overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 rounded-full border border-orange-100">
             <Trophy size={14} className="text-orange-600" />
             <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest">ساحة التفاعل الذكي</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-[#002d4d] leading-[1.1] tracking-tight">
            ذكاء التوقع <br/> <span className="text-gray-300">متعة الربح.</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg font-medium leading-loose max-w-xl">
            استمتع بتجربة تفاعلية فريدة لاختبار استراتيجياتك. نظام عادل برمجياً يتيح لك مضاعفة أرباحك بلمسة من الحماس والذكاء.
          </p>
          <div className="pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-16 rounded-2xl bg-[#f9a885] text-[#002d4d] hover:bg-[#002d4d] hover:text-white font-black text-lg shadow-xl transition-all">
                دخول الساحة
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Simulation Side */}
        <div className="relative flex justify-center items-center h-[400px]">
           <motion.div 
             animate={{ 
               y: [0, -30, 0],
               rotate: [0, 10, -10, 0]
             }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 right-10 text-blue-500 drop-shadow-xl"
           >
              <Gem size={80} strokeWidth={1.5} />
           </motion.div>

           <motion.div 
             animate={{ 
               y: [0, 40, 0],
               rotate: [0, -20, 20, 0]
             }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-10 left-10 text-[#f9a885] drop-shadow-xl"
           >
              <Dices size={100} strokeWidth={1.5} />
           </motion.div>

           <div className="relative z-10 text-center space-y-4">
              <div className="h-32 w-32 rounded-full border-4 border-gray-50 flex items-center justify-center relative shadow-inner bg-white">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 rounded-full border-t-4 border-[#f9a885]"
                 />
                 <Target size={48} className="text-gray-100" />
              </div>
              <div className="flex flex-col items-center gap-1">
                 <span className="text-[10px] font-black text-gray-200 uppercase tracking-[0.5em]">Provably Fair</span>
                 <Sparkles size={12} className="text-[#f9a885] animate-pulse" />
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
