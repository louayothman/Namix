
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";

/**
 * @fileOverview شريط الملاحة العالمي v2.0 - Atomic Scaling Edition
 * تم ضبط الشريط ليكون ثابتاً وممتداً مع ميزة تقلص العناصر على الهواتف لضمان ظهورها بالكامل.
 */
export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] w-full px-4 md:px-8 py-4 md:py-6 pointer-events-none">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto pointer-events-auto"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-[28px] md:rounded-[40px] h-14 md:h-20 px-4 md:px-10 flex items-center justify-between shadow-[0_20px_50px_-12px_rgba(0,45,77,0.05)] overflow-hidden">
          
          {/* محرك التقلص الذكي لضمان ظهور الكل على الموبايل */}
          <div className="flex items-center justify-between w-full gap-2 md:gap-0 scale-[0.82] sm:scale-90 md:scale-100 origin-right md:origin-center transition-transform">
            
            <Logo size="sm" className="scale-90 md:scale-110 shrink-0" />
            
            {/* روابط الملاحة - تظهر مصغرة جداً على الموبايل بدلاً من الاختفاء */}
            <div className="flex items-center gap-3 md:gap-12" dir="rtl">
              {['الخدمات', 'الأسعار', 'عن ناميكس', 'المساعدة'].map((item) => (
                <button 
                  key={item} 
                  className="text-[9px] md:text-[11px] font-black text-[#002d4d]/40 hover:text-[#002d4d] transition-all whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center gap-3 md:gap-8 shrink-0">
              <Link href="/login">
                <span className="text-[9px] md:text-[11px] font-black text-[#002d4d]/60 hover:text-[#002d4d] cursor-pointer transition-all whitespace-nowrap">دخول</span>
              </Link>
              <Link href="/login">
                <Button className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[9px] md:text-[11px] h-9 md:h-12 px-4 md:px-8 shadow-xl shadow-blue-900/10 active:scale-95 transition-all whitespace-nowrap">
                  ابدأ رحلتي الذكية
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </nav>
  );
}
