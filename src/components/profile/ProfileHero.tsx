
"use client";

import { UserCircle, ShieldCheck, ShieldAlert, Briefcase, Users, Hash, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProfileHeroProps {
  user: any;
  referralCount: number;
  totalInvestments: number;
}

/**
 * @fileOverview مكون الهوية المباشرة v6.0 - Raw Identity Edition
 * تم تجريد المكون من الحاويات والخلفيات ليظهر مباشرة على الصفحة بأسلوب مينيماليست.
 */
export function ProfileHero({ user, referralCount = 0, totalInvestments = 0 }: ProfileHeroProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const isVerified = !!(user?.displayName && user?.phoneNumber && user?.birthDate);

  const handleCopyId = () => {
    if (!user?.namixId) return;
    navigator.clipboard.writeText(user.namixId).then(() => {
      setCopyStatus("تم النسخ ✅");
      setTimeout(() => setCopyStatus(null), 2000);
    }).catch(() => {
      setCopyStatus("فشل النسخ ❌");
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 text-right" dir="rtl">
      
      {/* Identity Node - Transparent & Clean */}
      <div className="flex flex-col items-start gap-6">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-[32px] bg-gray-50 flex items-center justify-center shadow-inner border border-gray-100 text-[#002d4d] group-hover:scale-105 transition-transform duration-700">
              <UserCircle className="h-12 w-12" />
            </div>
            <div className={cn(
              "absolute -bottom-1 -right-1 h-7 w-7 rounded-[12px] border-[3px] border-white flex items-center justify-center shadow-lg z-20 transition-all duration-500",
              isVerified ? "bg-emerald-500" : "bg-orange-400"
            )}>
              {isVerified ? <ShieldCheck className="h-3.5 w-3.5 text-white fill-white" /> : <ShieldAlert className="h-3.5 w-3.5 text-white" />}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-[#002d4d] tracking-tight">{user?.displayName || '...'}</h2>
              <Badge className={cn(
                "font-black text-[8px] px-3 py-1 rounded-full border-none shadow-sm tracking-widest",
                isVerified ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-400"
              )}>
                {isVerified ? "VERIFIED" : "PENDING"}
              </Badge>
            </div>
            
            <div className="flex flex-col items-start gap-2">
              <button 
                onClick={handleCopyId}
                className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-all group/id active:scale-95"
              >
                <Hash className="h-3 w-3 text-[#f9a885]" />
                <span className="text-[10px] font-black text-[#002d4d] tabular-nums tracking-widest uppercase">ID: {user?.namixId || "..."}</span>
                {copyStatus ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 opacity-30 group-hover/id:opacity-100" />}
              </button>
              {copyStatus && (
                <span className="text-[9px] font-black text-emerald-600 px-2 animate-in fade-in slide-in-from-top-1">
                  {copyStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary - Minimal Grid */}
      <div className="grid grid-cols-2 gap-4">
         <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-1.5 group/stat hover:border-blue-100 transition-all">
            <div className="flex items-center gap-2">
               <Briefcase className="h-3.5 w-3.5 text-blue-500 group-hover/stat:rotate-12 transition-transform" />
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active Capital</span>
            </div>
            <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">${(totalInvestments || 0).toLocaleString()}</p>
         </div>
         <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-1.5 group/stat hover:border-orange-100 transition-all">
            <div className="flex items-center gap-2">
               <Users className="h-3.5 w-3.5 text-[#f9a885] group-hover/stat:scale-110 transition-transform" />
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Network</span>
            </div>
            <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">{(referralCount || 0)} Partners</p>
         </div>
      </div>
    </div>
  );
}
