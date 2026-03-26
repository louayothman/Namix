
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الملاحة المدمج v4.0 - The Seamless Entry Strip
 * توزيع خطي للعناصر لضمان تجربة مستخدم مباشرة دون قوائم جانبية.
 */

export function LandingNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  const navLinks = [
    { name: "الخدمات", en: "Services", href: "#" },
    { name: "عن ناميكس", en: "About", href: "/about" },
    { name: "المساعدة", en: "Help", href: "/faq" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-[1000] w-full bg-white py-6 md:py-10 px-4 md:px-12 flex items-center justify-between select-none">
      
      {/* 1. Action Node (Left) - Smart Adaptive Button */}
      <div className="flex-1 flex justify-start">
        <Link href={isLoggedIn ? "/home" : "/login"}>
          <Button className="h-9 md:h-12 px-4 md:px-10 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[8px] md:text-[11px] shadow-2xl shadow-blue-900/10 active:scale-95 transition-all group overflow-hidden relative border-none">
            <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
            <div className="relative z-10 flex items-center gap-2">
              <span>{isLoggedIn ? "متابعة" : "انضم الآن"}</span>
              <Sparkles size={12} className="text-[#f9a885] animate-pulse hidden md:block" />
            </div>
          </Button>
        </Link>
      </div>

      {/* 2. Navigation Matrix (Center) - Direct Access Linear Row */}
      <div className="flex-[2] flex items-center justify-center gap-3 md:gap-12" dir="rtl">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="flex flex-col items-center group transition-all"
          >
            <span className="text-[9px] md:text-[11px] font-black text-[#002d4d] group-hover:text-blue-600 transition-all tracking-normal whitespace-nowrap">
              {link.name}
            </span>
            <span className="text-[6px] md:text-[7px] font-bold text-gray-300 uppercase tracking-widest hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
              {link.en}
            </span>
          </Link>
        ))}
      </div>

      {/* 3. Identity Node (Right) - Nebula Brand */}
      <div className="flex-1 flex justify-end">
        <Link href="/">
          <Logo size="sm" className="scale-75 md:scale-110" />
        </Link>
      </div>

    </nav>
  );
}
