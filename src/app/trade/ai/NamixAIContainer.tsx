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
  Fingerprint,
  Radar,
  X,
  Plus,
  Minus,
  TrendingUp,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { Slider } from "@/components/ui/slider";
import { hapticFeedback } from "@/lib/haptic-engine";

/**
 * TurbulencePulse - مُفاعل الاضطراب النانوي (Nano Fluid Reactor)
 */
function TurbulencePulse({ level }: { level: number }) {
  const isHigh = level > 60;
  return (
    <div className="relative h-8 w-full flex items-center justify-center overflow-hidden rounded-[16px] bg-[#002d4d]/5 border border-gray-100 backdrop-blur-md">
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isHigh ? [6, 20, 6] : [4, 10, 4],
              opacity: isHigh ? [0.3, 1, 0.3] : [0.1, 0.4, 0.1],
            }}
            transition={{ 
              duration: isHigh ? 0.3 : 1.2, 
              repeat: Infinity, 
              delay: i * 0.05 
            }}
            className={cn(
              "w-0.5 mx-0.5 rounded-full",
              isHigh ? "bg-red-500" : "bg-blue-500"
            )}
          />
        ))}
      </div>
      <div className="relative z-10 flex items-center gap-2 px-4">
         <Waves size={10} className={cn(isHigh ? "text-red-500 animate-pulse" : "text-blue-500")} />
         <span className={cn("text-[6px] font-black uppercase tracking-[0.2em]", isHigh ? "text-red-600" : "text-blue-600")}>
           {isHigh ? "High Turbulence" : "Stable Stream"}
         </span>
      </div>
    </div>
  );
}

/**
 * TargetVoucher - صك الأهداف الرشيق (Nano Edition)
 */
function TargetVoucher({ targets, bias }: { targets: any, bias: string }) {
  return (
    <div className="relative p-3 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden group">
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 bg-gray-50 rounded-full border border-gray-100 shadow-inner z-20" />
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 bg-gray-50 rounded-full border border-gray-100 shadow-inner z-20" />
      
      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
           <div className="flex items-center gap-1.5">
              <Ticket size={10} className="text-[#f9a885]" />
              <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Yield Voucher</span>
           </div>
           <Badge className="bg-emerald-50 text-emerald-600 border-none text-[5px] px-1.5 py-0.5 rounded-md">VERIFIED</Badge>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
           {[
             { label: "TP1", val: targets.tp1, color: "text-emerald-600" },
             { label: "TP2", val: targets.tp2, color: "text-emerald-600" },
             { label: "TP3", val: targets.tp3, color: "text-[#f9a885]" },
           ].map((tp, i) => (
             <div key={i} className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl bg-gray-50/50 border border-gray-100/50">
                <span className="text-[5.5px] font-black text-gray-300 uppercase">{tp.label}</span>
                <span className={cn("text-[9px] font-black tabular-nums tracking-tighter", tp.color)} dir="ltr">
                  ${tp.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ConfidenceRing - حلقة الثقة المعايرة (Integer Only)
 */
function ConfidenceRing({ value, bias }: { value: number, bias: string }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const roundedValue = Math.round(value);
  const offset = circumference - (roundedValue / 100) * circumference;
  const color = bias === 'Long' ? "text-emerald-500" : bias === 'Short' ? "text-red-500" : "text-blue-500";

  return (
    <div className="relative h-8 w-8 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle cx="16" cy="16" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gray-100" />
        <motion.circle
          cx="16" cy="16" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         <span className={cn("text-[7px] font-black tabular-nums", color)}>%{roundedValue}</span>
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
      const amt = tradeAmount;
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

  const adjustAmount = (val: number) => {
    hapticFeedback.light();
    setTradeAmount(prev => Math.max(10, prev + val));
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-700 font-body text-right tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
             <div className="relative">
                <div className="h-10 w-10 border-2 border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><Zap size={14} className="text-[#f9a885] animate-pulse" /></div>
             </div>
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">تحليل النبض الاستراتيجي...</p>
          </div>
        ) : result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            
            <TurbulencePulse level={result.turbulence} />

            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "h-9 w-9 rounded-[14px] flex items-center justify-center shadow-inner border transition-all duration-700",
                    result.bias === 'Long' ? "bg-emerald-50 border-emerald-100 text-emerald-500" :
                    result.bias === 'Short' ? "bg-red-50 border-red-100 text-red-500" :
                    "bg-gray-50 border-gray-100 text-gray-400"
                  )}>
                     <Activity size={18} className={cn(result.bias !== 'Neutral' && "animate-pulse")} />
                  </div>
                  <div className="text-right">
                     <h4 className="text-sm font-black text-[#002d4d] leading-none">
                        {result.bias === 'Long' ? 'إشارة صعود' : result.bias === 'Short' ? 'إشارة هبوط' : 'حياد لحظي'}
                     </h4>
                     <p className="text-[6px] font-black text-gray-300 uppercase tracking-widest mt-1">Intelligence Node</p>
                  </div>
               </div>
               <Badge className={cn("px-2.5 py-0.5 rounded-full font-black text-[7px] border-none shadow-sm", result.bias === 'Long' ? "bg-emerald-500 text-white" : result.bias === 'Short' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400")}>
                  {result.bias.toUpperCase()}
               </Badge>
            </div>

            <AnimatePresence mode="wait">
               {result.bias !== 'Neutral' && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <TargetVoucher targets={result.targets} bias={result.bias} />
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="p-4 bg-gray-50/50 rounded-[28px] border border-gray-100 shadow-inner space-y-4">
               <div className="flex justify-between items-center px-1">
                  <div className="space-y-0.5">
                     <Label className="text-[7px] font-black text-gray-400 uppercase tracking-widest block">Liquidity Capital</Label>
                     <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">${tradeAmount.toFixed(2)}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                     <button onClick={() => adjustAmount(-10)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 transition-all active:scale-90"><Minus size={12} /></button>
                     <div className="h-3 w-px bg-gray-100" />
                     <button onClick={() => adjustAmount(10)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-emerald-500 transition-all active:scale-90"><Plus size={12} /></button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <MapPin size={8} className="text-blue-500" />
                        <span className="text-[6px] font-black text-gray-400 uppercase">Entry</span>
                     </div>
                     <span className="text-[8px] font-black text-[#002d4d] tabular-nums" dir="ltr">${Number(result.entry_zone.split(' - ')[0]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="p-2.5 bg-red-50/30 rounded-2xl border border-red-100 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <ShieldX size={8} className="text-red-500" />
                        <span className="text-[6px] font-black text-gray-400 uppercase">Invalid</span>
                     </div>
                     <span className="text-[8px] font-black text-red-600 tabular-nums" dir="ltr">${result.invalidated_at.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-2.5">
               <div className="p-5 bg-[#002d4d] rounded-[32px] text-white relative overflow-hidden group shadow-xl">
                  <div className="absolute top-0 left-0 p-4 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><Sparkles size={80} /></div>
                  
                  <div className="relative z-10 space-y-3">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10"><Info size={14} className="text-[#f9a885]" /></div>
                           <h4 className="text-[10px] font-black">الرؤية الاستراتيجية</h4>
                        </div>
                        <Badge variant="outline" className="text-white/30 border-white/5 text-[5px] font-black tracking-widest">SMC CORE</Badge>
                     </div>
                     
                     <p className="text-[10px] font-bold leading-relaxed text-blue-100/70">{result.reasoning_summary}</p>
                     
                     <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <ConfidenceRing value={result.confidence} bias={result.bias} />
                           <div className="text-right">
                              <p className="text-[6px] font-black text-white/30 uppercase">Conf.</p>
                              <p className="text-[9px] font-black text-white leading-none">تأكيد</p>
                           </div>
                        </div>

                        <Button 
                          onClick={handleExecute}
                          disabled={isExecuting || result.bias === 'Neutral'}
                          className={cn(
                            "h-10 px-6 rounded-full font-black text-[10px] shadow-xl transition-all active:scale-95 group/btn relative overflow-hidden",
                            result.bias === 'Long' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/40" : 
                            result.bias === 'Short' ? "bg-red-500 hover:bg-red-600 shadow-red-900/40" : 
                            "bg-gray-700 opacity-50"
                          )}
                        >
                           {isExecuting ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : (
                             <div className="flex items-center gap-2 relative z-10">
                                <span>تنفيذ الآن</span>
                                <PlayCircle className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                             </div>
                           )}
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="px-4 py-2 bg-gray-50 rounded-[20px] border border-gray-100 flex items-start gap-2.5">
                  <Radar size={10} className="text-blue-400 mt-0.5 shrink-0 animate-pulse" />
                  <p className="text-[8px] font-bold text-gray-400 leading-relaxed">{result.market_summary}</p>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
