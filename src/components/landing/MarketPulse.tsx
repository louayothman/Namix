
"use client";

import React from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مُفاعل النبض المتتالي v4.0 - Floating Kinetic Waterfall
 * تم تحديث المحرك ليدعم حركة الطفو (Floating) المتزامنة مع الجريان الأفقي اللانهائي.
 * التصميم يعتمد على بطاقات زجاجية نانوية تعزز الهوية المؤسساتية لناميكس.
 */

const TOP_ROW_ICONS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOGE", "DOT", "LINK", 
  "SHIB", "MATIC", "BCH", "TRX", "LTC", "NEAR", "UNI", "STX", "FIL", "ATOM"
];

const BOTTOM_ROW_ICONS = [
  "LDO", "ICP", "IMX", "HBAR", "KAS", "ETC", "APT", "OP", "RNDR", "ARB",
  "VET", "TIA", "SUI", "FTM", "INJ", "PEPE", "THETA", "RUNE", "SEI", "GRT"
];

function IconNode({ name, delay }: { name: string, delay: number }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4 + delay, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
      className="shrink-0 group"
    >
      <div className="relative p-4 md:p-6 bg-white/40 backdrop-blur-md rounded-[28px] border border-white/60 shadow-sm hover:shadow-2xl hover:bg-white hover:border-[#002d4d]/10 transition-all duration-700 active:scale-95 cursor-pointer">
         {/* Glow Effect */}
         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[28px]" />
         
         <div className="relative z-10 transition-transform duration-500 group-hover:scale-125">
            <CryptoIcon name={name} size={40} className="md:size-[56px]" />
         </div>

         {/* Internal Pulse Dot */}
         <div className="absolute top-2 right-2 h-1 w-1 rounded-full bg-emerald-500/40 animate-pulse" />
      </div>
    </motion.div>
  );
}

export function MarketPulse() {
  return (
    <section className="w-full bg-[#fcfdfe] border-y border-gray-100 py-16 md:py-28 relative select-none overflow-hidden space-y-16 md:space-y-24">
      
      {/* 1. تدرج الحواف للتلاشي اللانهائي (Sovereign Fade) */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-80 bg-gradient-to-r from-[#fcfdfe] via-[#fcfdfe]/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-80 bg-gradient-to-l from-[#fcfdfe] via-[#fcfdfe]/80 to-transparent z-20 pointer-events-none" />

      {/* 2. شلال الصف العلوي - جريان لليسار */}
      <div className="flex overflow-hidden group/top">
        <div className="flex items-center gap-8 md:gap-16 animate-marquee-seamless px-10 whitespace-nowrap">
          {[...TOP_ROW_ICONS, ...TOP_ROW_ICONS].map((icon, idx) => (
            <IconNode key={`${icon}-${idx}`} name={icon} delay={idx * 0.1} />
          ))}
        </div>
      </div>

      {/* 3. شلال الصف السفلي - جريان لليمين */}
      <div className="flex overflow-hidden group/bottom">
        <div className="flex items-center gap-8 md:gap-16 animate-marquee-reverse-seamless px-10 whitespace-nowrap">
          {[...BOTTOM_ROW_ICONS, ...BOTTOM_ROW_ICONS].map((icon, idx) => (
            <IconNode key={`${icon}-${idx}`} name={icon} delay={idx * 0.15} />
          ))}
        </div>
      </div>

      {/* 4. التوقيع التقني السفلي (Subtle Branding) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-5 pointer-events-none">
         <div className="h-px w-20 bg-[#002d4d]" />
         <span className="text-[8px] font-black uppercase tracking-[1em] text-[#002d4d] mr-[-1em]">Liquidity Pulse</span>
         <div className="h-px w-20 bg-[#002d4d]" />
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
          animation: marquee-seamless 50s linear infinite;
        }
        .animate-marquee-reverse-seamless {
          animation: marquee-reverse-seamless 50s linear infinite;
        }
        /* إبطاء السرعة عند التحليق لتعزيز التفاعل الاستكشافي */
        .group/top:hover .animate-marquee-seamless,
        .group/bottom:hover .animate-marquee-reverse-seamless {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
