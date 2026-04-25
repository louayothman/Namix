
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
import { ShieldCheck, Zap, Target, Coins, Activity, Sparkles, Hash } from "lucide-react";

/**
 * @fileOverview محرك بث تلغرام المستقل v25.0 - HTML-to-Image Pulse
 * تم دمج تقنية html-to-image لرسم بطاقات "Debit Card" تكتيكية للإشارات.
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
        // 1. جلب الأسواق والتحليل
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
          // 2. تفعيل بروتوكول الرسم (HTML Rendering)
          isCapturing.current = true;
          setActiveSignal(best.analysis);

          // انتظار الريندر في DOM
          setTimeout(async () => {
            if (captureRef.current) {
              try {
                // التقاط الصورة بصيغة JPEG عالية الجودة
                const dataUrl = await toJpeg(captureRef.current, { 
                  quality: 0.95,
                  backgroundColor: '#0B0F1A'
                });
                
                // 3. البث الفوري لتلغرام
                await broadcastSignalToTelegram(best.analysis, best.sym, dataUrl);
              } catch (err) {
                console.error("Capture Logic Fail:", err);
                // بث نصي احتياطي في حال فشل الصورة
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

    // دورة كل 5 دقائق
    const interval = setInterval(runTelegramCycle, 300000);
    runTelegramCycle();

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [db]);

  // واجهة البطاقة المصرفية المخبأة (Hidden Sovereign Card)
  return (
    <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none overflow-hidden z-[-1]" dir="rtl">
      {activeSignal && (
        <div 
          ref={captureRef}
          className="w-[600px] h-[800px] bg-[#0B0F1A] p-10 flex flex-col justify-between font-body text-right"
        >
          {/* Card Frame */}
          <div className="w-full h-full bg-[#121826] rounded-[50px] border border-white/5 p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
             
             {/* Wave Pattern Overlay */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wavePattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                      <path d="M0 10 Q 25 0 50 10 T 100 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wavePattern)" />
                </svg>
             </div>

             {/* 1. Header: Logo & Branding */}
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                   </div>
                   <div className="flex flex-col items-start" dir="ltr">
                      <h2 className="text-2xl font-black text-white italic tracking-tighter">NAMIX PRO</h2>
                      <p className="text-[8px] font-black text-[#f9a885] uppercase tracking-[0.4em] opacity-40">Intelligence Node</p>
                   </div>
                </div>
                <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                   <ShieldCheck className="text-emerald-500" size={20} />
                </div>
             </div>

             {/* 2. Asset Focus: Symbol & Bias */}
             <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                   <h3 className="text-5xl font-black text-white tracking-tighter">{activeSignal.pair}</h3>
                   <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", activeSignal.decision === 'BUY' ? 'bg-emerald-500' : 'bg-red-500')} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Pulse Sync</span>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className={cn(
                     "px-6 py-2 rounded-full font-black text-xs shadow-lg",
                     activeSignal.decision === 'BUY' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                   )}>
                      {activeSignal.type}
                   </div>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Decision Status</p>
                </div>
             </div>

             {/* 3. Data Matrix */}
             <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5 space-y-4">
                   <div className="flex items-center gap-2 text-gray-400">
                      <Target size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Entry / Target Nodes</span>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-blue-400 uppercase">Entry Zone</p>
                         <p className="text-2xl font-black text-white tabular-nums tracking-tighter" dir="ltr">{activeSignal.entry_range}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-emerald-400 uppercase">Main Target</p>
                         <p className="text-2xl font-black text-emerald-400 tabular-nums tracking-tighter" dir="ltr">${activeSignal.targets.tp1.toLocaleString()}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-white/[0.02] rounded-[28px] border border-white/5 flex items-center justify-between">
                      <div className="space-y-0.5">
                         <p className="text-[8px] font-black text-red-400 uppercase">Stop Loss</p>
                         <p className="text-lg font-black text-white tabular-nums" dir="ltr">${activeSignal.targets.sl.toLocaleString()}</p>
                      </div>
                      <ShieldCheck size={18} className="text-red-500 opacity-20" />
                   </div>
                   <div className="p-5 bg-white/[0.02] rounded-[28px] border border-white/5 flex items-center justify-between">
                      <div className="space-y-0.5">
                         <p className="text-[8px] font-black text-[#f9a885] uppercase">Confidence</p>
                         <p className="text-lg font-black text-white tabular-nums">%{activeSignal.confidence}</p>
                      </div>
                      <Zap size={18} className="text-[#f9a885] opacity-20" />
                   </div>
                </div>
             </div>

             {/* 4. Footer Branding & Chip */}
             <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-14 rounded-xl bg-gradient-to-br from-[#f9a885]/20 to-transparent border border-white/10 flex items-center justify-center relative">
                      <div className="grid grid-cols-3 gap-1 opacity-20">
                         {[...Array(6)].map((_, i) => <div key={i} className="h-1 w-2 bg-white rounded-full" />)}
                      </div>
                   </div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereign Asset Node</p>
                </div>
                <div className="text-left">
                   <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">Powered By</p>
                   <p className="text-[11px] font-black text-[#f9a885] tracking-tighter">NAMIX AI CORE</p>
                </div>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}

