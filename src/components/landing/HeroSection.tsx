"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center px-6 md:px-24 overflow-hidden">
      
      {/* Background Layer: Blurred Candlestick Chart */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 scale-110 blur-2xl"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1611974717484-247427cedf5b?q=80&w=2070&auto=format&fit=crop')" 
          }}
        />
        {/* Deep Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/90 to-transparent" />
      </div>

      <div className="container mx-auto relative z-10 text-right" dir="rtl">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-3xl space-y-10"
        >
          {/* Main Heading - Power and Clarity */}
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] uppercase tracking-normal">
            هل أنت مستعد <br />
            <span className="text-white">لبدء التداول؟</span>
          </h1>

          {/* Subtext - Professional & Calm */}
          <p className="text-gray-400 text-base md:text-xl font-medium leading-loose max-w-xl">
            انضم اليوم وتعلم كيف تحقق الأرباح من تداول الأصول الرقمية. هدفنا هو تمكين المتداولين بمختلف مستوياتهم من تحقيق نمو مستدام من خلال أنظمة ذكية وأدوات تحليلية متطورة.
          </p>

          {/* Call to Action */}
          <div className="pt-6">
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="h-16 md:h-20 px-12 md:px-16 rounded-xl bg-[#00d1ff] hover:bg-[#00b8e6] text-[#0a0e17] font-black text-xl md:text-2xl shadow-[0_20px_60px_rgba(0,209,255,0.25)] border-none uppercase transition-all">
                  انضم الآن
                  <Zap size={24} className="mr-4 fill-current" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Side Element (Side Rail) */}
      <div className="absolute left-12 bottom-12 hidden lg:flex flex-col items-center gap-6 opacity-20">
         <span className="text-[8px] font-black uppercase tracking-[1em] [writing-mode:vertical-lr] rotate-180">NAMIX PLATFORM</span>
         <div className="h-24 w-[1px] bg-gradient-to-b from-white to-transparent" />
      </div>

    </section>
  );
}