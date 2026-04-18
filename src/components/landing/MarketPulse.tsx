
"use client";

import React from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل النبض المتتالي v3.0 - Seamless Iconic Waterfall
 * تم تحديث المحرك ليدعم الحركة المتصلة (Infinite Seamless Loop) بدون انقطاع.
 * تم توسيع المصفوفة لتشمل تنوعاً ضخماً من العملات العالمية.
 */

const TOP_ROW_ICONS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOGE", "DOT", "LINK", 
  "SHIB", "MATIC", "BCH", "TRX", "LTC", "NEAR", "UNI", "STX", "FIL", "ATOM"
];

const BOTTOM_ROW_ICONS = [
  "LDO", "ICP", "IMX", "HBAR", "KAS", "ETC", "APT", "OP", "RNDR", "ARB",
  "VET", "TIA", "SUI", "FTM", "INJ", "PEPE", "THETA", "RUNE", "SEI", "GRT"
];

export function MarketPulse() {
  return (
    <section className="w-full bg-white border-y border-gray-50 py-12 md:py-20 relative select-none overflow-hidden space-y-12 md:space-y-16">
      
      {/* 1. تدرج الحواف لتأثير الانسياب اللانهائي - Fade to Infinity */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

      {/* 2. الشريط العلوي - يتحرك لليسار بنظام الحلقة المتصلة */}
      <div className="flex overflow-hidden group">
        <div className="flex items-center gap-16 md:gap-28 animate-marquee-seamless px-10 whitespace-nowrap">
          {/* تكرار المصفوفة لضمان الاتصال البصري اللانهائي */}
          {[...TOP_ROW_ICONS, ...TOP_ROW_ICONS].map((icon, idx) => (
            <div key={`${icon}-${idx}`} className="shrink-0 transition-all duration-700 hover:scale-125 hover:drop-shadow-[0_0_25px_rgba(249,168,133,0.4)]">
              <CryptoIcon name={icon} size={48} className="md:size-[64px]" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. الشريط السفلي - يتحرك لليمين بنظام الحلقة المتصلة */}
      <div className="flex overflow-hidden group">
        <div className="flex items-center gap-16 md:gap-28 animate-marquee-reverse-seamless px-10 whitespace-nowrap">
          {/* تكرار المصفوفة لضمان الاتصال البصري اللانهائي */}
          {[...BOTTOM_ROW_ICONS, ...BOTTOM_ROW_ICONS].map((icon, idx) => (
            <div key={`${icon}-${idx}`} className="shrink-0 transition-all duration-700 hover:scale-125 hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
              <CryptoIcon name={icon} size={48} className="md:size-[64px]" />
            </div>
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
          animation: marquee-seamless 40s linear infinite;
        }
        .animate-marquee-reverse-seamless {
          animation: marquee-reverse-seamless 40s linear infinite;
        }
        /* إبطاء الحركة عند التحليق لتعزيز التفاعل */
        .group:hover .animate-marquee-seamless,
        .group:hover .animate-marquee-reverse-seamless {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
