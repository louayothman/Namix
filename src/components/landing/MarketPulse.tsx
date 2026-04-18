
"use client";

import React from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل النبض المتتالي v6.0 - Perfect Seamless Loop
 * تم إصلاح مشكلة القفزة البصرية عبر إزالة الـ Padding والاعتماد على Gap ثابت.
 * يحتوي على 30 عملة عالمية كبرى (15 لكل صف) نضمن ظهور أيقوناتها الملونة.
 */

const ROW_1_ICONS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOGE", "DOT", "LINK", 
  "MATIC", "SHIB", "DAI", "LTC", "BCH"
];

const ROW_2_ICONS = [
  "NEAR", "UNI", "STX", "FIL", "ATOM", "ICP", "LDO", "HBAR", "APT", "OP", 
  "ARB", "VET", "TIA", "SUI", "FTM"
];

function IconNode({ name }: { name: string }) {
  return (
    <div className="shrink-0 group">
      <div className="relative p-2 transition-transform duration-500 group-hover:scale-125 cursor-pointer">
         <CryptoIcon name={name} size={48} className="md:size-[64px]" />
      </div>
    </div>
  );
}

export function MarketPulse() {
  return (
    <section className="w-full bg-transparent py-12 md:py-20 relative select-none overflow-hidden space-y-12 md:space-y-16">
      
      {/* تدرج الحواف للتلاشي اللانهائي (Sovereign Fade) */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-white via-white/40 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none" />

      {/* الصف العلوي - تدفق لليسار */}
      <div className="flex overflow-hidden group/top">
        <div className="flex items-center gap-12 md:gap-20 animate-marquee-seamless whitespace-nowrap w-max">
          {[...ROW_1_ICONS, ...ROW_1_ICONS].map((icon, idx) => (
            <IconNode key={`r1-${icon}-${idx}`} name={icon} />
          ))}
        </div>
      </div>

      {/* الصف السفلي - تدفق لليمين */}
      <div className="flex overflow-hidden group/bottom">
        <div className="flex items-center gap-12 md:gap-20 animate-marquee-reverse-seamless whitespace-nowrap w-max">
          {[...ROW_2_ICONS, ...ROW_2_ICONS].map((icon, idx) => (
            <IconNode key={`r2-${icon}-${idx}`} name={icon} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-seamless {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse-seamless {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-seamless {
          animation: marquee-seamless 60s linear infinite;
        }
        .animate-marquee-reverse-seamless {
          animation: marquee-reverse-seamless 60s linear infinite;
        }
        /* توقف مؤقت عند التفاعل لزيادة التركيز */
        .group/top:hover .animate-marquee-seamless,
        .group/bottom:hover .animate-marquee-reverse-seamless {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
