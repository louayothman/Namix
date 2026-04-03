
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Coins, Zap, Sparkles, RefreshCcw, PowerOff, Plus, Minus, TrendingUp, TrendingDown } from "lucide-react";
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
 * WheelBetPanel - لوحة تحكم ترفيهية انسيابية v4.0
 * تم حذف الرسميات وإضافة ميزات التدوير التلقائي المتقدمة مع أزرار التحكم في المبلغ.
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

  return (
    <section className="px-4 pb-10 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-[0_-15px_40px_rgba(0,0,0,0.03)] rounded-[32px] bg-white border border-gray-100">
        <CardContent className="p-5 space-y-5">
          
          {/* حقل مبلغ الدخول مع أزرار الزيادة والنقصان */}
          <div className="space-y-2 text-right">
            <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">مبلغ الرهان ($)</Label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => adjustAmount(-10)}
                disabled={loading}
                className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90"
              >
                <Minus size={16} />
              </button>
              
              <div className="relative flex-1">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={loading}
                  className="h-12 rounded-2xl bg-gray-50 border-none font-black text-center text-[15px] text-[#002d4d] shadow-inner outline-none transition-all focus:ring-2 focus:ring-blue-500/10" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>

              <button 
                onClick={() => adjustAmount(10)}
                disabled={loading}
                className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-all active:scale-90"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* خيار التدوير التلقائي */}
          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white">
             <div className="flex items-center gap-3">
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shadow-inner transition-all", isAutoSpin ? "bg-blue-600 text-white" : "bg-white text-gray-300")}>
                   <RefreshCcw size={14} className={cn(isAutoSpin && "animate-spin")} />
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-[#002d4d]">التدوير التلقائي</p>
                   <p className="text-[8px] text-gray-400 font-bold uppercase">Auto-Spin Mode</p>
                </div>
             </div>
             <div dir="ltr">
                <Switch 
                  checked={isAutoSpin} 
                  onCheckedChange={setIsAutoSpin} 
                  disabled={loading && !isAutoSpin}
                  className="scale-75 data-[state=checked]:bg-blue-600"
                />
             </div>
          </div>

          {/* حقول الإعدادات التلقائية - تظهر فقط عند التفعيل */}
          <AnimatePresence>
            {isAutoSpin && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 gap-3 overflow-hidden pt-1"
              >
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-black text-gray-400 pr-2 uppercase">عدد الجولات</Label>
                    <Input 
                      type="number" 
                      value={autoSpinRounds} 
                      onChange={e => setAutoSpinRounds(e.target.value)} 
                      className="h-10 rounded-xl bg-white border border-gray-100 text-center font-black text-[12px] shadow-sm"
                      placeholder="∞"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-black text-emerald-600 pr-2 uppercase">توقف عند ربح ($)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={stopProfit} 
                        onChange={e => setStopProfit(e.target.value)} 
                        className="h-10 rounded-xl bg-emerald-50/30 border border-emerald-100 text-center font-black text-[12px] text-emerald-600 shadow-sm"
                        placeholder="0"
                      />
                      <TrendingUp size={8} className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-200" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-black text-red-400 pr-2 uppercase">توقف عند خسارة ($)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={stopLoss} 
                        onChange={e => setStopLoss(e.target.value)} 
                        className="h-10 rounded-xl bg-red-50/30 border border-red-100 text-center font-black text-[12px] text-red-500 shadow-sm"
                        placeholder="0"
                      />
                      <TrendingDown size={8} className="absolute left-2 top-1/2 -translate-y-1/2 text-red-200" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={onSpin} 
            disabled={loading && !isAutoSpin} 
            className={cn(
              "w-full h-16 rounded-[24px] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden",
              isAutoSpin && loading ? "bg-red-500 hover:bg-red-600 shadow-red-900/10" : "bg-[#002d4d] hover:bg-[#001d33]"
            )}
          >
            {loading && isAutoSpin ? (
              <>
                <span className="relative z-10">إيقاف التدوير</span>
                <PowerOff size={20} className="relative z-10" />
              </>
            ) : loading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <>
                <span className="relative z-10">{isAutoSpin ? "ابدأ الجولات" : "ابدأ اللعب الآن"}</span>
                <Zap size={20} className="text-[#f9a885] fill-current relative z-10 animate-pulse" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-3 opacity-10">
             <Sparkles size={10} className="text-[#002d4d]" />
             <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Namix Fun & Odds</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
