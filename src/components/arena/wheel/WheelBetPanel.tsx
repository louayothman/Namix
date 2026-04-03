
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Coins, Zap, Sparkles, RefreshCcw, PowerOff, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface WheelBetPanelProps {
  betAmount: string;
  setBetAmount: (val: string) => void;
  loading: boolean;
  canBet: boolean;
  onSpin: () => void;
  isAutoSpin: boolean;
  setIsAutoSpin: (val: boolean) => void;
  autoSpinRounds: string;
  setAutoSpinRounds: (val: string) => void;
  stopProfit: string;
  setStopProfit: (val: string) => void;
  stopLoss: string;
  setStopLoss: (val: string) => void;
}

/**
 * WheelBetPanel - لوحة تحكم ترفيهية انسيابية v7.0
 * تم تحسين أزرار التحكم بالجولات وإضافة أزرار (+) و (-) لسهولة الاستخدام.
 */
export function WheelBetPanel({ 
  betAmount, setBetAmount, loading, canBet, onSpin, 
  isAutoSpin, setIsAutoSpin, autoSpinRounds, setAutoSpinRounds,
  stopProfit, setStopProfit, stopLoss, setStopLoss
}: WheelBetPanelProps) {
  
  const adjustAmount = (val: number) => {
    const current = parseInt(betAmount) || 0;
    setBetAmount(Math.max(1, current + val).toString());
  };

  const adjustRounds = (val: number) => {
    const current = parseInt(autoSpinRounds) || 0;
    setAutoSpinRounds(Math.max(1, current + val).toString());
  };

  return (
    <section className="px-4 pb-10 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-[0_-15px_40px_rgba(0,0,0,0.03)] rounded-[32px] bg-white border border-gray-100">
        <CardContent className="p-4 space-y-4">
          
          {/* مبلغ الرهان */}
          <div className="space-y-1.5 text-right">
            <Label className="text-[10px] font-black text-gray-400 uppercase pr-2">مبلغ الرهان ($)</Label>
            <div className="flex items-center gap-2">
              <button onClick={() => adjustAmount(-10)} disabled={loading} className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 active:scale-90 shadow-inner"><Minus size={12} /></button>
              <div className="relative flex-1">
                <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} disabled={loading} className="h-10 rounded-xl bg-gray-50 border-none font-black text-center text-[13px] text-[#002d4d] shadow-inner outline-none" />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-200" />
              </div>
              <button onClick={() => adjustAmount(10)} disabled={loading} className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-500 active:scale-90 shadow-inner"><Plus size={12} /></button>
            </div>
          </div>

          {/* التدوير التلقائي */}
          <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
             <div className="flex items-center gap-2.5">
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shadow-inner", isAutoSpin ? "bg-blue-600 text-white" : "bg-white text-gray-300")}>
                   <RefreshCcw size={12} className={cn(isAutoSpin && "animate-spin")} />
                </div>
                <p className="text-xs font-black text-[#002d4d]">التدوير التلقائي</p>
             </div>
             <div dir="ltr">
                <Switch checked={isAutoSpin} onCheckedChange={setIsAutoSpin} disabled={loading && !isAutoSpin} className="scale-75 data-[state=checked]:bg-blue-600" />
             </div>
          </div>

          <AnimatePresence>
            {isAutoSpin && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0 }} className="grid grid-cols-1 gap-3 overflow-hidden pt-1">
                <div className="space-y-1.5 text-right">
                  <Label className="text-[9px] font-black text-gray-400 pr-2 uppercase">عدد الجولات</Label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustRounds(-1)} disabled={loading} className="h-9 w-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 active:scale-90"><Minus size={10} /></button>
                    <Input type="number" value={autoSpinRounds} onChange={e => setAutoSpinRounds(e.target.value)} className="h-9 flex-1 rounded-lg bg-white border border-gray-100 text-center font-black text-[12px]" placeholder="∞" />
                    <button onClick={() => adjustRounds(1)} disabled={loading} className="h-9 w-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 active:scale-90"><Plus size={10} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[8px] font-black text-emerald-600 pr-2">توقف عند ربح ($)</Label>
                    <Input type="number" value={stopProfit} onChange={e => setStopProfit(e.target.value)} className="h-9 rounded-lg bg-emerald-50/30 border border-emerald-100 text-center font-black text-[11px] text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[8px] font-black text-red-400 pr-2">توقف عند خسارة ($)</Label>
                    <Input type="number" value={stopLoss} onChange={e => setStopLoss(e.target.value)} className="h-9 rounded-lg bg-red-50/30 border border-red-100 text-center font-black text-[11px] text-red-500" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button onClick={onSpin} disabled={loading && !isAutoSpin} className={cn("w-full h-14 rounded-2xl text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3", isAutoSpin && loading ? "bg-red-500 hover:bg-red-600" : "bg-[#002d4d] hover:bg-[#001d33]")}>
            {loading && isAutoSpin ? (
              <><span className="relative z-10">إيقاف التدوير</span><PowerOff size={16} /></>
            ) : loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <><span className="relative z-10">ابدأ التحدي</span><Zap size={16} className="text-[#f9a885] fill-current animate-pulse" /></>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 opacity-10">
             <Sparkles size={8} className="text-[#002d4d]" />
             <p className="text-[7px] font-black uppercase tracking-[0.5em] text-[#002d4d]">Namix Fun & Odds</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
