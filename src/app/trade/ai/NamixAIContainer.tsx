"use client";

import { useState, useEffect, useMemo } from "react";
import { namixAI } from "@/lib/namix-ai";
import { TradeSignal } from "@/lib/namix-ai-orchestrator";
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  PlayCircle, 
  Loader2, 
  Sparkles,
  ShieldX,
  Info,
  Waves,
  Ticket,
  ChevronLeft,
  ArrowUpRight,
  Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { Slider } from "@/components/ui/slider";

/**
 * @fileOverview Namix Floating Glass Lab v1.0
 * واجهة استخباراتية زجاجية شفافة تندمج مع الرسم البياني.
 * تشمل صك الأهداف، مؤشر الاضطراب، والمنزلق الفيزيائي.
 */

function TurbulencePulse({ level }: { level: number }) {
  const isHigh = level > 60;
  return (
    <div className="relative h-12 w-full flex items-center justify-center overflow-hidden rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isHigh ? [10, 40, 10] : [10, 20, 10],
              opacity: isHigh ? [0.2, 0.8, 0.2] : [0.1, 0.3, 0.1],
            }}
            transition={{ 
              duration: isHigh ? 0.4 : 1.5, 
              repeat: Infinity, 
              delay: i * 0.1 
            }}
            className={cn(
              "w-1 mx-0.5 rounded-full",
              isHigh ? "bg-red-400" : "bg-blue-400"
            )}
          />
        ))}
      </div>
      <div className="relative z-10 flex items-center gap-2">
         <Waves size={14} className={cn(isHigh ? "text-red-400 animate-pulse" : "text-blue-400")} />
         <span className={cn("text-[8px] font-black uppercase tracking-[0.3em]", isHigh ? "text-red-200" : "text-blue-200")}>
           {isHigh ? "High Turbulence Detection" : "Stable Market Pulse"}
         </span>
      </div>
    </div>
  );
}

function TargetVoucher({ targets, bias }: { targets: any, bias: string }) {
  const isLong = bias === 'Long';
  return (
    <div className="relative p-6 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 shadow-2xl overflow-hidden group">
      {/* Perforated Edge Look */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-white rounded-full z-20" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-white rounded-full z-20" />
      
      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
           <div className="flex items-center gap-2">
              <Ticket size={14} className="text-[#f9a885]" />
              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Yield Strategy Voucher</span>
           </div>
           <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[7px] px-2 py-0.5 rounded-md">ALPHA NODE</Badge>
        </div>

        <div className="grid grid-cols-3 gap-2">
           {[
             { label: "TP1", val: targets.tp1, color: "text-emerald-400" },
             { label: "TP2", val: targets.tp2, color: "text-emerald-400" },
             { label: "TP3", val: targets.tp3, color: "text-[#f9a885]" },
           ].map((tp, i) => (
             <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
                <span className="text-[7px] font-black text-white/30">{tp.label}</span>
                <span className={cn("text-[11px] font-black tabular-nums tracking-tighter", tp.color)} dir="ltr">${tp.val.toFixed(2)}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function ConfidenceRing({ value, bias }: { value: number, bias: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = bias === 'Long' ? "text-emerald-500" : bias === 'Short' ? "text-red-500" : "text-blue-500";

  return (
    <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/10" />
        <motion.circle
          cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         <span className={cn("text-[9px] font-black tabular-nums", color)}>%{value}</span>
      </div>
    </div>
  );
}

export function NamixAIContainer({ asset, livePrice }: { asset: any, livePrice: number | null }) {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<TradeSignal | null>(null);
  const [tradeAmount, setTradeAmount] = useState(10);
  const [tradeDuration, setTradeDuration] = useState(60);
  const [isExecuting, setIsExecuting] = useState(false);

  const globalTradeRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: globalConfig } = useDoc(globalTradeRef);

  const riskRef = useMemoFirebase(() => doc(db, "system_settings", "trading_risk"), [db]);
  const { data: riskConfig } = useDoc(riskRef);

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
    setIsExecuting(true);
    try {
      const amt = tradeAmount;
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
        aiConfidence: result.confidence
      });
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 font-body text-right tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6">
             <div className="h-16 w-16 border-2 border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
             <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">تنشيط المختبر الزجاجي...</p>
          </div>
        ) : result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
            
            {/* 1. Turbulence Reactor */}
            <TurbulencePulse level={result.turbulence} />

            {/* 2. Glass Identity Node */}
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-14 w-14 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl border transition-all duration-700",
                    result.bias === 'Long' ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-400" :
                    result.bias === 'Short' ? "bg-red-500/20 border-red-400/30 text-red-400" :
                    "bg-blue-500/10 border-blue-400/20 text-blue-400"
                  )}>
                     <Activity size={28} className={cn(result.bias !== 'Neutral' && "animate-pulse")} />
                  </div>
                  <div className="text-right">
                     <h4 className="text-xl font-black text-[#002d4d] leading-none">
                        {result.bias === 'Long' ? 'إشارة صعود سيادية' : result.bias === 'Short' ? 'إشارة هبوط سيادية' : 'حياد استراتيجي'}
                     </h4>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 tracking-normal">Quantum Analytics Core</p>
                  </div>
               </div>
               <Badge className={cn("px-5 py-2 rounded-full font-black text-[9px] border-none shadow-xl tracking-normal", result.bias === 'Long' ? "bg-emerald-500 text-white" : result.bias === 'Short' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400")}>
                  {result.bias.toUpperCase()} NODE
               </Badge>
            </div>

            {/* 3. Target Voucher */}
            <AnimatePresence>
               {result.bias !== 'Neutral' && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <TargetVoucher targets={result.targets} bias={result.bias} />
                 </motion.div>
               )}
            </AnimatePresence>

            {/* 4. Physical Liquidity Slider */}
            <div className="p-8 bg-white/5 backdrop-blur-md rounded-[44px] border border-gray-100 shadow-inner space-y-8">
               <div className="flex justify-between items-center px-2">
                  <div className="space-y-1">
                     <Label className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest block tracking-normal">المبلغ المخصص (Liquidity)</Label>
                     <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-[#002d4d] tabular-nums tracking-tighter">${tradeAmount}</span>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px]">SAFE CAP</Badge>
                     </div>
                  </div>
                  <div className="text-left">
                     <p className="text-[8px] font-black text-gray-400 uppercase">Available</p>
                     <p className="text-sm font-black text-[#002d4d] tabular-nums">${dbUser?.totalBalance?.toLocaleString()}</p>
                  </div>
               </div>

               <div className="px-4">
                  <Slider 
                    value={[tradeAmount]} 
                    min={Number(globalConfig?.minTradeAmount || 10)} 
                    max={Math.min(dbUser?.totalBalance || 1000, 5000)} 
                    step={10}
                    onValueChange={([val]) => setTradeAmount(val)}
                    className={cn(
                      "[&>span:last-child]:h-8 [&>span:last-child]:w-8 transition-all",
                      tradeAmount > 500 ? "[&>span:first-child]:bg-orange-500" : "[&>span:first-child]:bg-blue-600"
                    )}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/40 rounded-[28px] border border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-blue-500" />
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-normal">Entry</span>
                     </div>
                     <span className="text-[11px] font-black text-[#002d4d] tabular-nums" dir="ltr">${result.entry_zone}</span>
                  </div>
                  <div className="p-4 bg-red-50/20 rounded-[28px] border border-red-100 flex items-center justify-between group/risk">
                     <div className="flex items-center gap-2">
                        <ShieldX size={12} className="text-red-500 group-hover/risk:animate-bounce" />
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-normal">Inval.</span>
                     </div>
                     <span className="text-[11px] font-black text-red-600 tabular-nums" dir="ltr">${result.invalidated_at.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            {/* 5. Insight Bubbles & Reasoning */}
            <div className="space-y-4">
               <div className="p-8 bg-[#002d4d] rounded-[56px] text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 left-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><Sparkles size={140} /></div>
                  
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20"><Info size={20} className="text-[#f9a885]" /></div>
                           <h4 className="text-sm font-black tracking-normal">الرؤية الاستراتيجية</h4>
                        </div>
                        <Badge variant="outline" className="text-white/40 border-white/10 text-[7px] font-black tracking-widest">SMC ENGINE V5</Badge>
                     </div>
                     
                     <p className="text-[13px] font-bold leading-[2.2] text-blue-100/70 tracking-normal">{result.reasoning_summary}</p>
                     
                     <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <ConfidenceRing value={result.confidence} bias={result.bias} />
                           <div className="text-right">
                              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest tracking-normal">Confidence</p>
                              <p className="text-[11px] font-black text-white tracking-normal">تأكيد المفاعل</p>
                           </div>
                        </div>

                        <Button 
                          onClick={handleExecute}
                          disabled={isExecuting || result.bias === 'Neutral' || tradeAmount <= 0}
                          className={cn(
                            "h-16 px-10 rounded-full font-black text-sm shadow-2xl transition-all active:scale-95 group/btn relative overflow-hidden",
                            result.bias === 'Long' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/40" : 
                            result.bias === 'Short' ? "bg-red-500 hover:bg-red-600 shadow-red-900/40" : 
                            "bg-gray-700 opacity-50"
                          )}
                        >
                           {isExecuting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                             <div className="flex items-center gap-3 relative z-10">
                                <span>تنفيذ العقد</span>
                                <PlayCircle className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                             </div>
                           )}
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="px-6 py-4 bg-gray-50/50 rounded-[32px] border border-gray-100 flex items-start gap-4">
                  <Radar size={14} className="text-blue-400 mt-1 shrink-0 animate-pulse" />
                  <p className="text-[10px] font-bold text-gray-400 leading-relaxed tracking-normal">{result.market_summary}</p>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
