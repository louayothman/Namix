"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Coins, Zap, Sparkles, RefreshCcw, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

/**
 * WheelBetPanel - لوحة تحكم دورة الأرباح المتقدمة v3.0
 * تم إضافة خيار "التدوير الآلي" لتعزيز تجربة المستخدم.
 */
export function WheelBetPanel({ 
  betAmount, setBetAmount, loading, canBet, onSpin, 
  isAutoSpin, setIsAutoSpin, autoSpinRounds, setAutoSpinRounds 
}: WheelBetPanelProps) {
  return (
    <section className="px-4 pb-10 pt-2 bg-white border-t border-gray-50 shrink-0 font-body" dir="rtl">
      <Card className="border-none shadow-[0_-15px_40px_rgba(0,0,0,0.03)] rounded-[32px] bg-white border border-gray-100">
        <CardContent className="p-5 space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">مبلغ الدخول ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={loading && !isAutoSpin}
                  className="h-12 rounded-2xl bg-gray-50 border-none font-black text-center text-[15px] text-[#002d4d] shadow-inner outline-none transition-all focus:ring-2 focus:ring-blue-500/10" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>

            <div className="space-y-2 text-right">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-2 tracking-normal">عدد الدورات الآلية</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={autoSpinRounds} 
                  onChange={e => setAutoSpinRounds(e.target.value)} 
                  disabled={!isAutoSpin || loading}
                  className={cn(
                    "h-12 rounded-2xl border-none font-black text-center text-[15px] shadow-inner outline-none transition-all",
                    isAutoSpin ? "bg-blue-50 text-blue-600 focus:ring-2 focus:ring-blue-500/10" : "bg-gray-100 text-gray-300"
                  )} 
                  placeholder="∞"
                />
                <RefreshCcw className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors", isAutoSpin ? "text-blue-300" : "text-gray-200")} />
              </div>
            </div>
          </div>

          {/* مفتاح التدوير الآلي */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
             <div className="flex items-center gap-3">
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shadow-inner transition-all", isAutoSpin ? "bg-blue-600 text-white" : "bg-white text-gray-300")}>
                   <RefreshCcw size={14} className={cn(isAutoSpin && "animate-spin")} />
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-[#002d4d]">بروتوكول التدوير الآلي</p>
                   <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Auto-Pulse Engagement</p>
                </div>
             </div>
             <Switch 
               checked={isAutoSpin} 
               onCheckedChange={setIsAutoSpin} 
               disabled={loading && !isAutoSpin}
               className="data-[state=checked]:bg-blue-600"
             />
          </div>

          <Button 
            onClick={onSpin} 
            disabled={loading && !isAutoSpin} 
            className={cn(
              "w-full h-16 rounded-[24px] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden",
              isAutoSpin && loading ? "bg-red-500 hover:bg-red-600" : "bg-[#002d4d] hover:bg-[#001d33]"
            )}
          >
            {loading && isAutoSpin ? (
              <>
                <span className="relative z-10">إيقاف التدوير الآلي</span>
                <PowerOff size={20} className="relative z-10" />
              </>
            ) : loading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <>
                <span className="relative z-10">{isAutoSpin ? "إطلاق الدورات الآلية" : "إطلاق دورة الأرباح"}</span>
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
