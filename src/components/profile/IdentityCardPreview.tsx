
"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
}

/**
 * @fileOverview IdentityCardPreview - Luxury Gold & Gray Fluid Design v5.0
 * تصميم بطاقة عرضية ذهبية مع تموجات رمادية وانسيابية في توزيع المعرّف الرقمي.
 */
export function IdentityCardPreview({
  user,
  invitationLink
}: IdentityCardPreviewProps) {
  
  // دالة تنسيق الـ ID بمسافات تباعد احترافية
  const formatId = (id: string) => {
    if (!id) return "0000    0000    00";
    const cleanId = id.replace(/\s/g, '');
    const parts = [
      cleanId.slice(0, 4),
      cleanId.slice(4, 8),
      cleanId.slice(8, 10)
    ];
    return parts.filter(p => p).join('    ');
  };

  return (
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-[#D4AF37] flex flex-col justify-between shadow-2xl p-0 font-sans" dir="ltr">
      
      {/* 1. Background Layers - Gold Base with Gray Fluid Waves */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg viewBox="0 0 600 378" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           {/* التدرج الذهبي الأساسي */}
           <rect width="600" height="378" fill="url(#goldBase)" />
           
           {/* التموجات الرمادية الانسيابية */}
           <path d="M0 378C150 340 200 120 400 150C500 165 600 100 600 20V378H0Z" fill="url(#grayWave1)" opacity="0.4" />
           <path d="M0 378C80 320 180 280 350 300C450 320 600 250 600 180V378H0Z" fill="url(#grayWave2)" opacity="0.3" />
           
           {/* خطوط انسيابية رفيعة للتأثير البصري */}
           <path d="M0 320C120 300 250 330 400 280C500 250 600 280 600 200" stroke="#ffffff" strokeWidth="0.5" opacity="0.1" fill="none" />
           <path d="M0 340C150 320 300 350 450 300C550 270 600 300 600 220" stroke="#4B5563" strokeWidth="0.5" opacity="0.1" fill="none" />

           <defs>
              <linearGradient id="goldBase" x1="0" y1="0" x2="600" y2="378" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D4AF37" />
                <stop offset="1" stopColor="#AA8A2E" />
              </linearGradient>
              <linearGradient id="grayWave1" x1="0" y1="378" x2="600" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4B5563" />
                <stop offset="1" stopColor="#1F2937" />
              </linearGradient>
              <linearGradient id="grayWave2" x1="0" y1="378" x2="600" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9CA3AF" />
                <stop offset="1" stopColor="#4B5563" />
              </linearGradient>
           </defs>
        </svg>
      </div>

      {/* 2. Card Header - Logo & Contactless */}
      <div className="p-10 flex items-start justify-between relative z-10">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-[48px] font-black text-white tracking-tight leading-none italic drop-shadow-lg">NAMIX</h1>
          <div className="h-1 w-16 bg-white/20 rounded-full mt-2" />
        </div>
        
        {/* Contactless Icon */}
        <div className="text-white/30 pt-6">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
             <path d="M7 16C7 16 9 12 7 8" />
             <path d="M10 18C10 18 13 12 10 6" />
             <path d="M13 20C13 20 17 12 13 4" />
           </svg>
        </div>
      </div>

      {/* 3. Card Body - Strategic Placement */}
      <div className="px-10 relative z-10 flex-1 flex flex-col justify-end pb-12">
        
        <div className="flex flex-col gap-8">
           {/* User Name - Upper Layer */}
           <div className="text-left">
              <p className="text-[18px] font-bold text-white/60 uppercase tracking-[0.25em] drop-shadow-sm">
                {user?.displayName || "INVESTOR NAME"}
              </p>
           </div>

           {/* Core Identity Row - ID occupying space between QR and edge */}
           <div className="flex items-center justify-between gap-6">
              {/* Namix ID - Occupies the left and middle space */}
              <div className="flex-1">
                 <p className="text-[34px] font-black text-white tabular-nums tracking-[0.1em] drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
                    {formatId(user?.namixId)}
                 </p>
              </div>

              {/* QR Code Anchor - On the right side */}
              <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 relative group shrink-0 shadow-2xl">
                 <QRCodeSVG 
                   value={invitationLink} 
                   size={80} 
                   bgColor={"transparent"} 
                   fgColor={"#ffffff"} 
                   level={"H"} 
                   includeMargin={false} 
                 />
                 <div className="absolute -bottom-2 -left-2 bg-white rounded-full p-1.5 shadow-xl border border-gray-100">
                    <ShieldCheck size={14} className="text-[#D4AF37]" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Light Sweep Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
