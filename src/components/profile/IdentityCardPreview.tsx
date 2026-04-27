
"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
}

/**
 * @fileOverview IdentityCardPreview - Luxury Ripple Edition v7.0
 * تصميم متطور يعتمد على التموجات العضوية الشاملة مع دمج كامل للعناصر دون انقطاع لوني.
 */
export function IdentityCardPreview({
  user,
  invitationLink
}: IdentityCardPreviewProps) {
  
  const formatId = (id: string) => {
    if (!id) return "00 00 00 00 00";
    const cleanId = id.replace(/\s/g, '');
    const parts = [];
    for (let i = 0; i < cleanId.length; i += 2) {
      parts.push(cleanId.slice(i, i + 2));
    }
    return parts.join(' ');
  };

  return (
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-[#f4f1ea] flex flex-col justify-between shadow-2xl p-0 font-sans select-none" dir="ltr">
      
      {/* 1. Integrated Organic Waves - تغطي كامل المساحة */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg viewBox="0 0 600 378" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           <rect width="600" height="378" fill="url(#mainCreamGradient)" />
           
           {/* طبقة التموجات الرمادية والذهبية المتداخلة */}
           <g opacity="0.4">
              <path d="M-100 200C50 150 250 350 450 180C550 120 700 200 800 100" stroke="url(#waveGray)" strokeWidth="0.5" fill="none" />
              <path d="M-100 220C60 170 280 370 480 200C580 140 730 220 830 120" stroke="url(#waveGold)" strokeWidth="0.5" fill="none" />
              <path d="M-100 240C70 190 310 390 510 220C610 160 760 240 860 140" stroke="url(#waveGray)" strokeWidth="1" fill="none" />
              <path d="M-100 260C80 210 340 410 540 240C640 180 790 260 890 160" stroke="url(#waveGold)" strokeWidth="0.5" fill="none" />
              <path d="M-100 280C90 230 370 430 570 260C670 200 820 280 920 180" stroke="url(#waveGray)" strokeWidth="0.5" fill="none" />
              <path d="M-100 300C100 250 400 450 600 280C700 220 850 300 950 200" stroke="url(#waveGold)" strokeWidth="1" fill="none" />
              <path d="M-100 320C110 270 430 470 630 300C730 240 880 320 980 220" stroke="url(#waveGray)" strokeWidth="0.5" fill="none" />
              <path d="M-100 340C120 290 460 490 660 320C760 260 910 340 1010 240" stroke="url(#waveGold)" strokeWidth="0.5" fill="none" />
              <path d="M-100 360C130 310 490 510 690 340C790 280 940 360 1040 260" stroke="url(#waveGray)" strokeWidth="1" fill="none" />
           </g>

           <defs>
              <linearGradient id="mainCreamGradient" x1="0" y1="0" x2="600" y2="378" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f4f1ea" />
                <stop offset="1" stopColor="#e2ded3" />
              </linearGradient>
              <linearGradient id="waveGray" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="transparent" />
                <stop offset="0.5" stopColor="#b0af9e" />
                <stop offset="1" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="waveGold" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="transparent" />
                <stop offset="0.5" stopColor="#d4af37" opacity="0.3" />
                <stop offset="1" stopColor="transparent" />
              </linearGradient>
           </defs>
        </svg>
      </div>

      {/* 2. Header Section - Brand & Identity Mark */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <h1 className="text-[58px] font-black text-[#3d3d3d] tracking-tighter leading-none italic">NAMIX</h1>
        
        <div className="grid grid-cols-2 gap-2.5 pt-4 pr-2 opacity-60">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-5 h-5 rounded-full bg-[#3d3d3d]/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />
           ))}
        </div>
      </div>

      {/* 3. Footer Section - Unified Flow */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-2 flex-1">
           <p className="text-[20px] font-bold text-[#3d3d3d]/40 uppercase tracking-widest">
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[46px] font-black text-[#3d3d3d] tabular-nums tracking-normal leading-none">
              {formatId(user?.namixId)}
           </p>
        </div>

        <div className="shrink-0 ml-10 p-2 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10">
           <QRCodeSVG 
             value={invitationLink} 
             size={90} 
             bgColor={"transparent"} 
             fgColor={"#3d3d3d"} 
             level={"M"} 
             includeMargin={false} 
           />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
