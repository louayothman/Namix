
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
 * WaveLines - محرك الرسوم المتموجة المطور
 * تم استخدام اللون #6E6A63 كأساس للخطوط الشعرية لضمان التناغم.
 */
const WaveLines = () => {
  return (
    <svg
      viewBox="0 0 600 378"
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      preserveAspectRatio="none"
    >
      {[...Array(30)].map((_, i) => (
        <motion.path
          key={i}
          d={`M -50 ${200 + i * 4} Q 300 ${20 + i * 3}, 650 ${150 + i * 4}`}
          stroke={`rgba(110, 106, 99, ${0.03 + i * 0.01})`}
          strokeWidth="0.6"
          fill="none"
          animate={{
            d: [
              `M -50 ${200 + i * 4} Q 300 ${20 + i * 3}, 650 ${150 + i * 4}`,
              `M -50 ${210 + i * 4} Q 300 ${10 + i * 3}, 650 ${160 + i * 4}`,
              `M -50 ${200 + i * 4} Q 300 ${20 + i * 3}, 650 ${150 + i * 4}`
            ]
          }}
          transition={{
            duration: 8 + i * 0.2,
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

      {/* 2. Brand Identity Header - Ultra Bold & Static Color */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <h1 className="text-[64px] font-black tracking-tighter leading-none uppercase" style={{ fontWeight: 950, color: '#6E6A63' }}>
          NAMIX
        </h1>
        
        {/* Decorative Grid Dots */}
        <div className="grid grid-cols-2 gap-3 pt-6 pr-4 opacity-[0.08]">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-6 h-6 rounded-full bg-[#6E6A63]" />
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
