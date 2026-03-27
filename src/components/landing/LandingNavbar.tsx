
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, Globe } from "lucide-react";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const user = localStorage.getItem("namix_user");
    if (user) setIsLoggedIn(true);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12",
        isScrolled ? "py-4" : "py-8"
      )}
    >
      <div className={cn(
        "container mx-auto h-16 md:h-20 rounded-full transition-all duration-500 flex items-center justify-between px-8",
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20" : "bg-transparent"
      )}>
        
        {/* Logo Identity */}
        <Logo size="sm" className="scale-90 md:scale-100" />

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-10">
          {["الخدمات", "عن ناميكس", "المساعدة"].map((link, i) => (
            <Link 
              key={i} 
              href="#" 
              className="text-[11px] font-black text-[#002d4d]/60 hover:text-[#002d4d] transition-colors uppercase tracking-widest"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 opacity-40">
             <Globe size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">Global Access</span>
          </div>
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <Button className="h-10 md:h-12 px-6 md:px-8 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[11px] shadow-xl active:scale-95 transition-all group border-none relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}
