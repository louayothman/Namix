
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coins, Zap } from "lucide-react";

interface DiceBetPanelProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  loading: boolean;
  canBet: boolean;
  multiplier: number;
  winChance: number;
  onRoll: () => void;
}

export function DiceBetPanel({ betAmount, setBetAmount, loading, canBet, multiplier, winChance, onRoll }: DiceBetPanelProps) {
  return (
    <section className="px-6 py-4 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-sm rounded-2xl bg-gray-50/50">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <Label className="text-[8px] font-black text-gray-400 uppercase pr-2">المبلغ ($)</Label>
              <div className="relative">
                <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-10 rounded-xl bg-white border-none font-black text-center text-xs text-[#002d4d] shadow-inner" />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div className="text-center space-y-1">
                  <p className="text-[7px] font-black text-gray-400 uppercase">المضاعف</p>
                  <p className="text-[13px] font-black text-[#002d4d] tabular-nums tracking-tighter">x{multiplier.toFixed(4)}</p>
               </div>
               <div className="text-center space-y-1">
                  <p className="text-[7px] font-black text-gray-400 uppercase">الاحتمال</p>
                  <p className="text-[13px] font-black text-emerald-600 tabular-nums tracking-tighter">%{winChance.toFixed(2)}</p>
               </div>
            </div>
          </div>

          <Button onClick={onRoll} disabled={loading || !canBet} className="w-full h-12 rounded-xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[11px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
              <>
                <span>توليد الاحتمالية</span>
                <Zap size={14} className="text-[#f9a885] fill-current" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
