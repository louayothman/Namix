
"use client";

import { MapPin, ShieldX, Target, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TargetMatrixProps {
  entryZone: string;
  targets: { tp1: number; tp2: number; tp3: number };
  invalidatedAt: number;
}

/**
 * @fileOverview صك المستهدفات الاستراتيجية v7.0 - Sovereign Voucher Edition
 * تصميم يدمج بين مفهوم الصكوك المالية والذكاء الاصطناعي بنقاء بصري وفخامة تامة.
 */
export function TargetMatrix({ entryZone, targets, invalidatedAt }: TargetMatrixProps) {
  return (
    <div className="space-y-5 font-body tracking-normal" dir="rtl">
      
      {/* 1. بطاقة التمركز والحماية الموحدة */}
      <div className="relative overflow-hidden bg-white rounded-[32px] border border-gray-100 shadow-sm group transition-all hover:shadow-xl duration-700">
        
        {/* أيقونات الخلفية الشبحية (Subliminal Layers) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
           <MapPin size={110} className="absolute -right-6 -top-6 text-blue-500 opacity-[0.03] -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
           <ShieldX size={110} className="absolute -left-6 -bottom-6 text-red-500 opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
        </div>

        <div className="relative z-10 flex items-stretch h-20">
           {/* نطاق الدخول الاستراتيجي */}
           <div className="flex-1 flex flex-col items-center justify-center space-y-0.5 border-l border-gray-50/50">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">نطاق التمركز</p>
              <p className="text-base md:text-lg font-black text-[#002d4d] tabular-nums tracking-tighter" dir="ltr">
                ${entryZone}
              </p>
           </div>

           {/* صمام الأمان (نقطة الإلغاء) */}
           <div className="flex-1 flex flex-col items-center justify-center space-y-0.5 bg-red-50/10">
              <p className="text-[8px] font-black text-red-400 uppercase tracking-widest">صمام الأمان</p>
              <p className="text-base md:text-lg font-black text-red-600 tabular-nums tracking-tighter" dir="ltr">
                ${invalidatedAt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
           </div>
        </div>
      </div>

      {/* 2. صك المستهدفات الاستراتيجية (The Yield Voucher) */}
      <div className="relative p-6 bg-gray-50/50 rounded-[44px] border border-gray-100 shadow-inner overflow-hidden group/voucher transition-all duration-700 hover:bg-white hover:shadow-2xl">
        
        {/* أيقونة الهدف المركزية في الخلفية */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none group-hover/voucher:opacity-[0.05] transition-opacity duration-1000">
           <Target size={180} strokeWidth={1} />
        </div>

        <div className="flex items-center justify-between mb-5 px-2 relative z-10">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-[#f9a885] transition-transform group-hover/voucher:rotate-12">
                 <Sparkles size={16} />
              </div>
              <div className="text-right">
                 <h4 className="text-[11px] font-black text-[#002d4d] tracking-normal leading-none">صك المستهدفات الاستراتيجية</h4>
                 <p className="text-[6px] font-black text-gray-300 uppercase tracking-[0.2em] mt-1">Sovereign Target Nodes</p>
              </div>
           </div>
           <div className="flex items-center gap-1.5 opacity-30">
              <Zap size={10} className="text-[#f9a885] animate-pulse" />
              <div className="h-1 w-6 bg-gradient-to-r from-transparent to-[#f9a885] rounded-full" />
           </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          {[
            { label: "المستهدف الأول", val: targets.tp1, color: "text-emerald-600", bg: "bg-white", sub: "Primary" },
            { label: "المستهدف الثاني", val: targets.tp2, color: "text-emerald-600", bg: "bg-white", sub: "Growth" },
            { label: "المستهدف الأقصى", val: targets.tp3, color: "text-[#f9a885]", bg: "bg-[#002d4d]", sub: "Elite" },
          ].map((tp, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col items-center gap-1.5 p-4 rounded-[28px] border border-gray-100 shadow-sm text-center transition-all duration-700 hover:-translate-y-1 hover:shadow-xl group/item",
                tp.bg,
                tp.bg.includes('#') ? "border-transparent shadow-blue-900/20" : "hover:border-blue-100"
              )}
            >
              <div className="space-y-0">
                 <span className={cn("text-[7px] font-black uppercase leading-none tracking-widest", tp.bg.includes('#') ? "text-white/40" : "text-gray-400")}>
                   {tp.label}
                 </span>
                 <p className={cn("text-[5px] font-bold uppercase tracking-[0.3em] mt-0.5", tp.bg.includes('#') ? "text-white/20" : "text-gray-300")}>{tp.sub}</p>
              </div>
              <div className="h-0.5 w-4 bg-gray-100 rounded-full group-hover/item:w-8 transition-all duration-700" style={tp.bg.includes('#') ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}} />
              <span className={cn("text-[13px] font-black tabular-nums tracking-tighter leading-none", tp.color)} dir="ltr">
                ${tp.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
