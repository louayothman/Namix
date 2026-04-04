
"use client";

import { useState, useEffect, useMemo } from "react";
import { namixAI } from "@/lib/namix-ai";
import { TradeSignal } from "@/lib/namix-ai-orchestrator";
import { MarketScanner } from "./MarketScanner";
import { 
  Loader2, 
  Zap, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  MapPin, 
  Coins, 
  PlayCircle, 
  CheckCircle2, 
  X,
  Radar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

interface NamixAIContainerProps {
  asset: any;
  livePrice: number | null;
}

/**
 * ConfidenceRing - مؤشر الثقة الدائري المطور
 */
function ConfidenceRing({ value, colorClass }: { value: number, colorClass: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-100"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         <span className={cn("text-[10px] font-black tabular-nums", colorClass)}>%{value}</span>
      </div>
    </div>
  );
}

export function NamixAIContainer({ asset, livePrice }: NamixAIContainerProps) {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<TradeSignal | null>(null);
  
  const [tradeAmount, setTradeAmount] = useState("10");
  const [tradeDuration, setTradeDuration] = useState(60); 
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const globalTradeRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: globalConfig } = useDoc(globalTradeRef);

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

  const durations = useMemo(() => {
    if (globalConfig?.tradeDurations && Array.isArray(globalConfig.tradeDurations)) {
      return globalConfig.tradeDurations.map((d: any) => {
        let mult = 1;
        let suffix = 'ث';
        if (d.unit === 'minutes') { mult = 60; suffix = 'د'; }
        else if (d.unit === 'hours') { mult = 3600; suffix = 'س'; }
        return { label: `${d.value}${suffix}`, seconds: d.value * mult };
      });
    }
    return [{ label: '60ث', seconds: 60 }, { label: '5د', seconds: 300 }];
  }, [globalConfig]);

  useEffect(() => {
    if (!asset || livePrice === null) return;

    const runAnalysis = async () => {
      const analysis = await namixAI.getDeepAnalysis(asset, livePrice);
      if (analysis) {
        setResult(analysis);
      }
      if (isAnalyzing) {
        setTimeout(() => setIsAnalyzing(false), 1000);
      }
    };

    runAnalysis();
    const interval = setInterval(runAnalysis, 15000); 
    return () => clearInterval(interval);
  }, [asset, livePrice, isAnalyzing]);

  const handleExecuteTrade = async () => {
    if (!dbUser || !asset || !livePrice || !result || result.bias === 'Neutral') return;
    
    const amount = Number(tradeAmount) || 10;
    if (dbUser.totalBalance < amount) {
      setFeedback({ type: 'error', message: 'عجز في الملاءة المالية الحالية.' });
      return;
    }

    setIsExecuting(true);
    
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + tradeDuration * 1000);
    const profitRate = globalConfig?.defaultProfitRate || 80;
    const expectedProfit = (amount * profitRate) / 100;

    const tradePayload = {
      userId: dbUser.id,
      userName: dbUser.displayName,
      symbolId: asset.id,
      symbolCode: asset.code,
      tradeType: result.bias === 'Long' ? 'buy' : 'sell',
      amount: amount,
      entryPrice: livePrice,
      profitRate: profitRate,
      expectedProfit: expectedProfit,
      status: "open",
      result: "pending",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      createdAt: startTime.toISOString(),
      aiVerified: true,
      aiConfidence: result.confidence
    };

    try {
      await addDoc(collection(db, "trades"), tradePayload);
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      setFeedback({ type: 'success', message: `تم تنفيذ الصفقة بنجاح وفق توصية AI.` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'trades',
        operation: 'create',
        requestResourceData: tradePayload
      }));
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-1000 font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center gap-8">
             <div className="relative">
                <div className="h-24 w-24 border-[4px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><Zap size={32} className="text-[#f9a885] animate-pulse" /></div>
             </div>
             <p className="text-xl font-black text-[#002d4d] tracking-normal">تشغيل وكلاء ناميكس...</p>
          </motion.div>
        ) : result && (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
            <MarketScanner />
            
            {/* Bias Hub */}
            <section className="flex items-center justify-between px-2">
               <div className="space-y-1 text-right">
                  <div className="flex items-center gap-3 justify-end">
                     <h4 className="text-2xl font-black text-[#002d4d] tracking-normal">{result.bias === 'Long' ? 'صعود استراتيجي' : result.bias === 'Short' ? 'هبوط استراتيجي' : 'تذبذب جانبي'}</h4>
                     <Badge className={cn("font-black text-[10px] px-3 py-1 border-none shadow-sm tracking-normal", result.bias === 'Long' ? "bg-emerald-500 text-white" : result.bias === 'Short' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400")}>
                        {result.bias.toUpperCase()}
                     </Badge>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest tracking-normal">Market Directional Bias</p>
               </div>
               <div className="text-left">
                  <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner">
                     <Radar size={24} className="text-[#002d4d] animate-pulse" />
                  </div>
               </div>
            </section>

            {/* Custom Parameters */}
            <section className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner space-y-8">
               <div className="flex items-center gap-3 px-2">
                  <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600">
                     <Activity size={16} />
                  </div>
                  <h4 className="text-sm font-black text-[#002d4d] tracking-normal">تخصيص المعايير التشغيلية</h4>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest tracking-normal">مبلغ التنفيذ ($)</Label>
                     <div className="relative group">
                        <input 
                          type="number"
                          value={tradeAmount}
                          onChange={e => setTradeAmount(e.target.value)}
                          className="h-14 w-full rounded-2xl bg-white border border-gray-100 text-center font-black text-xl text-[#002d4d] shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                        />
                        <Coins size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200" />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest tracking-normal">المدة الزمنية</Label>
                     <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-none">
                        {durations.map((d) => (
                          <button
                            key={d.label}
                            onClick={() => setTradeDuration(d.seconds)}
                            className={cn(
                              "flex-1 min-w-[60px] h-10 rounded-xl font-black text-[10px] transition-all tabular-nums",
                              tradeDuration === d.seconds ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400 hover:bg-gray-50"
                            )}
                          >
                            {d.label}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* Recommendation Engine */}
            <AnimatePresence mode="wait">
               {result.bias !== 'Neutral' && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    
                    <div className="grid gap-4 md:grid-cols-2">
                       <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                          <div className="flex items-center gap-3">
                             <MapPin className="h-4 w-4 text-blue-500" />
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-normal">نطاق الدخول</span>
                          </div>
                          <p className="text-xl font-black text-[#002d4d] tabular-nums" dir="ltr">${result.entry_zone}</p>
                       </div>
                       <div className="p-6 bg-red-50/50 rounded-[32px] border border-red-100 space-y-4">
                          <div className="flex items-center gap-3">
                             <ShieldCheck className="h-4 w-4 text-red-500" />
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-normal">نقطة إلغاء التحليل</span>
                          </div>
                          <p className="text-xl font-black text-red-600 tabular-nums" dir="ltr">${result.invalidated_at.toFixed(2)}</p>
                       </div>
                    </div>

                    <div className="p-8 bg-[#002d4d] rounded-[48px] text-white space-y-6 relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                       <div className="absolute top-0 left-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Sparkles size={120} /></div>
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20"><Activity size={20} className="text-[#f9a885]" /></div>
                             <h4 className="text-sm font-black tracking-normal">ملخص استنتاجات الوكلاء</h4>
                          </div>
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[7px] px-3 py-1 rounded-full animate-pulse">LIVE ANALYSIS</Badge>
                       </div>
                       <p className="text-xs font-bold leading-[2.2] text-blue-100/70 relative z-10 tracking-normal">{result.reasoning_summary}</p>
                       
                       <div className="p-5 bg-white/5 rounded-3xl border border-white/5 relative z-10">
                          <p className="text-[10px] font-bold text-[#f9a885] leading-relaxed tracking-normal">{result.market_summary}</p>
                       </div>

                       <div className="pt-6 border-t border-white/10 flex flex-row items-center gap-4 relative z-10">
                          <ConfidenceRing value={result.confidence} colorClass={result.bias === 'Long' ? "text-emerald-400" : "text-red-400"} />
                          
                          <Button 
                            onClick={handleExecuteTrade}
                            disabled={isExecuting || !tradeAmount}
                            className={cn(
                              "flex-1 h-16 rounded-full font-black text-base shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group/exec",
                              result.bias === 'Long' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/40" : "bg-red-500 hover:bg-red-600 shadow-red-900/40"
                            )}
                          >
                             {isExecuting ? <Loader2 className="animate-spin" /> : (
                               <>
                                 <span>تنفيذ الصفقة المقترحة</span>
                                 <PlayCircle className="h-6 w-6 text-white group-hover/exec:scale-110 transition-transform" />
                               </>
                             )}
                          </Button>
                       </div>
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
                          <p className="text-sm font-black tracking-normal">{feedback.message}</p>
                       </div>
                       <button onClick={() => setFeedback(null)}><X size={18} /></button>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
