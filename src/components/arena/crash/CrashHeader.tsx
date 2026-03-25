
"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Plus, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export function CrashHeader({ user }: { user: any }) {
  const router = useRouter();

  return (
    <header className="h-[74px] bg-white px-6 flex items-center justify-between shrink-0 z-50 border-b border-gray-50 shadow-sm">
      <div className="flex items-center gap-4">
         <button 
           onClick={() => router.push('/arena')} 
           className="h-10 w-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#002d4d] active:scale-90 transition-all shadow-inner"
         >
           <ChevronRight className="h-6 w-6" />
         </button>
         <div className="space-y-0 text-right">
            <h1 className="text-xl font-black text-[#002d4d] tracking-tight leading-none">Namix Crash</h1>
            <div className="flex items-center gap-1.5 mt-1 opacity-40">
               <div className="h-1 w-1 rounded-full bg-orange-500 animate-pulse" />
               <span className="text-[7px] font-black uppercase tracking-[0.2em]">Operational Arena Node</span>
            </div>
         </div>
      </div>

      <div className="flex items-center gap-3">
         <div className="flex items-center gap-3 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 shadow-inner">
            <div className="text-right">
               <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none">Wallet</p>
               <p className="text-[13px] font-black text-[#002d4d] tabular-nums mt-0.5">
                 ${user?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </p>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <button className="h-7 w-7 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all">
               <Plus size={14} />
            </button>
         </div>
      </div>
    </header>
  );
}
