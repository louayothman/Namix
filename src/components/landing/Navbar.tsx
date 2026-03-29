
"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navbar() {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]);
  const borderBottom = useTransform(scrollY, [0, 100], ["1px solid rgba(0,0,0,0)", "1px solid rgba(0,0,0,0.05)"]);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.nav 
      style={{ backgroundColor, borderBottom, backdropFilter: blur, WebkitBackdropFilter: blur }}
      className="fixed top-0 left-0 right-0 h-20 z-[100] transition-all"
    >
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-[10px] font-black text-[#002d4d]/60 hover:text-[#002d4d] uppercase tracking-widest transition-colors">عن ناميكس</Link>
            <Link href="/academy" className="text-[10px] font-black text-[#002d4d]/60 hover:text-[#002d4d] uppercase tracking-widest transition-colors">الأكاديمية</Link>
            <Link href="/faq" className="text-[10px] font-black text-[#002d4d]/60 hover:text-[#002d4d] uppercase tracking-widest transition-colors">المساعدة</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="h-10 px-6 rounded-full bg-[#002d4d] text-white font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#001d33] transition-all active:scale-95">
              دخول المستثمرين
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
