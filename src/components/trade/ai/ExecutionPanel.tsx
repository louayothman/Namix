
"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Coins, PlayCircle, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExecutionPanelProps {
  amount: number;
  onAmountChange: (val: number) => void;
  min: number;
  max: number;
  balance: number;
  isExecuting: boolean;
  onExecute: () => void;
  confidence: number;
  bias: string;
}

function ConfidenceRing({ value, bias }: { value: number, bias: string }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.round(value) / 100) * circumference;
  const color = bias === 'Long' ? "text-emerald-500" : bias === 'Short' ? "text-red-500" : "text-blue-500";

  return (
    <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-gray-100" />
        <motion.circle
          cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="2.5" fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         <span className={cn("text-[8px] font-black tabular-nums", color)}>%{Math.round(value)}</span>
      </div>
    </div>
  );
}

export function ExecutionPanel({ amount, onAmountChange, min, max, balance, isExecuting, onExecute, confidence, bias }: ExecutionPanelProps) {
  return (
    <section className="space-y-6 font-body" dir="rtl">
      <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-5">
        <div className="flex justify-between items-center px-2">
          <div className="space-y-0.5">
            <Label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">مبلغ التنفيذ (Liquidity)</Label>
            <span className="text-2xl font-black text-[#002d4d] tabular-nums tracking-tighter">${amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm">
            <Coins size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-[#002d4d]">الرصيد: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="px-2">
          <Slider 
            value={[amount]} 
            min={min} 
            max={Math.min(max, balance || max)} 
            step={0.01}
            onValueChange={([val]) => onAmountChange(val)}
            className="[&>span]:bg-[#002d4d]"
          />
          <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-[7px] font-bold text-gray-300 tabular-nums">${min}</span>
            <span className="text-[7px] font-bold text-gray-300 tabular-nums">${Math.min(max, balance || max).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center gap-2">
           <ConfidenceRing value={confidence} bias={bias} />
           <div className="text-right">
              <p className="text-[7px] font-black text-gray-300 uppercase leading-none">Conf.</p>
              <p className="text-[10px] font-black text-[#002d4d] mt-1">تأكيد</p>
           </div>
        </div>

        <Button 
          onClick={onExecute}
          disabled={isExecuting || bias === 'Neutral'}
          className={cn(
            "flex-1 h-16 rounded-full font-black text-sm shadow-xl transition-all active:scale-[0.98] group relative overflow-hidden",
            bias === 'Long' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/20" : 
            bias === 'Short' ? "bg-red-500 hover:bg-red-600 shadow-red-900/20" : 
            "bg-gray-200 text-gray-400"
          )}
        >
          {isExecuting ? <Loader2 className="animate-spin h-5 w-5" /> : (
            <div className="flex items-center gap-3 relative z-10">
               <span>تنفيذ الصفقة المقترحة</span>
               <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
          )}
        </Button>
      </div>
    </section>
  );
}
