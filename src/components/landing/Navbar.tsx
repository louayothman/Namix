
"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "@/components/layout/Logo";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * @fileOverview القائمة العلوية المينيماليست v2.0
 */
export function Navbar({ onAboutClick }: { onAboutClick: () => void }) {
  const { scrollY } = useScroll();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(16px)"]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.nav 
      style={{ backgroundColor, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed top-0 left-0 right-0 h-24 z-[100] transition-all flex items-center"
    >
      <div className="container mx-auto h-full flex items-center justify-between px-8">
        <div className="flex items-center gap-12">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <button 
              onClick={onAboutClick}
              className="text-[10px] font-black text-[#002d4d]/50 hover:text-[#002d4d] uppercase tracking-wider transition-all outline-none"
            >
              عن ناميكس
            </button>
            <Link href="/faq" className="text-[10px] font-black text-[#002d4d]/50 hover:text-[#002d4d] uppercase tracking-wider transition-all">المساعدة</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <button className="h-12 px-10 rounded-full bg-[#002d4d] text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#001d33] transition-all active:scale-95">
              {isLoggedIn ? "لوحة التحكم" : "دخول"}
            </button>
          </Link>
        </div>
      </div>
      
      {/* Dynamic Border */}
      <motion.div 
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gray-100" 
      />
    </motion.nav>
  );
}
