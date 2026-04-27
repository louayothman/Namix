
"use client";

import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
  onAssetsLoad?: () => void;
}

/**
 * WaveLines - محرك الرسوم المتموجة المطور v5.0
 * تم تحويل الخطوط لمنحنيات Cubic Bezier لزيادة التموج وحقن مصفوفة إضافية في الزاوية اليمنى.
 */
const WaveLines = () => {
  return (
    <svg
      viewBox="0 0 600 378"
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* مصفوفة التدفق الرئيسية من الأسفل واليسار - 30 خطاً أكثر تموجاً */}
      {[...Array(30)].map((_, i) => (
        <motion.path
          key={`main-${i}`}
          d={`M -50 ${250 + i * 4} C 150 ${50 + i * 2}, 350 ${400 + i * 5}, 650 ${100 + i * 3}`}
          stroke={`rgba(110, 106, 99, ${0.02 + i * 0.006})`}
          strokeWidth="0.5"
          fill="none"
          animate={{
            d: [
              `M -50 ${250 + i * 4} C 150 ${50 + i * 2}, 350 ${400 + i * 5}, 650 ${100 + i * 3}`,
              `M -50 ${265 + i * 4} C 180 ${30 + i * 2}, 320 ${420 + i * 5}, 650 ${115 + i * 3}`,
              `M -50 ${250 + i * 4} C 150 ${50 + i * 2}, 350 ${400 + i * 5}, 650 ${100 + i * 3}`
            ]
          }}
          transition={{
            duration: 9 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* مصفوفة التدفق الثانوية في الزاوية العلوية اليمنى - 15 خطاً */}
      {[...Array(15)].map((_, i) => (
        <motion.path
          key={`corner-${i}`}
          d={`M 400 ${-20 + i * 3} C 500 ${80 + i * 5}, 550 ${-10 + i * 2}, 650 ${120 + i * 4}`}
          stroke={`rgba(110, 106, 99, ${0.01 + i * 0.004})`}
          strokeWidth="0.4"
          fill="none"
          animate={{
            d: [
              `M 400 ${-20 + i * 3} C 500 ${80 + i * 5}, 550 ${-10 + i * 2}, 650 ${120 + i * 4}`,
              `M 410 ${-10 + i * 3} C 480 ${100 + i * 5}, 570 ${-30 + i * 2}, 640 ${130 + i * 4}`,
              `M 400 ${-20 + i * 3} C 500 ${80 + i * 5}, 550 ${-10 + i * 2}, 650 ${120 + i * 4}`
            ]
          }}
          transition={{
            duration: 11 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </svg>
  );
};

export function IdentityCardPreview({
  user,
  invitationLink,
  onAssetsLoad
}: IdentityCardPreviewProps) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onAssetsLoad?.();
    }, 600);
    return () => clearTimeout(timer);
  }, [onAssetsLoad]);

  const formatId = (id: string) => {
    if (!id) return "00 00 00 00 00";
    const cleanId = id.replace(/\s/g, '');
    const parts = [];
    for (let i = 0; i < cleanId.length; i += 2) {
      parts.push(cleanId.slice(i, i + 2));
    }
    return parts.join('   ');
  };

  return (
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-[#f5f1ea] flex flex-col justify-between shadow-2xl p-0 font-sans select-none rounded-[24px]" dir="ltr">
      
      {/* 1. Background Logic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_#ffffff_0%,_#f5f1ea_55%,_#e9e3db_100%)]" />
        <WaveLines />
        <div className="absolute inset-0 backdrop-blur-[0.5px] opacity-10" />
      </div>

      {/* 2. Brand Identity Header - NAMIX.pro Elite Edition */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <h1 className="flex items-baseline tracking-tighter leading-none uppercase" style={{ color: '#6E6A63' }}>
          <span className="text-[64px] font-black" style={{ fontWeight: 950 }}>NAMIX</span>
          <span className="text-[32px] font-bold opacity-40 ml-1">.pro</span>
        </h1>
        
        {/* Nano Decorative Grid Dots */}
        <div className="grid grid-cols-2 gap-1.5 pt-6 pr-4 opacity-[0.08]">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#6E6A63]" />
           ))}
        </div>
      </div>

      {/* 3. Identity Information Footer */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-3 flex-1 pr-10">
           <p className="text-[16px] font-black uppercase tracking-[0.3em] leading-none" style={{ color: 'rgba(110, 106, 99, 0.4)' }}>
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[48px] font-black tabular-nums tracking-normal leading-none whitespace-nowrap" style={{ color: '#6E6A63' }}>
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Dynamic QR Node */}
        <div className="shrink-0 p-2 bg-white/5 backdrop-blur-md rounded-[20px] border border-white/10">
           <QRCodeSVG 
             value={invitationLink} 
             size={90} 
             bgColor={"transparent"} 
             fgColor={"#6E6A63"} 
             level={"M"} 
             includeMargin={false} 
           />
        </div>
      </div>
    </div>
  );
}
