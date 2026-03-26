
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, RotateCcw, Zap } from "lucide-react";
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

export function MinesBetPanel({
  betAmount, setBetAmount, minesCount, setMinesCount, gameState, loading, canBet, onStart, onCashout, onReset, currentMultiplier
}: MinesBetPanelProps) {
  return (
    <section className="px-6 pb-8 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-sm rounded-[32px] bg-gray-50/50">
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5 text-right">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-3 tracking-widest">قيمة الدخول ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-11 rounded-xl bg-white border-none font-black text-center text-sm text-[#002d4d] shadow-inner" 
                />
                <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-200" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-3 tracking-widest">الأعطال (Mines)</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 10, 15, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-9 rounded-xl font-black text-[10px] transition-all", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-md" : "bg-white text-gray-400 border border-gray-100"
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
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <span>سحب الأرباح الآمنة</span>
                    <Badge className="bg-white/20 text-white border-none font-black text-xs tabular-nums">
                      $ {(Number(betAmount) * currentMultiplier).toFixed(2)}
                    </Badge>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={onStart} 
                disabled={loading || !canBet} 
                className="w-full h-14 rounded-2xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <div className="flex items-center gap-3">
                    <span>بدء المحاولة</span>
                    <Zap size={16} className="text-[#f9a885] fill-current" />
                  </div>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <button onClick={onReset} className="w-full text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#002d4d] flex items-center justify-center gap-2 py-1 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> إعادة معايرة
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
