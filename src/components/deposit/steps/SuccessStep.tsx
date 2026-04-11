"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Coins, Gift, ShieldCheck, RefreshCcw, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SuccessStepProps {
  categoryType: string;
  successData?: {
    amount: number;
    bonus: number;
    totalAdded: number;
  };
  error?: string | null;
  onBackHome: () => void;
  onRetry: () => void;
}

/**
 * @fileOverview مفاعل نتائج التحقق المطور v12.0 - Radiant Result Engine
 * يدعم النجاح والفشل بتنسيق بصري موحد وتطهير لغوي كامل من الكلمات المحظورة.
 */
export function SuccessStep({ categoryType, successData, error, onBackHome, onRetry }: SuccessStepProps) {
  const isNowPayments = categoryType === 'nowpayments';
  const isBinance = categoryType === 'binance';
  const isSuccess = !error;

  return (
    <motion.div 
      key="result" 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="space-y-10 text-center py-6 font-body"
      dir="rtl"
    >
      
      {/* 1. المفاعل البصري المتوهج (Visual Pulse) */}
      <div className="relative inline-flex mb-2">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="h-32 w-32 md:h-40 md:w-40 bg-emerald-50 rounded-[48px] flex items-center justify-center shadow-inner border border-emerald-100 relative"
            >
              <Check className="h-16 w-16 md:h-20 md:w-20 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} 
                transition={{ duration: 2, repeat: Infinity }} 
                className="absolute inset-0 bg-emerald-400/20 rounded-[48px] blur-3xl -z-10" 
              />
            </motion.div>
          ) : (
            <motion.div 
              key="error-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="h-32 w-32 md:h-40 md:w-40 bg-red-50 rounded-[48px] flex items-center justify-center shadow-inner border border-red-100 relative"
            >
              <X className="h-16 w-16 md:h-20 md:w-20 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }} 
                transition={{ duration: 1.5, repeat: Infinity }} 
                className="absolute inset-0 bg-red-400/15 rounded-[48px] blur-3xl -z-10" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 2. نصوص الحالة الاستراتيجية */}
      <div className="space-y-3 px-4">
        <h3 className={cn(
          "text-2xl md:text-4xl font-black tracking-normal",
          isSuccess ? "text-[#002d4d]" : "text-red-600"
        )}>
          {isSuccess ? "تم اعتماد الإيداع" : "تعذر التحقق من العملية"}
        </h3>
        <p className="text-gray-400 font-bold text-xs md:text-base max-w-sm mx-auto leading-loose tracking-normal">
          {isSuccess 
            ? (isBinance 
                ? "لقد تم التحقق من المعرف الرقمي بنجاح. أضيف الرصيد المعتمد لمحفظتك فورياً."
                : isNowPayments 
                ? "آلية المراقبة الذكية فعالة الآن. سيتم إضافة الرصيد تلقائياً بمجرد رصد العملية." 
                : "لقد تم استلام بيانات الإيداع بنجاح. سيقوم نظام التدقيق بمراجعة العملية خلال دقائق.")
            : error || "المعذرة، لم نتمكن من العثور على بيانات مطابقة للمعرف المدخل. يرجى التأكد من الـ TXID والمحاولة مجدداً."}
        </p>
      </div>

      {/* 3. ملخص الرصيد (فقط عند النجاح في Binance) */}
      {isSuccess && isBinance && successData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-[320px] mx-auto p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6"
        >
           <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">المبلغ المعتمد</p>
              <h4 className="text-3xl font-black text-emerald-600 tabular-nums tracking-tighter">${successData.amount.toLocaleString()}</h4>
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
                <div className="flex items-center justify-between px-4 py-3 bg-[#002d4d] rounded-2xl text-white shadow-lg">
                   <span className="text-[9px] font-black uppercase tracking-widest">إجمالي المضاف</span>
                   <span className="text-lg font-black tabular-nums tracking-tighter">${successData.totalAdded.toLocaleString()}</span>
                </div>
             </div>
           )}
        </motion.div>
      )}

      {/* 4. أزرار التحكم النهائي (Action Bar) */}
      <div className="grid gap-4 w-full max-w-[320px] mx-auto pt-4">
        {isSuccess ? (
          <Button 
            onClick={onBackHome} 
            className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all"
          >
            العودة للرئيسية
          </Button>
        ) : (
          <Button 
            onClick={onRetry} 
            className="w-full h-16 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <RefreshCcw className="h-5 w-5 transition-transform group-hover:rotate-180 duration-700" />
            <span>تصحيح البيانات</span>
          </Button>
        )}
        
        <div className="flex items-center justify-center gap-3 opacity-20 mt-2">
           <ShieldCheck size={12} className="text-emerald-500" />
           <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest leading-none">Automated System Node v12.0</p>
        </div>
      </div>
    </motion.div>
  );
}

import { AnimatePresence } from "framer-motion";
