
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coins, Zap, ShieldCheck } from "lucide-react";

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
 * DiceBetPanel - لوحة الرهان v6.0
 * تم تحديث الخطوط لـ 16px وتطهير النصوص العربية.
 */
export function DiceBetPanel({ betAmount, setBetAmount, loading, canBet, multiplier, winChance, onRoll }: DiceBetPanelProps) {
  return (
    <section className="px-6 pb-10 pt-4 bg-white border-t border-gray-100 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-xl rounded-[40px] bg-gray-50/80 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest tracking-normal">مبلغ الدخول ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  className="h-14 rounded-2xl bg-white border-none font-black text-center text-base text-[#002d4d] shadow-inner focus-visible:ring-2 focus-visible:ring-[#002d4d]" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="text-center space-y-1 pt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest tracking-normal">المضاعف</p>
                  <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">x{multiplier.toFixed(4)}</p>
               </div>
               <div className="text-center space-y-1 pt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest tracking-normal">الاحتمال</p>
                  <p className="text-xl font-black text-emerald-600 tabular-nums tracking-tighter">%{winChance.toFixed(2)}</p>
               </div>
            </div>
          </div>

          <Button 
            onClick={onRoll} 
            disabled={loading || !canBet} 
            className="w-full h-16 rounded-[28px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group"
          >
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <>
                <span className="tracking-normal">إطلاق تنبؤ المسار</span>
                <Zap size={20} className="text-[#f9a885] fill-current group-hover:scale-125 transition-transform" />
              </>
            )}
          </Button>

          <div className="flex justify-center gap-4 opacity-20 select-none">
             <div className="flex items-center gap-1.5">
                <ShieldCheck size={10} />
                <span className="text-[8px] font-black uppercase tracking-widest">Nexus Validated</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
