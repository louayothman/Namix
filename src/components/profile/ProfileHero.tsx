
"use client";

import { UserCircle, ShieldCheck, ShieldAlert, Briefcase, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileHeroProps {
  user: any;
  referralCount: number;
  totalInvestments: number;
}

export function ProfileHero({ user, referralCount = 0, totalInvestments = 0 }: ProfileHeroProps) {
  const isVerified = !!(user?.displayName && user?.phoneNumber && user?.birthDate);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-6 duration-1000">
      {/* Sovereign Identity Card */}
      <div className="bg-[#002d4d] rounded-[48px] md:rounded-[64px] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 text-[300px] md:text-[400px] font-black text-white/[0.03] leading-none tracking-tighter italic rounded-[100px]">
              iX
           </div>
           <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner group-hover:scale-105 transition-transform duration-700 text-[#f9a885]">
                  <UserCircle className="h-12 w-12 drop-shadow-2xl" />
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-7 w-7 rounded-[10px] border-[3px] border-[#002d4d] flex items-center justify-center shadow-2xl z-20 transition-all duration-500",
                  isVerified ? "bg-emerald-500" : "bg-orange-400"
                )}>
                  {isVerified ? <ShieldCheck className="h-3.5 w-3.5 text-white fill-white" /> : <ShieldAlert className="h-3.5 w-3.5 text-white" />}
                </div>
              </div>
              
              <div className="text-right space-y-1.5">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight">{user?.displayName || '...'}</h1>
                  <Badge className={cn(
                    "font-black text-[8px] px-3 py-1 rounded-full border-none shadow-sm tracking-widest",
                    isVerified ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"
                  )}>
                    {isVerified ? "VERIFIED" : "PENDING"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 opacity-60">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-200">Investor Node: {user?.id?.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 backdrop-blur-md space-y-2 group/stat">
                <div className="flex items-center gap-2">
                   <Briefcase className="h-3 w-3 text-blue-400 group-hover/stat:rotate-12 transition-transform" />
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Active Capital</span>
                </div>
                <p className="text-2xl font-black tabular-nums tracking-tighter">${(totalInvestments || 0).toLocaleString()}</p>
             </div>
             <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 backdrop-blur-md space-y-2 group/stat">
                <div className="flex items-center gap-2">
                   <Users className="h-3 w-3 text-[#f9a885] group-hover/stat:scale-110 transition-transform" />
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Global Network</span>
                </div>
                <p className="text-2xl font-black tabular-nums tracking-tighter">{(referralCount || 0)} Partners</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
