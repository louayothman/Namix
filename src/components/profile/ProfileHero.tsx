
"use client";

import { Award, ShieldCheck, ShieldAlert, Briefcase, Users, Hash, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileHeroProps {
  user: any;
  referralCount: number;
  totalInvestments: number;
  calculatedTier?: any;
}

export function ProfileHero({ user, referralCount = 0, totalInvestments = 0, calculatedTier }: ProfileHeroProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const isVerified = !!(user?.displayName && user?.phoneNumber && user?.birthDate);

  const handleCopyId = () => {
    if (!user?.namixId) return;
    navigator.clipboard.writeText(user.namixId).then(() => {
      setCopyStatus("COPIED");
      setTimeout(() => setCopyStatus(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 text-right font-body" dir="rtl">
      
      <div className="space-y-4 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-[#002d4d] tracking-tight">{user?.displayName || '...'}</h2>
            {isVerified ? (
              <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-50" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-orange-400" />
            )}
          </div>
          
          {calculatedTier && (
            <div className="flex items-center gap-2 pt-0.5">
              <div className={cn(
                "h-5 w-5 rounded-lg flex items-center justify-center shadow-inner",
                calculatedTier.color === 'blue' ? "bg-blue-50 text-blue-500" :
                calculatedTier.color === 'emerald' ? "bg-emerald-50 text-emerald-500" :
                calculatedTier.color === 'orange' ? "bg-orange-50 text-orange-500" :
                calculatedTier.color === 'yellow' ? "bg-yellow-50 text-yellow-500" :
                "bg-gray-50 text-gray-400"
              )}>
                <Award size={12} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                calculatedTier.color === 'blue' ? "text-blue-600" :
                calculatedTier.color === 'emerald' ? "text-emerald-600" :
                calculatedTier.color === 'orange' ? "text-orange-600" :
                calculatedTier.color === 'yellow' ? "text-yellow-600" :
                "text-gray-400"
              )}>
                {calculatedTier.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {copyStatus ? (
              <motion.span 
                key="status"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-black text-emerald-600 tracking-widest uppercase ml-1"
              >
                {copyStatus}
              </motion.span>
            ) : null}
          </AnimatePresence>

          <button 
            onClick={handleCopyId}
            className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-all group/id active:scale-95 outline-none"
          >
            <Hash className="h-3 w-3 text-[#f9a885]" />
            <span className="text-[10px] font-black text-[#002d4d] tabular-nums tracking-widest uppercase">ID: {user?.namixId || "..."}</span>
            <Copy className="h-3 w-3 opacity-20 group-hover/id:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex items-stretch h-24 divide-x divide-x-reverse divide-gray-50/60">
         <div className="flex-1 p-6 relative group/stat overflow-hidden flex flex-col justify-center">
            <div className="absolute -bottom-4 -left-4 opacity-[0.03] group-hover/stat:opacity-[0.1] group-hover/stat:scale-125 group-hover/stat:rotate-12 transition-all duration-700 pointer-events-none text-blue-600">
               <Briefcase size={80} />
            </div>
            <div className="relative z-10 space-y-0.5 text-right">
               <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Active Capital</p>
               <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">${(totalInvestments || 0).toLocaleString()}</p>
            </div>
         </div>

         <div className="flex-1 p-6 relative group/stat overflow-hidden flex flex-col justify-center">
            <div className="absolute -bottom-4 -left-4 opacity-[0.03] group-hover/stat:opacity-[0.1] group-hover/stat:scale-125 group-hover/stat:rotate-12 transition-all duration-700 pointer-events-none text-orange-500">
               <Users size={80} />
            </div>
            <div className="relative z-10 space-y-0.5 text-right">
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Partners</p>
               <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">{(referralCount || 0)}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
