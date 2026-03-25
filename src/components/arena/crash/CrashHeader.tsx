
"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Plus, ShieldCheck, Zap, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function CrashHeader({ user }: { user: any }) {
  const router = useRouter();

  return (
    <header className="h-[74px] bg-white px-6 flex items-center justify-between shrink-0 z-50 border-b border-gray-50 shadow-sm font-body tracking-normal">
      <div className="flex items-center gap-4">
         <button 
           onClick={() => router.push('/arena')} 
           className="h-10 w-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#002d4d] hover:bg-gray-50 active:scale-90 transition-all shadow-sm"
         >
           <ChevronRight className="h-6 w-6" />
         </button>
         <div className="space-y-0 text-right">
            <h1 className="text-xl font-black text-[#002d4d] tracking-tight leading-none">Namix Crash</h1>
            <div className="flex items-center gap-1.5 mt-1.5 opacity-40">
               <div className="h-1 w-1 rounded-full bg-orange-500 animate-pulse" />
               <span className="text-[7px] font-black uppercase tracking-[0.3em]">Operational Arena Node</span>
            </div>
         </div>
      </div>

      <div className="flex items-center gap-3">
         <div className="flex items-center gap-3 bg-gray-50/80 px-4 py-2 rounded-full border border-gray-100 shadow-inner">
            <div className="text-right">
               <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Liquidity</p>
               <p className="text-[13px] font-black text-[#002d4d] tabular-nums leading-none">
                 ${user?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </p>
            </div>
            <div className="h-4 w-[0.5px] bg-gray-200" />
            <button className="h-8 w-8 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all ml-1 group">
               <Plus size={16} className="transition-transform group-hover:rotate-90" />
            </button>
         </div>
      </div>
    </header>
  );
}
