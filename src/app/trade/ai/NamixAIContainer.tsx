
"use client";

import { useState, useEffect } from "react";
import { namixAI } from "@/lib/namix-ai";
import { TradeSignal } from "@/lib/namix-ai-orchestrator";
import { MarketScanner } from "./MarketScanner";
import { Loader2, Zap, Target, ShieldCheck, Sparkles, TrendingUp, TrendingDown, Activity, ChevronLeft, MapPin, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NamixAIContainerProps {
  asset: any;
  livePrice: number | null;
}

export function NamixAIContainer({ asset, livePrice }: NamixAIContainerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<TradeSignal | null>(null);

  useEffect(() => {
    if (!asset || !livePrice) return;

    const runAnalysis = async () => {
      const analysis = await namixAI.getDeepAnalysis(asset, livePrice);
      if (analysis) {
        setResult(analysis);
      }
      setIsAnalyzing(false);
    };

    runAnalysis();
    const interval = setInterval(runAnalysis, 10000);
    return () => clearInterval(interval);
  }, [asset, livePrice]);

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-1000 font-body" dir="rtl">
      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center gap-8">
             <div className="relative">
                <div className="h-24 w-24 border-[4px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><Zap size={32} className="text-[#f9a885] animate-pulse" /></div>
             </div>
             <p className="text-xl font-black text-[#002d4d]">تشغيل وكلاء ناميكس...</p>
          </motion.div>
        ) : result && (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
            <MarketScanner />
            
            {/* Bias & Confidence Hub */}
            <section className="flex items-center justify-between px-2">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <h4 className="text-2xl font-black text-[#002d4d]">{result.bias === 'Long' ? 'صعود استراتيجي' : result.bias === 'Short' ? 'هبوط استراتيجي' : 'تذبذب جانبي'}</h4>
                     <Badge className={cn("font-black text-[10px] px-3 py-1 border-none shadow-sm", result.bias === 'Long' ? "bg-emerald-500 text-white" : result.bias === 'Short' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400")}>
                        {result.bias.toUpperCase()}
                     </Badge>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Directional Bias</p>
               </div>
               <div className="text-left">
                  <div className="h-16 w-16 rounded-full border-4 border-gray-50 flex flex-col items-center justify-center relative group">
                     <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent border-4" />
                     <span className="text-lg font-black text-blue-600 tabular-nums">%{result.confidence}</span>
                     <span className="text-[6px] font-black text-gray-300 uppercase">Confidence</span>
                  </div>
               </div>
            </section>

            {/* Strategy Roadmap */}
            <section className="grid gap-4 md:grid-cols-2">
               <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                     <MapPin className="h-4 w-4 text-blue-500" />
                     <span className="text-[10px] font-black text-gray-400 uppercase">نطاق الدخول المثالي</span>
                  </div>
                  <p className="text-xl font-black text-[#002d4d] tabular-nums" dir="ltr">${result.entry_zone}</p>
               </div>
               <div className="p-6 bg-red-50/50 rounded-[32px] border border-red-100 space-y-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="h-4 w-4 text-red-500" />
                     <span className="text-[10px] font-black text-gray-400 uppercase">نقطة إلغاء التحليل (SL)</span>
                  </div>
                  <p className="text-xl font-black text-red-600 tabular-nums" dir="ltr">${result.invalidated_at.toFixed(2)}</p>
               </div>
            </section>

            {/* Target Vault */}
            <section className="space-y-4">
               <div className="flex items-center gap-3 px-2">
                  <Target className="h-4 w-4 text-emerald-500" />
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">أهداف جني الأرباح (TP)</h4>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "TP1", val: result.targets.tp1, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "TP2", val: result.targets.tp2, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "TP3", val: result.targets.tp3, color: "text-emerald-700", bg: "bg-emerald-100" }
                  ].map((target, i) => (
                    <div key={i} className={cn("p-4 rounded-[24px] text-center border space-y-1 shadow-sm", target.bg, "border-transparent")}>
                       <p className="text-[8px] font-black opacity-40">{target.label}</p>
                       <p className={cn("text-xs font-black tabular-nums", target.color)}>${target.val.toFixed(2)}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* AI Reasoning Summary */}
            <section className="p-8 bg-[#002d4d] rounded-[48px] text-white space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 left-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Sparkles size={120} /></div>
               <div className="flex items-center gap-3 relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20"><Activity size={20} className="text-[#f9a885]" /></div>
                  <h4 className="text-sm font-black">ملخص استنتاجات الوكلاء</h4>
               </div>
               <p className="text-xs font-bold leading-[2.2] text-blue-100/70 relative z-10">{result.reasoning_summary}</p>
               <div className="pt-4 border-t border-white/10 flex items-center gap-3 opacity-40">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Analysis Verified</span>
               </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
