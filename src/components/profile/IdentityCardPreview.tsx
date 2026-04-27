
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
 * @fileOverview IdentityCardPreview - Gold & Gray Premium Design v4.0
 * تصميم بطاقة عرضية يدمج بين الرمادي المعدني والذهبي مع تباعد رقمي موسّع.
 */
export function IdentityCardPreview({
  user,
  invitationLink
}: IdentityCardPreviewProps) {
  
  // دالة تنسيق الـ ID بمسافات تباعد كبيرة (4 مسافات)
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
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-[#f4f4f2] flex flex-col justify-between shadow-2xl p-0 font-sans" dir="ltr">
      
      {/* 1. Background Layers - Gold & Gray Fluidity */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg viewBox="0 0 600 378" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           <rect width="600" height="378" fill="url(#mainGrad)" />
           <path d="M0 378C150 350 250 180 450 200C550 210 600 150 600 80V378H0Z" fill="url(#goldGrad)" opacity="0.4" />
           <path d="M0 378C100 330 200 300 400 320C500 340 600 280 600 200V378H0Z" fill="url(#grayGrad)" opacity="0.3" />
           <path d="M0 378L120 350C240 330 400 350 600 300V378H0Z" fill="#D4AF37" opacity="0.1" />
           <defs>
              <linearGradient id="mainGrad" x1="0" y1="0" x2="600" y2="378" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8f9fa" />
                <stop offset="1" stopColor="#e9ecef" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0" y1="378" x2="600" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D4AF37" />
                <stop offset="1" stopColor="#F5E0A3" />
              </linearGradient>
              <linearGradient id="grayGrad" x1="0" y1="378" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6c757d" />
                <stop offset="1" stopColor="#adb5bd" />
              </linearGradient>
           </defs>
        </svg>
      </div>

      {/* 2. Card Header - NAMIX Logo & Contactless Icon */}
      <div className="p-10 flex items-start justify-between relative z-10">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-[44px] font-black text-[#334155] tracking-tight leading-none italic">NAMIX</h1>
          <div className="h-1 w-12 bg-[#D4AF37] rounded-full mt-1" />
        </div>
        
        {/* Contactless Icon */}
        <div className="text-[#334155] pt-4 opacity-30">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
             <path d="M7 16C7 16 9 12 7 8" />
             <path d="M10 18C10 18 13 12 10 6" />
             <path d="M13 20C13 20 17 12 13 4" />
           </svg>
        </div>
      </div>

      {/* 3. Card Body - Details & QR (No Chip) */}
      <div className="px-10 relative z-10 flex-1 flex flex-col justify-end pb-12">
        
        <div className="flex items-end justify-between">
           {/* User Info - Focus on Spacing */}
           <div className="space-y-5">
              <div className="space-y-2">
                 <p className="text-[18px] font-medium text-[#64748b] uppercase tracking-[0.2em]">{user?.displayName || "INVESTOR NAME"}</p>
                 <p className="text-[32px] font-black text-[#1e293b] tabular-nums tracking-[0.05em] drop-shadow-sm">
                    {formatId(user?.namixId)}
                 </p>
              </div>
           </div>

           {/* QR Code Anchor - Flat Minimalist */}
           <div className="bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-white/50 relative">
              <QRCodeSVG 
                value={invitationLink} 
                size={85} 
                bgColor={"transparent"} 
                fgColor={"#334155"} 
                level={"H"} 
                includeMargin={false} 
              />
              <div className="absolute -bottom-2 -left-2 bg-[#D4AF37] rounded-full p-1 border-2 border-white">
                 <ShieldCheck size={14} className="text-white" />
              </div>
           </div>
        </div>
      </div>

      {/* Decorative Atmosphere Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-[350px] h-[350px] bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-[100px] -z-10" />
    </div>
  );
}
