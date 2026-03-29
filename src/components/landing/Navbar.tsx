
"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "@/components/layout/Logo";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navbar({ onAboutClick }: { onAboutClick: () => void }) {
  const { scrollY } = useScroll();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.nav 
      style={{ backgroundColor, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed top-0 left-0 right-0 h-20 z-[100] transition-all border-none"
    >
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={onAboutClick}
              className="text-[10px] font-black text-[#002d4d]/60 hover:text-[#002d4d] uppercase tracking-normal transition-colors outline-none"
            >
              عن ناميكس
            </button>
            <Link href="/faq" className="text-[10px] font-black text-[#002d4d]/60 hover:text-[#002d4d] uppercase tracking-normal transition-colors">المساعدة</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <button className="h-11 px-8 rounded-full bg-[#002d4d] text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#001d33] transition-all active:scale-95">
              {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
