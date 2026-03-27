
"use client";

import React, { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview شريط الملاحة الصرف v1.0
 * تصميم أبيض صلب بدون شفافيات زجاجية، متوافق تماماً مع الهواتف.
 */
export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "مختبر العقود", href: "#contracts" },
    { name: "التداول الفوري", href: "#trading" },
    { name: "ساحة المغامرة", href: "#arena" },
    { name: "عن ناميكس", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 md:px-12 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Right Side: Logo */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo size="sm" />
        </motion.div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[13px] font-black text-gray-400 hover:text-[#002d4d] transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Left Side: Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" className="text-[13px] font-black text-gray-400 hover:text-[#002d4d] group">
              تسجيل الدخول
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/login">
            <Button className="h-10 px-6 rounded-xl bg-[#002d4d] text-white font-black text-[13px] shadow-lg active:scale-95 border-none">
              ابدأ الآن
            </Button>
          </Link>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#002d4d] transition-colors p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Solid White */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6 text-right" dir="rtl">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-black text-[#002d4d] border-b border-gray-50 pb-4 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/login" className="pt-4">
                <Button className="w-full h-14 rounded-2xl bg-[#002d4d] text-white font-black">تسجيل الدخول</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
