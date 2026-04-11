
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coins, Gift, ShieldCheck, ArrowDownCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SuccessStepProps {
  categoryType: string;
  successData?: {
    amount: number;
    bonus: number;
    totalAdded: number;
  };
  onBackHome: () => void;
}

export function SuccessStep({ categoryType, successData, onBackHome }: SuccessStepProps) {
  const isNowPayments = categoryType === 'nowpayments';
  const isBinance = categoryType === 'binance';

  return (
    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center py-10 font-body">
      
      {/* Visual Indicator */}
      <div className="relative inline-flex mb-4">
        <div className="h-40 w-40 bg-emerald-50 rounded-[56px] flex items-center justify-center shadow-inner border border-emerald-100 animate-in zoom-in-50 duration-700">
          <CheckCircle2 className="h-20 w-20 text-emerald-500" />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} 
          transition={{ duration: 2, repeat: Infinity }} 
          className="absolute inset-0 bg-emerald-400/20 rounded-[56px] blur-3xl" 
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">تم اعتماد الإيداع</h3>
        <p className="text-gray-400 font-bold text-sm md:text-lg px-8 leading-loose">
          {isBinance 
            ? "لقد تم التحقق من المعرف الرقمي بنجاح. أضيف الرصيد المعتمد لمحفظتك فورياً."
            : isNowPayments 
            ? "آلية المراقبة الذكية فعالة الآن. سيتم حقن الرصيد تلقائياً بمجرد رصد العملية على الشبكة." 
            : "لقد تم استلام بيانات الإيداع بنجاح. سيقوم محرك التدقيق بمراجعة العملية خلال دقائق."}
        </p>
      </div>

      {/* Financial Result Card (For Binance/Automated) */}
      {isBinance && successData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-xs mx-auto p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6"
        >
           <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المبلغ المعتمد للإيداع</p>
              <h4 className="text-3xl font-black text-emerald-600 tabular-nums">${successData.amount.toLocaleString()}</h4>
           </div>

           {successData.bonus > 0 && (
             <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-2">
                      <Gift size={14} className="text-[#f9a885]" />
                      <span className="text-[10px] font-black text-[#002d4d]">مكافأة النظام</span>
                   </div>
                   <span className="text-sm font-black text-[#f9a885] tabular-nums">+$ {successData.bonus.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between px-2 bg-[#002d4d] p-4 rounded-2xl text-white shadow-lg">
                   <span className="text-[10px] font-black uppercase">إجمالي الرصيد المُضاف</span>
                   <span className="text-lg font-black tabular-nums">${successData.totalAdded.toLocaleString()}</span>
                </div>
             </div>
           )}
        </motion.div>
      )}

      {/* Security Signature */}
      <div className="grid gap-4 w-full max-w-sm mx-auto">
        <Button onClick={onBackHome} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-xl active:scale-95 transition-all">
          العودة للوحة القيادة
        </Button>
        <div className="flex items-center justify-center gap-3 opacity-20 mt-2">
           <ShieldCheck size={14} className="text-emerald-500" />
           <p className="text-[9px] font-black text-[#002d4d] uppercase tracking-widest">Automated Verification Protocol v10.0</p>
        </div>
      </div>
    </motion.div>
  );
}
