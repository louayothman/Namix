
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
 * @fileOverview IdentityCardPreview - Static Asset Edition v8.0
 * يعتمد هذا المكون الآن على خلفية خارجية (card-bg.png) لضمان المطابقة البصرية التامة.
 * تم تنسيق Namix ID ليشغل المساحة السفلية بجانب الـ QR بوضوح نخبوي.
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
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-white flex flex-col justify-between shadow-2xl p-0 font-sans select-none rounded-[24px]" dir="ltr">
      
      {/* 1. Background Image Layer - يتم جلبها من public/card-bg.png */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/card-bg.png" 
          alt="Card Background" 
          className="w-full h-full object-cover"
          // Fallback simple color in case file is missing
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
          }}
        />
      </div>

      {/* 2. Brand Identity Header */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <h1 className="text-[58px] font-black text-[#1a1a1a] tracking-tighter leading-none italic">NAMIX</h1>
        
        {/* Subtle Embossed Dots Pattern */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 pr-2 opacity-20">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-5 h-5 rounded-full bg-[#1a1a1a]" />
           ))}
        </div>
      </div>

      {/* 3. Personalized Identity Footer */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-2 flex-1 pr-6">
           <p className="text-[18px] font-bold text-[#1a1a1a]/40 uppercase tracking-[0.2em] leading-none mb-1">
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[44px] font-black text-[#1a1a1a] tabular-nums tracking-normal leading-none whitespace-nowrap">
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Floating QR without background or shadows */}
        <div className="shrink-0 p-1 bg-white/5 backdrop-blur-md rounded-2xl">
           <QRCodeSVG 
             value={invitationLink} 
             size={85} 
             bgColor={"transparent"} 
             fgColor={"#1a1a1a"} 
             level={"M"} 
             includeMargin={false} 
           />
        </div>
      </div>
    </div>
  );
}
