
'use client';

import React, { useEffect, useRef, useState } from "react";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  limit,
  orderBy
} from "firebase/firestore";
import { runNamix } from "@/lib/namix-orchestrator";
import { broadcastSignalToTelegram } from "@/app/actions/telegram-actions";
import { toJpeg } from "html-to-image";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Target, 
  Activity, 
  TrendingUp, 
  Clock,
  Cpu,
  ShieldCheck,
  TrendingDown
} from "lucide-react";
import { getHistoricalKlines } from "@/services/binance-service";
import { generateInternalHistory } from "@/lib/internal-market";
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ReferenceLine, 
  ResponsiveContainer,
  Cell
} from "recharts";

/**
 * @fileOverview محرك البث التلقائي للإشارات v45.0 - Professional Image Protocol
 * تم إعادة هندسة الكرت ليتطابق مع التصميم النخبوي المعتمد (الخلفية الشفافة، صمام الأمان، وشبكة التذييل).
 */

export function TelegramBroadcastManager() {
  const db = useFirestore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [activeSignal, setActiveSignal] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const isCapturing = useRef(false);

  useEffect(() => {
    const runTelegramCycle = async () => {
      if (isCapturing.current) return;
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

        const best = analyses.sort((a, b) => b.strength - a.strength)[0];
        if (best && best.analysis.decision !== 'HOLD') {
          await processImageSignal(best.analysis, best.sym);
        }
      } catch (e) {
        console.error("Broadcast Cycle Fail:", e);
        isCapturing.current = false;
      }
    };

    // تشغيل أولي
    runTelegramCycle();

    const interval = setInterval(runTelegramCycle, 300000); 
    return () => clearInterval(interval);
  }, [db]);

  const processImageSignal = async (signal: any, symbol: any) => {
    isCapturing.current = true;
    
    let history: any[] = [];
    try {
      if (symbol.priceSource === 'binance') {
        history = await getHistoricalKlines(symbol.binanceSymbol, '15m', 14);
      } else {
        history = generateInternalHistory(symbol.id, symbol, 14);
      }
      
      if (!history.length) throw new Error("No chart data available");
      
      setChartData(history.map(d => ({ ...d, body: [d.open, d.close] })));
      setActiveSignal(signal);

      setTimeout(async () => {
        if (captureRef.current) {
          try {
            const dataUrl = await toJpeg(captureRef.current, { quality: 0.98, pixelRatio: 4, backgroundColor: '#0B0F1A' });
            await broadcastSignalToTelegram(signal, symbol, dataUrl);
          } catch (err) {
            console.error("Capture Error:", err);
            await broadcastSignalToTelegram(signal, symbol);
          }
        }
        setActiveSignal(null);
        setChartData([]);
        isCapturing.current = false;
      }, 4000);
    } catch (err) {
      console.error("Process Signal Error:", err);
      isCapturing.current = false;
    }
  };

  if (!activeSignal) return null;

  const isBuy = activeSignal.decision === 'BUY';
  const isSell = activeSignal.decision === 'SELL';

  return (
    <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none overflow-hidden z-[-1]" dir="rtl">
      <div ref={captureRef} className="w-[650px] h-[950px] bg-[#0B0F1A] p-6 flex flex-col justify-between font-body text-right">
        <div className="w-full h-full bg-[#121826] rounded-[64px] border border-white/5 p-10 flex flex-col relative overflow-hidden shadow-2xl">
           
           {/* 1. Background Logo - Sovereign Huge Transparent Dots */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.015] z-0">
              <div className="grid grid-cols-2 gap-20">
                 <div className="w-72 h-72 rounded-full bg-white" />
                 <div className="w-72 h-72 rounded-full bg-[#f9a885]" />
                 <div className="w-72 h-72 rounded-full bg-[#f9a885]" />
                 <div className="w-72 h-72 rounded-full bg-white" />
              </div>
           </div>

           {/* 2. Top Header Strip */}
           <div className="flex items-center justify-between relative z-10 mb-8">
              <Badge className={cn(
                "font-black text-[12px] px-6 py-3 rounded-full border-none shadow-xl text-white uppercase tracking-normal",
                isBuy ? "bg-emerald-500" : "bg-red-500"
              )}>
                {isBuy ? 'إشارة شراء / BUY' : 'إشارة بيع / SELL'}
              </Badge>
              <div className="flex items-center gap-5">
                 <div className="text-right">
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-none">{activeSignal.pair}</h3>
                    <p className="text-2xl font-black text-[#f9a885] tabular-nums mt-2 leading-none">
                      ${activeSignal.agents.tech.last.toLocaleString(undefined, { minimumFractionDigits: 3 })}
                    </p>
                 </div>
                 <div className="h-16 w-16 flex items-center justify-center">
                    <CryptoIcon name={activeSignal.pair.split('/')[0]} size={64} />
                 </div>
              </div>
           </div>

           <div className="h-px bg-white/5 w-full mb-8 relative z-10" />

           {/* 3. Analysis Card & Bar Chart */}
           <div className="bg-black/20 rounded-[48px] border border-white/5 p-8 flex flex-col gap-5 relative z-10 flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ANALYSIS / التحليل</span>
              </div>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-normal">{activeSignal.reason}</p>
              
              <div className="flex-1 w-full mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                       <XAxis hide />
                       <YAxis hide domain={['auto', 'auto']} />
                       <ReferenceLine y={activeSignal.agents.tech.last} stroke="#f9a885" strokeWidth={2} strokeDasharray="4 4" opacity={0.3} />
                       <Bar dataKey="body" barSize={20} radius={[8, 8, 8, 8]} isAnimationActive={false}>
                          {chartData.map((d, i) => (
                            <Cell key={i} fill={d.close >= d.open ? "#10b981" : "#ef4444"} />
                          ))}
                       </Bar>
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* 4. Metrics Grid - 3 Columns */}
           <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
              <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 space-y-1 text-center">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">الدخول / ENTRY</p>
                 <p className="text-sm font-black text-white tabular-nums tracking-tighter" dir="ltr">{activeSignal.entry_range}</p>
              </div>
              <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 space-y-1 text-center">
                 <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">الهدف / TARGET</p>
                 <p className="text-2xl font-black text-emerald-500 tabular-nums tracking-tighter">
                   ${activeSignal.targets.tp1.toLocaleString(undefined, { minimumFractionDigits: 3 })}
                 </p>
              </div>
              <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 space-y-1 text-center">
                 <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">الثقة / CONF</p>
                 <p className="text-2xl font-black text-white tabular-nums tracking-tighter">%{activeSignal.confidence}</p>
              </div>
           </div>

           {/* 5. Stop Loss Section - Fixed Bottom Bar */}
           <div className="mt-6 p-6 bg-red-500/[0.03] rounded-[36px] border border-red-500/10 flex items-center justify-between relative z-10">
              <span className="text-2xl font-black text-red-500 tabular-nums tracking-tighter">
                 ${activeSignal.targets.sl.toLocaleString(undefined, { minimumFractionDigits: 3 })}
              </span>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">صمام الأمان / STOP LOSS</span>
                 <ShieldCheck size={20} className="text-red-500" />
              </div>
           </div>

           {/* 6. Sovereign Footer Grid */}
           <div className="mt-auto pt-8 flex flex-col items-center gap-3 relative z-10">
              <div className="grid grid-cols-2 gap-1.5 opacity-40">
                 <div className="h-1.5 w-1.5 rounded-full bg-white" />
                 <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                 <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                 <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <p className="text-[8px] font-black text-white/10 tracking-[0.5em] uppercase">POWERED BY NAMIX AI CORE</p>
           </div>
        </div>
      </div>
    </div>
  );
}
