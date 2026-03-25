"use client";

import { Badge } from "@/components/ui/badge";

interface ReportsHeaderProps {
  now: Date;
}

export function ReportsHeader({ now }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
      <div className="space-y-2 text-right">
        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Sovereign Financial Intelligence
        </div>
        <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">التقارير والملاءة المالية</h1>
        <p className="text-muted-foreground font-bold text-xs">تحليل شامل لتدفقات الخزينة، الأرباح الموزعة، وصافي ربحية المنصة السيادية.</p>
      </div>
      
      <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-gray-100 shadow-sm">
         <div className="px-6 py-2 border-l border-gray-100">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-right">توقيت التقرير</p>
            <p className="text-[11px] font-black text-[#002d4d] tabular-nums">{now.toLocaleTimeString('ar-EG')}</p>
         </div>
         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-4 py-1.5 rounded-full shadow-inner animate-pulse">
            LIVE ENGINE ACTIVE
         </Badge>
      </div>
    </div>
  );
}
