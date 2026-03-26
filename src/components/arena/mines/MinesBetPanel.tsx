
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, RotateCcw, Zap, Sparkles } from "lucide-react";
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
 * MinesBetPanel - لوحة التحكم v900.0
 * تم ضبط الحجم ليكون طبيعياً ومريحاً للهواتف بخط 13px وتطهير النصوص.
 */
export function MinesBetPanel({
  betAmount, setBetAmount, minesCount, setMinesCount, gameState, loading, canBet, onStart, onCashout, onReset, currentMultiplier
}: MinesBetPanelProps) {
  return (
    <section className="px-4 pb-10 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-[0_-15px_40px_rgba(0,0,0,0.03)] rounded-[32px] bg-white border border-gray-50">
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">مبلغ الدخول ($)</Label>
              <div className="relative group">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-12 rounded-2xl bg-gray-50 border-none font-black text-center text-[13px] text-[#002d4d] shadow-inner outline-none transition-all focus:ring-2 focus:ring-blue-500/10" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">عدد الأعطال</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 10, 15, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-9 rounded-xl font-black text-[11px] transition-all tabular-nums shadow-sm", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-gray-400 border border-transparent hover:bg-gray-100"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {gameState === 'playing' ? (
              <Button 
                onClick={onCashout} 
                disabled={loading} 
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[13px] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full hover:translate-x-0 transition-transform duration-700" />
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <span>سحب الأرباح الآمنة</span>
                    <Badge className="bg-emerald-500 text-white border-none font-black text-[12px] tabular-nums px-3 py-1 rounded-lg shadow-sm">
                      $ {(Number(betAmount) * currentMultiplier).toFixed(2)}
                    </Badge>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={onStart} 
                disabled={loading || !canBet} 
                className="w-full h-14 rounded-2xl bg-[#002d4d] text-white font-black text-[13px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <span>بدء استخراج السيولة</span>
                    <Zap size={16} className="text-[#f9a885] fill-current" />
                  </>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <div className="flex justify-center pt-1">
                <button onClick={onReset} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all group">
                  <RotateCcw className="h-3 w-3 group-hover:rotate-[-180deg] transition-transform duration-500" /> تصفير المحرك
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
