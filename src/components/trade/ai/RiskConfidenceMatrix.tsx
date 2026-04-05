"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RiskConfidenceMatrixProps {
  riskLevel: string;
  riskAction: string;
  confidenceScore: number;
}

/**
 * ConfidenceRing - مؤشر الثقة الحلقي النانوي المتفاعل
 */
function ConfidenceRing({ value, colorClass }: { value: number, colorClass: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-50"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <span className={cn("text-[12px] font-black tabular-nums leading-none", colorClass.replace('text-', 'text-'))}>%{Math.round(value)}</span>
      </div>
    </div>
  );
}

/**
 * @fileOverview مصفوفة المخاطرة والثقة الموحدة v2.0 - Sovereign Unified Card
 * دمج المخاطرة والثقة في صك واحد فخم مع أيقونات خلفية شبحية تفاعلية.
 */
export function RiskConfidenceMatrix({ riskLevel, riskAction, confidenceScore }: RiskConfidenceMatrixProps) {
  const isLowRisk = riskLevel === 'LOW';
  const confidenceColor = confidenceScore >= 70 ? "text-emerald-500" : confidenceScore >= 45 ? "text-blue-500" : "text-red-500";

  return (
    <div className="p-8 rounded-[56px] border border-gray-100 bg-white shadow-[0_32px_64px_-16px_rgba(0,45,77,0.08)] relative overflow-hidden group/matrix font-body tracking-normal transition-all duration-700 hover:shadow-2xl" dir="rtl">
       
       {/* Background Transparent Icons - الذكاء البصري الشبحي */}
       <div className="absolute top-0 right-0 p-6 opacity-[0.02] -rotate-12 pointer-events-none group-hover/matrix:rotate-0 group-hover/matrix:scale-110 transition-all duration-1000 text-[#002d4d]">
          <Radar size={160} />
       </div>
       <div className="absolute bottom-0 left-0 p-6 opacity-[0.02] rotate-12 pointer-events-none group-hover/matrix:rotate-0 group-hover/matrix:scale-110 transition-all duration-1000 text-blue-600">
          <ShieldCheck size={160} />
       </div>

       <div className="relative z-10 flex flex-row items-center justify-between gap-6">
          
          {/* الجناح الأيمن: تقييم المخاطرة */}
          <div className="flex-1 flex flex-col items-start gap-3">
             <div className="flex items-center gap-4">
                <div className={cn(
                  "h-11 w-11 rounded-[18px] flex items-center justify-center shadow-inner transition-transform group-hover/matrix:scale-110 duration-500",
                  isLowRisk ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                   <ShieldAlert size={22} />
                </div>
                <div className="text-right space-y-0.5">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Risk Assessment</p>
                   <p className={cn("text-sm font-black tracking-normal", isLowRisk ? "text-emerald-700" : "text-red-700")}>
                     {riskLevel || "ANALYZING"}
                   </p>
                </div>
             </div>
             <Badge className={cn(
               "border-none font-black text-[8px] px-4 py-1 rounded-full shadow-lg transition-all duration-500 tracking-normal", 
               isLowRisk ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
             )}>
                {riskAction || "HOLD"}
             </Badge>
          </div>

          {/* Separator - فاصل نانوي رقيق */}
          <div className="h-16 w-px bg-gray-50 shrink-0" />

          {/* الجناح الأيسر: مؤشر الثقة الحلقي */}
          <div className="flex flex-col items-center gap-2 px-2">
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none tracking-normal">Confidence</p>
             <ConfidenceRing value={confidenceScore} colorClass={confidenceColor} />
          </div>

       </div>

       {/* خط النبض السفلي */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
    </div>
  );
}
