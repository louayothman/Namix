
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Coins, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown, 
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  ClipboardPaste,
  ShieldCheck,
  MousePointer2
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

  const adjustAmount = (val: number) => {
    setAmount(prev => {
      const next = Math.max(0, (Number(prev) || 0) + val);
      return next.toFixed(2);
    });
  };

  return (
    <div className="space-y-5 font-body tracking-normal" dir="rtl">
      
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "p-3 rounded-2xl border flex items-center gap-3 shadow-xl mb-4",
              feedback.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
            )}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            <p className="text-[10px] font-black">{feedback.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full border border-gray-200 flex items-center justify-center">
                   <span className="text-[8px] font-bold text-gray-300">i</span>
                </div>
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المبلغ</Label>
             </div>
             <p className="text-[8px] font-bold text-gray-300 tabular-nums">${balance.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner group/input focus-within:ring-2 focus-within:ring-[#002d4d]/10 transition-all">
             <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <Coins size={14} className="text-[#f9a885]" />
             </div>
             <input 
               type="number"
               value={amount}
               onChange={e => setAmount(e.target.value)}
               disabled={!canBet}
               className="flex-1 bg-transparent border-none text-right font-black text-lg outline-none tabular-nums text-[#002d4d]" 
             />
             <div className="flex items-center gap-1 pl-1">
                <button onClick={handleHalf} disabled={!canBet} className="px-3 h-9 rounded-xl bg-white/80 border border-gray-100 text-[10px] font-black hover:bg-[#002d4d] hover:text-white transition-all">1/2</button>
                <button onClick={handleDouble} disabled={!canBet} className="px-3 h-9 rounded-xl bg-white/80 border border-gray-100 text-[10px] font-black hover:bg-[#002d4d] hover:text-white transition-all">2x</button>
             </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <ShieldCheck size={10} className="text-blue-400" />
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">صرف تلقائي</Label>
             </div>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner group/input focus-within:ring-2 focus-within:ring-[#002d4d]/10 transition-all">
             <input 
               type="number"
               value={autoCashout}
               onChange={e => setAutoCashout(e.target.value)}
               disabled={!canBet}
               className="flex-1 bg-transparent border-none text-right font-black text-lg outline-none tabular-nums text-[#002d4d] px-4" 
             />
             <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-gray-300 shadow-sm shrink-0">
                <span className="text-[10px] font-black">x</span>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        {canCashout ? (
          <Button 
            onClick={onCashout}
            className="w-full h-20 rounded-[28px] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-2xl shadow-emerald-900/30 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
          >
             <p className="text-[9px] font-black opacity-60 uppercase tracking-[0.2em]">CASH OUT NOW</p>
             <span className="text-3xl tabular-nums tracking-tighter flex items-baseline gap-1">
               <span className="text-base opacity-40">$</span>{(currentBet * multiplier).toFixed(2)}
             </span>
          </Button>
        ) : (
          <Button 
            onClick={() => onPlaceBet(Number(amount))}
            disabled={!canBet || Number(amount) <= 0 || Number(amount) > balance}
            className={cn(
              "w-full h-16 rounded-[28px] font-black text-lg shadow-xl transition-all active:scale-95 flex flex-col items-center justify-center",
              canBet ? "bg-[#002d4d] hover:bg-[#001d33] text-white" : "bg-gray-100 text-gray-300"
            )}
          >
            {currentBet && state !== 'crashed' ? (
              <div className="flex flex-col items-center">
                 <span className="text-base">رهان</span>
                 <span className="text-[9px] opacity-60">(الجولة القادمة)</span>
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
