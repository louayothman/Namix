
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * @fileOverview HeroHeader Component - Minimalist Identity Node v2.0
 * Logo on the right (Enlarged), Pure Text-only shimmering login button on the left (Enlarged).
 * تضخيم العناصر لضمان مظهر مؤسساتي فخم يتناسب مع كبرى المنصات.
 */
export function HeroHeader() {
  return (
    <div className="absolute top-8 md:top-12 left-0 right-0 px-8 md:px-20 flex items-center justify-between z-[100]">
      {/* LEFT: Enlarged Pure Text Shimmer Login */}
      <Link href="/login">
        <button className="relative px-4 py-2 outline-none group bg-transparent border-none">
          <motion.span 
            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-sm md:text-lg font-black uppercase tracking-[0.3em] bg-gradient-to-r from-[#002d4d] via-[#f9a885] to-[#002d4d] bg-[length:400%_auto] bg-clip-text text-transparent drop-shadow-sm"
          >
            دخول
          </motion.span>
        </button>
      </Link>

      {/* RIGHT: Sovereign Enlarged Logo */}
      <div className="flex items-center gap-3 transition-transform duration-500 hover:scale-105">
        <Logo size="md" animate={true} />
      </div>
    </div>
  );
}
