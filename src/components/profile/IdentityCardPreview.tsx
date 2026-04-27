
"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
  onAssetsLoad?: () => void;
}

/**
 * @fileOverview SilkWaveEngine v7.0 - Intelligent Convergence Fallback
 * محرك رسم التموجات الحريرية المطور ليكون الخيار الاحتياطي في حال عدم تحميل الصورة.
 */
const SilkWaves = () => {
  return (
    <svg
      viewBox="0 0 800 500"
      className="absolute inset-0 w-full h-full opacity-80 pointer-events-none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6E6A63" stopOpacity="0" />
          <stop offset="30%" stopColor="#6E6A63" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#6E6A63" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6E6A63" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <g transform="translate(0, 30)">
        {/* الحزمة الرئيسية: تتقارب في الزوايا وتتباعد في المركز */}
        {[...Array(35)].map((_, i) => (
          <path
            key={`main-${i}`}
            d={`M -50 ${480 - i * 0.5} C 150 ${490 - i * 3}, 650 ${-100 + i * 8}, 850 ${420 - i * 0.5}`}
            stroke="url(#waveGradient)"
            strokeWidth="0.8"
            fill="none"
            opacity={0.2 + (i * 0.01)}
          />
        ))}

        {/* الحزمة العلوية اليمنى: متوازية وتختفي خلف الحواف */}
        {[...Array(15)].map((_, i) => (
          <path
            key={`top-${i}`}
            d={`M 500 -100 C 600 -50, 750 -150, 950 250`}
            stroke="#6E6A63"
            strokeWidth="0.6"
            fill="none"
            opacity={0.05 + (i * 0.005)}
            transform={`translate(${i * 2}, ${i * 4})`}
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
  const [bgLoaded, setBgLoaded] = useState(false);
  
  useEffect(() => {
    // إرسال إشارة الجاهزية فور رندر المكون البرمجي لضمان التقاط الصورة في حال عدم وجود صورة ثابتة
    const timer = setTimeout(() => {
      if (!bgLoaded) {
        onAssetsLoad?.();
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [onAssetsLoad, bgLoaded]);

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
      
      {/* Background Logic: Static Image with SVG Fallback */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,_#ffffff_0%,_#f5f1ea_65%,_#e9e3db_100%)]" />
        
        {/* المحاولة الأولى: الصورة الثابتة من ملفات المشروع */}
        <img 
          src="/card-bg.png" 
          alt="Card Background"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            bgLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => {
            setBgLoaded(true);
            onAssetsLoad?.();
          }}
          onError={() => {
            setBgLoaded(false);
            // في حال فشل الصورة، نرسل إشارة الجاهزية لاستخدام الـ SVG
            onAssetsLoad?.();
          }}
        />

        {/* الخيار الاحتياطي: التموجات البرمجية */}
        {!bgLoaded && <SilkWaves />}
      </div>

      {/* Header: NAMIX.pro - Solid Bold Identity */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <div className="flex items-baseline leading-none">
          <span className="text-[72px] font-black tracking-tighter" style={{ color: '#6E6A63', fontWeight: 950 }}>NAMIX</span>
          <span className="text-[36px] font-bold opacity-40 ml-1" style={{ color: '#6E6A63' }}>.pro</span>
        </div>
        
        {/* Nano Grid Dots: Top Right - Sophisticated Watermark */}
        <div className="grid grid-cols-2 gap-1.5 pt-6 pr-4 opacity-[0.12]">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#6E6A63]" />
           ))}
        </div>
      </div>

      {/* Footer Identity: Name & Spaced ID - Standard Fintech Layout */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-4 flex-1 pr-10">
           <p className="text-[15px] font-black uppercase tracking-[0.4em] leading-none" style={{ color: 'rgba(110, 106, 99, 0.6)' }}>
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[52px] font-black tabular-nums tracking-normal leading-none whitespace-nowrap" style={{ color: '#6E6A63' }}>
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Minimal QR Node - Integrated & Functional */}
        <div className="shrink-0 p-2 opacity-70 mb-1">
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
