
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
    <section className="p-6 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-sm rounded-2xl bg-gray-50/50">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 text-right">
              <Label className="text-[8px] font-black text-gray-400 uppercase pr-2">المبلغ ($)</Label>
              <div className="relative">
                <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-9 rounded-xl bg-white border-none font-black text-center text-xs text-[#002d4d]" />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div className="text-center">
                  <p className="text-[7px] font-black text-gray-400 uppercase">المضاعف</p>
                  <p className="text-xs font-black text-[#002d4d] tabular-nums">x{multiplier.toFixed(4)}</p>
               </div>
               <div className="text-center">
                  <p className="text-[7px] font-black text-gray-400 uppercase">الاحتمال</p>
                  <p className="text-xs font-black text-emerald-600 tabular-nums">%{winChance.toFixed(2)}</p>
               </div>
            </div>
          </div>

          <Button onClick={onRoll} disabled={loading || !canBet} className="w-full h-10 rounded-xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : (
              <>
                <span>بدء المحاولة</span>
                <Zap size={12} className="text-[#f9a885] fill-current" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
