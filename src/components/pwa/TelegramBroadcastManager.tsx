
'use client';

import React, { useEffect, useRef, useState } from "react";
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
  MapPin,
  Fingerprint,
  Cpu
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
 * @fileOverview محرك بث تلغرام النخبوي v40.5 - Pure Identity Rebirth
 * تم إصلاح خطأ استيراد setDoc، وحذف "Live Node"، وإعادة بناء شعار التذييل بنقاء مطلق.
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
            history = await getHistoricalKlines(best.sym.binanceSymbol, '15m', 14);
          } else {
            history = generateInternalHistory(best.sym.id, best.sym, 14);
          }
          
          const formatted = history.map(d => ({
            ...d,
            body: [d.open, d.close]
          }));

          setChartData(formatted);
          setActiveSignal(best.analysis);

          setTimeout(async () => {
            if (captureRef.current) {
              try {
                const dataUrl = await toJpeg(captureRef.current, { 
                  quality: 0.98,
                  pixelRatio: 4, 
                  backgroundColor: '#0B0F1A'
                });
                await broadcastSignalToTelegram(best.analysis, best.sym, dataUrl);
              } catch (err) {
                console.error("Capture HD Fail:", err);
                await broadcastSignalToTelegram(best.analysis, best.sym);
              }
            }
            setActiveSignal(null);
            setChartData([]);
            isCapturing.current = false;
          }, 4000); 
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
          className="w-[650px] h-[950px] bg-[#0B0F1A] p-6 flex flex-col justify-between font-body text-right"
        >
          <div className="w-full h-full bg-[#121826] rounded-[64px] border border-white/5 p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
             
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none scale-[3] -rotate-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-32 h-32 rounded-full bg-white" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-white" />
                </div>
             </div>

             <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-8">
                <div className="flex items-center gap-5">
                   <div className="h-16 w-16 flex items-center justify-center">
                      <CryptoIcon name={activeSignal.pair.split('/')[0]} size={60} />
                   </div>
                   <div className="text-right">
                      <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{activeSignal.pair}</h3>
                      <p className="text-xl font-black text-[#f9a885] tabular-nums mt-1.5 leading-none">
                        ${activeSignal.agents.tech.last.toLocaleString()}
                      </p>
                   </div>
                </div>
                
                <Badge className={cn(
                  "font-black text-[11px] px-6 py-2.5 rounded-full border-none shadow-xl text-white uppercase tracking-widest",
                  activeSignal.decision === 'BUY' ? "bg-emerald-500" : "bg-red-500"
                )}>
                  {activeSignal.decision === 'BUY' ? 'إشارة شراء / LONG' : 'إشارة بيع / SHORT'}
                </Badge>
             </div>

             <div className="relative h-[480px] w-full z-10 mt-4 bg-black/20 rounded-[48px] border border-white/5 shadow-inner overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={chartData} margin={{ top: 50, right: 10, left: 10, bottom: 20 }}>
                      <XAxis hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      <ReferenceLine y={activeSignal.agents.tech.last} stroke="#f9a885" strokeWidth={2} strokeDasharray="4 4" />
                      <Bar dataKey="body" barSize={18} radius={[8, 8, 8, 8]} isAnimationActive={false}>
                         {chartData.map((d, i) => (
                           <Cell key={i} fill={d.close >= d.open ? "#10b981" : "#ef4444"} />
                         ))}
                      </Bar>
                   </ComposedChart>
                </ResponsiveContainer>

                <div className="absolute top-8 left-8 text-left" dir="ltr">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
                      <span className="text-[9px] font-black text-[#f9a885] uppercase tracking-widest">التحليل / ANALYSIS</span>
                   </div>
                   <p className="text-[11px] font-bold text-white/50 max-w-[220px] leading-relaxed uppercase">{activeSignal.reason}</p>
                </div>
             </div>

             <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
                <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 space-y-1 text-center">
                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none">الثقة / CONF</p>
                   <p className="text-2xl font-black text-white tabular-nums tracking-tighter">%{activeSignal.confidence}</p>
                </div>

                <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 space-y-1 text-center border-x border-white/5">
                   <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">الهدف / TARGET</p>
                   <p className="text-2xl font-black text-emerald-500 tabular-nums tracking-tighter">${activeSignal.targets.tp1.toLocaleString()}</p>
                </div>

                <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 space-y-1 text-center">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">الدخول / ENTRY</p>
                   <p className="text-[13px] font-black text-white tabular-nums tracking-tighter" dir="ltr">{activeSignal.entry_range}</p>
                </div>
             </div>

             <div className="p-5 bg-red-500/[0.03] rounded-[32px] border border-red-500/10 flex items-center justify-between px-10 relative z-10 mt-2">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={18} className="text-red-500 opacity-40" />
                   <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">صمام الأمان / STOP LOSS</span>
                </div>
                <p className="text-xl font-black text-red-500 tabular-nums tracking-tighter" dir="ltr">${activeSignal.targets.sl.toLocaleString()}</p>
             </div>

             <div className="relative pt-10 flex flex-col items-center gap-4">
                <div className="relative h-6 w-6 flex items-center justify-center">
                   <div className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-white" />
                   <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="absolute bottom-0 left-0 h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <p className="text-[9px] font-black text-white/40 tracking-[0.4em] uppercase">POWERED BY NAMIX AI CORE</p>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}
