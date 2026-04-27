
"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sparkles, Hash, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IdentityCardPreviewProps {
  user: any;
  calculatedTier: any;
  invitationLink: string;
}

/**
 * @fileOverview IdentityCardPreview - Debit Card Aspect Ratio v2.0
 * تم تعديل التصميم ليصبح عرضياً (Landscape) بأسلوب البطاقات البنكية الفخمة.
 */
export function IdentityCardPreview({
  user,
  calculatedTier,
  invitationLink
}: IdentityCardPreviewProps) {
  const tierColor = calculatedTier?.color || "blue";
  
  // توزيع الألوان بناءً على فئة الحساب
  const theme = {
    blue: { bg: "bg-[#002d4d]", accent: "text-blue-400", glow: "from-blue-500/20" },
    yellow: { bg: "bg-[#f59e0b]", accent: "text-yellow-100", glow: "from-yellow-200/40" },
    emerald: { bg: "bg-[#10b981]", accent: "text-emerald-100", glow: "from-emerald-200/40" },
    orange: { bg: "bg-[#f9a885]", accent: "text-orange-100", glow: "from-orange-200/40" },
    gray: { bg: "bg-[#8899AA]", accent: "text-gray-200", glow: "from-white/10" }
  }[tierColor as keyof typeof theme] || { bg: "bg-[#002d4d]", accent: "text-blue-400", glow: "from-blue-500/20" };

  return (
    <div className={cn(
      "w-[600px] h-[378px] p-0 relative overflow-hidden flex flex-col justify-between shadow-2xl",
      theme.bg
    )} style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      
      {/* Background Atmosphere Layers */}
      <div className="absolute inset-0 z-0">
         <div className={cn("absolute top-[-20%] right-[-10%] w-[100%] h-[100%] rounded-full blur-[120px] opacity-40 bg-gradient-to-br", theme.glow)} />
         
         {/* Subtle iX Branding */}
         <div className="absolute right-[-5%] bottom-[-10%] text-[280px] font-black text-white/[0.03] leading-none select-none tracking-tighter italic">
            iX
         </div>
      </div>

      {/* Card Header */}
      <div className="w-full p-10 flex items-start justify-between relative z-10">
         <Logo size="sm" lightText hideText={false} animate={false} className="scale-125" />
         <div className="flex flex-col items-end gap-1">
            <Badge className={cn("text-[9px] font-black border-none px-4 py-1 rounded-full shadow-lg", `bg-white/10 text-white backdrop-blur-md`)}>
               {calculatedTier?.name || "حساب أساسي"}
            </Badge>
         </div>
      </div>

      {/* Card Body - Dual Wing Layout */}
      <div className="flex-1 flex items-center justify-between px-10 relative z-10">
         <div className="space-y-6 text-right">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Investor Name</p>
               <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{user?.displayName}</h1>
            </div>

            <div className="space-y-1">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Namix ID</p>
               <div className="flex items-center gap-3">
                  <p className="text-xl font-black text-white tabular-nums tracking-[0.15em]">{user?.namixId}</p>
               </div>
            </div>
         </div>

         {/* QR Code Anchor */}
         <div className="bg-white p-2 rounded-[24px] shadow-2xl relative">
            <QRCodeSVG 
              value={invitationLink} 
              size={120} 
              bgColor={"transparent"} 
              fgColor={"#002d4d"} 
              level={"H"} 
              includeMargin={false} 
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-50 scale-[0.6]">
                  <Logo size="sm" hideText animate={false} />
               </div>
            </div>
         </div>
      </div>

      {/* Footer Compliance */}
      <div className="w-full p-8 relative z-10 flex items-center justify-between">
         <div className="flex items-center gap-4 opacity-40">
            <ShieldCheck size={14} className="text-[#f9a885]" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">Verified Member</span>
         </div>
         <div className="flex items-center gap-1.5 opacity-20">
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
         </div>
      </div>
    </div>
  );
}
