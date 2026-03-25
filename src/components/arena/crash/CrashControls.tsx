
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Zap, Loader2, MousePointerClick, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CrashControlsProps {
  state: 'waiting' | 'running' | 'crashed';
  onPlaceBet: (amount: number) => void;
  onCashout: () => void;
  currentBet: number | null;
  hasCashedOut: boolean;
  multiplier: number;
  balance: number;
}

export function CrashControls({ 
  state, 
  onPlaceBet, 
  onCashout, 
  currentBet, 
  hasCashedOut, 
  multiplier, 
  balance 
}: CrashControlsProps) {
  const [amount, setAmount] = useState("10");

  const canBet = state === 'waiting' && !currentBet;
  const canCashout = state === 'running' && currentBet && !hasCashedOut;

  return (
    <div className="space-y-5 font-body">
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">مبلغ الرهان</p>
           <span className="text-[8px] font-bold text-gray-300">Min: $1.00</span>
        </div>
        <div className="relative group">
           <Input 
             type="number" 
             value={amount} 
             onChange={e => setAmount(e.target.value)}
             disabled={!canBet}
             className="h-14 rounded-[20px] bg-gray-50 border-none font-black text-center text-xl shadow-inner focus-visible:ring-2 focus-visible:ring-[#002d4d]" 
           />
           <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
        </div>
        <div className="grid grid-cols-4 gap-2">
           {[10, 50, 100, "MAX"].map((v, i) => (
             <button 
               key={i} 
               onClick={() => setAmount(v === "MAX" ? Math.floor(balance).toString() : v.toString())}
               disabled={!canBet}
               className="h-8 rounded-xl bg-gray-50 text-[10px] font-black text-[#002d4d] hover:bg-[#002d4d] hover:text-white transition-all border border-gray-100"
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
            className="w-full h-20 rounded-[32px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-2xl shadow-emerald-900/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
             <p className="relative z-10 text-[10px] font-bold opacity-60 uppercase tracking-widest">Cash Out Now</p>
             <span className="relative z-10 text-2xl tabular-nums tracking-tighter">
               ${(currentBet * multiplier).toFixed(2)}
             </span>
          </Button>
        ) : (
          <Button 
            onClick={() => onPlaceBet(Number(amount))}
            disabled={!canBet || Number(amount) <= 0 || Number(amount) > balance}
            className={cn(
              "w-full h-16 rounded-[32px] font-black text-lg shadow-xl transition-all active:scale-95",
              canBet ? "bg-[#002d4d] text-white" : "bg-gray-100 text-gray-300"
            )}
          >
            {currentBet && state !== 'crashed' ? (
              <div className="flex items-center gap-3">
                 <Loader2 className="h-5 w-5 animate-spin" />
                 <span>بانتظار الصعود...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <span>بدء الرهان</span>
                 <Zap className="h-5 w-5 text-[#f9a885] fill-current" />
              </div>
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 opacity-20 py-2">
         <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} />
            <span className="text-[7px] font-black uppercase tracking-widest">Verified Justice</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-1.5">
            <MousePointerClick size={10} />
            <span className="text-[7px] font-black uppercase tracking-widest">Instant Settlement</span>
         </div>
      </div>
    </div>
  );
}
