
"use client";

import React from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion } from "framer-motion";

/**
 * @fileOverview مُفاعل النبض المتتالي v7.0 - Seamless Motion Engine
 * تم استخدام Framer Motion لضمان حركة لانهائية حقيقية (Seamless Loop) بدون أي قفزات.
 * يعرض 30 عملة عالمية كبرى موزعة على صفين متساويين بنقاء بصري مطلق.
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

      {/* الصف العلوي - تدفق لليسار (Seamless Loop) */}
      <div className="flex overflow-hidden">
        <motion.div 
          className="flex items-center gap-12 md:gap-20 whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{ 
            duration: 50, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {/* تكرار المصفوفة لضمان استمرارية الحركة دون فراغات */}
          {[...ROW_1_ICONS, ...ROW_1_ICONS].map((icon, idx) => (
            <IconNode key={`r1-${icon}-${idx}`} name={icon} />
          ))}
        </motion.div>
      </div>

      {/* الصف السفلي - تدفق لليمين (Seamless Loop) */}
      <div className="flex overflow-hidden">
        <motion.div 
          className="flex items-center gap-12 md:gap-20 whitespace-nowrap"
          initial={{ x: "-50%" }}
          animate={{ x: [ "-50%", "0%"] }}
          transition={{ 
            duration: 50, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...ROW_2_ICONS, ...ROW_2_ICONS].map((icon, idx) => (
            <IconNode key={`r2-${icon}-${idx}`} name={icon} />
          ))}
        </motion.div>
      </div>

    </section>
  );
}
