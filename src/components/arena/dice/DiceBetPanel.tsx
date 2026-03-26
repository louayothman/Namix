
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coins, Zap, Sparkles } from "lucide-react";

interface DiceBetPanelProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  loading: boolean;
  canBet: boolean;
  multiplier: number;
  winChance: number;
  onRoll: () => void;
}

/**
 * DiceBetPanel - لوحة التحكم v900.0
 * تم ضبط الحجم ليكون طبيعياً ومريحاً للهواتف بخط 13px وتطهير النصوص.
 */
export function DiceBetPanel({ betAmount, setBetAmount, loading, canBet, multiplier, winChance, onRoll }: DiceBetPanelProps) {
  return (
    <section className="px-4 pb-10 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-[0_-15px_40px_rgba(0,0,0,0.03)] rounded-[32px] bg-white border border-gray-50">
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">مبلغ الدخول ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  className="h-12 rounded-2xl bg-gray-50 border-none font-black text-center text-[13px] text-[#002d4d] shadow-inner outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center pt-2">
               <div className="p-2 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-inner space-y-0.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-normal">المضاعف</p>
                  <p className="text-[13px] font-black text-[#002d4d] tabular-nums tracking-tighter">x{multiplier.toFixed(2)}</p>
               </div>
               <div className="p-2 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 shadow-inner space-y-0.5">
                  <p className="text-[8px] font-black text-emerald-600/60 uppercase tracking-normal">الاحتمال</p>
                  <p className="text-[13px] font-black text-emerald-600 tabular-nums tracking-tighter">%{winChance.toFixed(1)}</p>
               </div>
            </div>
          </div>

          <Button 
            onClick={onRoll} 
            disabled={loading || !canBet} 
            className="w-full h-14 rounded-2xl bg-[#002d4d] text-white font-black text-[13px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full hover:translate-x-0 transition-transform duration-700" />
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                <span className="relative z-10">تحليل مسار الاحتمالات</span>
                <Zap size={16} className="text-[#f9a885] fill-current relative z-10 animate-pulse" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 opacity-10">
             <Sparkles size={8} className="text-[#002d4d]" />
             <p className="text-[8px] font-black uppercase tracking-[0.5em] tracking-normal">Nexus Computation Matrix</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
