
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
 * @fileOverview IdentityCardPreview - Pure White Luxury Design v3.0
 * تصميم بطاقة عرضية (Landscape) يطابق الصورة المرفقة (أبيض عاجي مع منحنيات).
 */
export function IdentityCardPreview({
  user,
  invitationLink
}: IdentityCardPreviewProps) {
  
  // دالة تنسيق الـ ID بأسلوب البطاقات البنكية (0000 0000 00)
  const formatId = (id: string) => {
    if (!id) return "0000 0000 00";
    const cleanId = id.replace(/\s/g, '');
    const parts = [
      cleanId.slice(0, 4),
      cleanId.slice(4, 8),
      cleanId.slice(8, 10)
    ];
    return parts.filter(p => p).join('  ');
  };

  return (
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-[#fdfdfb] flex flex-col justify-between shadow-2xl p-0 font-sans" dir="ltr">
      
      {/* 1. Background Layers - منحنيات السيولة الانسيابية (طابق الصورة) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <svg viewBox="0 0 600 378" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
           <path d="M0 378C150 350 250 200 450 220C550 230 600 180 600 120V378H0Z" fill="url(#grad1)" opacity="0.3" />
           <path d="M0 378C100 340 200 320 400 340C500 350 600 300 600 250V378H0Z" fill="url(#grad2)" opacity="0.5" />
           <path d="M0 378L120 360C240 340 400 360 600 320V378H0Z" fill="#e5e7eb" opacity="0.2" />
           <defs>
              <linearGradient id="grad1" x1="0" y1="378" x2="600" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f3f4f6" />
                <stop offset="1" stopColor="#d1d5db" />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="378" x2="600" y2="250" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e5e7eb" />
                <stop offset="1" stopColor="#9ca3af" />
              </linearGradient>
           </defs>
        </svg>
      </div>

      {/* 2. Card Header - NAMIX Logo & Contactless Icon */}
      <div className="p-10 flex items-start justify-between relative z-10">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-[40px] font-black text-[#4b5563] tracking-tight leading-none">NAMIX</h1>
        </div>
        
        {/* Contactless Icon (Matching Image) */}
        <div className="text-[#4b5563] pt-4 opacity-40">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
             <path d="M7 16C7 16 9 12 7 8" />
             <path d="M10 18C10 18 13 12 10 6" />
             <path d="M13 20C13 20 17 12 13 4" />
           </svg>
        </div>
      </div>

      {/* 3. Card Body - EMV Chip & Details */}
      <div className="px-10 relative z-10 flex-1 flex flex-col justify-start gap-10">
        
        {/* Modern EMV Chip Replica */}
        <div className="w-[64px] h-[48px] bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl relative overflow-hidden border border-gray-300 shadow-sm">
           <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 opacity-40">
              {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-black/10" />)}
           </div>
           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
        </div>

        {/* User Info - BOTTOM LEFT (Matching Image) */}
        <div className="mt-auto pb-10 flex items-end justify-between">
           <div className="space-y-4">
              <div className="space-y-1">
                 <p className="text-[20px] font-normal text-[#4b5563] uppercase tracking-wider">{user?.displayName}</p>
                 <p className="text-[28px] font-black text-[#374151] tabular-nums tracking-[0.1em]">
                    {formatId(user?.namixId)}
                 </p>
              </div>
           </div>

           {/* QR Code Anchor (Replacing MasterCard) */}
           <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/50 relative">
              <QRCodeSVG 
                value={invitationLink} 
                size={80} 
                bgColor={"transparent"} 
                fgColor={"#374151"} 
                level={"H"} 
                includeMargin={false} 
              />
              <div className="absolute -bottom-2 -left-2 bg-emerald-500 rounded-full p-1 shadow-lg border-2 border-white">
                 <ShieldCheck size={12} className="text-white" />
              </div>
           </div>
        </div>
      </div>

      {/* Decorative Light Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-[#f9a885]/10 to-transparent rounded-full blur-[80px] -z-10" />
    </div>
  );
}
