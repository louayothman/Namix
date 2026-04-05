
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { BiasHeader } from "@/components/trade/ai/BiasHeader";
import { IntelligenceBriefing } from "@/components/trade/ai/IntelligenceBriefing";
import { IntelligenceMetrics } from "@/components/trade/ai/IntelligenceMetrics";
import { ParameterConsole } from "@/components/trade/ai/ParameterConsole";
import { MarketScanner } from "@/components/trade/ai/MarketScanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Loader2, 
  PlayCircle, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Check, 
  Minus, 
  AlertTriangle,
  Radar,
  Sparkles,
  Waves
} from "lucide-react";
import { hapticFeedback } from "@/lib/haptic-engine";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/use-market-store";

/**
 * @fileOverview NAMIX-AI Sovereign Terminal v106.0 - 1s API Pulse
 * محرك استخباراتي يربط بين مسار API المركزي والتحديث اللحظي كل ثانية.
 */

type ReactorStatus = 'calibrating' | 'results';

export function NamixAIContainer({ asset, livePrice }: { asset: any, livePrice: number | null }) {
  const db = useFirestore();
  const [status, setStatus] = useState<ReactorStatus>('calibrating');
  const [dbUser, setDbUser] = useState<any>(null);
  
  // States for Live Analysis
  const [result, setResult] = useState<any>(null);
  const [tradeAmount, setTradeAmount] = useState(10.00);
  const [tradeDuration, setTradeDuration] = useState<number>(0); 
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const globalTradeRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: globalConfig } = useDoc(globalTradeRef);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      const parsed = JSON.parse(session);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
        if (snap.exists()) setDbUser({ ...snap.data(), id: snap.id });
      });
      return () => unsub();
    }
  }, [db]);

  // Calibration Phase
  useEffect(() => {
    if (status === 'calibrating') {
      const timer = setTimeout(() => setStatus('results'), 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  /**
   * 1s Logic Pulse - جلب الاستنتاج من الـ API كل ثانية
   */
  useEffect(() => {
    if (status !== 'results' || !asset?.binanceSymbol) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/namix?symbol=${asset.binanceSymbol}`);
        const data = await res.json();
        setResult(data);
      } catch (e) {
        // Silent error to keep UI fluid
      }
    };

    const interval = setInterval(fetchAnalysis, 1000);
    fetchAnalysis();
    return () => clearInterval(interval);
  }, [status, asset]);

  const adminDurations = useMemo(() => {
    if (globalConfig?.tradeDurations && Array.isArray(globalConfig.tradeDurations)) {
      return globalConfig.tradeDurations.map((d: any) => {
        let mult = 1;
        let fullLabel = 'ثانية';
        if (d.unit === 'minutes') { mult = 60; fullLabel = 'دقيقة'; }
        else if (d.unit === 'hours') { mult = 3600; fullLabel = 'ساعة'; }
        else if (d.unit === 'days') { mult = 86400; fullLabel = 'يوم'; }
        return { label: `${d.value} ${fullLabel}`, seconds: d.value * mult };
      });
    }
    return [{ label: '60 ثانية', seconds: 60 }];
  }, [globalConfig]);

  useEffect(() => {
    if (adminDurations.length > 0 && tradeDuration === 0) {
      setTradeDuration(adminDurations[0].seconds);
    }
  }, [adminDurations, tradeDuration]);

  const handleTradeExecution = async () => {
    if (!dbUser || !result || result.decision === 'HOLD' || isExecuting) return;
    
    hapticFeedback.medium();
    setIsExecuting(true);
    try {
      const amt = Number(tradeAmount);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + tradeDuration * 1000); 
      const profitRate = globalConfig?.defaultProfitRate || 80;

      await addDoc(collection(db, "trades"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        symbolId: asset.id,
        symbolCode: asset.code,
        tradeType: result.decision === 'BUY' ? 'buy' : 'sell',
        amount: amt,
        entryPrice: livePrice || asset.currentPrice,
        profitRate,
        expectedProfit: (amt * profitRate) / 100,
        status: "open",
        result: "pending",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        createdAt: startTime.toISOString(),
        aiVerified: true,
        aiConfidence: Math.round(result.score * 100)
      });
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
      hapticFeedback.success();
      setFeedback({ type: 'success', message: 'تم تنفيذ بروتوكول AI بنجاح.' });
    } catch (e) {
      hapticFeedback.error();
    } finally {
      setIsExecuting(false);
    }
  };

  const confidenceScore = result ? Math.round(result.score * 100) : 0;
  const confidenceColor = confidenceScore >= 70 ? "bg-emerald-500" : confidenceScore >= 45 ? "bg-blue-500" : "bg-red-500";

  return (
    <div className="w-full space-y-6 font-body tracking-normal select-none" dir="rtl">
      <AnimatePresence mode="wait">
        {status === 'calibrating' && (
          <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-2">
             <MarketScanner />
          </motion.div>
        )}

        {status === 'results' && result && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-10">
            
            <div className="relative flex items-center justify-between px-5 py-3 bg-gray-50/40 rounded-[32px] border border-gray-100 shadow-inner group overflow-hidden">
               <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                  <Waves size={100} className="text-[#002d4d]" />
               </div>
               <div className="relative z-10 space-y-0.5 text-right">
                  <p className="text-[11px] font-black text-[#002d4d] leading-none">نبض الأسواق</p>
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Live Pulse</p>
               </div>
               <div className="relative z-10 text-left">
                  <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Price Stream</p>
                  <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter leading-none">
                    <span className="text-[10px] text-gray-300 ml-0.5">$</span>
                    {(livePrice || asset.currentPrice)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
               </div>
            </div>
            
            <IntelligenceMetrics scorecard={{
              momentum: Math.round((result.agents?.tech?.score || 0.5) * 100),
              liquidity: Math.round((result.agents?.volume?.score || 0.5) * 100),
              volatility: 85
            }} />

            <BiasHeader bias={result.decision === 'BUY' ? 'Long' : result.decision === 'SELL' ? 'Short' : 'Neutral'} />
            
            {/* تحليل المؤشرات | Indicator Analysis - Flat Matrix */}
            <div className="p-6 bg-gray-50/40 rounded-[40px] border border-gray-100 shadow-inner space-y-4 relative overflow-hidden group/heatmap">
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none group-hover/heatmap:scale-110 transition-transform duration-1000">
                  <Radar size={220} strokeWidth={1} />
               </div>

               <div className="flex items-center justify-between px-2 relative z-10">
                  <div className="text-right">
                    <h4 className="text-[10px] font-black text-[#002d4d]">تحليل المؤشرات</h4>
                    <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">Indicator Analysis</p>
                  </div>
                  <Badge className="bg-white text-blue-600 border-gray-100 font-black text-[7px] px-2 py-0.5 rounded-md shadow-sm">NANO SYNC</Badge>
               </div>

               <div className="flex items-center justify-between gap-4 relative z-10">
                  {result.heatmap?.map((item: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-center gap-1.5">
                       <div className={cn(
                         "h-6 w-6 rounded-lg flex items-center justify-center shadow-inner",
                         item.status === 'bullish' ? "bg-emerald-50 text-emerald-500" : 
                         item.status === 'bearish' ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400"
                       )}>
                          {item.status === 'bullish' ? <Check size={12}/> : item.status === 'bearish' ? <AlertTriangle size={12}/> : <Minus size={12}/>}
                       </div>
                       <div className="text-center">
                          <p className="text-[7px] font-black text-gray-400 uppercase leading-none mb-1">{item.label.split(' ')[0]}</p>
                          <span className={cn("text-[9px] font-black tabular-nums", item.status === 'bullish' ? "text-emerald-600" : item.status === 'bearish' ? "text-red-600" : "text-gray-400")}>
                            {item.val}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* بطاقة المخاطر مع الثقة المدمجة */}
            <div className={cn(
              "p-6 rounded-[44px] border shadow-2xl relative overflow-hidden group/risk transition-colors duration-500 bg-white",
              result.risk?.level === 'LOW' ? "border-emerald-100" : "border-red-100"
            )}>
               <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none group-hover/risk:rotate-12 transition-transform duration-1000">
                  <ShieldCheck size={140} />
               </div>

               <div className="flex items-center justify-between relative z-10 mb-6">
                  <div className="flex items-center gap-3">
                     <div className={cn(
                       "h-10 w-10 rounded-2xl flex items-center justify-center shadow-inner",
                       result.risk?.level === 'LOW' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                     )}>
                        <ShieldAlert size={20} />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Risk Evaluation</p>
                        <p className={cn("text-sm font-black mt-1", result.risk?.level === 'LOW' ? "text-emerald-700" : "text-red-700")}>{result.risk?.level || "UNKNOWN"}</p>
                     </div>
                  </div>
                  <Badge className={cn("border-none font-black text-[9px] px-4 py-1.5 rounded-xl shadow-lg", result.risk?.level === 'LOW' ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
                     {result.risk?.action || "HOLD"}
                  </Badge>
               </div>

               <div className="space-y-3 relative z-10 bg-gray-50/50 p-5 rounded-[32px] border border-gray-100 shadow-inner">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                     <span className="text-gray-400">درجة الثقة الاستراتيجية</span>
                     <span className={cn("tabular-nums", confidenceScore >= 70 ? "text-emerald-600" : "text-blue-600")}>%{confidenceScore}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${confidenceScore}%` }}
                       transition={{ duration: 0.5, ease: "circOut" }}
                       className={cn("h-full relative rounded-full", confidenceColor)}
                     >
                        <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                     </motion.div>
                  </div>
               </div>
            </div>

            <IntelligenceBriefing reasoning={result.reasoning} summary={`تم تحليل الرمز بنتيجة ثقة %${confidenceScore} في هذه اللحظة عبر المحرك السيادي.`} />

            <div className="pt-4 border-t border-gray-100">
               <ParameterConsole 
                 amount={tradeAmount}
                 onAmountChange={setTradeAmount}
                 duration={tradeDuration}
                 onDurationChange={setTradeDuration}
                 durations={adminDurations}
                 balance={dbUser?.totalBalance || 0}
                 minAmount={globalConfig?.minTradeAmount || 10}
                 maxAmount={globalConfig?.maxTradeAmount || 5000}
               />
            </div>

            <div className="pt-2 flex items-center gap-4">
               <Button 
                 onClick={handleTradeExecution}
                 disabled={isExecuting || result.decision === 'HOLD' || result.risk?.action === 'AVOID TRADE'}
                 className={cn(
                   "flex-1 h-16 rounded-full font-black text-lg shadow-xl active:scale-95 transition-all group",
                   result.decision === 'BUY' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/40" : 
                   result.decision === 'SELL' ? "bg-red-500 hover:bg-red-600 shadow-red-900/40" : "bg-gray-100 text-gray-400"
                 )}
               >
                 {isExecuting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                   <div className="flex items-center gap-3">
                      <span>تأكيد التنفيذ (${tradeAmount.toFixed(2)})</span>
                      <PlayCircle className="h-6 w-6" />
                   </div>
                 )}
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {feedback && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-6 right-6 z-[1200]">
              <div className={cn(
                "p-5 rounded-[32px] flex items-center justify-between shadow-2xl border",
                feedback.type === 'success' ? "bg-emerald-600 border-emerald-400 text-white" : "bg-red-600 border-red-400 text-white"
              )}>
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                    <p className="text-sm font-black leading-none">{feedback.message}</p>
                 </div>
                 <button onClick={() => setFeedback(null)}><X size={18} /></button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
