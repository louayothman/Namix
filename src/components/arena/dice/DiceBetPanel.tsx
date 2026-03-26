
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

/**
 * DiceBetPanel - لوحة التحكم v800.0
 * تم ضبط الحجم ليكون طبيعياً ومريحاً للهواتف بخط 13px وتطهير النصوص.
 */
export function DiceBetPanel({ betAmount, setBetAmount, loading, canBet, multiplier, winChance, onRoll }: DiceBetPanelProps) {
  return (
    <section className="px-4 pb-6 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-lg rounded-[28px] bg-gray-50/80 border border-white">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">مبلغ الدخول ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  className="h-11 rounded-xl bg-white border-none font-black text-center text-[13px] text-[#002d4d] shadow-inner outline-none" 
                />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1.5">
               <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-normal">المضاعف</p>
                  <p className="text-[13px] font-black text-[#002d4d] tabular-nums tracking-tighter">x{multiplier.toFixed(2)}</p>
               </div>
               <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-normal">الاحتمال</p>
                  <p className="text-[13px] font-black text-emerald-600 tabular-nums tracking-tighter">%{winChance.toFixed(1)}</p>
               </div>
            </div>
          </div>

          <Button 
            onClick={onRoll} 
            disabled={loading || !canBet} 
            className="w-full h-12 rounded-xl bg-[#002d4d] text-white font-black text-[13px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
              <>
                <span>تنبؤ المسار</span>
                <Zap size={14} className="text-[#f9a885] fill-current" />
              </>
            )}
          </Button>

          <div className="text-center opacity-10">
             <p className="text-[7px] font-black uppercase tracking-widest tracking-normal">Nexus Probability Engine</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
