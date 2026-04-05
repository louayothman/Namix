"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { BiasHeader } from "@/components/trade/ai/BiasHeader";
import { IntelligenceBriefing } from "@/components/trade/ai/IntelligenceBriefing";
import { MarketScanner } from "@/components/trade/ai/MarketScanner";
import { ParameterConsole } from "@/components/trade/ai/ParameterConsole";
import { MarketPulseHub } from "@/components/trade/ai/MarketPulseHub";
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
  Target,
  Waves,
  Coins,
  TrendingUp,
  TrendingDown,
  Sparkles
} from "lucide-react";
import { hapticFeedback } from "@/lib/haptic-engine";
import { cn } from "@/lib/utils";

/**
 * @fileOverview NAMIX-AI Sovereign Console v118.0 - Dual Matrix Edition
 * دمج الأهداف الاستراتيجية والمقاييس في بطاقة واحدة مسطحة.
 * إعادة بناء المخاطر والثقة إلى قسمين متجاورين مع مؤشر حلقي (Radial) للثقة.
 */

type ReactorStatus = 'calibrating' | 'results';

/**
 * ConfidenceRing - مؤشر الثقة الحلقي النانوي
 */
function ConfidenceRing({ value, colorClass }: { value: number, colorClass: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-100"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <span className={cn("text-[14px] font-black tabular-nums leading-none", colorClass.replace('text-', 'text-'))}>%{Math.round(value)}</span>
         <span className="text-[6px] font-bold text-gray-300 uppercase tracking-tighter mt-0.5">Trust</span>
      </div>
    </div>
  );
}

export function NamixAIContainer({ asset, livePrice }: { asset: any, livePrice: number | null }) {
  const db = useFirestore();
  const [status, setStatus] = useState<ReactorStatus>('calibrating');
  const [dbUser, setDbUser] = useState<any>(null);
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

  useEffect(() => {
    if (status === 'calibrating') {
      const timer = setTimeout(() => setStatus('results'), 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  /**
   * 3s Strategic Sync Cycle
   */
  useEffect(() => {
    if (status !== 'results' || !asset?.binanceSymbol) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/namix?symbol=${asset.binanceSymbol}`);
        const data = await res.json();
        setResult(data);
      } catch (e) {}
    };

    const interval = setInterval(fetchAnalysis, 3000);
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
  const confidenceColor = confidenceScore >= 70 ? "text-emerald-500" : confidenceScore >= 45 ? "text-blue-500" : "text-red-500";

  return (
    <div className="w-full space-y-6 font-body tracking-normal select-none" dir="rtl">
      <AnimatePresence mode="wait">
        {status === 'calibrating' && (
          <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <MarketScanner />
          </motion.div>
        )}

        {status === 'results' && result && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-10">
            
            <MarketPulseHub price={livePrice || asset.currentPrice} turbulence={confidenceScore} />
            
            <div className="p-6 bg-gray-50/40 rounded-[40px] border border-gray-100 shadow-inner space-y-4 relative overflow-hidden group/heatmap">
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none group-hover/heatmap:scale-110 transition-transform duration-1000">
                  <Radar size={220} strokeWidth={1} />
               </div>
               <div className="flex items-center justify-between px-2 relative z-10">
                  <h4 className="text-[10px] font-black text-[#002d4d]">تحليل المؤشرات | Analysis</h4>
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
                          <p className="text-[7px] font-black text-gray-400 uppercase leading-none mb-1">{item.label}</p>
                          <span className={cn("text-[9px] font-black tabular-nums", item.status === 'bullish' ? "text-emerald-600" : item.status === 'bearish' ? "text-red-600" : "text-gray-400")}>
                            {item.val}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-white rounded-[56px] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,45,77,0.08)] space-y-10 relative overflow-hidden group/intel">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 group-hover/intel:scale-110 transition-transform duration-1000">
                  <Target size={180} />
               </div>
               <div className="absolute bottom-0 left-0 p-8 opacity-[0.02] rotate-12 group-hover/intel:scale-110 transition-transform duration-1000">
                  <Zap size={180} />
               </div>

               {/* مقاييس الاستخبارات */}
               <div className="grid grid-cols-4 divide-x divide-x-reverse divide-gray-100 relative z-10">
                  {[
                    { label: "الزخم", val: `${Math.round((result.agents?.tech?.score || 0.5) * 100)}%`, icon: Zap, color: "text-orange-500" },
                    { label: "السيولة", val: `${Math.round((result.agents?.volume?.score || 0.5) * 100)}%`, icon: Target, color: "text-blue-500" },
                    { label: "الاستقرار", val: "85%", icon: ShieldCheck, color: "text-emerald-500" },
                    { label: "الارتباط", val: "SYNC", icon: Waves, color: "text-purple-500" }
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                       <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{m.label}</p>
                       <p className={cn("text-sm font-black tabular-nums", m.color)}>{m.val}</p>
                    </div>
                  ))}
               </div>

               <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent relative z-10" />

               {/* الأهداف الاستراتيجية */}
               <div className="space-y-6 relative z-10 text-right">
                  <div className="flex items-center justify-between px-2">
                     <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">الأهداف الاستراتيجية | Targets</h4>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md">YIELD OPTIMIZED</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                     {[
                       { label: "الهدف 1", val: result.targets?.tp1, color: "text-emerald-600" },
                       { label: "الهدف 2", val: result.targets?.tp2, color: "text-emerald-600" },
                       { label: "الهدف الأقصى", val: result.targets?.tp3, color: "text-[#f9a885]", glow: true }
                     ].map((t, i) => (
                       <div key={i} className="flex flex-col items-center text-center space-y-1.5">
                          <span className="text-[8px] font-black text-gray-400 uppercase">{t.label}</span>
                          <div className="flex items-center gap-1">
                             <span className={cn("text-[13px] font-black tabular-nums tracking-tighter", t.color)}>
                               ${((livePrice || asset.currentPrice) * (t.val || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             </span>
                             {t.glow && <Sparkles size={8} className="text-[#f9a885] animate-pulse" />}
                          </div>
                       </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner text-center space-y-1">
                        <span className="text-[8px] font-black text-gray-400 uppercase block">نطاق التمركز</span>
                        <p className="text-[11px] font-black text-[#002d4d] tabular-nums" dir="ltr">
                          ${(livePrice || asset.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })} - ${((livePrice || asset.currentPrice) * 1.0005).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                     </div>
                     <div className="p-4 bg-red-50/50 rounded-[24px] border border-red-100 shadow-inner text-center space-y-1">
                        <span className="text-[8px] font-black text-red-400 uppercase block">صمام الأمان</span>
                        <p className="text-[11px] font-black text-red-600 tabular-nums">
                          ${((livePrice || asset.currentPrice) * (result.invalidated_at || 0.985)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* 4. مصفوفة المخاطرة والثقة الثنائية المتطورة */}
            <div className="grid grid-cols-2 gap-4">
               {/* جناح المخاطرة */}
               <div className={cn(
                 "p-6 rounded-[44px] border shadow-xl relative overflow-hidden transition-all duration-500 bg-white flex flex-col justify-between",
                 result.risk?.level === 'LOW' ? "border-emerald-100" : "border-red-100"
               )}>
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                     <ShieldCheck size={100} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-3">
                     <div className={cn(
                       "h-10 w-10 rounded-2xl flex items-center justify-center shadow-inner",
                       result.risk?.level === 'LOW' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                     )}>
                        <ShieldAlert size={20} />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-gray-400 uppercase">Risk Level</p>
                        <p className={cn("text-xs font-black", result.risk?.level === 'LOW' ? "text-emerald-700" : "text-red-700")}>
                          {result.risk?.level || "UNKNOWN"}
                        </p>
                     </div>
                     <Badge className={cn("border-none font-black text-[7px] px-3 py-1 rounded-full shadow-md", result.risk?.level === 'LOW' ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
                        {result.risk?.action || "HOLD"}
                     </Badge>
                  </div>
               </div>

               {/* جناح الثقة الحلقي */}
               <div className="p-6 rounded-[44px] border border-gray-100 shadow-xl bg-white flex flex-col items-center justify-center relative overflow-hidden group/conf">
                  <div className="absolute inset-0 bg-gray-50/30 opacity-0 group-hover/conf:opacity-100 transition-opacity" />
                  <div className="relative z-10 space-y-3 flex flex-col items-center">
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Confidence</p>
                     <ConfidenceRing value={confidenceScore} colorClass={confidenceColor} />
                  </div>
               </div>
            </div>

            <BiasHeader bias={result.decision === 'BUY' ? 'Long' : result.decision === 'SELL' ? 'Short' : 'Neutral'} />
            <IntelligenceBriefing reasoning={result.reasoning} summary={`تم تحليل الرمز بنتيجة ثقة %${confidenceScore} في هذه اللحظة عبر المحرك السيادي.`} />

            <div className="pt-4 border-t border-gray-50">
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
                   "flex-1 h-16 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-xl active:scale-95 transition-all group relative overflow-hidden",
                   result.decision === 'BUY' ? "hover:bg-emerald-600 shadow-emerald-900/40" : 
                   result.decision === 'SELL' ? "hover:bg-red-600 shadow-red-900/40" : "bg-gray-100 text-gray-400"
                 )}
               >
                 <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
                 {isExecuting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                   <div className="flex items-center gap-3 relative z-10">
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
