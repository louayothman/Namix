
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessStepProps {
  categoryType: string;
  onBackHome: () => void;
}

export function SuccessStep({ categoryType, onBackHome }: SuccessStepProps) {
  const isNowPayments = categoryType === 'nowpayments';

  return (
    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center py-20">
      <div className="relative inline-flex">
        <div className="h-48 w-48 bg-emerald-50 rounded-[64px] flex items-center justify-center shadow-inner border border-emerald-100 animate-in zoom-in-50 duration-700">
          <CheckCircle2 className="h-24 w-24 text-emerald-500" />
        </div>
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[64px] blur-3xl" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-4xl md:text-5xl font-black text-[#002d4d] tracking-tight">تم إطلاق البروتوكول</h3>
        <p className="text-gray-400 font-bold text-base md:text-xl px-12 leading-loose">
          {isNowPayments 
            ? "سيتم تحديث رصيدك آلياً بمجرد رصد الحوالة في سجلات البلوكشين العالمية (0 Confirmation)." 
            : "لقد تم استلام بيانات الإيداع. سيقوم محرك التدقيق بمراجعة العملية وحقن الرصيد خلال دقائق معدودة."}
        </p>
      </div>

      <Button onClick={onBackHome} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl active:scale-95 transition-all">
        العودة للوحة القيادة
      </Button>
    </motion.div>
  );
}
