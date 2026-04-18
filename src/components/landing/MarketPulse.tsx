
"use client";

import React from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل النبض المتتالي v1.0 - Iconic Waterfall
 * يتكون من شريطين متحركين بعكس الاتجاه يحتويان على أيقونات العملات الرقمية فقط.
 */

const TOP_ROW_ICONS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "USDC", "ADA", "AVAX", "DOGE", "DOT", "LINK", "SHIB", "MATIC", "DAI", "BCH"
];

const BOTTOM_ROW_ICONS = [
  "TRX", "LTC", "NEAR", "UNI", "STX", "FIL", "ATOM", "LDO", "ICP", "IMX", "HBAR", "KAS", "ETC", "APT", "OP"
];

export function MarketPulse() {
  return (
    <section className="w-full bg-white border-y border-gray-50 py-10 md:py-16 relative select-none overflow-hidden space-y-10 md:space-y-12">
      {/* 1. تدرج الحواف لتأثير الانبثاق البصري */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

      {/* 2. الشريط العلوي - يتحرك لليسار */}
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-12 md:gap-24 px-10">
          {[...TOP_ROW_ICONS, ...TOP_ROW_ICONS].map((icon, idx) => (
            <div key={idx} className="shrink-0 transition-all duration-700 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(249,168,133,0.3)]">
              <CryptoIcon name={icon} size={48} className="md:size-[64px]" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. الشريط السفلي - يتحرك لليمين (معكوس) */}
      <div className="flex whitespace-nowrap animate-marquee-reverse">
        <div className="flex items-center gap-12 md:gap-24 px-10">
          {[...BOTTOM_ROW_ICONS, ...BOTTOM_ROW_ICONS].map((icon, idx) => (
            <div key={idx} className="shrink-0 transition-all duration-700 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <CryptoIcon name={icon} size={48} className="md:size-[64px]" />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 50s linear infinite;
        }
      `}</style>
    </section>
  );
}
