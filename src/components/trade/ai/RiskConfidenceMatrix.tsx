"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Badge, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskConfidenceMatrixProps {
  riskLevel: string;
  riskAction: string;
  confidenceScore: number;
}

/**
 * ConfidenceRing - مؤشر الثقة الحلقي النانوي المتفاعل
 */
function ConfidenceRing({ value, colorClass }: { value: number, colorClass: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-100"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
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
         <span className={cn("text-[14px] font-black tabular-nums leading-none", colorClass.replace('text-', 'text-'))}>%{Math.round(value)}</span>
         <span className="text-[6px] font-bold text-gray-300 uppercase tracking-tighter mt-0.5">Trust</span>
      </div>
    </div>
  );
}

/**
 * @fileOverview مصفوفة المخاطرة والثقة الموحدة v1.0
 * دمج المخاطرة (يمين) والثقة (يسار) في بطاقة واحدة معزولة.
 */
export function RiskConfidenceMatrix({ riskLevel, riskAction, confidenceScore }: RiskConfidenceMatrixProps) {
  const isLowRisk = riskLevel === 'LOW';
  const confidenceColor = confidenceScore >= 70 ? "text-emerald-500" : confidenceScore >= 45 ? "text-blue-500" : "text-red-500";

  return (
    <div className="grid grid-cols-2 gap-4 font-body tracking-normal" dir="rtl">
       {/* الجناح الأيمن: تقييم المخاطرة */}
       <div className={cn(
         "p-6 rounded-[44px] border shadow-xl relative overflow-hidden transition-all duration-500 bg-white flex flex-col items-center justify-center text-center gap-3",
         isLowRisk ? "border-emerald-100" : "border-red-100"
       )}>
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
             <ShieldCheck size={100} />
          </div>
          <div className={cn(
            "h-10 w-10 rounded-2xl flex items-center justify-center shadow-inner",
            isLowRisk ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
             <ShieldAlert size={20} />
          </div>
          <div className="space-y-0.5">
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Risk Assessment</p>
             <p className={cn("text-xs font-black", isLowRisk ? "text-emerald-700" : "text-red-700")}>
               {riskLevel || "ANALYZING"}
             </p>
          </div>
          <Badge className={cn("border-none font-black text-[7px] px-3 py-1 rounded-full shadow-md", isLowRisk ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
             {riskAction || "HOLD"}
          </Badge>
       </div>

       {/* الجناح الأيسر: مؤشر الثقة الحلقي */}
       <div className="p-6 rounded-[44px] border border-gray-100 shadow-xl bg-white flex flex-col items-center justify-center relative overflow-hidden group/conf">
          <div className="absolute inset-0 bg-gray-50/30 opacity-0 group-hover/conf:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-3 flex flex-col items-center">
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Confidence Level</p>
             <ConfidenceRing value={confidenceScore} colorClass={confidenceColor} />
          </div>
       </div>
    </div>
  );
}
