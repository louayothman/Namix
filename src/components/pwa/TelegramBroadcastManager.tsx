
'use client';

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { runNamix } from "@/lib/namix-orchestrator";
import { broadcastSignalToTelegram } from "@/app/actions/telegram-actions";
import { toJpeg } from "html-to-image";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Zap, 
  Target, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  ArrowRightLeft
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { getHistoricalKlines } from "@/services/binance-service";
import { generateInternalHistory } from "@/lib/internal-market";

/**
 * @fileOverview محرك بث تلغرام المستقل v30.0 - Real Chart & Bilingual Edition
 * يولد بطاقة مصرفية استخباراتية تحتوي على رسم بياني حقيقي وبيانات ثنائية اللغة.
 */

export function TelegramBroadcastManager() {
  const db = useFirestore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [activeSignal, setActiveSignal] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const isMounted = useRef(true);
  const isCapturing = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const runTelegramCycle = async () => {
      if (!isMounted.current || isCapturing.current) return;

      try {
        const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
        const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        if (symbols.length === 0) return;

        const analyses = [];
        for (const sym of symbols) {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          const strength = Math.abs(analysis.score - 0.5);
          analyses.push({ sym, analysis, strength });
        }

        // اختيار أفضل فرصة (أعلى نسبة ثقة)
        const best = analyses.sort((a, b) => b.strength - a.strength)[0];

        if (best && best.analysis.decision !== 'HOLD') {
          isCapturing.current = true;
          
          // جلب بيانات الشارت للبطاقة
          let history: any[] = [];
          if (best.sym.priceSource === 'binance') {
            history = await getHistoricalKlines(best.sym.binanceSymbol, '1h', 24);
          } else {
            history = generateInternalHistory(best.sym.id, best.sym, 24);
          }
          
          setChartData(history.map(d => ({ value: d.close || d.value })));
          setActiveSignal(best.analysis);

          // انتظار رندر الشارت ثم الالتقاط
          setTimeout(async () => {
            if (captureRef.current) {
              try {
                const dataUrl = await toJpeg(captureRef.current, { 
                  quality: 0.95,
                  backgroundColor: '#0B0F1A'
                });
                await broadcastSignalToTelegram(best.analysis, best.sym, dataUrl);
              } catch (err) {
                console.error("Capture Logic Fail:", err);
                await broadcastSignalToTelegram(best.analysis, best.sym);
              }
            }
            setActiveSignal(null);
            setChartData([]);
            isCapturing.current = false;
          }, 2000);
        }
      } catch (e) {
        console.error("Telegram Cycle Error:", e);
        isCapturing.current = false;
      }
    };

    const interval = setInterval(runTelegramCycle, 300000); // 5 دقائق
    runTelegramCycle();

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [db]);

  const isUp = activeSignal?.decision === 'BUY';

  return (
    <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none overflow-hidden z-[-1]" dir="rtl">
      {activeSignal && (
        <div 
          ref={captureRef}
          className="w-[600px] h-[950px] bg-[#0B0F1A] p-8 flex flex-col justify-between font-body text-right"
        >
          {/* Main Card Frame - Grey Blue Gradient */}
          <div className="w-full h-full bg-gradient-to-br from-[#121826] to-[#0B0F1A] rounded-[60px] border border-white/5 p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
             
             {/* 1. Giant Transparent Watermark Logo */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-[2.8] -rotate-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-32 h-32 rounded-full bg-white" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-white" />
                </div>
             </div>

             {/* 2. Header: Asset (Right) & Platform Identity (Left) */}
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                   <div className="h-16 w-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                      <CryptoIcon name={activeSignal.pair.split('/')[0]} size={44} />
                   </div>
                   <div className="text-right">
                      <h3 className="text-2xl font-black text-white tracking-tighter">{activeSignal.pair}</h3>
                      <p className="text-[9px] font-black text-blue-300/40 uppercase tracking-[0.3em] mt-1">Live Asset Node</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-left" dir="ltr">
                      <p className="text-[7px] font-black text-blue-200/20 uppercase tracking-widest leading-none">Security Node</p>
                      <p className="text-[10px] font-black text-white/40 mt-1">NAMIX PRO</p>
                   </div>
                   <div className="grid grid-cols-2 gap-1 scale-[0.8] opacity-60">
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                   </div>
                </div>
             </div>

             {/* 3. Decision Highlight */}
             <div className="relative z-10 flex flex-col items-center gap-4 py-4">
                <div className={cn(
                  "px-12 py-4 rounded-[32px] font-black text-lg shadow-2xl flex items-center gap-4 border border-white/5",
                  isUp ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                )}>
                   {isUp ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                   <span>{activeSignal.type} / {isUp ? 'شراء' : 'بيع'}</span>
                </div>
                <div className="text-center space-y-1">
                   <p className="text-5xl font-black text-white tracking-tighter tabular-nums" dir="ltr">${activeSignal.agents?.tech?.last?.toLocaleString()}</p>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.5em]">Real-time Execution Price</p>
                </div>
             </div>

             {/* 4. Real-time Chart Section */}
             <div className="relative h-32 w-full z-10 px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent rounded-3xl" />
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <YAxis hide domain={['auto', 'auto']} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={isUp ? "#10b981" : "#ef4444"} 
                        strokeWidth={3} 
                        fillOpacity={0.15} 
                        fill={isUp ? "#10b981" : "#ef4444"} 
                      />
                   </AreaChart>
                </ResponsiveContainer>
                <div className="absolute top-2 right-6 flex items-center gap-2">
                   <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isUp ? "bg-emerald-500" : "bg-red-500")} />
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">24H Momentum</span>
                </div>
             </div>

             {/* 5. Bilingual Data Matrix */}
             <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="p-8 bg-white/[0.03] rounded-[48px] border border-white/5 space-y-6 shadow-inner">
                   <div className="flex justify-between items-center text-gray-400 px-2">
                      <div className="flex items-center gap-2">
                         <Target size={14} className="text-[#f9a885]" />
                         <span className="text-[9px] font-black uppercase">Nodes / نقاط التمركز</span>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-400 border-none text-[8px] font-black tracking-widest px-4 py-1.5 rounded-xl">PRO SPECTRA</Badge>
                   </div>
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-1.5 text-right">
                         <p className="text-[10px] font-black text-blue-400 uppercase">Entry / الدخول</p>
                         <p className="text-2xl font-black text-white tabular-nums tracking-tighter" dir="ltr">{activeSignal.entry_range}</p>
                      </div>
                      <div className="space-y-1.5 text-right">
                         <p className="text-[10px] font-black text-emerald-400 uppercase">Target / الهدف</p>
                         <p className="text-2xl font-black text-emerald-400 tabular-nums tracking-tighter" dir="ltr">${activeSignal.targets.tp1.toLocaleString()}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                   <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 flex items-center justify-between group">
                      <div className="space-y-1 text-right">
                         <p className="text-[9px] font-black text-red-400 uppercase">Stop Loss / وقف الخسارة</p>
                         <p className="text-xl font-black text-white tabular-nums" dir="ltr">${activeSignal.targets.sl.toLocaleString()}</p>
                      </div>
                      <ShieldCheck size={20} className="text-red-500 opacity-20" />
                   </div>
                   <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 flex items-center justify-between group">
                      <div className="space-y-1 text-right">
                         <p className="text-[9px] font-black text-[#f9a885] uppercase">Confidence / الثقة</p>
                         <p className="text-xl font-black text-white tabular-nums">%{activeSignal.confidence}</p>
                      </div>
                      <Zap size={20} className="text-[#f9a885] opacity-20" />
                   </div>
                </div>
             </div>

             {/* 6. Luxury Footer Branding */}
             <div className="relative pt-10 flex flex-col items-center gap-6">
                {/* Custom Styled Divider */}
                <div className="w-full flex items-center gap-0">
                   <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                   <div className="px-8 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1.5 scale-[0.9] opacity-40">
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      </div>
                   </div>
                   <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent via-white/10 to-transparent" />
                </div>

                <div className="text-center space-y-2">
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.6em] ml-[0.6em]">NAMIX UNIVERSAL NETWORK</p>
                   <div className="flex items-center justify-center gap-3">
                      <Sparkles size={10} className="text-[#f9a885]/40" />
                      <p className="text-[11px] font-black text-[#f9a885] tracking-[0.1em] uppercase">Powered by NAMIX AI CORE</p>
                      <Sparkles size={10} className="text-[#f9a885]/40" />
                   </div>
                </div>
                
                <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.3em] opacity-30">Sovereign Intelligence Node v30.0</p>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}
