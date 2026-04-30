
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { BiasHeader } from "@/components/trade/ai/BiasHeader";
import { IntelligenceBriefing } from "@/components/trade/ai/IntelligenceBriefing";
import { MarketScanner } from "@/components/trade/ai/MarketScanner";
import { ParameterConsole } from "@/components/trade/ai/ParameterConsole";
import { MarketPulseHub } from "@/components/trade/ai/MarketPulseHub";
import { RiskConfidenceMatrix } from "@/components/trade/ai/RiskConfidenceMatrix";
import { AgentDialogueFeed } from "@/components/trade/ai/AgentDialogueFeed";
import { IntelligenceMetrics } from "@/components/trade/ai/IntelligenceMetrics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Loader2, 
  PlayCircle, 
  Activity, 
  Check, 
  Target,
  Sparkles,
  ShieldCheck,
  X,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { hapticFeedback } from "@/lib/haptic-engine";
import { cn } from "@/lib/utils";

type ReactorStatus = 'calibrating' | 'results';

export function NamixAIContainer({ asset, livePrice }: { asset: any, livePrice: number | null }) {
  const db = useFirestore();
  const [status, setStatus] = useState<ReactorStatus>('calibrating');
  const [dbUser, setDbUser] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [tradeAmount, setTradeAmount] = useState(10.00);
  const [tradeDuration, setTradeDuration] = useState<number>(0); 
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const lastAgentsRef = useRef<Record<string, string>>({});

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

  const durations = useMemo(() => {
    if (globalConfig?.tradeDurations && Array.isArray(globalConfig.tradeDurations) && globalConfig.tradeDurations.length > 0) {
      return globalConfig.tradeDurations.map((d: any) => {
        let mult = 1;
        let suffix = 'ث';
        if (d.unit === 'minutes') { mult = 60; suffix = 'د'; }
        else if (d.unit === 'hours') { mult = 3600; suffix = 'س'; }
        else if (d.unit === 'days') { mult = 86400; suffix = 'ي'; }
        else if (d.unit === 'months') { mult = 2592000; suffix = 'ش'; }
        return { label: `${d.value}${suffix}`, seconds: d.value * mult };
      });
    }
    return [
      { label: '60ث', seconds: 60 },
      { label: '3د', seconds: 180 },
      { label: '5د', seconds: 300 },
      { label: '15د', seconds: 900 }
    ];
  }, [globalConfig]);

  useEffect(() => {
    if (durations.length > 0 && tradeDuration === 0) {
      setTradeDuration(durations[0].seconds);
    }
  }, [durations, tradeDuration]);

  useEffect(() => {
    if (status !== 'results' || !asset?.id || tradeDuration === 0) return;

    const fetchAnalysis = async () => {
      try {
        const symbolParam = asset.binanceSymbol || asset.code.replace('/', '');
        const res = await fetch(`/api/namix?symbol=${symbolParam}&duration=${tradeDuration}`);
        const data = await res.json();
        setResult(data);

        if (data.dialogue) {
          const newMessages: any[] = [];
          data.dialogue.forEach((msg: any) => {
            if (lastAgentsRef.current[msg.agent] !== msg.message) {
              newMessages.push({ ...msg, id: Date.now() + Math.random() });
              lastAgentsRef.current[msg.agent] = msg.message;
            }
          });

          if (newMessages.length > 0) {
            setChatHistory(prev => [...prev, ...newMessages].slice(-20));
          }
        }
      } catch (e) {}
    };

    const interval = setInterval(fetchAnalysis, 5000);
    fetchAnalysis();
    return () => clearInterval(interval);
  }, [status, asset, tradeDuration]);

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
      setFeedback({ type: 'success', message: 'تم تنفيذ العملية بنجاح.' });
    } catch (e) {
      hapticFeedback.error();
    } finally {
      setIsExecuting(false);
    }
  };

  const confidenceScore = result ? Math.round(result.score * 100) : 0;
  const currentPrice = livePrice || asset.currentPrice;

  if (status === 'calibrating') return <MarketScanner />;

  return (
    <div className="w-full space-y-6 font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {status === 'results' && result && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-10">
            
            <BiasHeader bias={result.decision === 'BUY' ? 'Long' : result.decision === 'SELL' ? 'Short' : 'Neutral'} />

            <MarketPulseHub price={currentPrice} turbulence={confidenceScore} />
            
            <div className="p-8 bg-white rounded-[56px] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,45,77,0.08)] space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110"><Target size={180} /></div>

               <IntelligenceMetrics scorecard={{
                 momentum: Math.round((result.agents?.tech?.score || 0.5) * 100),
                 liquidity: Math.round((result.agents?.volume?.score || 0.5) * 100),
                 volatility: 85
               }} />

               <div className="h-px bg-gray-50 relative z-10" />

               <div className="space-y-6 relative z-10 text-right">
                  <div className="flex items-center justify-between px-2">
                     <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-normal">الأهداف المقترحة</h4>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md">YIELD NODES</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                     {[
                       { label: "الهدف 1", val: result.targets?.tp1, color: "text-emerald-600" },
                       { label: "الهدف 2", val: result.targets?.tp2, color: "text-emerald-600" },
                       { label: "الهدف الأقصى", val: result.targets?.tp3, color: "text-[#f9a885]", glow: true }
                     ].map((t, i) => (
                       <div key={i} className="flex flex-col items-center text-center space-y-1.5">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-normal">{t.label}</span>
                          <div className="flex items-center gap-1">
                             <span className={cn("text-[13px] font-black tabular-nums tracking-tighter", t.color)}>
                               ${(t.val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                             </span>
                             {t.glow && <Sparkles size={8} className="text-[#f9a885] animate-pulse" />}
                          </div>
                       </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                     <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 shadow-inner text-center space-y-1">
                        <div className="flex items-center justify-center gap-2 mb-1">
                           <MapPin className="h-3 w-3 text-blue-500" />
                           <span className="text-[8px] font-black text-gray-400 uppercase block tracking-normal">نطاق التمركز</span>
                        </div>
                        <p className="text-[11px] font-black text-[#002d4d] tabular-nums tracking-normal" dir="ltr">{result.entry_range}</p>
                     </div>
                     <div className="p-4 bg-red-50/50 rounded-[24px] border border-red-100 shadow-inner text-center space-y-1">
                        <div className="flex items-center justify-center gap-2 mb-1">
                           <ShieldCheck className="h-3 w-3 text-red-500" />
                           <span className="text-[8px] font-black text-red-400 uppercase block tracking-normal">صمام الأمان</span>
                        </div>
                        <p className="text-[11px] font-black text-red-600 tabular-nums tracking-normal">${(result.targets?.sl || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white rounded-[48px] border border-gray-100 shadow-sm relative overflow-hidden">
               <AgentDialogueFeed messages={chatHistory} />
            </div>

            <RiskConfidenceMatrix 
              riskLevel={result.risk?.level} 
              riskAction={result.risk?.action} 
              confidenceScore={confidenceScore} 
            />

            <IntelligenceBriefing reasoning={result.reasoning} summary={`تم تحليل الرمز بنتيجة ثقة %${confidenceScore} عبر المعايير التقنية المعتمدة.`} />

            <ParameterConsole 
              amount={tradeAmount}
              onAmountChange={setTradeAmount}
              duration={tradeDuration}
              onDurationChange={setTradeDuration}
              durations={durations}
              balance={dbUser?.totalBalance || 0}
              minAmount={globalConfig?.minTradeAmount || 10}
              maxAmount={globalConfig?.maxTradeAmount || 5000}
              onExecute={handleTradeExecution}
              isExecuting={isExecuting}
              decision={result.decision}
            />

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
