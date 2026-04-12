"use client";

import { Button } from "@/components/ui/button";
import { BarChart3, Sparkles } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1 text-right">
        <div className="flex items-center gap-2 text-emerald-500 font-normal text-[10px] uppercase tracking-widest justify-end">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          مركز التحكم والتحليل الاستراتيجي
        </div>
        <h1 className="text-2xl font-normal text-[#002d4d]">إدارة المنصة المركزية</h1>
        <p className="text-muted-foreground font-normal text-[11px] flex items-center gap-2 justify-end">
          <Sparkles className="h-3.5 w-3.5 text-[#f9a885]" />
          تحليلات ذكاء أعمال لحظية متصلة بقاعدة البيانات.
        </p>
      </div>
      <div className="flex items-center gap-4">
         <div className="flex flex-col items-end">
            <p className="text-[9px] font-normal text-gray-400 uppercase">حالة النظام</p>
            <p className="text-[11px] font-normal text-emerald-600">مستقر ومتصل</p>
         </div>
         <div className="h-8 w-px bg-gray-100" />
         <Button variant="outline" className="rounded-full border-gray-100 font-normal text-[11px] h-9 px-4 hover:bg-[#002d4d] hover:text-white transition-all shadow-sm">
            <BarChart3 className="ml-2 h-3.5 w-3.5" /> التقارير الإدارية
         </Button>
      </div>
    </div>
  );
}