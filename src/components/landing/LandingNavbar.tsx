
"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * @fileOverview شريط الملاحة الذكي v22.0 - إصدار الحواف الناعمة والروح الحيوية
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
              className="text-[13px] font-black text-gray-400 hover:text-[#002d4d] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Left Side: Adaptive Smart Button with Soft Corners & Vitality */}
        <div className="flex items-center">
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px -12px rgba(0, 45, 77, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative h-12 px-10 rounded-[24px] bg-[#002d4d] text-white flex flex-col items-center justify-center overflow-hidden group shadow-xl transition-all duration-500 border-none outline-none"
            >
              {/* Vitality: Animated Background Pulse */}
              <motion.div 
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#002d4d] to-indigo-900 z-0"
              />

              {/* Soul: Shimmering Light Rail */}
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#f9a885]/10 to-transparent skew-x-[-30deg] z-10"
              />
              
              <div className="relative z-20 flex flex-col items-center leading-none pointer-events-none">
                <span className="text-[13px] font-black group-hover:text-[#f9a885] transition-colors duration-300">
                  {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}
                </span>
                <span className="text-[7px] font-bold text-[#f9a885]/60 uppercase mt-1 group-hover:text-white transition-colors duration-300">
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
