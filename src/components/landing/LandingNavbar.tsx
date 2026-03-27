
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview شريط الملاحة المدمج v18.0
 * تم تحويله ليكون غير ثابت (Absolute) وبدون حدود، مع تبسيط العرض للهواتف.
 */
export function LandingNavbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 bg-transparent">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Right Side: Logo */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo size="sm" />
        </motion.div>

        {/* Center: Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { name: "مختبر العقود", href: "#contracts" },
            { name: "التداول الفوري", href: "#trading" },
            { name: "ساحة المغامرة", href: "#arena" },
            { name: "عن ناميكس", href: "/about" },
          ].map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[13px] font-black text-gray-400 hover:text-[#002d4d] transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Left Side: Call to Action */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="h-10 px-6 rounded-xl bg-[#002d4d] text-white font-black text-[13px] shadow-lg active:scale-95 border-none transition-all hover:bg-[#001d33]">
              ابدأ الآن
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
