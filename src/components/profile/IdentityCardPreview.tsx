
"use client";

import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
  onAssetsLoad?: () => void;
}

/**
 * @fileOverview SilkWaveEngine v5.0 - Pixel Perfect Matching
 * محرك رسم التموجات الحريرية المطور لمحاكاة الصورة المرفقة بدقة 100%.
 */
const SilkWaves = () => {
  return (
    <svg
      viewBox="0 0 800 500"
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6E6A63" stopOpacity="0" />
          <stop offset="50%" stopColor="#6E6A63" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6E6A63" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <g transform="translate(0, 50)">
        {/* الحزمة الرئيسية - Ribbon Wave */}
        {[...Array(25)].map((_, i) => (
          <path
            key={`main-${i}`}
            d={`M -100 ${450 + i * 2} C 150 ${500 + i * 2}, 450 ${50 + i * 2}, 950 ${350 + i * 2}`}
            stroke="url(#waveGradient)"
            strokeWidth="0.6"
            fill="none"
            opacity={0.1 + (i * 0.01)}
          />
        ))}

        {/* الحزمة الخلفية العريضة - Soft Ambient Wave */}
        {[...Array(15)].map((_, i) => (
          <path
            key={`bg-${i}`}
            d={`M -100 ${500 + i * 5} C 200 ${550 + i * 5}, 600 ${200 + i * 5}, 1000 ${450 + i * 5}`}
            stroke="#6E6A63"
            strokeWidth="0.4"
            fill="none"
            opacity={0.03}
          />
        ))}
      </g>
    </svg>
  );
};

export function IdentityCardPreview({
  user,
  invitationLink,
  onAssetsLoad
}: IdentityCardPreviewProps) {
  
  useEffect(() => {
    // إرسال إشارة الجاهزية فور رندر المكون البرمجي
    const timer = setTimeout(() => {
      onAssetsLoad?.();
    }, 500);
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
      
      {/* Background Logic: Ivory Silk Gradient with Code-Generated Waves */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#ffffff_0%,_#f5f1ea_70%,_#e9e3db_100%)]" />
        <SilkWaves />
      </div>

      {/* Header: NAMIX.pro Straight Bold Edition */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <div className="flex items-baseline leading-none">
          <span className="text-[72px] font-black tracking-tighter" style={{ color: '#6E6A63', fontWeight: 950 }}>NAMIX</span>
          <span className="text-[36px] font-bold opacity-40 ml-1" style={{ color: '#6E6A63' }}>.pro</span>
        </div>
        
        {/* Nano Grid Dots: Top Right */}
        <div className="grid grid-cols-2 gap-1.5 pt-6 pr-4 opacity-[0.1]">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#6E6A63]" />
           ))}
        </div>
      </div>

      {/* Footer Identity: Name & Spaced ID */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-4 flex-1 pr-10">
           <p className="text-[15px] font-black uppercase tracking-[0.4em] leading-none" style={{ color: 'rgba(110, 106, 99, 0.5)' }}>
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[52px] font-black tabular-nums tracking-normal leading-none whitespace-nowrap" style={{ color: '#6E6A63' }}>
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Minimal QR Node */}
        <div className="shrink-0 p-2 opacity-60 mb-1">
           <QRCodeSVG 
             value={invitationLink} 
             size={100} 
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
