
"use client";

import React from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل النبض المتتالي v2.0 - Seamless Iconic Waterfall
 * تم تحديث المحرك ليدعم الحركة المتصلة (Infinite Loop) بدون انقطاع.
 * تم تطهير المصفوفة لضمان ظهور كافة الأيقونات بدقة عالية.
 */

const TOP_ROW_ICONS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOGE", "DOT", "LINK", "SHIB", "MATIC", "BCH", "TRX", "LTC"
];

const BOTTOM_ROW_ICONS = [
  "NEAR", "UNI", "STX", "FIL", "ATOM", "LDO", "ICP", "IMX", "HBAR", "KAS", "ETC", "APT", "OP", "RNDR", "ARB"
];

export function MarketPulse() {
  return (
    <section className="w-full bg-white border-y border-gray-50 py-12 md:py-20 relative select-none overflow-hidden space-y-12 md:space-y-16">
      {/* 1. تدرج الحواف لتأثير الانسياب اللانهائي */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

      {/* 2. الشريط العلوي - يتحرك لليسار بنظام الحلقة المتصلة */}
      <div className="flex overflow-hidden group">
        <div className="flex items-center gap-16 md:gap-28 animate-marquee-continuous px-10 whitespace-nowrap">
          {/* تكرار المصفوفة لضمان الاتصال البصري */}
          {[...TOP_ROW_ICONS, ...TOP_ROW_ICONS].map((icon, idx) => (
            <div key={`${icon}-${idx}`} className="shrink-0 transition-all duration-700 hover:scale-125 hover:drop-shadow-[0_0_20px_rgba(249,168,133,0.4)]">
              <CryptoIcon name={icon} size={44} className="md:size-[60px]" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. الشريط السفلي - يتحرك لليمين بنظام الحلقة المتصلة */}
      <div className="flex overflow-hidden group">
        <div className="flex items-center gap-16 md:gap-28 animate-marquee-reverse-continuous px-10 whitespace-nowrap">
          {/* تكرار المصفوفة لضمان الاتصال البصري */}
          {[...BOTTOM_ROW_ICONS, ...BOTTOM_ROW_ICONS].map((icon, idx) => (
            <div key={`${icon}-${idx}`} className="shrink-0 transition-all duration-700 hover:scale-125 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <CryptoIcon name={icon} size={44} className="md:size-[60px]" />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-continuous {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse-continuous {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-continuous {
          animation: marquee-continuous 60s linear infinite;
        }
        .animate-marquee-reverse-continuous {
          animation: marquee-reverse-continuous 60s linear infinite;
        }
        /* إيقاف الحركة مؤقتاً عند التفاعل لتعزيز الشعور بالسيطرة */
        .group:hover .animate-marquee-continuous,
        .group:hover .animate-marquee-reverse-continuous {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
