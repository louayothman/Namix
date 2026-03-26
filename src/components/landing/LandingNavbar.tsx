
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الملاحة العالمي v3.0 - The Monolithic Sovereign Edition
 * تصميم فخم بدون زوايا علوية، مع منطق ذكي للأزرار وتجربة جوال راقية.
 */
export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الخدمات", href: "#" },
    { name: "عن ناميكس", href: "/about" },
    { name: "المساعدة", href: "/faq" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] w-full pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "w-full bg-white border-b border-gray-100 shadow-2xl transition-all duration-700 pointer-events-auto",
          "rounded-b-[40px] md:rounded-b-[56px]",
          scrolled ? "py-3 md:py-4" : "py-5 md:py-7"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* الجانب الأيمن: الشعار السديمي */}
          <Link href="/">
            <Logo size="sm" className="md:scale-110" />
          </Link>

          {/* المنتصف: الروابط (للكمبيوتر فقط بتنسيق فخم) */}
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

          {/* الجانب الأيسر: زر التفاعل الذكي */}
          <div className="flex items-center gap-4">
            <Link href={isLoggedIn ? "/home" : "/login"} className="hidden md:block">
              <Button className="h-12 md:h-14 px-10 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[11px] shadow-2xl shadow-blue-900/20 active:scale-95 transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                <div className="relative z-10 flex items-center gap-3">
                  <span>{isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}</span>
                  <Sparkles size={14} className="text-[#f9a885] animate-pulse" />
                </div>
              </Button>
            </Link>

            {/* زر القائمة للجوال - تصميم راقي */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center text-[#002d4d] shadow-inner active:scale-90 transition-all border border-gray-100"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* قائمة الجوال المنزلقة - فخامة وعصرية */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-white pointer-events-auto overflow-hidden rounded-b-[48px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-t border-gray-50"
          >
            <div className="px-8 py-10 space-y-8 text-right" dir="rtl">
              <div className="space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-xl font-black text-[#002d4d] flex items-center justify-between group"
                    >
                      <span>{link.name}</span>
                      <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#f9a885] group-hover:text-[#002d4d] transition-all">
                        <ChevronLeft size={16} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-6 border-t border-gray-50"
              >
                <Link href={isLoggedIn ? "/home" : "/login"} onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-16 rounded-[24px] bg-[#002d4d] text-[#f9a885] font-black text-base shadow-xl flex items-center justify-center gap-4 group">
                    {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن للنخبة"}
                    <ArrowRight size={20} className="rotate-180 transition-transform group-hover:-translate-x-2" />
                  </Button>
                </Link>
              </motion.div>
              
              <div className="flex justify-center opacity-10">
                 <p className="text-[8px] font-black uppercase tracking-[0.8em]">Namix Network</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// أيقونة العودة المستخدمة في قائمة الجوال
function ChevronLeft({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="3" 
      strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}
