"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

export function LandingNavbar() {
  const navLinks = [
    { name: "الرئيسية", href: "#" },
    { name: "عن ناميكس", href: "#" },
    { name: "الخدمات", href: "#" },
    { name: "تواصل معنا", href: "#" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-[100] px-6 py-8 md:px-24">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Right Side: Logo */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo size="md" className="brightness-200" />
        </motion.div>

        {/* Left Side: Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <Link 
                href={link.href} 
                className="text-[14px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-normal"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Icon (Placeholder for now) */}
        <div className="md:hidden">
           <div className="h-1 w-6 bg-white rounded-full mb-1.5" />
           <div className="h-1 w-4 bg-white rounded-full ml-auto" />
        </div>

      </div>
    </header>
  );
}