
"use client";

import { useState, useEffect, useMemo } from "react";
import { namixAI } from "@/lib/namix-ai";
import { TradeSignal } from "@/lib/namix-ai-orchestrator";
import { 
  Zap, 
  Loader2, 
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { hapticFeedback } from "@/lib/haptic-engine";

// استيراد المكونات المستقلة المكتنزة
import { MarketPulseHub } from "@/components/trade/ai/MarketPulseHub";
import { BiasHeader } from "@/components/trade/ai/BiasHeader";
import { TargetMatrix } from "@/components/trade/ai/TargetMatrix";
import { ExecutionPanel } from "@/components/trade/ai/ExecutionPanel";
import { IntelligenceBriefing } from "@/components/trade/ai/IntelligenceBriefing";

export function NamixAIContainer({ asset, livePrice }: { asset: any, livePrice: number | null }) {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<TradeSignal | null>(null);
  const [tradeAmount, setTradeAmount] = useState(10);
  const [isExecuting, setIsExecuting] = useState(false);

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
    if (!asset || livePrice === null) return;
    const runAnalysis = async () => {
      const analysis = await namixAI.getDeepAnalysis(asset, livePrice);
      if (analysis) setResult(analysis);
      setIsAnalyzing(false);
    };
    runAnalysis();
    const interval = setInterval(runAnalysis, 5000);
    return () => clearInterval(interval);
  }, [asset, livePrice]);

  const handleExecute = async () => {
    if (!dbUser || !result || result.bias === 'Neutral' || isExecuting) return;
    hapticFeedback.medium();
    setIsExecuting(true);
    try {
      const amt = Number(tradeAmount);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60 * 1000); 
      const profitRate = globalConfig?.defaultProfitRate || 80;

      await addDoc(collection(db, "trades"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        symbolId: asset.id,
        symbolCode: asset.code,
        tradeType: result.bias === 'Long' ? 'buy' : 'sell',
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
        aiConfidence: Math.round(result.confidence)
      });
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
      hapticFeedback.success();
    } catch (e) {
      console.error(e);
      hapticFeedback.error();
    } finally {
      setIsExecuting(false);
    }
  };

  const maxTrade = globalConfig?.maxTradeAmount || 5000;
  const minTrade = globalConfig?.minTradeAmount || 10;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <div className="relative">
                <div className="h-12 w-12 border-2 border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><Zap size={18} className="text-[#f9a885] animate-pulse" /></div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">معايرة النبض الاستراتيجي...</p>
          </div>
        ) : result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
            
            <MarketPulseHub price={livePrice} turbulence={result.turbulence} />

            <BiasHeader bias={result.bias} />

            {result.bias !== 'Neutral' && (
              <TargetMatrix 
                entryZone={result.entry_zone} 
                targets={result.targets} 
                invalidatedAt={result.invalidated_at} 
              />
            )}

            <ExecutionPanel 
              amount={tradeAmount}
              onAmountChange={setTradeAmount}
              min={minTrade}
              max={maxTrade}
              balance={dbUser?.totalBalance || 0}
              isExecuting={isExecuting}
              onExecute={handleExecute}
              confidence={result.confidence}
              bias={result.bias}
            />

            <IntelligenceBriefing 
              reasoning={result.reasoning_summary} 
              summary={result.market_summary} 
            />

            <div className="flex items-center justify-center gap-3 opacity-20 select-none">
               <ShieldCheck size={12} className="text-[#002d4d]" />
               <p className="text-[8px] font-black uppercase tracking-widest text-[#002d4d]">Namix Sovereign Shield Active</p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
