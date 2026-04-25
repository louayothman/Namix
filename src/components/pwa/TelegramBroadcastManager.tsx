
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
 * @fileOverview محرك بث تلغرام المستقل v35.0 - Recharts Candlestick Edition
 * تم تطوير المحرك لاستخدام Recharts في رسم 7 شموع تكتيكية توضح أهداف الصفقة ومنطق الدخول.
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
            // جلب 7 شموع فقط لتوضيح إعداد الصفقة
            history = await getHistoricalKlines(best.sym.binanceSymbol, '15m', 7);
          } else {
            history = generateInternalHistory(best.sym.id, best.sym, 7);
          }
          
          // تحضير البيانات لـ Recharts
          const formatted = history.map(d => ({
            ...d,
            // تحديد الجسم والفتيل للرسم
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
          }, 2500); // زيادة بسيطة لضمان رندر Recharts
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

  const isUp = activeSignal?.decision === 'BUY';

  return (
    <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none overflow-hidden z-[-1]" dir="rtl">
      {activeSignal && (
        <div 
          ref={captureRef}
          className="w-[600px] h-[950px] bg-[#0B0F1A] p-8 flex flex-col justify-between font-body text-right"
        >
          <div className="w-full h-full bg-gradient-to-br from-[#121826] to-[#0B0F1A] rounded-[60px] border border-white/5 p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
             
             {/* العلامة المائية الضخمة */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-[2.8] -rotate-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-32 h-32 rounded-full bg-white" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-white" />
                </div>
             </div>

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

             {/* مسرح الشموع اليابانية (Recharts Engine) */}
             <div className="relative h-64 w-full z-10 px-4 mt-6 bg-white/[0.02] rounded-[40px] border border-white/[0.03] shadow-inner overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={chartData} margin={{ top: 40, right: 10, left: 10, bottom: 20 }}>
                      <XAxis hide />
                      <YAxis hide domain={['auto', 'auto']} />
                      
                      {/* رسم الفتائل (Wicks) */}
                      <Bar dataKey="lowHigh" fill="#8884d8" barSize={2}>
                         {chartData.map((d, i) => (
                           <Cell key={i} fill={d.close >= d.open ? "#10b981" : "#ef4444"} fillOpacity={0.4} />
                         ))}
                      </Bar>

                      {/* رسم الأجسام (Bodies) */}
                      <Bar dataKey="openClose" barSize={20}>
                         {chartData.map((d, i) => (
                           <Cell key={i} fill={d.close >= d.open ? "#10b981" : "#ef4444"} />
                         ))}
                      </Bar>

                      {/* خطوط إعداد الصفقة (Setup Lines) */}
                      <ReferenceLine y={activeSignal.agents.tech.last} stroke="#f9a885" strokeWidth={1} strokeDasharray="3 3" label={{ position: 'left', value: `ENTRY: ${activeSignal.agents.tech.last.toFixed(2)}`, fill: '#f9a885', fontSize: 8, fontWeight: 900 }} />
                      <ReferenceLine y={activeSignal.targets.tp1} stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" label={{ position: 'left', value: `TARGET: ${activeSignal.targets.tp1.toFixed(2)}`, fill: '#10b981', fontSize: 8, fontWeight: 900 }} />
                      <ReferenceLine y={activeSignal.targets.sl} stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" label={{ position: 'left', value: `SL: ${activeSignal.targets.sl.toFixed(2)}`, fill: '#ef4444', fontSize: 8, fontWeight: 900 }} />
                   </ComposedChart>
                </ResponsiveContainer>

                {/* شرح سبب الدخول على الشارت */}
                <div className="absolute top-4 right-6 text-right max-w-[200px] space-y-1">
                   <div className="flex items-center justify-end gap-2 text-[#f9a885]">
                      <Sparkles size={10} className="animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Logic Node</span>
                   </div>
                   <p className="text-[10px] font-bold text-white/60 leading-relaxed">{activeSignal.reason}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-6 relative z-10 mt-6">
                <div className="p-8 bg-white/[0.03] rounded-[48px] border border-white/5 space-y-6 shadow-inner">
                   <div className="flex justify-between items-center text-gray-400 px-2">
                      <div className="flex items-center gap-2">
                         <Target size={14} className="text-[#f9a885]" />
                         <span className="text-[9px] font-black uppercase">Nodes / نقاط التمركز</span>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-400 border-none text-[7px] font-black tracking-widest px-4 py-1.5 rounded-xl">PRO SPECTRA</Badge>
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
                   <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 flex items-center justify-between">
                      <div className="space-y-1 text-right">
                         <p className="text-[9px] font-black text-red-400 uppercase">Stop Loss / وقف الخسارة</p>
                         <p className="text-xl font-black text-white tabular-nums" dir="ltr">${activeSignal.targets.sl.toLocaleString()}</p>
                      </div>
                      <ShieldCheck size={20} className="text-red-500 opacity-20" />
                   </div>
                   <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 flex items-center justify-between">
                      <div className="space-y-1 text-right">
                         <p className="text-[9px] font-black text-[#f9a885] uppercase">Confidence / الثقة</p>
                         <p className="text-xl font-black text-white tabular-nums">%{activeSignal.confidence}</p>
                      </div>
                      <Zap size={20} className="text-[#f9a885] opacity-20" />
                   </div>
                </div>
             </div>

             <div className="relative pt-10 flex flex-col items-center gap-6">
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
                
                <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.3em] opacity-30">Sovereign Intelligence Node v35.0</p>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}
