
"use client";

import { useState, useEffect, useMemo } from "react";
import { namixAI } from "@/lib/namix-ai";
import { TradeSignal } from "@/lib/namix-ai-orchestrator";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { MarketPulseHub } from "@/components/trade/ai/MarketPulseHub";
import { BiasHeader } from "@/components/trade/ai/BiasHeader";
import { TargetMatrix } from "@/components/trade/ai/TargetMatrix";
import { IntelligenceBriefing } from "@/components/trade/ai/IntelligenceBriefing";
import { MarketScanner } from "@/components/trade/ai/MarketScanner";
import { RadialControl } from "@/components/trade/ai/RadialControl";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Loader2, PlayCircle, Activity } from "lucide-react";
import { hapticFeedback } from "@/lib/haptic-engine";

type MفاعلStatus = 'calibrating' | 'configuring' | 'analyzing' | 'results';

export function NamixAIContainer({ asset, livePrice }: { asset: any, livePrice: number | null }) {
  const db = useFirestore();
  const [status, setStatus] = useState<MفاعلStatus>('calibrating');
  const [dbUser, setDbUser] = useState<any>(null);
  const [result, setResult] = useState<TradeSignal | null>(null);
  
  // التشغيل المعاير
  const [tradeAmount, setTradeAmount] = useState(10.00);
  const [tradeDuration, setTradeDuration] = useState(60); 
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

  // Phase 1: Calibration (3 seconds)
  useEffect(() => {
    if (status === 'calibrating') {
      const timer = setTimeout(() => setStatus('configuring'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleStartAnalysis = async () => {
    hapticFeedback.medium();
    setStatus('analyzing');
    
    // محاكاة التحليل العميق بناءً على المبلغ والمدة
    const analysis = await namixAI.getDeepAnalysis(asset, livePrice);
    if (analysis) {
      setResult(analysis);
      setTimeout(() => setStatus('results'), 2000);
    }
  };

  const handleTradeExecution = async () => {
    if (!dbUser || !result || result.bias === 'Neutral' || isExecuting) return;
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
      hapticFeedback.error();
    } finally {
      setIsExecuting(false);
    }
  };

  const maxTrade = globalConfig?.maxTradeAmount || 5000;

  return (
    <div className="w-full space-y-6 font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        
        {/* Step 1: Calibration Animation */}
        {status === 'calibrating' && (
          <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="py-10 space-y-8">
             <MarketScanner />
             <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Initializing Neural Nodes...</p>
          </motion.div>
        )}

        {/* Step 2: Configuration Console */}
        {status === 'configuring' && (
          <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 py-4">
             <div className="grid grid-cols-2 gap-8">
                {/* Left: Liquidity Control */}
                <div className="space-y-4">
                   <RadialControl 
                     label="حجم السيولة" 
                     subLabel="LIQUIDITY INPUT"
                     value={tradeAmount} 
                     min={globalConfig?.minTradeAmount || 10} 
                     max={Math.min(maxTrade, dbUser?.totalBalance || maxTrade)}
                     onChange={setTradeAmount}
                     color="text-[#f9a885]"
                   />
                   <div className="text-center">
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Available Balance</p>
                      <p className="text-xs font-black text-[#002d4d] tabular-nums">${dbUser?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   </div>
                </div>

                {/* Right: Temporal Control */}
                <div className="space-y-4">
                   <RadialControl 
                     label="مدة العقد" 
                     subLabel="TEMPORAL DURATION"
                     value={tradeDuration} 
                     min={10} 
                     max={3600} 
                     unit="ث"
                     step={1}
                     onChange={setTradeDuration}
                     color="text-blue-500"
                   />
                   <div className="text-center">
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Execution window</p>
                      <p className="text-xs font-black text-[#002d4d] tabular-nums">{tradeDuration} ثانية</p>
                   </div>
                </div>
             </div>

             <Button 
               onClick={handleStartAnalysis} 
               className="w-full h-20 rounded-[32px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl shadow-blue-900/20 active:scale-95 transition-all group overflow-hidden relative"
             >
                <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                <span className="relative z-10">بدء تشغيل الوكلاء</span>
                <Zap className="mr-3 h-6 w-6 text-[#f9a885] fill-current group-hover:scale-125 transition-transform" />
             </Button>
          </motion.div>
        )}

        {/* Step 3: Analysis in progress */}
        {status === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center gap-6">
             <div className="relative">
                <div className="h-20 w-20 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Activity size={32} className="text-blue-500 animate-pulse" />
                </div>
             </div>
             <p className="text-sm font-black text-[#002d4d] tracking-normal">جاري هندسة الصفقة المعتمدة...</p>
          </motion.div>
        )}

        {/* Step 4: Final Results */}
        {status === 'results' && result && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-10">
            
            <MarketPulseHub price={livePrice} turbulence={result.turbulence} />

            <BiasHeader bias={result.bias} />

            {result.bias !== 'Neutral' && (
              <TargetMatrix 
                entryZone={result.entry_zone} 
                targets={result.targets} 
                invalidatedAt={result.invalidated_at} 
              />
            )}

            <IntelligenceBriefing 
              reasoning={result.reasoning_summary} 
              summary={result.market_summary} 
            />

            <Button 
              onClick={handleTradeExecution}
              disabled={isExecuting || result.bias === 'Neutral'}
              className={cn(
                "w-full h-16 rounded-full font-black text-lg shadow-xl active:scale-95 transition-all group",
                result.bias === 'Long' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/20" : 
                result.bias === 'Short' ? "bg-red-500 hover:bg-red-600 shadow-red-900/20" : 
                "bg-gray-100 text-gray-400"
              )}
            >
              {isExecuting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <div className="flex items-center gap-3">
                   <span>تأكيد التنفيذ (${tradeAmount.toFixed(2)})</span>
                   <PlayCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
              )}
            </Button>

            <button onClick={() => setStatus('configuring')} className="w-full text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors">تعديل المعايير والبدء مجدداً</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
