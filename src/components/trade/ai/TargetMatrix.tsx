
"use client";

import { MapPin, ShieldX, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface TargetMatrixProps {
  entryZone: string;
  targets: { tp1: number; tp2: number; tp3: number };
  invalidatedAt: number;
}

export function TargetMatrix({ entryZone, targets, invalidatedAt }: TargetMatrixProps) {
  return (
    <div className="space-y-4 font-body" dir="rtl">
      {/* Entry & Invalidation Nodes */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-[28px] border border-gray-100 shadow-sm space-y-2 group hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-blue-500" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">سعر الدخول</span>
          </div>
          <p className="text-base font-black text-[#002d4d] tabular-nums tracking-tighter" dir="ltr">${entryZone}</p>
        </div>
        <div className="p-4 bg-red-50/30 rounded-[28px] border border-red-100 space-y-2 group hover:shadow-md transition-all">
          <div className="flex items-center gap-2">
            <ShieldX size={12} className="text-red-500" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">نقطة الإلغاء</span>
          </div>
          <p className="text-base font-black text-red-600 tabular-nums tracking-tighter" dir="ltr">${invalidatedAt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Targets Voucher */}
      <div className="relative p-4 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner overflow-hidden">
        <div className="flex items-center gap-2 mb-4 px-1">
           <Target size={14} className="text-emerald-500" />
           <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-widest">أهداف جني الأرباح المعتمدة</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "الهدف الأول", val: targets.tp1, color: "text-emerald-600" },
            { label: "الهدف الثاني", val: targets.tp2, color: "text-emerald-600" },
            { label: "الهدف الأقصى", val: targets.tp3, color: "text-[#f9a885]" },
          ].map((tp, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-[7px] font-black text-gray-400 uppercase">{tp.label}</span>
              <span className={cn("text-[11px] font-black tabular-nums tracking-tighter", tp.color)} dir="ltr">
                ${tp.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
