
"use client";

import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { Globe, ShieldCheck, Zap } from "lucide-react";

export function BrandingPanel() {
  return (
    <div className="hidden lg:flex relative w-[40%] bg-[#002d4d] flex-col items-center justify-center p-20 overflow-hidden border-l border-white/5 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>
      
      <div className="flex flex-col items-center gap-12 relative z-10 text-center">
        <div className="transition-transform duration-1000 hover:scale-105">
          <Logo size="lg" className="text-white brightness-200" />
        </div>
        
        <div className="space-y-2">
          <div className="h-0.5 w-12 bg-[#f9a885] mx-auto rounded-full shadow-[0_0_10px_#f9a885]" />
          <p className="text-white/20 text-[9px] font-black tracking-[0.5em] uppercase">Professional Asset Protocol</p>
        </div>

        <div className="flex gap-10 pt-10">
           {[
             { icon: ShieldCheck, label: "Secure" },
             { icon: Zap, label: "Fluid" },
             { icon: Globe, label: "Global" }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
                   <item.icon className="h-4 w-4 text-white/30 group-hover:text-[#f9a885]" />
                </div>
                <span className="text-[7px] font-black text-white/10 uppercase tracking-widest">{item.label}</span>
             </div>
           ))}
        </div>
      </div>
      
      <div className="absolute bottom-12 text-center opacity-10">
         <p className="text-white text-[8px] font-black uppercase tracking-[0.8em]">Namix Universal Network</p>
      </div>
    </div>
  );
}
