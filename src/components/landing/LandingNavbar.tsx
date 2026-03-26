
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { LandingBarIntro } from "./LandingBarIntro";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شريط الملاحة العالمي v6.0 - The Integrated Slate Strip
 * يتميز بلون #7D8E9E وأزرار برتقالية، مع توزيع ذكي متوازن على الهواتف.
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
    <nav className="absolute top-0 left-0 right-0 z-[1000] w-full bg-[#7D8E9E] py-6 md:py-8 px-4 md:px-12 flex items-center justify-between select-none border-none shadow-none">
      
      {/* 1. Identity Node (Left) - Using the new LandingBarIntro component */}
      <div className="flex-1 flex justify-start">
        <LandingBarIntro />
      </div>

      {/* 2. Navigation Matrix (Center) - Direct Access Linear Row */}
      <div className="flex-[2] flex items-center justify-center gap-6 md:gap-12" dir="rtl">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="flex flex-col items-center group transition-all"
          >
            <span className="text-[10px] md:text-[13px] font-black text-white group-hover:text-[#f9a885] transition-all tracking-normal whitespace-nowrap">
              {link.name}
            </span>
            <span className="text-[6px] md:text-[8px] font-bold text-white/40 uppercase tracking-widest hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
              {link.en}
            </span>
          </Link>
        ))}
      </div>

      {/* 3. Action Node (Right) - Smart Adaptive Orange Button */}
      <div className="flex-1 flex justify-end">
        <Link href={isLoggedIn ? "/home" : "/login"}>
          <Button className="h-10 md:h-12 px-6 md:px-10 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[10px] md:text-[12px] shadow-xl active:scale-95 transition-all group overflow-hidden relative border-none">
            <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
            <div className="relative z-10 flex items-center gap-2">
              <span className="tracking-normal">{isLoggedIn ? "متابعة" : "انضم الآن"}</span>
              <Sparkles size={14} className="text-[#002d4d] animate-pulse hidden md:block" />
            </div>
          </Button>
        </Link>
      </div>

    </nav>
  );
}
