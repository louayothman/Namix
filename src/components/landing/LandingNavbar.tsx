
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { ArrowRight, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الملاحة المدمج v4.0 - The Seamless Sovereign Edition
 * تصميم مدمج كلياً بدون ظلال، مع زر قائمة "ذري" مبتكر للهواتف.
 */

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  const navLinks = [
    { name: "الخدمات", href: "#" },
    { name: "عن ناميكس", href: "/about" },
    { name: "المساعدة", href: "/faq" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-[1000] w-full bg-transparent py-8 md:py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* الجانب الأيمن: الشعار السديمي */}
        <Link href="/" className="relative z-[1100]">
          <Logo size="sm" className="md:scale-110" />
        </Link>

        {/* المنتصف: الروابط (للكمبيوتر فقط) */}
        <div className="hidden md:flex items-center gap-12" dir="rtl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[11px] font-black text-[#002d4d]/40 hover:text-[#002d4d] transition-all tracking-normal relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 right-0 w-0 h-[1.5px] bg-[#f9a885] transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* الجانب الأيسر: زر التفاعل الذكي + زر القائمة المبتكر */}
        <div className="flex items-center gap-6 relative z-[1100]">
          <Link href={isLoggedIn ? "/home" : "/login"} className="hidden md:block">
            <Button className="h-12 md:h-14 px-10 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[11px] shadow-2xl shadow-blue-900/10 active:scale-95 transition-all group overflow-hidden relative border-none">
              <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
              <div className="relative z-10 flex items-center gap-3">
                <span>{isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}</span>
                <Sparkles size={14} className="text-[#f9a885] animate-pulse" />
              </div>
            </Button>
          </Link>

          {/* زر القائمة "الذري" المبتكر (Atomic Morphing Trigger) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative h-10 w-10 flex items-center justify-center outline-none group"
          >
            <div className="grid grid-cols-2 gap-1.5 transition-transform duration-500 group-active:scale-90">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={isOpen ? {
                    scale: [1, 1.5, 1],
                    rotate: 45,
                    x: i === 0 || i === 2 ? 2 : -2,
                    borderRadius: "2px"
                  } : {
                    scale: 1,
                    rotate: 0,
                    x: 0,
                    borderRadius: "50%"
                  }}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                    isOpen ? "bg-red-500" : (i === 1 || i === 2 ? "bg-[#f9a885]" : "bg-[#002d4d]")
                  )}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* قائمة الجوال "الانبثاق الكمومي" - Quantum Expansion Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 90% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 90% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-white z-[1050] flex flex-col items-center justify-center px-10"
          >
            {/* الخلفية السديمية للقائمة */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-black text-[#002d4d] italic">NAMIX</div>
            </div>

            <div className="w-full space-y-12 text-right relative z-10" dir="rtl">
              <div className="space-y-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="text-4xl font-black text-[#002d4d] group-hover:text-[#f9a885] transition-colors">{link.name}</span>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-1">Explore Section</span>
                      </div>
                      <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-inner">
                        <ChevronLeft size={24} strokeWidth={3} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-10 border-t border-gray-100"
              >
                <Link href={isLoggedIn ? "/home" : "/login"} onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-20 rounded-[32px] bg-[#002d4d] text-[#f9a885] font-black text-xl shadow-2xl flex items-center justify-center gap-4 group active:scale-95 transition-all">
                    <span>{isLoggedIn ? "متابعة الاستخدام" : "انضم الآن للنخبة"}</span>
                    <ArrowRight size={24} className="rotate-180 transition-transform group-hover:-translate-x-2" />
                  </Button>
                </Link>
              </motion.div>
              
              <div className="flex justify-center opacity-10 pt-10">
                 <p className="text-[10px] font-black uppercase tracking-[1em] mr-[-1em]">NAMIX NETWORK</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
