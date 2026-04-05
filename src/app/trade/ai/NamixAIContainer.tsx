"use client";

import { useState, useEffect, useMemo } from "react";
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
  AlertTriangle 
} from "lucide-react";
import { hapticFeedback } from "@/lib/haptic-engine";
import { cn } from "@/lib/utils";

type ReactorStatus = 'calibrating' | 'configuring' | 'analyzing' | 'results';

/**
 * ConfidenceRing - مؤشر الثقة النانوي المدمج
 */
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
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
         <span className={cn("text-[9px] font-black tabular-nums", colorClass)}>%{value.toFixed(1)}</span>
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
      const timer = setTimeout(() => setStatus('configuring'), 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // محرك التحديث التلقائي (Continuous Pulse) بمجرد ظهور النتائج
  useEffect(() => {
    if (status !== 'results' || !asset) return;

    const fetchUpdate = async () => {
      try {
        const symbol = asset.binanceSymbol || asset.code.replace('/', '');
        const res = await fetch(`/api/namix?symbol=${symbol}`);
        const data = await res.json();
        if (!data.error) setResult(data);
      } catch (e) {}
    };

    const interval = setInterval(fetchUpdate, 15000); // تحديث كل 15 ثانية لضمان استقرار Gemini
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

  const handleStartAnalysis = async () => {
    hapticFeedback.medium();
    setStatus('analyzing');
    
    try {
      const symbol = asset.binanceSymbol || asset.code.replace('/', '');
      const res = await fetch(`/api/namix?symbol=${symbol}`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setResult(data);
      setTimeout(() => setStatus('results'), 2500);
    } catch (e) {
      console.error("Analysis Failed", e);
      setStatus('configuring');
    }
  };

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

        {status === 'configuring' && (
          <motion.div key="config" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 py-2">
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

             <Button 
               onClick={handleStartAnalysis} 
               className="w-full h-20 rounded-[32px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl active:scale-95 transition-all group overflow-hidden relative"
             >
                <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                <span className="relative z-10">بدء تشغيل الوكلاء</span>
                <Zap className="mr-3 h-6 w-6 text-[#f9a885] fill-current" />
             </Button>
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
             <p className="text-sm font-black text-[#002d4d] tracking-normal">جاري الاستعلام من النواة الاستخباراتية...</p>
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
            
            <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-4">
               <div className="flex items-center gap-2 px-2">
                  <ShieldCheck size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مصفوفة التدقيق الاستخباري</span>
               </div>
               <div className="grid gap-2.5">
                  {result.heatmap?.map((item: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-[20px] flex items-center justify-between border border-gray-100 shadow-sm transition-all hover:shadow-md">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center shadow-inner",
                            item.status === 'bullish' ? "bg-emerald-50 text-emerald-500" : 
                            item.status === 'bearish' ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400"
                          )}>
                             {item.status === 'bullish' ? <Check size={14}/> : item.status === 'bearish' ? <AlertTriangle size={14}/> : <Minus size={14}/>}
                          </div>
                          <span className="text-[11px] font-black text-[#002d4d]">{item.label}</span>
                       </div>
                       <Badge className={cn(
                         "font-black text-[8px] border-none px-2 py-0.5 rounded-md",
                         item.status === 'bullish' ? "bg-emerald-500 text-white" : 
                         item.status === 'bearish' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"
                       )}>
                          {item.val}
                       </Badge>
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
            
            <button onClick={() => setStatus('configuring')} className="w-full text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors">إعادة معايرة المعايير</button>
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
                    <p className="text-sm font-black tracking-normal">{feedback.message}</p>
                 </div>
                 <button onClick={() => setFeedback(null)}><X size={18} /></button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
