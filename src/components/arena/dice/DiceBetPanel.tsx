
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
 * DiceBetPanel - لوحة الرهان v7.0
 * تم اعتماد حجم خط 13px وتطهير النصوص العربية.
 */
export function DiceBetPanel({ betAmount, setBetAmount, loading, canBet, multiplier, winChance, onRoll }: DiceBetPanelProps) {
  return (
    <section className="px-6 pb-8 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-xl rounded-[36px] bg-gray-50/80 backdrop-blur-md border border-white/50">
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5 text-right">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-3 tracking-normal">مبلغ الدخول ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  className="h-12 rounded-xl bg-white border-none font-black text-center text-[13px] text-[#002d4d] shadow-inner focus-visible:ring-2 focus-visible:ring-[#002d4d]" 
                />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
               <div className="text-center space-y-0.5 pt-1.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-normal">المضاعف</p>
                  <p className="text-[13px] font-black text-[#002d4d] tabular-nums tracking-tighter leading-none">x{multiplier.toFixed(4)}</p>
               </div>
               <div className="text-center space-y-0.5 pt-1.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-normal">الاحتمال</p>
                  <p className="text-[13px] font-black text-emerald-600 tabular-nums tracking-tighter leading-none">%{winChance.toFixed(2)}</p>
               </div>
            </div>
          </div>

          <Button 
            onClick={onRoll} 
            disabled={loading || !canBet} 
            className="w-full h-14 rounded-[22px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[13px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                <span className="tracking-normal">إطلاق تنبؤ المسار</span>
                <Zap size={16} className="text-[#f9a885] fill-current group-hover:scale-125 transition-transform" />
              </>
            )}
          </Button>

          <div className="flex justify-center gap-4 opacity-10 select-none">
             <div className="flex items-center gap-1.5">
                <ShieldCheck size={8} />
                <span className="text-[7px] font-black uppercase tracking-widest">Nexus Secure</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
