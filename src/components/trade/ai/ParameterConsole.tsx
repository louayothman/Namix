
"use client";

import React from "react";
import { RadialControl } from "./RadialControl";
import { Wallet, Clock, ShieldCheck, Coins } from "lucide-react";

interface ParameterConsoleProps {
  amount: number;
  onAmountChange: (val: number) => void;
  duration: number;
  onDurationChange: (val: number) => void;
  durations: { label: string, seconds: number }[];
  balance: number;
  minAmount: number;
  maxAmount: number;
}

/**
 * @fileOverview قُمرة المعايير التكتيكية v4.0 - Side-by-Side Dual Wings
 * عرض المبلغ والمدة جنباً إلى جنب لتقليل التمرير، مع استخدام المتحكمات الدائرية.
 */
export function ParameterConsole({ 
  amount, 
  onAmountChange, 
  duration, 
  onDurationChange, 
  durations,
  balance,
  minAmount,
  maxAmount
}: ParameterConsoleProps) {
  
  // منطق سحب المبلغ: الحساسية تعتمد على الرصيد
  const handleAmountDrag = (delta: number) => {
    const step = balance / 200; // حساسية ديناميكية
    const next = Math.max(minAmount, Math.min(maxAmount, amount + (delta * step)));
    onAmountChange(Number(next.toFixed(2)));
  };

  // منطق سحب المدة: التنقل بين خيارات المشرف
  const currentDurationIndex = durations.findIndex(d => d.seconds === duration);
  const handleDurationDrag = (delta: number) => {
    if (Math.abs(delta) < 5) return; // Deadzone للحساسية
    const direction = delta > 0 ? 1 : -1;
    const nextIdx = Math.max(0, Math.min(durations.length - 1, currentDurationIndex + direction));
    onDurationChange(durations[nextIdx].seconds);
  };

  const amountPercentage = ((amount - minAmount) / (Math.min(maxAmount, balance) - minAmount)) * 100;
  const durationPercentage = ((currentDurationIndex + 1) / durations.length) * 100;

  return (
    <div className="space-y-8 font-body select-none" dir="rtl">
      
      <div className="grid grid-cols-2 gap-4">
        {/* الجناح الأيمن: هندسة السيولة */}
        <div className="p-4 bg-white rounded-[40px] border border-gray-50 shadow-sm flex flex-col items-center justify-center">
           <RadialControl 
             label="حقن السيولة"
             subLabel={`Balance: $${balance.toFixed(0)}`}
             value={`$${amount.toLocaleString()}`}
             percentage={amountPercentage}
             icon={Wallet}
             colorClass="stroke-blue-600"
             onDrag={handleAmountDrag}
           />
        </div>

        {/* الجناح الأيسر: نافذة الاستحقاق */}
        <div className="p-4 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
           <RadialControl 
             label="نافذة التنفيذ"
             subLabel="Fixed Nodes"
             value={durations[currentDurationIndex]?.label || "..."}
             percentage={durationPercentage}
             icon={Clock}
             colorClass="stroke-[#f9a885]"
             onDrag={handleDurationDrag}
           />
        </div>
      </div>

      {/* تذييل الميثاق النانوي */}
      <div className="flex items-center justify-center gap-6 opacity-20 pt-2">
         <div className="flex items-center gap-2">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-widest">Authorized Execution</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-200" />
         <div className="flex items-center gap-2">
            <Coins size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-widest">Precision Yield Core</span>
         </div>
      </div>

    </div>
  );
}
