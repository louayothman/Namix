
"use client";

import { Badge } from "@/components/ui/badge";
import { Radar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface BiasHeaderProps {
  bias: 'Long' | 'Short' | 'Neutral';
}

export function BiasHeader({ bias }: BiasHeaderProps) {
  const labelMap = {
    Long: 'صعود استراتيجي',
    Short: 'هبوط استراتيجي',
    Neutral: 'تذبذب عرضي'
  };

  const colorMap = {
    Long: 'bg-emerald-500',
    Short: 'bg-red-500',
    Neutral: 'bg-gray-100'
  };

  const textMap = {
    Long: 'text-emerald-500',
    Short: 'text-red-500',
    Neutral: 'text-gray-400'
  };

  return (
    <section className="flex items-center justify-between px-2 font-body" dir="rtl">
      <div className="space-y-1 text-right">
        <div className="flex items-center gap-3 justify-end">
          <h4 className="text-xl font-black text-[#002d4d] tracking-normal">{labelMap[bias]}</h4>
          <Badge className={cn("font-black text-[9px] px-3 py-1 border-none shadow-sm", colorMap[bias], bias === 'Neutral' ? 'text-gray-400' : 'text-white')}>
            {bias.toUpperCase()}
          </Badge>
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Market Directional Bias</p>
      </div>
      <div className="text-left">
        <div className={cn("h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner", textMap[bias])}>
          <Radar size={20} className="animate-pulse" />
        </div>
      </div>
    </section>
  );
}
