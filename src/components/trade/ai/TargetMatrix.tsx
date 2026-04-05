
"use client";

import { Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TargetMatrixProps {
  entryZone: string;
  targets: { tp1: number; tp2: number; tp3: number };
  invalidatedAt: number;
}

/**
 * @fileOverview الأهداف الاستراتيجية v8.0 - Sovereign Borderless Edition
 * تصميم نقي تماماً يعتمد على الأيقونة الخلفية والتدفق المفتوح للأرقام مع فواصل نانوية.
 */
export function TargetMatrix({ entryZone, targets, invalidatedAt }: TargetMatrixProps) {
  return (
    <div className="space-y-4 font-body tracking-normal" dir="rtl">
      
      {/* 1. بطاقة التمركز وصمام الأمان - تصميم زجاجي موحد */}
      <div className="relative overflow-hidden bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-inner group transition-all duration-700 hover:bg-white hover:shadow-xl">
        <div className="relative z-10 flex items-stretch h-16">
           {/* نطاق الدخول */}
           <div className="flex-1 flex flex-col items-center justify-center space-y-0.5 border-l border-gray-100/50">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">نطاق التمركز</p>
              <p className="text-sm font-black text-[#002d4d] tabular-nums tracking-tighter" dir="ltr">
                ${entryZone}
              </p>
           </div>

           {/* صمام الأمان */}
           <div className="flex-1 flex flex-col items-center justify-center space-y-0.5">
              <p className="text-[7px] font-black text-red-400 uppercase tracking-widest">صمام الأمان</p>
              <p className="text-sm font-black text-red-600 tabular-nums tracking-tighter" dir="ltr">
                ${invalidatedAt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
           </div>
        </div>
      </div>

      {/* 2. مصفوفة الأهداف الاستراتيجية - تصميم مفتوح وفخم */}
      <div className="relative p-6 bg-white rounded-[44px] border border-gray-100 shadow-sm overflow-hidden group/matrix transition-all duration-700 hover:shadow-2xl">
        
        {/* أيقونة الهدف المركزية الشبحية - تفاعلية عند التمرير */}
        <div className="absolute -bottom-10 -left-10 opacity-[0.02] pointer-events-none group-hover/matrix:opacity-[0.05] group-hover/matrix:rotate-12 transition-all duration-1000 text-[#002d4d]">
           <Target size={220} strokeWidth={1} />
        </div>

        {/* Header - No Icons */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
           <h4 className="text-base font-black text-[#002d4d] tracking-normal">الأهداف الاستراتيجية</h4>
           <div className="flex items-center gap-2 mt-1 opacity-30">
              <div className="h-[0.5px] w-4 bg-[#002d4d]" />
              <p className="text-[7px] font-black uppercase tracking-[0.3em]">Strategic Target Nodes</p>
              <div className="h-[0.5px] w-4 bg-[#002d4d]" />
           </div>
        </div>

        {/* Targets Flow with Nano-Separators */}
        <div className="flex items-center justify-between relative z-10 px-2">
          
          {/* Target 1 */}
          <div className="flex-1 flex flex-col items-center text-center space-y-1">
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-normal">الهدف 1</span>
             <span className="text-sm font-black text-emerald-600 tabular-nums tracking-tighter" dir="ltr">
               ${targets.tp1.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
          </div>

          {/* Separator | */}
          <div className="h-6 w-[1px] bg-gray-100 mx-2 opacity-50" />

          {/* Target 2 */}
          <div className="flex-1 flex flex-col items-center text-center space-y-1">
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-normal">الهدف 2</span>
             <span className="text-sm font-black text-emerald-600 tabular-nums tracking-tighter" dir="ltr">
               ${targets.tp2.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
          </div>

          {/* Separator | */}
          <div className="h-6 w-[1px] bg-gray-100 mx-2 opacity-50" />

          {/* Target Max */}
          <div className="flex-1 flex flex-col items-center text-center space-y-1 group/max">
             <div className="flex items-center gap-1">
                <span className="text-[8px] font-black text-[#f9a885] uppercase tracking-normal">الهدف الأقصى</span>
                <Sparkles size={8} className="text-[#f9a885] animate-pulse" />
             </div>
             <span className="text-sm font-black text-[#002d4d] tabular-nums tracking-tighter group-hover/max:text-[#f9a885] transition-colors" dir="ltr">
               ${targets.tp3.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
          </div>

        </div>

        {/* Dynamic Light Strip */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#f9a885]/20 to-transparent rounded-full" />
      </div>
    </div>
  );
}
