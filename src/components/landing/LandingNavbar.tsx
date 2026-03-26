"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";

export function LandingNavbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-6xl px-6">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-[32px] h-16 md:h-20 px-6 md:px-10 flex items-center justify-between shadow-[0_20px_50px_-12px_rgba(0,45,77,0.05)]"
      >
        <Logo size="md" className="scale-90 md:scale-100" />
        
        <div className="hidden lg:flex items-center gap-12" dir="rtl">
          {['الخدمات', 'الأسعار', 'عن ناميكس', 'المساعدة'].map((item) => (
            <button key={item} className="text-[11px] font-black text-[#002d4d]/40 hover:text-[#002d4d] transition-all tracking-normal">{item}</button>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/login">
            <span className="text-[11px] font-black text-[#002d4d]/60 hover:text-[#002d4d] cursor-pointer transition-all">دخول</span>
          </Link>
          <Link href="/login">
            <Button className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] md:text-[11px] h-10 md:h-12 px-6 md:px-8 shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
              ابدأ رحلتي الذكية
            </Button>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}
