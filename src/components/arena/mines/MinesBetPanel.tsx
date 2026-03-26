
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, RotateCcw, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinesBetPanelProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  minesCount: number;
  setMinesCount: (val: number) => void;
  gameState: 'idle' | 'playing' | 'won' | 'lost';
  loading: boolean;
  canBet: boolean;
  onStart: () => void;
  onCashout: () => void;
  onReset: () => void;
  currentMultiplier: number;
}

/**
 * MinesBetPanel - لوحة الرهان v6.0
 * تم تحديث الخطوط لـ 16px وتطهير النصوص العربية.
 */
export function MinesBetPanel({
  betAmount, setBetAmount, minesCount, setMinesCount, gameState, loading, canBet, onStart, onCashout, onReset, currentMultiplier
}: MinesBetPanelProps) {
  return (
    <section className="px-6 pb-10 pt-4 bg-white border-t border-gray-100 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-xl rounded-[40px] bg-gray-50/80 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-normal">قيمة الدخول ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-14 rounded-2xl bg-white border-none font-black text-center text-base text-[#002d4d] shadow-inner focus-visible:ring-2 focus-visible:ring-[#002d4d]" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-normal">الأعطال (Mines)</Label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 10, 15, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-11 rounded-xl font-black text-xs transition-all", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "bg-white text-gray-400 border border-gray-100 shadow-sm hover:bg-gray-50"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {gameState === 'playing' ? (
              <Button 
                onClick={onCashout} 
                disabled={loading} 
                className="w-full h-16 rounded-[28px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <>
                    <span className="tracking-normal">سحب الأرباح الآمنة</span>
                    <Badge className="bg-white/20 text-white border-none font-black text-sm tabular-nums px-4 py-1 rounded-xl">
                      $ {(Number(betAmount) * currentMultiplier).toFixed(2)}
                    </Badge>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={onStart} 
                disabled={loading || !canBet} 
                className="w-full h-16 rounded-[28px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <div className="flex items-center gap-4">
                    <span className="tracking-normal">بدء محاولة الاستخراج</span>
                    <Zap size={20} className="text-[#f9a885] fill-current group-hover:rotate-12 transition-transform" />
                  </div>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <button onClick={onReset} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-3 py-2 transition-colors tracking-normal">
                <RotateCcw className="h-4 w-4" /> إعادة معايرة المفاعل
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
