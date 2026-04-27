"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sparkles, Hash, Award } from "lucide-react";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
}

/**
 * @fileOverview IdentityCardPreview - The visual soul of the Sovereign ID Card
 * تم تصميمها بكرت رأسي فخم (450x750) مع طبقات لونية تعتمد على الرتبة.
 */
export function IdentityCardPreview({
  user,
  calculatedTier,
  invitationLink
}: IdentityCardPreviewProps) {
  const tierColor = calculatedTier?.color || "blue";
  
  // خوارزمية الألوان السيادية بناءً على الرتبة
  const theme = {
    blue: { bg: "bg-[#002d4d]", accent: "text-blue-400", glow: "from-blue-500/20" },
    yellow: { bg: "bg-[#f59e0b]", accent: "text-yellow-100", glow: "from-yellow-200/40" },
    emerald: { bg: "bg-[#10b981]", accent: "text-emerald-100", glow: "from-emerald-200/40" },
    orange: { bg: "bg-[#f9a885]", accent: "text-orange-100", glow: "from-orange-200/40" },
    gray: { bg: "bg-[#8899AA]", accent: "text-gray-200", glow: "from-white/10" }
  }[tierColor as keyof typeof theme] || { bg: "bg-[#002d4d]", accent: "text-blue-400", glow: "from-blue-500/20" };

  return (
    <div className={cn(
      "w-[450px] min-h-[750px] p-0 relative overflow-hidden flex flex-col items-center",
      theme.bg
    )} style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      
      {/* 1. Background Atmosphere Layers */}
      <div className="absolute inset-0 z-0">
         <div className={cn("absolute top-[-10%] right-[-10%] w-[80%] h-[50%] rounded-full blur-[100px] opacity-30 bg-gradient-to-br", theme.glow)} />
         <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[50%] rounded-full blur-[100px] opacity-10 bg-white/5" />
         
         {/* Sovereign iX Ghost Watermark */}
         <div className="absolute left-[-15%] top-1/2 -translate-y-1/2 text-[500px] font-black text-white/[0.03] leading-none select-none tracking-tighter italic">
            iX
         </div>
      </div>

      {/* 2. Header Strip */}
      <div className="w-full p-12 flex items-center justify-between relative z-10">
         <Logo size="md" lightText hideText={false} animate={false} className="scale-110" />
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
               <ShieldCheck className="h-5 w-5 text-white" />
            </div>
         </div>
      </div>

      {/* 3. Central Identity Core */}
      <div className="flex-1 w-full px-12 flex flex-col items-center justify-center gap-12 relative z-10 text-center">
         
         <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight px-4">{user?.displayName}</h1>
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
               <Award size={14} className="text-[#f9a885]" />
               <span className="text-[12px] font-black text-white uppercase tracking-[0.2em]">{calculatedTier?.name || "Starter Protocol"}</span>
            </div>
         </div>

         {/* The Sovereign QR */}
         <div className="p-4 bg-white rounded-[56px] shadow-2xl relative group">
            <div className="p-3 bg-gray-50 rounded-[44px] border border-gray-100">
               <QRCodeSVG 
                 value={invitationLink} 
                 size={240} 
                 bgColor={"transparent"} 
                 fgColor={"#002d4d"} 
                 level={"H"} 
                 includeMargin={false} 
               />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="bg-white p-2.5 rounded-2xl shadow-lg border border-gray-50">
                  <Logo size="sm" hideText animate={false} />
               </div>
            </div>
         </div>

         <div className="space-y-3">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Namix Sovereign ID</p>
            <div className="flex items-center justify-center gap-3">
               <Hash size={16} className="text-[#f9a885]" />
               <p className="text-2xl font-black text-white tabular-nums tracking-[0.2em]">{user?.namixId}</p>
            </div>
         </div>
      </div>

      {/* 4. Footer Compliance Node */}
      <div className="w-full p-12 mt-auto relative z-10 flex flex-col items-center gap-6">
         <div className="w-full h-px bg-white/10" />
         <div className="flex items-center gap-8 opacity-40">
            <div className="grid grid-cols-2 gap-1 scale-90">
               <div className="h-1.5 w-1.5 rounded-full bg-white" />
               <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
               <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
               <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
            <span className="text-[9px] font-black text-white uppercase tracking-[0.8em] mr-[-0.8em]">AUTHORIZED ACCESS</span>
         </div>
      </div>
    </div>
  );
}
