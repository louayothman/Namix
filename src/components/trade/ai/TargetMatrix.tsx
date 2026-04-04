
"use client";

import { MapPin, ShieldX, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TargetMatrixProps {
  entryZone: string;
  targets: { tp1: number; tp2: number; tp3: number };
  invalidatedAt: number;
}

/**
 * @fileOverview مصفوفة الأهداف السيادية v6.0 - Unified Sovereign Card
 * تصميم يدمج نقاط الدخول والحماية في بطاقة واحدة مع أيقونات خلفية شفافة.
 */
export function TargetMatrix({ entryZone, targets, invalidatedAt }: TargetMatrixProps) {
  return (
    <div className="space-y-4 font-body tracking-normal" dir="rtl">
      
      {/* 1. البطاقة السيادية الموحدة (Entry & Invalidation) */}
      <div className="relative overflow-hidden bg-white rounded-[32px] border border-gray-100 shadow-sm group transition-all hover:shadow-xl">
        
        {/* أيقونات الخلفية الشبحية (Ghost Icons) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
           <MapPin size={100} className="absolute -right-6 -top-6 text-blue-500 opacity-[0.03] -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
           <ShieldX size={100} className="absolute -left-6 -bottom-6 text-red-500 opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
        </div>

        <div className="relative z-10 flex items-stretch h-20">
           {/* قسم سعر الدخول */}
           <div className="flex-1 flex flex-col items-center justify-center space-y-0.5 border-l border-gray-50/50">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">سعر الدخول</p>
              <p className="text-lg font-black text-[#002d4d] tabular-nums tracking-tighter" dir="ltr">
                ${entryZone}
              </p>
           </div>

           {/* قسم نقطة الإلغاء */}
           <div className="flex-1 flex flex-col items-center justify-center space-y-0.5 bg-red-50/10">
              <p className="text-[8px] font-black text-red-400 uppercase tracking-widest">نقطة الإلغاء</p>
              <p className="text-lg font-black text-red-600 tabular-nums tracking-tighter" dir="ltr">
                ${invalidatedAt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
           </div>
        </div>
      </div>

      {/* 2. صك أهداف جني الأرباح (Targets Voucher) */}
      <div className="relative p-4 bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-inner overflow-hidden group/voucher">
        <div className="flex items-center justify-between mb-4 px-1">
           <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center shadow-sm text-emerald-500">
                 <Target size={14} />
              </div>
              <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-widest">أهداف جني الأرباح</span>
           </div>
           <div className="flex items-center gap-1 opacity-20">
              <Zap size={10} className="text-[#f9a885] animate-pulse" />
              <span className="text-[7px] font-black uppercase">Active Path</span>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "الهدف الأول", val: targets.tp1, color: "text-emerald-600", bg: "bg-white" },
            { label: "الهدف الثاني", val: targets.tp2, color: "text-emerald-600", bg: "bg-white" },
            { label: "الهدف الأقصى", val: targets.tp3, color: "text-[#f9a885]", bg: "bg-[#002d4d]" },
          ].map((tp, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-2xl border border-gray-100 shadow-sm text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md",
                tp.bg,
                tp.bg.includes('#') ? "border-transparent" : ""
              )}
            >
              <span className={cn("text-[7px] font-black uppercase leading-none mb-1", tp.bg.includes('#') ? "text-white/40" : "text-gray-400")}>
                {tp.label}
              </span>
              <span className={cn("text-[11px] font-black tabular-nums tracking-tighter leading-none", tp.color)} dir="ltr">
                ${tp.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
