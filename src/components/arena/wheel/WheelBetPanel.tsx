
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Coins, Zap, Sparkles } from "lucide-react";

interface WheelBetPanelProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  loading: boolean;
  canBet: boolean;
  onSpin: () => void;
}

/**
 * WheelBetPanel - لوحة تحكم دورة الأرباح v2.0
 */
export function WheelBetPanel({ betAmount, setBetAmount, loading, canBet, onSpin }: WheelBetPanelProps) {
  return (
    <section className="px-4 pb-10 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-[0_-15px_40px_rgba(0,0,0,0.03)] rounded-[32px] bg-white border border-gray-50">
        <CardContent className="p-5 space-y-5">
          <div className="space-y-2 text-right">
            <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">مبلغ الدخول المعتمد ($)</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={betAmount} 
                onChange={e => setBetAmount(e.target.value)} 
                disabled={loading}
                className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-[16px] text-[#002d4d] shadow-inner outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" 
              />
              <Coins className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
            </div>
          </div>

          <Button 
            onClick={onSpin} 
            disabled={loading || !canBet} 
            className="w-full h-16 rounded-[24px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <>
                <span className="relative z-10">إطلاق دورة الأرباح</span>
                <Zap size={20} className="text-[#f9a885] fill-current relative z-10 animate-pulse" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-3 opacity-10">
             <Sparkles size={10} className="text-[#002d4d]" />
             <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Namix Dynamic Odds Protocol</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
