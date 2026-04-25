
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
  ArrowRightLeft,
  MapPin
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
 * @fileOverview محرك بث تلغرام النخبوي v36.0 - High-Contrast Tactical Card
 * تم تطوير المفاعل لعرض 14 شمعة تكتيكية بزوايا مستديرة بالكامل ومصفوفة بيانات نانوية موحدة.
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

        const best = analyses.sort((a, b) => b.strength - a.strength)[0];

        if (best && best.analysis.decision !== 'HOLD') {
          isCapturing.current = true;
          
          let history: any[] = [];
          if (best.sym.priceSource === 'binance') {
            // جلب 14 شمعة تكتيكية لتوضيح إعداد الصفقة
            history = await getHistoricalKlines(best.sym.binanceSymbol, '15m', 14);
          } else {
            history = generateInternalHistory(best.sym.id, best.sym, 14);
          }
          
          const formatted = history.map(d => ({
            ...d,
            openClose: [d.open, d.close],
            lowHigh: [d.low, d.high]
          }));

          setChartData(formatted);
          setActiveSignal(best.analysis);

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
          }, 3000); 
        }
      } catch (e) {
        console.error("Telegram Cycle Error:", e);
        isCapturing.current = false;
      }
    };

    const interval = setInterval(runTelegramCycle, 300000); 
    runTelegramCycle();

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [db]);

  if (!activeSignal) return null;

  return (
    <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none overflow-hidden z-[-1]" dir="rtl">
      {activeSignal && (
        <div 
          ref={captureRef}
          className="w-[600px] h-[950px] bg-[#0B0F1A] p-6 flex flex-col justify-between font-body text-right"
        >
          <div className="w-full h-full bg-[#121826] rounded-[64px] border border-white/5 p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
             
             {/* Sovereign Watermark */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none scale-[3] -rotate-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-32 h-32 rounded-full bg-white" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-white" />
                </div>
             </div>

             {/* Header Node */}
             <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-8">
                <div className="flex items-center gap-5">
                   <div className="h-16 w-16 rounded-[24px] bg-white/5 flex items-center justify-center shadow-xl border border-white/10">
                      <CryptoIcon name={activeSignal.pair.split('/')[0]} size={44} />
                   </div>
                   <div className="text-right">
                      <h3 className="text-2xl font-black text-white tracking-tighter">{activeSignal.pair}</h3>
                      <p className="text-[9px] font-bold text-[#f9a885] uppercase tracking-widest mt-1">Market Pulse Analysis</p>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <Badge className={cn(
                     "font-black text-[10px] px-6 py-2 rounded-full border-none shadow-xl",
                     activeSignal.decision === 'BUY' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                   )}>
                      {activeSignal.decision === 'BUY' ? 'LONG SIGNAL' : 'SHORT SIGNAL'}
                   </Badge>
                </div>
             </div>

             {/* Tactical Candlestick Theater - Increased Height */}
             <div className="relative h-[420px] w-full z-10 mt-6 bg-black/20 rounded-[48px] border border-white/5 shadow-inner overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={chartData} margin={{ top: 50, right: 10, left: 10, bottom: 20 }}>
                      <XAxis hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      
                      {/* Wicks */}
                      <Bar dataKey="lowHigh" fill="#8884d8" barSize={1.5}>
                         {chartData.map((d, i) => (
                           <Cell key={i} fill={d.close >= d.open ? "#10b981" : "#ef4444"} fillOpacity={0.3} />
                         ))}
                      </Bar>

                      {/* Perfect Rounded Bodies */}
                      <Bar dataKey="openClose" barSize={18} radius={[10, 10, 10, 10]}>
                         {chartData.map((d, i) => (
                           <Cell key={i} fill={d.close >= d.open ? "#10b981" : "#ef4444"} />
                         ))}
                      </Bar>

                      {/* Setup Annotations */}
                      <ReferenceLine y={activeSignal.agents.tech.last} stroke="#f9a885" strokeWidth={1} strokeDasharray="3 3" />
                      <ReferenceLine y={activeSignal.targets.tp1} stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" />
                      <ReferenceLine y={activeSignal.targets.sl} stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" />
                   </ComposedChart>
              </ResponsiveContainer>

              {/* Float Analysis Node */}
              <div className="absolute top-6 left-6 text-left" dir="ltr">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="h-1 w-1 rounded-full bg-[#f9a885] animate-pulse" />
                    <span className="text-[8px] font-black text-[#f9a885] uppercase tracking-widest">Logic Node</span>
                 </div>
                 <p className="text-[10px] font-bold text-white/40 max-w-[180px] leading-relaxed uppercase">{activeSignal.reason}</p>
              </div>
              
              <div className="absolute bottom-6 right-8 text-right space-y-1">
                 <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Live Execution Price</p>
                 <p className="text-xl font-black text-white tabular-nums tracking-tighter">${activeSignal.agents.tech.last.toLocaleString()}</p>
              </div>
           </div>

           {/* Compact Nodes Row - Save Space */}
           <div className="grid grid-cols-1 gap-4 relative z-10 mt-6">
              <div className="p-6 bg-white/[0.02] rounded-[40px] border border-white/5 flex items-center justify-between gap-10">
                 <div className="flex items-center gap-8 flex-1">
                    <div className="space-y-1 text-right">
                       <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={10} /> Entry Range
                       </p>
                       <p className="text-xl font-black text-white tabular-nums tracking-tighter" dir="ltr">{activeSignal.entry_range}</p>
                    </div>
                    <div className="h-8 w-px bg-white/5" />
                    <div className="space-y-1 text-right">
                       <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                          <Target size={10} /> Target Node
                       </p>
                       <p className="text-xl font-black text-emerald-400 tabular-nums tracking-tighter" dir="ltr">${activeSignal.targets.tp1.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="text-center bg-white/[0.02] px-6 py-2 rounded-2xl border border-white/5">
                    <p className="text-[7px] font-black text-gray-500 uppercase mb-1">Confidence</p>
                    <p className="text-lg font-black text-[#f9a885] tabular-nums">%{activeSignal.confidence}</p>
                 </div>
              </div>

              <div className="p-5 bg-red-500/5 rounded-[32px] border border-red-500/10 flex items-center justify-between px-10">
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-red-500 opacity-40" />
                    <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Security Stop Loss</span>
                 </div>
                 <p className="text-lg font-black text-red-500 tabular-nums tracking-tighter" dir="ltr">${activeSignal.targets.sl.toLocaleString()}</p>
              </div>
           </div>

           {/* Clean Minimalist Footer */}
           <div className="relative pt-8 flex flex-col items-center gap-4">
              <div className="w-full flex items-center gap-4 opacity-10">
                 <div className="flex-1 h-[0.5px] bg-white" />
                 <div className="grid grid-cols-2 gap-1 scale-[0.6]">
                    <div className="h-2 w-2 rounded-full bg-white" />
                    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                    <div className="h-2 w-2 rounded-full bg-white" />
                 </div>
                 <div className="flex-1 h-[0.5px] bg-white" />
              </div>

              <div className="flex flex-col items-center gap-1.5 opacity-50">
                 <p className="text-[10px] font-black text-[#f9a885] tracking-[0.2em] uppercase">Powered by NAMIX AI CORE</p>
                 <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.4em]">Proprietary Intelligence Protocol v36.0</p>
              </div>
           </div>

          </div>
        </div>
      )}
    </div>
  );
}
