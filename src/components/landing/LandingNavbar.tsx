
"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * @fileOverview شريط الملاحة الذكي v20.0 - التوازن البصري المستقل
 */
export function LandingNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-[100] px-6 py-10 md:px-12 bg-transparent font-body" dir="rtl">
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
        <nav className="hidden md:flex items-center gap-12">
          {[
            { name: "مختبر العقود", href: "#contracts" },
            { name: "التداول الفوري", href: "#trading" },
            { name: "ساحة المغامرة", href: "#arena" },
            { name: "عن ناميكس", href: "/about" },
          ].map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[14px] font-black text-gray-400 hover:text-[#002d4d] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Left Side: Adaptive Smart Button */}
        <div className="flex items-center">
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative h-12 px-8 rounded-2xl bg-[#002d4d] text-white flex flex-col items-center justify-center overflow-hidden group shadow-2xl shadow-blue-900/20"
            >
              {/* Shimmer Effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
              />
              
              <div className="relative z-10 flex flex-col items-center leading-none">
                <span className="text-[13px] font-black">
                  {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}
                </span>
                <span className="text-[8px] font-bold text-[#f9a885] uppercase tracking-widest mt-1 opacity-80">
                  {isLoggedIn ? "Continue" : "Join Now"}
                </span>
              </div>
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
}
