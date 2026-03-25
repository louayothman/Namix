
"use client";

import { Settings2, ChevronLeft } from "lucide-react";

interface SettingsHeaderProps {
  activeSection: string;
  onBack: () => void;
}

export function SettingsHeader({ activeSection, onBack }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">
          <Settings2 className="h-4 w-4" />
          Infrastructure Console
        </div>
        <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">إعدادات المنصة</h1>
        <p className="text-muted-foreground font-bold text-xs">إدارة مركزية لكافة العمليات الاستراتيجية للهوية المؤسسية للمنصة.</p>
      </div>
      {activeSection !== 'menu' && (
        <button 
          onClick={onBack} 
          className="rounded-full h-14 px-8 text-[11px] font-black bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 group flex items-center gap-3"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          العودة للوحة القيادة
        </button>
      )}
    </div>
  );
}
