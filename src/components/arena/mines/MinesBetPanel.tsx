
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
    <section className="px-6 pb-10 pt-4 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-sm rounded-[32px] bg-gray-50/50">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 text-right">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-2 tracking-widest">مبلغ الرهان ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-12 rounded-xl bg-white border-none font-black text-center text-sm text-[#002d4d] shadow-inner focus:ring-2 focus:ring-blue-500/20" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-2 tracking-widest">عدد الألغام</Label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 10, 15, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-10 rounded-xl font-black text-[10px] transition-all", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
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
                className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <>
                    <span>سحب الأرباح</span>
                    <Badge className="bg-white/20 text-white border-none font-black text-sm tabular-nums">
                      $ {(Number(betAmount) * currentMultiplier).toFixed(2)}
                    </Badge>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={onStart} 
                disabled={loading || !canBet} 
                className="w-full h-16 rounded-2xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <div className="flex items-center gap-3">
                    <span>بدء استخراج السيولة</span>
                    <Zap size={18} className="text-[#f9a885] fill-current" />
                  </div>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <button onClick={onReset} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-[#002d4d] flex items-center justify-center gap-3 py-2 transition-colors">
                <RotateCcw className="h-4 w-4" /> محاولة جديدة
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
