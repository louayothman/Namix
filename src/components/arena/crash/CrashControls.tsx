
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Zap, Loader2, MousePointerClick, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CrashControlsProps {
  state: 'waiting' | 'running' | 'crashed';
  onPlaceBet: (amount: number) => void;
  onCashout: () => void;
  currentBet: number | null;
  hasCashedOut: boolean;
  multiplier: number;
  balance: number;
  feedback: { type: 'success' | 'error' | 'info', msg: string } | null;
}

/**
 * @fileOverview محطة التحكم بمفاعل Crash v2.0 - Modern Interface
 * تم دمج نظام التنويهات المدمجة وتطهير الطباعة العربية.
 */
export function CrashControls({ 
  state, 
  onPlaceBet, 
  onCashout, 
  currentBet, 
  hasCashedOut, 
  multiplier, 
  balance,
  feedback
}: CrashControlsProps) {
  const [amount, setAmount] = useState("10");

  const canBet = state === 'waiting' && !currentBet;
  const canCashout = state === 'running' && currentBet && !hasCashedOut;

  return (
    <div className="space-y-6 font-body tracking-normal">
      
      {/* Dynamic Feedback Node */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "p-4 rounded-[24px] border flex items-center gap-3 shadow-lg",
              feedback.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
              feedback.type === 'error' ? "bg-red-50 border-red-100 text-red-700" : "bg-blue-50 border-blue-100 text-blue-700"
            )}
          >
            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
               {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            </div>
            <p className="text-[11px] font-black leading-relaxed">{feedback.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-3">
           <div className="flex items-center gap-2">
              <Coins className="h-3.5 w-3.5 text-orange-400" />
              <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">مبلغ الرهان</p>
           </div>
           <span className="text-[9px] font-bold text-gray-300 tabular-nums">BALANCE: ${balance.toLocaleString()}</span>
        </div>
        
        <div className="relative group p-1.5 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner flex items-center">
           <button 
             onClick={() => setAmount(prev => Math.max(1, Number(prev) - 10).toString())}
             disabled={!canBet}
             className="h-11 w-11 rounded-2xl bg-white text-[#002d4d] flex items-center justify-center shadow-sm border border-gray-100 active:scale-90 transition-all disabled:opacity-30"
           >
              -
           </button>
           <Input 
             type="number" 
             value={amount} 
             onChange={e => setAmount(e.target.value)}
             disabled={!canBet}
             className="flex-1 bg-transparent border-none font-black text-center text-2xl shadow-none focus-visible:ring-0 tabular-nums text-[#002d4d]" 
           />
           <button 
             onClick={() => setAmount(prev => (Number(prev) + 10).toString())}
             disabled={!canBet}
             className="h-11 w-11 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30"
           >
              +
           </button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-1">
           {[10, 50, 100, "MAX"].map((v, i) => (
             <button 
               key={i} 
               onClick={() => setAmount(v === "MAX" ? Math.floor(balance).toString() : v.toString())}
               disabled={!canBet}
               className="h-9 rounded-xl bg-white text-[9px] font-black text-[#002d4d] hover:bg-[#002d4d] hover:text-white transition-all border border-gray-100 shadow-sm"
             >
               {v === "MAX" ? "الكل" : `$${v}`}
             </button>
           ))}
        </div>
      </div>

      <div className="pt-2">
        {canCashout ? (
          <Button 
            onClick={onCashout}
            className="w-full h-20 rounded-[36px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-2xl shadow-emerald-900/30 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
             <p className="relative z-10 text-[9px] font-black opacity-60 uppercase tracking-widest">سحب الأرباح الآن</p>
             <span className="relative z-10 text-3xl tabular-nums tracking-tighter flex items-baseline gap-1">
               <span className="text-base opacity-40">$</span>{(currentBet * multiplier).toFixed(2)}
             </span>
          </Button>
        ) : (
          <Button 
            onClick={() => onPlaceBet(Number(amount))}
            disabled={!canBet || Number(amount) <= 0 || Number(amount) > balance}
            className={cn(
              "w-full h-16 rounded-[36px] font-black text-lg shadow-xl transition-all active:scale-95 group relative overflow-hidden",
              canBet ? "bg-[#002d4d] text-white" : "bg-gray-100 text-gray-300"
            )}
          >
            {currentBet && state !== 'crashed' ? (
              <div className="flex items-center gap-3">
                 <Loader2 className="h-5 w-5 animate-spin" />
                 <span>بانتظار الانطلاق...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <span>تأكيد الرهان</span>
                 <Zap className={cn("h-5 w-5 transition-transform group-hover:scale-125", canBet ? "text-[#f9a885] fill-current" : "text-gray-200")} />
              </div>
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 opacity-30 py-4 select-none">
         <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" />
            <span className="text-[8px] font-black uppercase tracking-widest">عدالة مثبتة</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-2">
            <MousePointerClick size={12} className="text-[#f9a885]" />
            <span className="text-[8px] font-black uppercase tracking-widest">صرف لحظي</span>
         </div>
      </div>
    </div>
  );
}
