
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { MarketPulseHub } from "@/components/trade/ai/MarketPulseHub";
import { BiasHeader } from "@/components/trade/ai/BiasHeader";
import { IntelligenceBriefing } from "@/components/trade/ai/IntelligenceBriefing";
import { MarketScanner } from "@/components/trade/ai/MarketScanner";
import { ParameterConsole } from "@/components/trade/ai/ParameterConsole";
import { IntelligenceMetrics } from "@/components/trade/ai/IntelligenceMetrics";
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
  Radar
} from "lucide-react";
import { hapticFeedback } from "@/lib/haptic-engine";
import { cn } from "@/lib/utils";

type ReactorStatus = 'calibrating' | 'analyzing' | 'results';

function ConfidenceRing({ value, colorClass }: { value: number, colorClass: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-gray-100" />
        <motion.circle
          cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
         <span className={cn("text-[9px] font-black tabular-nums", colorClass)}>%{value.toFixed(0)}</span>
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
  
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const fetchUpdate = async () => {
    if (!asset) return;
    try {
      const symbol = asset.binanceSymbol || asset.code.replace('/', '');
      const res = await fetch(`/api/namix?symbol=${symbol}`);
      const data = await res.json();
      if (!data.error) {
        setResult(data);
        if (status === 'calibrating' || status === 'analyzing') {
          setStatus('results');
        }
      }
    } catch (e) {
      console.error("Pulse Sync Error", e);
    }
  };

  useEffect(() => {
    if (status === 'calibrating') {
      const timer = setTimeout(() => {
        setStatus('analyzing');
        fetchUpdate();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'results') {
      // تحديث كل 1 ثانية لحيوية قصوى
      updateTimerRef.current = setInterval(fetchUpdate, 1000);
    }
    return () => {
      if (updateTimerRef.current) clearInterval(updateTimerRef.current);
    };
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
    
    if (result.risk?.level === 'DANGEROUS') {
      setFeedback({ type: 'error', message: 'بروتوكول الأمان منع الصفقة: مخاطرة عالية جداً.' });
      return;
    }

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
        entryPrice: livePrice,
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

  return (
    <div className="w-full space-y-6 font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {status === 'calibrating' && (
          <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="py-2">
             <MarketScanner />
          </motion.div>
        )}

        {status === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center gap-6">
             <div className="relative">
                <div className="h-20 w-20 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Activity size={32} className="text-blue-500 animate-pulse" />
                </div>
             </div>
             <p className="text-sm font-black text-[#002d4d]">جاري الاستعلام من النواة الاستخباراتية...</p>
          </motion.div>
        )}

        {status === 'results' && result && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-10">
            <MarketPulseHub price={livePrice} turbulence={Math.round((1 - (result.score || 0.5)) * 100)} />
            
            <IntelligenceMetrics 
              scorecard={{
                momentum: Math.round((result.agents?.tech?.score || 0.5) * 100),
                liquidity: Math.round((result.agents?.volume?.score || 0.5) * 100),
                volatility: 85 
              }} 
            />

            <BiasHeader bias={result.decision === 'BUY' ? 'Long' : result.decision === 'SELL' ? 'Short' : 'Neutral'} />
            
            {/* تحليل المؤشرات | Indicator Analysis - نانوي ومدمج */}
            <div className="p-6 bg-gray-50/40 rounded-[40px] border border-gray-100 shadow-inner space-y-4 relative overflow-hidden group/heatmap">
               {/* خلفية القسم الشفافة الضخمة */}
               <div className="absolute -bottom-4 -left-4 opacity-[0.02] pointer-events-none transition-transform duration-1000 group-hover/heatmap:scale-110">
                  <Radar size={180} strokeWidth={1} />
               </div>

               <div className="flex items-center justify-between px-2 relative z-10">
                  <div className="text-right">
                    <h4 className="text-[10px] font-black text-[#002d4d] tracking-normal">تحليل المؤشرات</h4>
                    <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">Indicator Analysis</p>
                  </div>
                  <Badge className="bg-white text-blue-600 border-gray-100 font-black text-[7px] px-2 py-0.5 rounded-md shadow-sm">NANO SYNC</Badge>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-10">
                  {result.heatmap?.map((item: any, i: number) => (
                    <div key={i} className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
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

            <div className={cn(
              "p-6 rounded-[36px] border shadow-inner flex items-center justify-between",
              result.risk?.level === 'LOW' ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
            )}>
               <div className="flex items-center gap-3">
                  <ShieldAlert className={cn("h-5 w-5", result.risk?.level === 'LOW' ? "text-emerald-600" : "text-red-600")} />
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Risk Evaluation</p>
                     <p className={cn("text-sm font-black", result.risk?.level === 'LOW' ? "text-emerald-700" : "text-red-700")}>{result.risk?.level || "UNKNOWN"}</p>
                  </div>
               </div>
               <Badge className={cn("border-none font-black text-[8px] px-3 py-1", result.risk?.level === 'LOW' ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
                  {result.risk?.action || "HOLD"}
               </Badge>
            </div>

            <IntelligenceBriefing 
              reasoning={result.reasoning || "جاري تحديث الاستنتاج المنطقي..."}
              summary={`تم تحليل الرمز بنتيجة ثقة ${(result.score * 100).toFixed(2)}% في هذه اللحظة.`}
            />

            <div className="pt-4 border-t border-gray-100">
               <ParameterConsole 
                 amount={tradeAmount}
                 onAmountChange={setAmount => setTradeAmount(setAmount)}
                 duration={tradeDuration}
                 onDurationChange={setDuration => setTradeDuration(setDuration)}
                 durations={adminDurations}
                 balance={dbUser?.totalBalance || 0}
                 minAmount={globalConfig?.minTradeAmount || 10}
                 maxAmount={globalConfig?.maxTradeAmount || 5000}
               />
            </div>

            <div className="pt-2 flex items-center gap-4">
               <ConfidenceRing 
                 value={result.score * 100} 
                 colorClass={result.decision === 'BUY' ? "text-emerald-500" : result.decision === 'SELL' ? "text-red-500" : "text-blue-500"} 
               />
               
               <Button 
                 onClick={handleTradeExecution}
                 disabled={isExecuting || result.decision === 'HOLD'}
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
                    <p className="text-sm font-black">{feedback.message}</p>
                 </div>
                 <button onClick={() => setFeedback(null)}><X size={18} /></button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
