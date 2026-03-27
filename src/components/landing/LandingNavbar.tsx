
"use client";

import React, { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "مختبر العقود", href: "#contracts" },
    { name: "التداول الفوري", href: "#trading" },
    { name: "ساحة المغامرة", href: "#arena" },
    { name: "عن ناميكس", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 md:px-12 backdrop-blur-md bg-[#0a0e17]/60 border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Right Side: Logo */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo size="sm" className="brightness-200" />
        </motion.div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <Link 
                href={link.href} 
                className="text-[13px] font-black text-white/50 hover:text-[#00d1ff] transition-colors uppercase tracking-widest"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Left Side: Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" className="text-[13px] font-black text-white/60 hover:text-white group">
              تسجيل الدخول
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/login">
            <Button className="h-10 px-6 rounded-xl bg-[#00d1ff] hover:bg-[#00b8e6] text-[#0a0e17] font-black text-[13px] shadow-[0_10px_30px_rgba(0,209,255,0.2)] border-none transition-all active:scale-95">
              ابدأ الآن
            </Button>
          </Link>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white/60 hover:text-white transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0a0e17] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6 text-right">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-black text-white/60 hover:text-[#00d1ff]"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/login" className="pt-4 border-t border-white/5">
                <Button className="w-full h-14 rounded-2xl bg-white/5 text-white font-black">تسجيل الدخول</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
