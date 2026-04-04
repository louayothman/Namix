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
  Coins, 
  PlayCircle, 
  Loader2, 
  Plus, 
  Minus,
  Sparkles,
  ShieldX,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";

/**
 * LiquidPulse - المفاعل الفيزيائي السائل المورفي
 */
function LiquidPulse({ bias }: { bias: 'Long' | 'Short' | 'Neutral' }) {
  const colors = {
    Long: "from-emerald-500/40 to-teal-600/40 border-emerald-400/20",
    Short: "from-red-500/40 to-rose-600/40 border-red-400/20",
    Neutral: "from-blue-500/20 to-indigo-600/20 border-blue-400/10"
  };

  return (
    <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
      <motion.div
        animate={{
          borderRadius: ["40% 60% 70% 30% / 40% 40% 60% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 40% 60% 60%"],
          rotate: 360,
          scale: bias === 'Neutral' ? [1, 1.05, 1] : [1, 1.2, 1]
        }}
        transition={{ duration: bias === 'Neutral' ? 6 : 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute inset-0 bg-gradient-to-br border backdrop-blur-xl shadow-inner", colors[bias])}
      />
      <div className="relative z-10 text-white">
        {bias === 'Long' ? <TrendingUpIcon size={16} /> : bias === 'Short' ? <TrendingDownIcon size={16} /> : <Activity size={16} />}
      </div>
    </div>
  );
}

function TrendingUpIcon({ size = 24 }: { size?: number }) {
  return <motion.div animate={{ y: [1, -1, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Activity size={size} /></motion.div>;
}

function TrendingDownIcon({ size = 24 }: { size?: number }) {
  return <motion.div animate={{ y: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 2 }}><Activity size={size} className="rotate-180" /></motion.div>;
}

/**
 * ConfidenceRing - مؤشر الثقة الدائري التفاعلي اللحظي
 */
function ConfidenceRing({ value, bias }: { value: number, bias: string }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = bias === 'Long' ? "text-emerald-500" : bias === 'Short' ? "text-red-500" : "text-blue-500";

  return (
    <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
      <svg className="h-full w-full transform -rotate-90">
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-100" />
        <motion.circle
          cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
  const [tradeAmount, setTradeAmount] = useState("10");
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

  useEffect(() => {
    if (!asset || livePrice === null) return;
    const runAnalysis = async () => {
      const analysis = await namixAI.getDeepAnalysis(asset, livePrice);
      if (analysis) setResult(analysis);
      setIsAnalyzing(false);
    };
    runAnalysis();
    const interval = setInterval(runAnalysis, 5000); // تحديث كل 5 ثواني لمواكبة السعر
    return () => clearInterval(interval);
  }, [asset, livePrice]);

  const handleExecute = async () => {
    if (!dbUser || !result || result.bias === 'Neutral' || isExecuting) return;
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
        aiVerified: true
      });
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 font-body tracking-normal" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6">
             <div className="h-16 w-16 border-2 border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
             <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">تنشيط المفاعل...</p>
          </div>
        ) : result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            
            {/* Header: Visual Liquid Pulse */}
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <LiquidPulse bias={result.bias} />
                  <div className="text-right">
                     <h4 className="text-lg font-black text-[#002d4d] leading-none">
                        {result.bias === 'Long' ? 'صعود استراتيجي' : result.bias === 'Short' ? 'هبوط استراتيجي' : 'توازن عرضي'}
                     </h4>
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1 tracking-normal">Sovereign Pulse Matrix</p>
                  </div>
               </div>
               <Badge className={cn("px-4 py-1.5 rounded-full font-black text-[8px] border-none shadow-sm tracking-normal", result.bias === 'Long' ? "bg-emerald-500 text-white" : result.bias === 'Short' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400")}>
                  {result.bias.toUpperCase()}
               </Badge>
            </div>

            {/* Tactical Controls: Ultra Compact Layout */}
            <div className="p-5 bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-inner">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <Label className="text-[8px] font-black text-gray-400 pr-3 uppercase tracking-normal">المبلغ ($)</Label>
                     <div className="flex items-center gap-1.5 h-10 bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                        <button onClick={() => setTradeAmount(prev => Math.max(1, Number(prev) - 10).toString())} className="h-8 w-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center active:scale-90 transition-all"><Minus size={12}/></button>
                        <input type="number" value={tradeAmount} onChange={e => setTradeAmount(e.target.value)} className="flex-1 bg-transparent border-none text-center font-black text-sm text-[#002d4d] outline-none tabular-nums" />
                        <button onClick={() => setTradeAmount(prev => (Number(prev) + 10).toString())} className="h-8 w-8 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center active:scale-90 transition-all"><Plus size={12}/></button>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[8px] font-black text-gray-400 pr-3 uppercase tracking-normal">المدة</Label>
                     <div className="flex items-center gap-1 h-10 bg-white rounded-xl border border-gray-100 p-1 shadow-sm overflow-x-auto scrollbar-none">
                        {[60, 300, 900].map(s => (
                          <button key={s} onClick={() => setTradeDuration(s)} className={cn("flex-1 h-8 rounded-lg font-black text-[8px] transition-all", tradeDuration === s ? "bg-blue-50 text-blue-600" : "text-gray-300")}>
                            {s >= 60 ? `${s/60}د` : `${s}ث`}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Precision Dual Matrix: Entry & Invalidation */}
            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 bg-white border border-gray-100 rounded-[28px] shadow-sm space-y-2 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                     <MapPin size={10} className="text-blue-500" />
                     <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest tracking-normal">Entry Zone</span>
                  </div>
                  <p className="text-sm font-black text-[#002d4d] tabular-nums" dir="ltr">${result.entry_zone}</p>
               </div>
               <div className="p-4 bg-red-50/20 border border-red-100 rounded-[28px] shadow-sm space-y-2 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-2">
                     <ShieldX size={10} className="text-red-500" />
                     <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest tracking-normal">Invalidation</span>
                  </div>
                  <p className="text-sm font-black text-red-600 tabular-nums" dir="ltr">${result.invalidated_at.toFixed(2)}</p>
               </div>
            </div>

            {/* Expert Reasoning & Execution Hub */}
            <div className="space-y-4">
               <div className="p-7 bg-[#002d4d] rounded-[44px] text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><Sparkles size={100} /></div>
                  
                  <div className="flex items-center gap-3 relative z-10 mb-4">
                     <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20"><Activity size={16} className="text-[#f9a885]" /></div>
                     <h4 className="text-xs font-black tracking-normal">الأسباب الاستراتيجية</h4>
                  </div>
                  
                  <p className="text-[11px] font-bold leading-[2] text-blue-100/70 relative z-10 tracking-normal">{result.reasoning_summary}</p>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 relative z-10 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <ConfidenceRing value={result.confidence} bias={result.bias} />
                        <div className="text-right">
                           <p className="text-[7px] font-black text-white/30 uppercase tracking-widest tracking-normal">Confidence</p>
                           <p className="text-[10px] font-black text-white tracking-normal">درجة التأكيد</p>
                        </div>
                     </div>
                     
                     <Button 
                       onClick={handleExecute}
                       disabled={isExecuting || result.bias === 'Neutral'}
                       className={cn(
                         "h-14 px-8 rounded-full font-black text-xs shadow-2xl transition-all active:scale-95 group/btn",
                         result.bias === 'Long' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/40" : result.bias === 'Short' ? "bg-red-500 hover:bg-red-600 shadow-red-900/40" : "bg-gray-700 opacity-50"
                       )}
                     >
                        {isExecuting ? <Loader2 className="animate-spin h-4 w-4" /> : (
                          <div className="flex items-center gap-2">
                             <span>تنفيذ الصفقة</span>
                             <PlayCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                          </div>
                        )}
                     </Button>
                  </div>
               </div>

               <div className="px-5 py-3 bg-gray-50/50 rounded-[24px] border border-gray-100 flex items-start gap-3">
                  <Info size={12} className="text-blue-400 mt-1 shrink-0" />
                  <p className="text-[9px] font-bold text-gray-400 leading-relaxed tracking-normal">{result.market_summary}</p>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
