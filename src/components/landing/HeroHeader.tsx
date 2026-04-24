
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";

/**
 * @fileOverview HeroHeader Component - Static Minimalist Edition v3.0
 * تم إزالة اللمعان والرسوم المتحركة من زر الدخول لجعله نصاً صريحاً وفخماً.
 */
export function HeroHeader() {
  return (
    <div className="absolute top-8 md:top-12 left-0 right-0 px-8 md:px-20 flex items-center justify-between z-[100]">
      {/* LEFT: Plain Static Text Login */}
      <Link href="/login">
        <button className="relative px-4 py-2 outline-none group bg-transparent border-none">
          <span className="text-sm md:text-lg font-black uppercase tracking-[0.3em] text-[#002d4d] drop-shadow-sm transition-colors hover:text-[#f9a885]">
            دخول
          </span>
        </button>
      </Link>

      {/* RIGHT: Sovereign Enlarged Logo */}
      <div className="flex items-center gap-3 transition-transform duration-500 hover:scale-105">
        <Logo size="md" animate={true} />
      </div>
    </div>
  );
}
