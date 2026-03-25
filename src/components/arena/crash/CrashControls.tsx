
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Coins, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  MousePointer2,
  Loader2
} from "lucide-react";
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
  const [amount, setAmount] = useState("10.00");
  const [autoCashout, setAutoCashout] = useState("2.00");

  const canBet = state === 'waiting' && !currentBet;
  const canCashout = state === 'running' && currentBet && !hasCashedOut;

  const handleHalf = () => setAmount(prev => (Math.max(0, Number(prev) / 2)).toFixed(2));
  const handleDouble = () => setAmount(prev => (Number(prev) * 2).toFixed(2));

  return (
    <div className="space-y-6 font-body" dir="rtl">
      
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "p-4 rounded-2xl border flex items-center gap-3 shadow-xl mb-2",
              feedback.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
            )}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <p className="text-xs font-black">{feedback.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-2">
             <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مبلغ الرهان</Label>
             <span className="text-[10px] font-bold text-blue-600 tabular-nums">${balance.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner">
             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <Coins size={16} className="text-[#f9a885]" />
             </div>
             <input 
               type="number"
               value={amount}
               onChange={e => setAmount(e.target.value)}
               disabled={!canBet}
               className="flex-1 bg-transparent border-none text-right font-black text-xl outline-none tabular-nums text-[#002d4d]" 
             />
             <div className="flex items-center gap-1.5 pl-1">
                <button onClick={handleHalf} disabled={!canBet} className="px-4 h-10 rounded-xl bg-white border border-gray-100 text-[10px] font-black hover:bg-[#002d4d] hover:text-white transition-all">1/2</button>
                <button onClick={handleDouble} disabled={!canBet} className="px-4 h-10 rounded-xl bg-white border border-gray-100 text-[10px] font-black hover:bg-[#002d4d] hover:text-white transition-all">2x</button>
             </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">جني أرباح تلقائي</Label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner">
             <input 
               type="number"
               value={autoCashout}
               onChange={e => setAutoCashout(e.target.value)}
               disabled={!canBet}
               className="flex-1 bg-transparent border-none text-right font-black text-xl outline-none tabular-nums text-[#002d4d] px-4" 
             />
             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-gray-300 shadow-sm shrink-0">
                <span className="text-[11px] font-black">x</span>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        {canCashout ? (
          <Button 
            onClick={onCashout}
            className="w-full h-24 rounded-[32px] bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-2xl shadow-emerald-900/30 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
          >
             <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em]">CASH OUT NOW</p>
             <span className="text-4xl tabular-nums tracking-tighter flex items-baseline gap-1">
               <span className="text-xl opacity-40">$</span>{(currentBet * multiplier).toFixed(2)}
             </span>
          </Button>
        ) : (
          <Button 
            onClick={() => onPlaceBet(Number(amount))}
            disabled={!canBet || Number(amount) <= 0 || Number(amount) > balance}
            className={cn(
              "w-full h-20 rounded-[32px] font-black text-xl shadow-xl transition-all active:scale-95",
              canBet ? "bg-[#002d4d] hover:bg-[#001d33] text-white" : "bg-gray-100 text-gray-300"
            )}
          >
            {currentBet && state !== 'crashed' ? (
              <div className="flex flex-col items-center">
                 <span>رهان قيد الانتظار</span>
                 <span className="text-[10px] opacity-60 uppercase tracking-widest mt-1">Ready for launch</span>
              </div>
            ) : (
              "راهن الآن"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
