
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
 * @fileOverview مصفوفة الأهداف الاستراتيجية الموحدة v10.0 - Sovereign Unified Flow
 * تصميم يدمج كافة المناطق الفنية (دخول، حماية، أهداف) في صك واحد نقي وفخم.
 */
export function TargetMatrix({ entryZone, targets, invalidatedAt }: TargetMatrixProps) {
  return (
    <div className="space-y-4 font-body tracking-normal" dir="rtl">
      
      {/* صك البيانات الاستراتيجية الموحد */}
      <div className="relative p-7 bg-white rounded-[48px] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,45,77,0.08)] overflow-hidden group transition-all duration-1000 hover:shadow-2xl">
        
        {/* أيقونة الهدف السيادية - خلفية شفافة تفاعلية */}
        <div className="absolute -bottom-12 -left-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.06] group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000 text-[#002d4d]">
           <Target size={240} strokeWidth={1} />
        </div>

        {/* الطبقة الأولى: المناطق الفنية (دخول وحماية) */}
        <div className="flex items-center justify-between relative z-10 mb-8 border-b border-gray-50 pb-6">
           <div className="flex-1 flex flex-col items-center text-center space-y-1.5">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">نطاق التمركز</span>
              <p className="text-sm font-black text-[#002d4d] tabular-nums tracking-tighter" dir="ltr">
                ${entryZone}
              </p>
           </div>

           {/* فاصل نانوي | */}
           <div className="h-6 w-[1px] bg-gray-100 mx-2 opacity-50" />

           <div className="flex-1 flex flex-col items-center text-center space-y-1.5">
              <span className="text-[8px] font-black text-red-400 uppercase tracking-widest leading-none">صمام الأمان</span>
              <p className="text-sm font-black text-red-600 tabular-nums tracking-tighter" dir="ltr">
                ${invalidatedAt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
           </div>
        </div>

        {/* الطبقة الثانية: عنوان الأهداف الاستراتيجية */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
           <h4 className="text-base font-black text-[#002d4d] tracking-normal leading-none">الأهداف الاستراتيجية</h4>
           <div className="flex items-center gap-2 mt-1.5 opacity-30">
              <div className="h-[0.5px] w-4 bg-[#002d4d]" />
              <p className="text-[7px] font-black uppercase tracking-[0.3em] tracking-normal">Strategic Target Nodes</p>
              <div className="h-[0.5px] w-4 bg-[#002d4d]" />
           </div>
        </div>

        {/* الطبقة الثالثة: تدفق المستهدفات (TP Flow) */}
        <div className="flex items-center justify-between relative z-10 px-2">
          
          {/* Target 1 */}
          <div className="flex-1 flex flex-col items-center text-center space-y-1.5">
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-normal">الهدف 1</span>
             <span className="text-[13px] font-black text-emerald-600 tabular-nums tracking-tighter" dir="ltr">
               ${targets.tp1.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
          </div>

          {/* Separator | */}
          <div className="h-6 w-[1px] bg-gray-100 mx-2 opacity-50" />

          {/* Target 2 */}
          <div className="flex-1 flex flex-col items-center text-center space-y-1.5">
             <span className="text-[8px] font-black text-gray-400 uppercase tracking-normal">الهدف 2</span>
             <span className="text-[13px] font-black text-emerald-600 tabular-nums tracking-tighter" dir="ltr">
               ${targets.tp2.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
          </div>

          {/* Separator | */}
          <div className="h-6 w-[1px] bg-gray-100 mx-2 opacity-50" />

          {/* Target Max */}
          <div className="flex-1 flex flex-col items-center text-center space-y-1.5 group/max">
             <div className="flex items-center gap-1">
                <span className="text-[8px] font-black text-[#f9a885] uppercase tracking-normal">الهدف الأقصى</span>
                <Sparkles size={8} className="text-[#f9a885] animate-pulse" />
             </div>
             <span className="text-[13px] font-black text-[#002d4d] tabular-nums tracking-tighter group-hover/max:text-[#f9a885] transition-colors" dir="ltr">
               ${targets.tp3.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
          </div>

        </div>

        {/* خط الطاقة السفلي - لمسة نهائية */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent rounded-full" />
      </div>
    </div>
  );
}
