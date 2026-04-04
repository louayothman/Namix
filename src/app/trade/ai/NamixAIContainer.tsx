
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
  Ticket,
  ChevronLeft,
  Radar,
  Plus,
  Minus,
  TrendingUp,
  Coins,
  Cpu,
  Waves
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { hapticFeedback } from "@/lib/haptic-engine";

/**
 * AgentReactorHub - مُفاعِل الوكلاء الصامت (Sovereign Hub)
 * بديل لشريط الحالة القديم، يعرض نبض المزامنة والتقلب بأسلوب نانو.
 */
function AgentReactorHub({ turbulence }: { turbulence: number }) {
  const volLevel = turbulence > 60 ? 3 : turbulence > 30 ? 2 : 1;
  const volColor = turbulence > 60 ? "bg-red-500" : turbulence > 30 ? "bg-orange-400" : "bg-emerald-500";

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 rounded-[24px] border border-gray-100 shadow-inner group">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm relative overflow-hidden">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.1)_180deg,transparent_360deg)]"
           />
           <Cpu size={14} className="text-blue-500 relative z-10" />
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-[#002d4d] leading-none tracking-normal">مفاعل الوكلاء</p>
           <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mt-1 tracking-normal">Agent Reactor Active</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
         <div className="flex flex-col items-end">
            <span className="text-[6px] font-black text-gray-300 uppercase tracking-normal">Volatility</span>
            <div className="flex gap-0.5 mt-0.5">
               {[1, 2, 3].map((i) => (
                 <div key={i} className={cn("h-1 w-2.5 rounded-full transition-all duration-500", i <= volLevel ? volColor : "bg-gray-200")} />
               ))}
            </div>
         </div>
         <div className="h-6 w-px bg-gray-200" />
         <div className="flex flex-col items-end">
            <span className="text-[6px] font-black text-gray-300 uppercase tracking-normal">Live Sync</span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mt-0.5 shadow-[0_0_5px_#10b981]" />
         </div>
      </div>
    </div>
  );
}

/**
 * TargetVoucher - صك الأهداف المتناظر (Precision Matrix)
 */
function TargetVoucher({ targets }: { targets: any }) {
  return (
    <div className="relative p-3 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
      
      <div className="grid grid-cols-3 gap-1.5 relative z-10">
         {[
           { label: "TP1", val: targets.tp1, color: "text-emerald-600" },
           { label: "TP2", val: targets.tp2, color: "text-emerald-600" },
           { label: "TP3", val: targets.tp3, color: "text-[#f9a885]" },
         ].map((tp, i) => (
           <div key={i} className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl bg-gray-50/50 border border-gray-100/50">
              <span className="text-[6px] font-black text-gray-300 uppercase">TARGET {i+1}</span>
              <span className={cn("text-[9px] font-black tabular-nums tracking-tighter", tp.color)} dir="ltr">
                ${tp.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
           </div>
         ))}
      </div>
    </div>
  );
}

/**
 * ConfidenceRing - مؤشر الثقة الرقمي (Integer Mode)
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
    <div className="w-full space-y-4 animate-in fade-in duration-700 font-body text-right tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
             <div className="relative">
                <div className="h-10 w-10 border-2 border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><Zap size={14} className="text-[#f9a885] animate-pulse" /></div>
             </div>
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest tracking-normal">تحليل النبض الاستراتيجي...</p>
          </div>
        ) : result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            
            <AgentReactorHub turbulence={result.turbulence} />

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
                     <h4 className="text-xs font-black text-[#002d4d] leading-none tracking-normal">
                        {result.bias === 'Long' ? 'إشارة صعود' : result.bias === 'Short' ? 'إشارة هبوط' : 'حياد لحظي'}
                     </h4>
                     <p className="text-[6px] font-black text-gray-300 uppercase tracking-widest mt-1 tracking-normal">Intelligence Node</p>
                  </div>
               </div>
               <Badge className={cn("px-2.5 py-0.5 rounded-full font-black text-[7px] border-none shadow-sm tracking-normal", result.bias === 'Long' ? "bg-emerald-500 text-white" : result.bias === 'Short' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400")}>
                  {result.bias.toUpperCase()}
               </Badge>
            </div>

            <AnimatePresence mode="wait">
               {result.bias !== 'Neutral' && (
                 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <TargetVoucher targets={result.targets} />
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="p-3 bg-gray-50/50 rounded-[24px] border border-gray-100 shadow-inner space-y-3">
               <div className="flex justify-between items-center px-1">
                  <div className="space-y-0.5">
                     <Label className="text-[7px] font-black text-gray-400 uppercase tracking-widest block tracking-normal">Liquidity Capital</Label>
                     <span className="text-lg font-black text-[#002d4d] tabular-nums tracking-tighter">${tradeAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                     <button onClick={() => adjustAmount(-10)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 transition-all active:scale-90"><Minus size={12} /></button>
                     <div className="h-3 w-px bg-gray-100" />
                     <button onClick={() => adjustAmount(10)} className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-emerald-500 transition-all active:scale-90"><Plus size={12} /></button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-[18px] border border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <MapPin size={8} className="text-blue-500" />
                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-normal">Entry</span>
                     </div>
                     <span className="text-[8px] font-black text-[#002d4d] tabular-nums" dir="ltr">${Number(result.entry_zone.split(' - ')[0]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="p-2 bg-red-50/30 rounded-[18px] border border-red-100 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <ShieldX size={8} className="text-red-500" />
                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-normal">Invalid</span>
                     </div>
                     <span className="text-[8px] font-black text-red-600 tabular-nums" dir="ltr">${result.invalidated_at.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
               </div>
            </div>

            <div className="p-5 bg-[#002d4d] rounded-[36px] text-white relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 left-0 p-4 opacity-[0.03] transition-transform duration-1000 group-hover:rotate-12"><Sparkles size={80} /></div>
               <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10"><Info size={14} className="text-[#f9a885]" /></div>
                        <h4 className="text-[10px] font-black tracking-normal">الرؤية الاستراتيجية</h4>
                     </div>
                     <Badge variant="outline" className="text-white/30 border-white/5 text-[5px] font-black tracking-widest">SMC CORE</Badge>
                  </div>
                  
                  <p className="text-[10px] font-bold leading-relaxed text-blue-100/70 tracking-normal">{result.reasoning_summary}</p>
                  
                  <div className="pt-3 border-t border-white/5 flex flex-row items-center gap-4">
                     <div className="flex items-center gap-2">
                        <ConfidenceRing value={result.confidence} bias={result.bias} />
                        <div className="text-right">
                           <p className="text-[6px] font-black text-white/30 uppercase tracking-normal">Conf.</p>
                           <p className="text-[9px] font-black text-white leading-none tracking-normal">تأكيد</p>
                        </div>
                     </div>

                     <Button 
                       onClick={handleExecute}
                       disabled={isExecuting || result.bias === 'Neutral'}
                       className={cn(
                         "flex-1 h-11 rounded-full font-black text-[10px] shadow-xl transition-all active:scale-95 group/btn relative overflow-hidden",
                         result.bias === 'Long' ? "bg-emerald-500 hover:bg-emerald-600" : 
                         result.bias === 'Short' ? "bg-red-500 hover:bg-red-600" : 
                         "bg-gray-700 opacity-50"
                       )}
                     >
                        {isExecuting ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : (
                          <div className="flex items-center gap-2 relative z-10">
                             <span>تنفيذ الصفقة المقترحة</span>
                             <PlayCircle className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                          </div>
                        )}
                     </Button>
                  </div>
               </div>
            </div>

            <div className="px-4 py-2 bg-gray-50 rounded-[20px] border border-gray-100 flex items-start gap-2.5">
               <Radar size={10} className="text-blue-400 mt-0.5 shrink-0 animate-pulse" />
               <p className="text-[8px] font-bold text-gray-400 leading-relaxed tracking-normal">{result.market_summary}</p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
