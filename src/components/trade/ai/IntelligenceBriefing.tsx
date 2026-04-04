
"use client";

import { Info, Sparkles, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IntelligenceBriefingProps {
  reasoning: string;
  summary: string;
}

export function IntelligenceBriefing({ reasoning, summary }: IntelligenceBriefingProps) {
  return (
    <section className="space-y-4 font-body" dir="rtl">
      <div className="p-6 bg-[#002d4d] rounded-[44px] text-white relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 left-0 p-6 opacity-[0.03] transition-transform duration-1000 group-hover:rotate-12"><Sparkles size={100} /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><Info size={16} className="text-[#f9a885]" /></div>
              <h4 className="text-[11px] font-black uppercase tracking-normal">الأسباب الاستراتيجية</h4>
            </div>
            <Badge variant="outline" className="text-white/30 border-white/5 text-[6px] font-black tracking-widest">AI REASONING</Badge>
          </div>
          <p className="text-[11px] font-bold leading-[2] text-blue-100/70 tracking-normal">{reasoning}</p>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 rounded-[24px] border border-gray-100 flex items-start gap-3">
        <Radar size={12} className="text-blue-400 mt-0.5 shrink-0 animate-pulse" />
        <p className="text-[9px] font-bold text-gray-400 leading-relaxed tracking-normal">{summary}</p>
      </div>
    </section>
  );
}
