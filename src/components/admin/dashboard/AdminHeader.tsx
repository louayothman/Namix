"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Sparkles } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em]">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Strategic Intelligence Hub
        </div>
        <h1 className="text-2xl font-black text-[#002d4d]">مركز القيادة والتحكم</h1>
        <p className="text-muted-foreground font-bold text-[10px] flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-[#f9a885]" />
          تحليلات ذكاء أعمال لحظية متصلة بقاعدة البيانات 100%.
        </p>
      </div>
      <div className="flex items-center gap-4">
         <div className="flex flex-col items-end">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">System Health</p>
            <p className="text-[11px] font-black text-emerald-600">Stable & Resilient</p>
         </div>
         <div className="h-8 w-px bg-gray-100" />
         <Button variant="outline" className="rounded-full border-gray-100 font-bold text-[10px] h-9 px-4 hover:bg-[#002d4d] hover:text-white transition-all shadow-sm">
            <BarChart3 className="ml-2 h-3.5 w-3.5" /> استخراج التقارير الإدارية
         </Button>
      </div>
    </div>
  );
}
