
"use client";

import React from "react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

/**
 * @fileOverview HeroHeader Component - Tactical Insight Edition v4.0
 * تم إضافة بوابة التحليل الذكي بجانب زر الدخول لجذب الزوار وتعزيز الظهور في محركات البحث.
 */
export function HeroHeader() {
  return (
    <div className="absolute top-8 md:top-12 left-0 right-0 px-8 md:px-20 flex items-center justify-between z-[100]">
      
      {/* LEFT: Identity Actions Matrix */}
      <div className="flex items-center gap-8 md:gap-12">
        <Link href="/login">
          <button className="relative outline-none group bg-transparent border-none">
            <span className="text-sm md:text-lg font-black uppercase tracking-[0.3em] text-[#002d4d] drop-shadow-sm transition-colors hover:text-[#f9a885]">
              دخول
            </span>
          </button>
        </Link>

        {/* Public Insight Portal (Namix AI Prophet) */}
        <Link href="/market/BTCUSDT">
          <button className="relative flex items-center gap-2 group outline-none bg-transparent border-none">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#002d4d] transition-colors">
              التحليل الذكي
            </span>
            <Activity size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </Link>
      </div>

      {/* RIGHT: Sovereign Enlarged Logo */}
      <div className="flex items-center gap-3 transition-transform duration-500 hover:scale-105">
        <Logo size="md" animate={true} />
      </div>
    </div>
  );
}
