"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ChevronLeft } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 md:py-10">
      <div className="container mx-auto flex items-center justify-between">
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Logo size="md" className="brightness-200" />
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <Link href="/login">
            <Button className="h-12 md:h-14 px-8 md:px-10 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[13px] shadow-2xl shadow-orange-900/20 active:scale-95 transition-all group border-none relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                انضم الآن
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </header>
  );
}