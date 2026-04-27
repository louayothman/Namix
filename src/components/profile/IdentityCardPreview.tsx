
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
 * @fileOverview IdentityCardPreview - Perfect Replica v6.0
 * تصميم مطابق تماماً للصورة المرفقة: خلفية عاجية، خطوط انسيابية، وتوزيع عناصر دقيق.
 */
export function IdentityCardPreview({
  user,
  invitationLink
}: IdentityCardPreviewProps) {
  
  // تنسيق المعرف الرقمي: كل رقمين بينهما مسافة (مطابق للصورة)
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
      
      {/* 1. Background Layers - Precise Replica of the Image Waves */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg viewBox="0 0 600 378" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           {/* القاعدة العاجية مع تدرج ناعم */}
           <rect width="600" height="378" fill="url(#creamGradient)" />
           
           {/* الخطوط المنحنية الانسيابية (Contour Lines) */}
           <g opacity="0.15">
              <path d="M-50 300C100 280 250 400 450 250C550 180 650 220 700 150" stroke="#555" strokeWidth="1" fill="none" />
              <path d="M-50 320C120 300 280 420 480 270C580 200 680 240 730 170" stroke="#555" strokeWidth="1" fill="none" />
              <path d="M-50 340C140 320 310 440 510 290C610 220 710 260 760 190" stroke="#555" strokeWidth="1" fill="none" />
              <path d="M-50 360C160 340 340 460 540 310C640 240 740 280 790 210" stroke="#555" strokeWidth="1" fill="none" />
              <path d="M-50 380C180 360 370 480 570 330C670 260 770 300 820 230" stroke="#555" strokeWidth="1" fill="none" />
              <path d="M-50 400C200 380 400 500 600 350C700 280 800 320 850 250" stroke="#555" strokeWidth="1" fill="none" />
           </g>

           {/* الحاوية البيضاء المنحنية للـ QR في الركن السفلي الأيمن */}
           <path d="M450 378C450 320 500 250 600 250V378H450Z" fill="white" />

           <defs>
              <linearGradient id="creamGradient" x1="0" y1="0" x2="600" y2="378" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f4f1ea" />
                <stop offset="1" stopColor="#e8e2d5" />
              </linearGradient>
           </defs>
        </svg>
      </div>

      {/* 2. Top Section - Logo & Dots */}
      <div className="p-10 flex items-start justify-between relative z-10">
        <h1 className="text-[54px] font-black text-[#4a4a4a] tracking-tighter leading-none">NAMIX</h1>
        
        {/* النقاط الأربعة (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2 pt-4 pr-2">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-5 h-5 rounded-full bg-[#cccbbd] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />
           ))}
        </div>
      </div>

      {/* 3. Bottom Section - Name, ID & QR */}
      <div className="px-10 pb-10 relative z-10 flex items-end justify-between">
        
        {/* الهوية النصية (يسار) */}
        <div className="space-y-1">
           <p className="text-[20px] font-bold text-[#a5a496] uppercase tracking-wide">
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[44px] font-black text-[#4a4a4a] tabular-nums tracking-normal leading-none">
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* رمز الـ QR (داخل المساحة البيضاء) */}
        <div className="mb-[-10px] mr-[-10px] pr-8 pb-8">
           <QRCodeSVG 
             value={invitationLink} 
             size={100} 
             bgColor={"transparent"} 
             fgColor={"#000000"} 
             level={"M"} 
             includeMargin={false} 
           />
        </div>
      </div>

      {/* لمسة ضوئية نهائية لتعزيز الواقعية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
