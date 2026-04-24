
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Minus, 
  Zap, 
  Clock, 
  Coins, 
  PlayCircle, 
  Loader2,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ParameterConsoleProps {
  amount: number;
  onAmountChange: (val: number) => void;
  duration: number;
  onDurationChange: (val: number) => void;
  durations: { label: string, seconds: number }[];
  balance: number;
  minAmount: number;
  maxAmount: number;
  onExecute: () => void;
  isExecuting: boolean;
  decision: 'BUY' | 'SELL' | 'HOLD';
}

/**
 * @fileOverview قُمرة التنفيذ الموحدة v11.0 - Liquidity Safety Protocol
 * تم إضافة محرك فحص الرصيد اللحظي لضمان سلامة التنفيذ ومنع الأخطاء المالية.
 */
export function ParameterConsole({ 
  amount, 
  onAmountChange, 
  duration, 
  onDurationChange, 
  durations,
  balance,
  minAmount,
  maxAmount,
  onExecute,
  isExecuting,
  decision
}: ParameterConsoleProps) {

  const adjustAmount = (val: number) => {
    const next = Math.max(minAmount, Math.min(maxAmount, amount + val));
    onAmountChange(next);
  };

  const isBuy = decision === 'BUY';
  const isSell = decision === 'SELL';
  const isHold = decision === 'HOLD';
  const isInsufficient = balance < amount;

  return (
    <div className="p-1 font-body select-none" dir="rtl">
      <div className="bg-white rounded-[44px] border border-gray-100 shadow-[0_20px_50px_-12px_rgba(0,45,77,0.08)] overflow-hidden flex flex-col group transition-all duration-700 hover:shadow-2xl">
        
        {/* Section 1: Amount Control - التدقيق المالي */}
        <div className="p-8 space-y-5">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <Coins size={14} className="text-[#f9a885]" />
                <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-normal">حقن السيولة</span>
             </div>
             <Badge 
               variant="outline" 
               className={cn(
                 "border-none font-black text-[8px] px-3 py-1 rounded-full tabular-nums shadow-inner transition-colors duration-500",
                 isInsufficient ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"
               )}
             >
                {isInsufficient ? "عجز في الرصيد" : `Avl: $${balance.toLocaleString()}`}
             </Badge>
          </div>

          <div className="flex items-center gap-3">
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={() => adjustAmount(-10)}
               className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-inner border border-gray-100"
             >
                <Minus size={20} />
             </motion.button>

             <div className="flex-1 relative group/input">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => onAmountChange(Number(e.target.value))}
                  className={cn(
                    "h-14 w-full rounded-2xl bg-gray-50 border-none font-black text-center text-2xl shadow-inner focus:ring-2 transition-all outline-none tabular-nums",
                    isInsufficient ? "text-red-500 focus:ring-red-100" : "text-[#002d4d] focus:ring-blue-500/10"
                  )}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
                   <span className="text-sm font-bold">$</span>
                </div>
             </div>

             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={() => adjustAmount(10)}
               className="h-14 w-14 rounded-2xl bg-[#002d4d] flex items-center justify-center text-[#f9a885] hover:bg-[#001d33] transition-all shadow-xl"
             >
                <Plus size={20} />
             </motion.button>
          </div>
        </div>

        {/* Section 2: Duration Selector - نافذة التنفيذ */}
        <div className="px-8 pb-8 space-y-4">
           <div className="flex items-center gap-2 px-2">
              <Clock size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-normal">نافذة التنفيذ</span>
           </div>
           <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-[22px] border border-gray-100 shadow-inner overflow-x-auto scrollbar-none">
              {durations.slice(0, 6).map((d, idx) => (
                <button
                  key={`${d.label}-${idx}`}
                  onClick={() => onDurationChange(d.seconds)}
                  className={cn(
                    "flex-1 h-10 rounded-xl font-black text-[10px] transition-all duration-500 tabular-nums border",
                    duration === d.seconds 
                      ? "bg-white text-[#002d4d] border-gray-100 shadow-sm" 
                      : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  {duration === d.seconds && <motion.div layoutId="active-dur-min" className="absolute inset-0 bg-[#f9a885]/5" />}
                  <span className="relative z-10">{d.label}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Section 3: Execution Button - القاعدة الذكية */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-50">
           <Button
             onClick={onExecute}
             disabled={isExecuting || isHold || isInsufficient}
             className={cn(
               "w-full h-18 rounded-[32px] text-white font-black text-lg shadow-xl transition-all duration-1000 group active:scale-[0.98] relative overflow-hidden",
               isInsufficient ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" :
               isBuy ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20" :
               isSell ? "bg-red-600 hover:bg-red-700 shadow-red-900/20" :
               "bg-gray-200 text-gray-400 border-none shadow-none"
             )}
           >
             <AnimatePresence mode="wait">
               {isExecuting ? (
                 <motion.div key="executing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                    <Loader2 className="animate-spin h-6 w-6" />
                    <span>جاري التنفيذ...</span>
                 </motion.div>
               ) : (
                 <motion.div 
                   key="idle" 
                   initial={{ opacity: 0, y: 10 }} 
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-3"
                 >
                    {isInsufficient ? (
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5" />
                        <span>رصيد غير كافٍ للتنفيذ</span>
                      </div>
                    ) : isHold ? (
                      <span className="opacity-60">بانتظار الإشارة الاستباقية...</span>
                    ) : (
                      <>
                        <span>تأكيد بروتوكول {isBuy ? 'الشراء' : 'البيع'}</span>
                        <PlayCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
                      </>
                    )}
                 </motion.div>
               )}
             </AnimatePresence>

             {(!isHold && !isInsufficient) && (
               <motion.div 
                 animate={{ opacity: [0.1, 0.3, 0.1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-white/10 pointer-events-none" 
               />
             )}
           </Button>
        </div>

        {/* Bottom Metadata - الختم الموثق */}
        <div className="py-3 bg-[#002d4d] flex items-center justify-center gap-4 opacity-90">
           <div className="flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-emerald-400" />
              <p className="text-[7px] font-black text-blue-100/40 uppercase tracking-widest">Protocol Verified</p>
           </div>
           <div className="h-3 w-px bg-white/10" />
           <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-[#f9a885]" />
              <p className="text-[7px] font-black text-blue-100/40 uppercase tracking-widest">Instant Activation</p>
           </div>
        </div>
      </div>
    </div>
  );
}
