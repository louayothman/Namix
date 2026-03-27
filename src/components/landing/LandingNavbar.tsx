
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { LandingBarIntro } from "./LandingBarIntro";

/**
 * @fileOverview شريط الملاحة العالمي v8.0 - Integrated Grey-Blue Edition
 * تم تحديث اللون للخلفية المعتمدة #7D8E9E مع أزرار برتقالية وتنسيق مدمج.
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
    <nav className="absolute top-0 left-0 right-0 z-[1000] w-full bg-[#7D8E9E] h-20 md:h-28 flex items-center justify-between select-none border-none shadow-none overflow-hidden">
      
      {/* 1. Identity Node (Right Edge) */}
      <div className="h-full flex items-center justify-start">
        <LandingBarIntro />
      </div>

      {/* 2. Navigation Matrix (Center) */}
      <div className="hidden md:flex items-center justify-center gap-10" dir="rtl">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className="flex flex-col items-center group transition-all"
          >
            <span className="text-[14px] font-black text-[#002d4d] group-hover:text-white transition-all tracking-normal whitespace-nowrap">
              {link.name}
            </span>
            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {link.en}
            </span>
          </Link>
        ))}
      </div>

      {/* 3. Action Node (Left Edge) */}
      <div className="pl-6 md:pl-12 flex items-center gap-4">
        {/* Mobile direct links - Optimized spacing */}
        <div className="flex md:hidden items-center gap-4 ml-2" dir="rtl">
           {navLinks.slice(0, 2).map((link) => (
             <Link key={link.name} href={link.href} className="text-[11px] font-black text-[#002d4d]">{link.name}</Link>
           ))}
        </div>

        <Link href={isLoggedIn ? "/home" : "/login"}>
          <Button className="h-11 md:h-14 px-6 md:px-10 rounded-full bg-[#f9a885] hover:bg-[#002d4d] hover:text-white text-[#002d4d] font-black text-[11px] md:text-[13px] shadow-xl active:scale-95 transition-all group overflow-hidden relative border-none">
            <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
            <div className="relative z-10 flex items-center gap-2">
              <span className="tracking-normal">{isLoggedIn ? "متابعة" : "انضم الآن"}</span>
              <Sparkles size={14} className="text-current animate-pulse hidden md:block" />
            </div>
          </Button>
        </Link>
      </div>

    </nav>
  );
}
