
"use client";

import { useState, useEffect, useMemo } from "react";
import { analyzeMarket, AIAnalysisResult, AICalibration } from "@/lib/namix-ai-engine";
import { MarketScanner } from "./MarketScanner";
import { TrendAnalyzer } from "./TrendAnalyzer";
import { GuidanceTerminal } from "./GuidanceTerminal";
import { IntelligenceMetrics } from "./IntelligenceMetrics";
import { Loader2, ShieldCheck, Zap, Clock, Sparkles, PlayCircle, CheckCircle2, AlertTriangle, X, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

interface NamixAIContainerProps {
  asset: any;
  livePrice: number | null;
}

/**
 * @fileOverview حاوية NAMIX AI v15.0 - Pure Internal Intelligence
 * تم اجتثاث كافة أكواد تلغرام ليعمل المحرك بنقاء استخباري داخلي 100%.
 */
export function NamixAIContainer({ asset, livePrice }: NamixAIContainerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [executingTradeId, setExecutingTradeId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      const parsed = JSON.parse(userSession);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
        if (snap.exists()) setDbUser({ ...snap.data(), id: snap.id });
      });
      return () => unsub();
    }
  }, [db]);

  const calibrationRef = useMemoFirebase(() => doc(db, "system_settings", "trading_ai"), [db]);
  const { data: calibrationData } = useDoc(calibrationRef);

  const globalTradeRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: globalConfig } = useDoc(globalTradeRef);

  const durations = useMemo(() => {
    if (globalConfig?.tradeDurations && Array.isArray(globalConfig.tradeDurations)) {
      return globalConfig.tradeDurations.map((d: any) => {
        let mult = 1;
        let suffix = 's';
        if (d.unit === 'minutes') { mult = 60; suffix = 'm'; }
        else if (d.unit === 'hours') { mult = 3600; suffix = 'h'; }
        else if (d.unit === 'days') { mult = 86400; suffix = 'd'; }
        return { label: `${d.value}${suffix}`, seconds: d.value * mult };
      });
    }
    return [{ label: '60s', seconds: 60 }, { label: '5m', seconds: 300 }];
  }, [globalConfig]);

  useEffect(() => {
    if (!asset || !livePrice) return;

    const runAnalysis = () => {
      const calibration: AICalibration = {
        rsiOversold: calibrationData?.rsiOversold || 35,
        rsiOverbought: calibrationData?.rsiOverbought || 65,
        confidenceThreshold: calibrationData?.aiConfidenceThreshold || 85,
        volatilityWeight: calibrationData?.volatilityWeight || 8
      };

      const analysis = analyzeMarket(asset, livePrice, calibration, durations);
      setResult(analysis);
      
      if (Object.keys(customAmounts).length === 0) {
        const init: Record<string, string> = {};
        analysis.suggestions.forEach(s => {
          init[s.durationLabel] = (globalConfig?.minTradeAmount || 10).toString();
        });
        setCustomAmounts(init);
      }
      
      if (isAnalyzing) {
        setTimeout(() => setIsAnalyzing(false), 1500);
      }
    };

    runAnalysis();
    const interval = setInterval(runAnalysis, 5000);
    return () => clearInterval(interval);
  }, [asset, livePrice, isAnalyzing, calibrationData, durations, globalConfig?.minTradeAmount]);

  const handleExecuteTrade = (suggestion: any) => {
    if (!dbUser || !asset || !livePrice || suggestion.action === 'wait') return;
    
    const amount = Number(customAmounts[suggestion.durationLabel]) || globalConfig?.minTradeAmount || 10;
    if (dbUser.totalBalance < amount) {
      setFeedback({ type: 'error', message: 'عجز في الملاءة المالية الحالية.' });
      return;
    }

    setExecutingTradeId(suggestion.durationLabel);
    
    const startTime = new Date();
    const durationSeconds = suggestion.seconds || 60;
    const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
    const profitRate = globalConfig?.defaultProfitRate || 80;
    const expectedProfit = (amount * profitRate) / 100;

    const tradePayload = {
      userId: dbUser.id,
      userName: dbUser.displayName,
      symbolId: asset.id,
      symbolCode: asset.code,
      tradeType: suggestion.action,
      amount: amount,
      entryPrice: livePrice,
      profitRate: profitRate,
      expectedProfit: expectedProfit,
      status: "open",
      result: "pending",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      createdAt: startTime.toISOString()
    };

    addDoc(collection(db, "trades"), tradePayload)
      .then(() => {
        setFeedback({ type: 'success', message: `تم إطلاق الصفقة بنجاح.` });
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'trades',
          operation: 'create',
          requestResourceData: tradePayload
        }));
      })
      .finally(() => {
        setExecutingTradeId(null);
      });

    updateDoc(doc(db, "users", dbUser.id), {
      totalBalance: increment(-amount)
    }).catch(console.error);
  };

  const updateAmount = (id: string, val: string) => {
    setCustomAmounts(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-1000 tracking-normal font-body" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center justify-center gap-8"
          >
             <div className="relative">
                <div className="h-24 w-24 border-[4px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Zap size={32} className="text-[#f9a885] animate-pulse" />
                </div>
             </div>
             <div className="text-center space-y-2">
                <h4 className="text-xl font-black text-[#002d4d]">معايرة NAMIX AI...</h4>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Scanning Global Pulse Nodes</p>
             </div>
          </motion.div>
        ) : result && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <MarketScanner />
            <TrendAnalyzer trend={result.trend} confidence={result.confidence} />
            <IntelligenceMetrics rsi={result.rsi} volatility={result.volatility} momentum={result.momentum} />
            
            <section className="space-y-5 text-right relative">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                       <Clock size={16} />
                    </div>
                    <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-normal">التنفيذ الاستراتيجي المباشر</h4>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-3 py-1 rounded-full shadow-inner">INTERNAL ENGINE</Badge>
               </div>

               <AnimatePresence>
                 {feedback && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="px-2 mb-4"
                   >
                      <div className={cn(
                        "p-4 rounded-[24px] border flex items-center justify-between shadow-xl",
                        feedback.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
                      )}>
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                               {feedback.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}
                            </div>
                            <p className="text-[11px] font-black tracking-normal">{feedback.message}</p>
                         </div>
                         <button onClick={() => setFeedback(null)} className="opacity-40 hover:opacity-100 transition-opacity">
                            <X size={14} />
                         </button>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="grid gap-3">
                  {result.suggestions.map((sug, i) => {
                    const isExecuting = executingTradeId === sug.durationLabel;
                    const currentAmt = customAmounts[sug.durationLabel] || "10";
                    
                    return (
                      <div key={i} className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col gap-4 group transition-all hover:bg-white hover:shadow-xl relative overflow-hidden">
                         <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                               <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center font-black text-[10px] shadow-sm text-[#002d4d] tabular-nums">
                                  {sug.durationLabel}
                               </div>
                               <Badge className={cn(
                                 "font-black text-[8px] px-3 py-1 rounded-lg border-none shadow-sm tracking-normal",
                                 sug.action === 'buy' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                               )}>
                                 {sug.action === 'buy' ? 'شراء' : 'بيع'}
                               </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="relative group/amount">
                                 <input 
                                   type="number"
                                   value={currentAmt}
                                   onChange={(e) => updateAmount(sug.durationLabel, e.target.value)}
                                   className="h-10 w-16 rounded-xl bg-white border border-gray-100 text-center font-black text-[11px] tabular-nums shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                 />
                                 <Coins size={8} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-300" />
                              </div>
                              <Button 
                                onClick={() => handleExecuteTrade(sug)}
                                disabled={!!executingTradeId}
                                className={cn(
                                  "h-10 rounded-xl px-6 font-black text-[11px] transition-all shadow-lg active:scale-95 gap-3",
                                  sug.action === 'buy' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                                )}
                              >
                                {isExecuting ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : (
                                  <>
                                    <span>تنفيذ</span>
                                    <PlayCircle size={12} />
                                  </>
                                )}
                              </Button>
                            </div>
                         </div>
                         <div className="flex flex-col gap-2 relative z-10">
                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed pr-1">{sug.reason}</p>
                            <div className="flex items-center gap-1.5 opacity-40 pr-1">
                               <ShieldCheck size={10} className="text-emerald-500" />
                               <span className="text-[8px] font-black tabular-nums">%{sug.confidence.toFixed(0)} Model Accuracy</span>
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </section>

            <GuidanceTerminal guidance={result.guidance} />

            <div className="flex flex-col items-center gap-4 opacity-30 select-none pt-10">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-[#002d4d]" />
                  <p className="text-[8px] font-black uppercase tracking-widest text-[#002d4d]">Namix Core Ledger v15.0</p>
               </div>
               <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
