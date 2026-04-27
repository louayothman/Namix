
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
 * WaveLines - محرك الرسوم المتموجة المطور v7.0 - Precision Match
 * يقوم بتوليد مصفوفة كثيفة من الخطوط الشعرية المتوازية (70 خطاً) لمحاكاة الصورة المرفقة.
 */
const WaveLines = () => {
  return (
    <svg
      viewBox="0 0 600 378"
      className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* 1. الحزمة الرئيسية: 45 خطاً متوازياً تتدفق من اليسار لتشكل تموجاً حريرياً في المركز */}
      {[...Array(45)].map((_, i) => {
        const offset = i * 4;
        return (
          <path
            key={`main-${i}`}
            d={`M -50 ${200 + offset} C 150 ${230 + offset}, 450 ${-150 + offset}, 650 ${250 + offset}`}
            stroke="#6E6A63"
            strokeWidth="0.35"
            fill="none"
            style={{ opacity: 0.02 + (i * 0.0015) }}
          />
        );
      })}
      
      {/* 2. حزمة الزاوية العلوية اليمنى: 25 خطاً ناعماً لتحقيق التوازن البصري */}
      {[...Array(25)].map((_, i) => {
        const offset = i * 3.5;
        return (
          <path
            key={`corner-${i}`}
            d={`M 300 ${-80 + offset} C 400 ${100 + offset}, 500 ${-20 + offset}, 700 ${150 + offset}`}
            stroke="#6E6A63"
            strokeWidth="0.25"
            fill="none"
            style={{ opacity: 0.015 + (i * 0.001) }}
          />
        );
      })}

      {/* طبقة تنعيم الحواف */}
      <rect width="100%" height="100%" fill="none" style={{ backdropFilter: 'blur(0.2px)', opacity: 0.1 }} />
    </svg>
  );
};

export function IdentityCardPreview({
  user,
  invitationLink,
  onAssetsLoad
}: IdentityCardPreviewProps) {
  
  useEffect(() => {
    // إرسال إشارة الجاهزية فور رندر المكون نظراً لأنه يعتمد على محرك رسومي داخلي
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
      
      {/* Background Logic: Cream Silk Gradient with Generative Waves */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#ffffff_0%,_#f5f1ea_60%,_#e9e3db_100%)]" />
        <WaveLines />
      </div>

      {/* Header: NAMIX.pro Straight Bold Edition (Exactly like the provided image) */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <div className="flex items-baseline leading-none">
          <span className="text-[72px] font-black tracking-tighter" style={{ color: '#6E6A63', fontWeight: 950 }}>NAMIX</span>
          <span className="text-[36px] font-bold opacity-40 ml-1" style={{ color: '#6E6A63' }}>.pro</span>
        </div>
        
        {/* Nano Grid Dots: Top Right (Refined Size) */}
        <div className="grid grid-cols-2 gap-2 pt-6 pr-4 opacity-[0.15]">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-4 h-4 rounded-full bg-[#6E6A63]" />
           ))}
        </div>
      </div>

      {/* Footer Identity: Name & Spaced ID */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-4 flex-1 pr-10">
           <p className="text-[15px] font-black uppercase tracking-[0.4em] leading-none" style={{ color: 'rgba(110, 106, 99, 0.4)' }}>
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[52px] font-black tabular-nums tracking-normal leading-none whitespace-nowrap" style={{ color: '#6E6A63' }}>
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Minimal QR Node: No Shadow, Integrated into the Silk theme */}
        <div className="shrink-0 p-2 opacity-80 mb-1">
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
