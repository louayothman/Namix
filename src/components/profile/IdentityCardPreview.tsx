
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
 * WaveLines - محرك الرسوم المتموجة المطور v6.0 - Perfect Mirror Edition
 * تم ضبط المسارات المنحنية لتطابق الصورة المرفقة تماماً من حيث التموج والكثافة والتموضع.
 */
const WaveLines = () => {
  return (
    <svg
      viewBox="0 0 600 378"
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* 1. الحزمة الرئيسية: تموج انسيابي يرتفع نحو اليمين ثم ينحدر (30 خطاً متوازياً) */}
      {[...Array(30)].map((_, i) => {
        const offset = i * 4.5; // مسافة ثابتة لضمان التوازي التام
        return (
          <path
            key={`main-wave-${i}`}
            d={`M -50 ${320 + offset} C 120 ${350 + offset}, 400 ${-120 + offset}, 650 ${280 + offset}`}
            stroke="#6E6A63"
            strokeWidth="0.4"
            fill="none"
            style={{ opacity: 0.03 + (i * 0.004) }}
          />
        );
      })}

      {/* 2. الحزمة العلوية: تموجات ناعمة في الزاوية اليمنى (15 خطاً) */}
      {[...Array(15)].map((_, i) => {
        const offset = i * 3.5;
        return (
          <path
            key={`corner-wave-${i}`}
            d={`M 350 ${-60 + offset} C 450 ${120 + offset}, 550 ${-40 + offset}, 680 ${180 + offset}`}
            stroke="#6E6A63"
            strokeWidth="0.3"
            fill="none"
            style={{ opacity: 0.02 + (i * 0.003) }}
          />
        );
      })}

      {/* 3. طبقة الضبابية الفنية لزيادة النعومة */}
      <rect width="100%" height="100%" fill="none" style={{ backdropFilter: 'blur(0.5px)', opacity: 0.1 }} />
    </svg>
  );
};

export function IdentityCardPreview({
  user,
  invitationLink,
  onAssetsLoad
}: IdentityCardPreviewProps) {
  
  useEffect(() => {
    // إرسال إشارة الجاهزية فور رندر المكون نظراً لأنه يعتمد على كود داخلي الآن
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
      
      {/* Background Logic: Cream Silk Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#ffffff_0%,_#f5f1ea_60%,_#e9e3db_100%)]" />
        <WaveLines />
      </div>

      {/* Header: NAMIX.pro Straight Bold Edition */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <div className="flex items-baseline leading-none">
          <span className="text-[64px] font-black tracking-tighter" style={{ color: '#6E6A63', fontWeight: 950 }}>NAMIX</span>
          <span className="text-[32px] font-bold opacity-40 ml-1" style={{ color: '#6E6A63' }}>.pro</span>
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
           <p className="text-[14px] font-black uppercase tracking-[0.4em] leading-none" style={{ color: 'rgba(110, 106, 99, 0.4)' }}>
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[46px] font-black tabular-nums tracking-normal leading-none whitespace-nowrap" style={{ color: '#6E6A63' }}>
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Minimal QR Node: No Shadow */}
        <div className="shrink-0 p-2 opacity-80">
           <QRCodeSVG 
             value={invitationLink} 
             size={85} 
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
