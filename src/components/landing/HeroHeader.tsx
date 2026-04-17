
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * @fileOverview HeroHeader Component - Minimalist Identity Node
 * Logo on the right, Pure Text-only shimmering login button on the left.
 */
export function HeroHeader() {
  return (
    <div className="absolute top-10 left-0 right-0 px-8 md:px-16 flex items-center justify-between z-[100]">
      {/* LEFT: Pure Text Shimmer Login */}
      <Link href="/login">
        <button className="relative px-6 py-2 outline-none group bg-transparent border-none">
          <motion.span 
            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-[#002d4d] via-[#f9a885] to-[#002d4d] bg-[length:400%_auto] bg-clip-text text-transparent"
          >
            دخول
          </motion.span>
        </button>
      </Link>

      {/* RIGHT: Sovereign Logo */}
      <div className="flex items-center gap-3">
        <Logo size="sm" animate={true} />
      </div>
    </div>
  );
}
