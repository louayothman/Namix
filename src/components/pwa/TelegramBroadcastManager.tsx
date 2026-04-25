
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
import { ShieldCheck, Zap, Target, Coins, Activity, Sparkles, Hash, TrendingUp, TrendingDown, Cpu } from "lucide-react";

/**
 * @fileOverview محرك بث تلغرام المستقل v26.1 - Fix: Added Missing Badge Import
 * تم تحديث التصميم ليكون رمادي مزرق مع خلفية شعار شفافة ونظام ثنائي اللغة وتذييل راقي.
 */

export function TelegramBroadcastManager() {
  const db = useFirestore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [activeSignal, setActiveSignal] = useState<any>(null);
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
            isCapturing.current = false;
          }, 1500);
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

  return (
    <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none overflow-hidden z-[-1]" dir="rtl">
      {activeSignal && (
        <div 
          ref={captureRef}
          className="w-[600px] h-[850px] bg-[#0B0F1A] p-8 flex flex-col justify-between font-body text-right"
        >
          {/* Main Card Frame - Grey Blue Gradient */}
          <div className="w-full h-full bg-gradient-to-br from-[#121826] to-[#0B0F1A] rounded-[60px] border border-white/5 p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
             
             {/* 1. Giant Transparent Watermark Logo */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-[2.5] -rotate-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-32 h-32 rounded-full bg-white" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-[#f9a885]" />
                  <div className="w-32 h-32 rounded-full bg-white" />
                </div>
             </div>

             {/* 2. Wave Pattern Overlay */}
             <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wavePattern" x="0" y="0" width="120" height="24" patternUnits="userSpaceOnUse">
                      <path d="M0 12 Q 30 0 60 12 T 120 12" fill="none" stroke="white" strokeWidth="0.8"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wavePattern)" />
                </svg>
             </div>

             {/* 3. Header: Market Icon (Right) & Platform Icon (Left) */}
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12">
                      <CryptoIcon name={activeSignal.pair.split('/')[0]} size={36} />
                   </div>
                   <div className="text-right">
                      <h3 className="text-2xl font-black text-white tracking-tighter">{activeSignal.pair}</h3>
                      <p className="text-[8px] font-black text-blue-300/40 uppercase tracking-[0.3em] mt-1">Market Pulse Node</p>
                   </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                   <div className="grid grid-cols-2 gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                   </div>
                   <span className="text-[6px] font-black text-blue-200/20 tracking-[0.5em]">NAMIX</span>
                </div>
             </div>

             {/* 4. Main Body: Symbol & Direction */}
             <div className="flex items-center justify-between relative z-10 py-4">
                <div className="flex flex-col items-start gap-3">
                   <div className={cn(
                     "px-8 py-3 rounded-3xl font-black text-sm shadow-xl flex items-center gap-3",
                     activeSignal.decision === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                   )}>
                      {activeSignal.decision === 'BUY' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      <span>{activeSignal.type} / {activeSignal.decision === 'BUY' ? 'شراء' : 'بيع'}</span>
                   </div>
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mr-4">Decision Status</p>
                </div>
                <div className="text-left space-y-1" dir="ltr">
                   <p className="text-4xl font-black text-white tracking-tighter tabular-nums">${activeSignal.agents?.tech?.last?.toLocaleString()}</p>
                   <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Global Entry Price</p>
                </div>
             </div>

             {/* 5. Data Matrix - Bilingual */}
             <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="p-8 bg-white/[0.03] rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                   <div className="flex justify-between items-center text-gray-400 px-2">
                      <div className="flex items-center gap-2">
                         <Target size={14} />
                         <span className="text-[9px] font-black uppercase">Nodes / نقاط التمركز</span>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-400 border-none text-[7px] font-black tracking-widest px-3 py-1">PRO SPECTRA</Badge>
                   </div>
                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-1 text-right">
                         <p className="text-[9px] font-black text-blue-400 uppercase">Entry Zone / الدخول</p>
                         <p className="text-2xl font-black text-white tabular-nums tracking-tighter" dir="ltr">{activeSignal.entry_range}</p>
                      </div>
                      <div className="space-y-1 text-right">
                         <p className="text-[9px] font-black text-emerald-400 uppercase">Main Target / الهدف</p>
                         <p className="text-2xl font-black text-emerald-400 tabular-nums tracking-tighter" dir="ltr">${activeSignal.targets.tp1.toLocaleString()}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 flex items-center justify-between group/box hover:bg-white/[0.04] transition-all">
                      <div className="space-y-1 text-right">
                         <p className="text-[8px] font-black text-red-400 uppercase">Stop Loss / وقف الخسارة</p>
                         <p className="text-xl font-black text-white tabular-nums" dir="ltr">${activeSignal.targets.sl.toLocaleString()}</p>
                      </div>
                      <ShieldCheck size={20} className="text-red-500 opacity-20 group-hover/box:opacity-100 transition-opacity" />
                   </div>
                   <div className="p-6 bg-white/[0.02] rounded-[36px] border border-white/5 flex items-center justify-between group/box hover:bg-white/[0.04] transition-all">
                      <div className="space-y-1 text-right">
                         <p className="text-[8px] font-black text-[#f9a885] uppercase">Confidence / الثقة</p>
                         <p className="text-xl font-black text-white tabular-nums">%{activeSignal.confidence}</p>
                      </div>
                      <Zap size={20} className="text-[#f9a885] opacity-20 group-hover/box:opacity-100 transition-opacity" />
                   </div>
                </div>
             </div>

             {/* 6. Professional Footer - Centered Logo & Branding */}
             <div className="relative pt-12 flex flex-col items-center gap-6">
                {/* Separator with Gap for Logo */}
                <div className="w-full flex items-center gap-0">
                   <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                   <div className="px-6 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1 scale-[0.8] opacity-60">
                        <div className="h-2 w-2 rounded-full bg-white" />
                        <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                        <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                   </div>
                   <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent via-white/10 to-transparent" />
                </div>

                <div className="text-center space-y-1.5">
                   <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] ml-[0.5em]">NAMIX UNIVERSAL NETWORK</p>
                   <div className="flex items-center justify-center gap-3">
                      <div className="h-px w-4 bg-[#f9a885]/40" />
                      <p className="text-[10px] font-black text-[#f9a885] tracking-widest uppercase">Powered by NAMIX AI CORE</p>
                      <div className="h-px w-4 bg-[#f9a885]/40" />
                   </div>
                </div>
                
                <p className="text-[6px] font-bold text-gray-500 uppercase tracking-[0.2em] opacity-40">Sovereign Intelligence Node v26.0</p>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}
