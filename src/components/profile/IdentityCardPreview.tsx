
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

const WaveLines = () => {
  return (
    <svg
      viewBox="0 0 600 378"
      className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
      preserveAspectRatio="none"
    >
      {[...Array(15)].map((_, i) => (
        <motion.path
          key={i}
          d={`M -50 ${250 + i * 6} Q 300 ${50 + i * 4}, 650 ${200 + i * 6}`}
          stroke={`rgba(120,110,100,${0.05 + i * 0.015})`}
          strokeWidth="0.8"
          fill="none"
          animate={{
            d: [
              `M -50 ${250 + i * 6} Q 300 ${50 + i * 4}, 650 ${200 + i * 6}`,
              `M -50 ${260 + i * 6} Q 300 ${40 + i * 4}, 650 ${210 + i * 6}`,
              `M -50 ${250 + i * 6} Q 300 ${50 + i * 4}, 650 ${200 + i * 6}`
            ]
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <path
          key={`cross-${i}`}
          d={`M -50 ${100 + i * 15} C 150 ${300 + i * 10}, 450 ${50 + i * 5}, 650 ${250 + i * 15}`}
          stroke={`rgba(120,110,100,0.03)`}
          strokeWidth="0.5"
          fill="none"
        />
      ))}
    </svg>
  );
};

export function IdentityCardPreview({
  user,
  invitationLink,
  onAssetsLoad
}: IdentityCardPreviewProps) {
  
  // إطلاق إشارة الجاهزية فور التحميل لأن الخلفية أصبحت داخلية
  useEffect(() => {
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
    return parts.join(' ');
  };

  return (
    <div className="w-[600px] h-[378px] relative overflow-hidden bg-[#f5f1ea] flex flex-col justify-between shadow-2xl p-0 font-sans select-none rounded-[24px]" dir="ltr">
      
      {/* 1. Programmatic Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#ffffff_0%,_#f5f1ea_50%,_#e9e3db_100%)]" />
        <WaveLines />
        <div className="absolute inset-0 backdrop-blur-[0.5px] opacity-20" />
      </div>

      {/* 2. Brand Identity Header */}
      <div className="p-12 flex items-start justify-between relative z-10">
        <h1 className="text-[58px] font-black text-[#4a4a4a] tracking-tighter leading-none italic uppercase">NAMIX</h1>
        
        {/* Top Right Dots - Glass Style */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 pr-2 opacity-10">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-5 h-5 rounded-full bg-[#1a1a1a]" />
           ))}
        </div>
      </div>

      {/* 3. Personalized Identity Footer */}
      <div className="px-12 pb-12 relative z-10 flex items-end justify-between w-full">
        
        <div className="space-y-2 flex-1 pr-6">
           <p className="text-[18px] font-bold text-[#1a1a1a]/30 uppercase tracking-[0.2em] leading-none mb-1">
              {user?.displayName || "INVESTOR NAME"}
           </p>
           <p className="text-[44px] font-black text-[#1a1a1a] tabular-nums tracking-normal leading-none whitespace-nowrap">
              {formatId(user?.namixId)}
           </p>
        </div>

        {/* Integrated QR Node */}
        <div className="shrink-0 p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
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
