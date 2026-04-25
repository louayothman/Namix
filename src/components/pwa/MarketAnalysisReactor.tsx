
'use client';

import React, { useEffect, useRef, useState } from "react";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  limit, 
  orderBy,
  getDocs
} from "firebase/firestore";
import { runNamix } from "@/lib/namix-orchestrator";
import { sendImageToChat } from "@/app/actions/telegram-actions";
import { toJpeg } from "html-to-image";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Zap, 
  Target, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  MapPin,
  Cpu,
  Radar,
  BarChart3,
  Waves,
  Info
} from "lucide-react";
import { getHistoricalKlines } from "@/services/binance-service";
import { generateInternalHistory } from "@/lib/internal-market";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ReferenceLine, 
  ResponsiveContainer
} from "recharts";
import { generateDeepMarketReport } from "@/lib/market-report-engine";

/**
 * @fileOverview مُفاعل طلبات التحليل المرئي v1.6 - Liquid Pulse & Grid Identity
 */

export function MarketAnalysisReactor() {
  const db = useFirestore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const isProcessing = useRef(false);

  useEffect(() => {
    const q = query(
      collection(db, "market_analysis_requests"), 
      where("status", "==", "pending"), 
      orderBy("createdAt", "asc"), 
      limit(1)
    );

    const unsubscribe = onSnapshot(q, async (snap) => {
      if (!snap.empty && !isProcessing.current) {
        const request = { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
        await processRequest(request);
      }
    });
    return () => unsubscribe();
  }, [db]);

  const updateTelegramProgress = async (botToken: string, chatId: string, messageId: string, progress: number, text: string, symbolCode: string) => {
    const totalBlocks = 20;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    const bars = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
    const msg = `🔍 *جاري تحليل سوق ${symbolCode}*\n[${bars}]\n\n_${text}_`;
    
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: msg,
        parse_mode: 'Markdown'
      })
    });
  };

  const processRequest = async (request: any) => {
    isProcessing.current = true;
    try {
      const symSnap = await getDocs(query(collection(db, "trading_symbols"), where("code", "==", request.symbolCode)));
      if (symSnap.empty) throw new Error("Symbol not found");
      const symbol = { id: symSnap.docs[0].id, ...symSnap.docs[0].data() } as any;
      
      const botsSnap = await getDocs(query(collection(db, "system_settings", "telegram", "bots"), where("id", "==", request.botId)));
      const bot = botsSnap.docs[0]?.data();
      if (!bot) throw new Error("Bot not found");

      const progressSteps = [
        { p: 5, t: "بدء تهيئة محرك التحليل..." },
        { p: 15, t: "ربط القنوات السعرية اللحظية..." },
        { p: 25, t: "جاري تحليل الزخم اللحظي..." },
        { p: 40, t: "فحص مستويات السيولة الحالية..." },
        { p: 60, t: "تجهيز المنحنى السعري (24H)..." },
        { p: 80, t: "ضبط صمام أمان المحفظة..." },
        { p: 95, t: "إصدار التقرير النهائي..." },
        { p: 100, t: "اكتمل التحليل بنجاح." }
      ];

      let analysis: any = null;
      let history: any[] = [];

      for (const step of progressSteps) {
        await updateTelegramProgress(bot.token, request.chatId, request.messageId, step.p, step.t, request.symbolCode);
        
        if (step.p === 40) {
          analysis = await runNamix(symbol.binanceSymbol || symbol.code);
        }
        if (step.p === 60) {
          if (symbol.priceSource === 'binance') {
            history = await getHistoricalKlines(symbol.binanceSymbol, '1h', 24);
          } else {
            history = generateInternalHistory(symbol.id, symbol, 24);
          }
          setChartData(history.map(d => ({ value: d.close || d.price })));
          setActiveAnalysis({ ...analysis, symbol });
        }

        await new Promise(r => setTimeout(r, 200));
      }

      if (captureRef.current) {
        const dataUrl = await toJpeg(captureRef.current, { quality: 0.98, pixelRatio: 4, backgroundColor: '#0B0F1A' });
        const textReport = await generateDeepMarketReport(request.symbolCode, symbol.id);
        
        await fetch(`https://api.telegram.org/bot${bot.token}/deleteMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: request.chatId, message_id: request.messageId })
        });
        
        await sendImageToChat(request.botId, request.chatId, textReport, dataUrl, symbol.id);
      }

      await updateDoc(doc(db, "market_analysis_requests", request.id), { status: "completed" });
      setActiveAnalysis(null);
      setChartData([]);
      isProcessing.current = false;

    } catch (e) {
      console.error("Analysis Reactor Error:", e);
      await deleteDoc(doc(db, "market_analysis_requests", request.id));
      isProcessing.current = false;
    }
  };

  if (!activeAnalysis) return null;

  const currentPrice = activeAnalysis.agents.tech.last;
  const isBuy = activeAnalysis.decision === 'BUY';
  const isSell = activeAnalysis.decision === 'SELL';
  const pulseColor = isBuy ? "#10b981" : isSell ? "#ef4444" : "#3b82f6";

  return (
    <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none overflow-hidden z-[-1]" dir="rtl">
      <div ref={captureRef} className="w-[800px] h-[1200px] bg-[#0B0F1A] p-8 flex flex-col justify-between font-body text-right">
        <div className="w-full h-full bg-[#121826] rounded-[64px] border border-white/5 p-12 flex flex-col gap-8 relative overflow-hidden shadow-2xl">
           
           <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-6">
                 <div className="h-20 w-20 flex items-center justify-center">
                    <CryptoIcon name={activeAnalysis.symbol.icon} size={72} />
                 </div>
                 <div className="text-right">
                    <h3 className="text-3xl font-black text-white tracking-tight leading-none">{activeAnalysis.symbol.name}</h3>
                    <p className="text-2xl font-black text-[#f9a885] tabular-nums mt-3 leading-none whitespace-nowrap">
                      ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                 </div>
              </div>
              <Badge className={cn(
                "font-black text-[12px] px-8 py-3 rounded-full border-none shadow-xl text-white uppercase tracking-widest whitespace-nowrap",
                isBuy ? "bg-emerald-500" : isSell ? "bg-red-500" : "bg-blue-600"
              )}>
                {isBuy ? 'إشارة شراء / BUY' : isSell ? 'إشارة بيع / SELL' : 'تحليل السوق / NEUTRAL'}
              </Badge>
           </div>

           {/* محرك النبض السائل لـ 24 ساعة */}
           <div className="relative h-[280px] w-full bg-black/20 rounded-[44px] border border-white/5 shadow-inner overflow-hidden flex flex-col justify-end">
              <div className="absolute inset-0 z-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 60, right: 0, left: 0, bottom: 0 }}>
                       <YAxis hide domain={['auto', 'auto']} />
                       <ReferenceLine y={currentPrice} stroke={pulseColor} strokeWidth={2} strokeDasharray="5 5" opacity={0.3} />
                       <Area 
                         type="monotone" 
                         dataKey="value" 
                         stroke={pulseColor} 
                         strokeWidth={5} 
                         fillOpacity={0.15} 
                         fill={pulseColor} 
                         isAnimationActive={false}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="absolute top-8 left-8 text-left z-20" dir="ltr">
                 <Badge variant="outline" className="border-white/10 text-white/40 text-[9px] font-black px-4 py-1.5 rounded-full backdrop-blur-md">24H PRICE PULSE</Badge>
              </div>
           </div>

           <div className="grid grid-cols-4 gap-4">
              {[
                { label: "الزخم", val: `${Math.round(activeAnalysis.agents.tech.score * 100)}%`, icon: Zap, color: "text-orange-400" },
                { label: "السيولة", val: activeAnalysis.volume, icon: Target, color: "text-blue-400" },
                { label: "الثقة", val: `${activeAnalysis.confidence}%`, icon: ShieldCheck, color: "text-emerald-400" },
                { label: "الاتجاه", val: activeAnalysis.trend, icon: Activity, color: "text-purple-400" }
              ].map((m, i) => (
                <div key={i} className="p-6 bg-white/[0.03] rounded-[36px] border border-white/5 text-center space-y-2 group hover:bg-white/[0.06] transition-all">
                   <div className="flex justify-center mb-1"><m.icon size={20} className={m.color} /></div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{m.label}</p>
                   <p className="text-xl font-black text-white tabular-nums tracking-tighter">{m.val}</p>
                </div>
              ))}
           </div>

           <div className="p-10 bg-white/[0.02] rounded-[48px] border border-white/5 space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-[#f9a885]">
                    <BarChart3 size={20} />
                 </div>
                 <h4 className="text-lg font-black text-white">التحليل الاستراتيجي (Strategic Analysis)</h4>
              </div>
              <p className="text-[15px] font-bold text-gray-400 leading-[2.2] tracking-normal">
                {activeAnalysis.reason === "Market Equilibrium" 
                  ? "السوق يمر بمرحلة توازن تقني مؤقت؛ محرك التحليل ينصح بالترقب لحين وضوح اتجاه النبض القادم لضمان استقرار التنفيذ." 
                  : `بناءً على قراءة التدفقات اللحظية، تم رصد ${activeAnalysis.trend === 'صاعد' ? 'زخم شرائي إيجابي' : 'تراكم ضغط بيعي'} مدعوم بـ ${activeAnalysis.volume === 'عالي' ? 'سيولة مرتفعة' : 'استقرار نسبي'} في مناطق التنفيذ الحالية.`}
              </p>
           </div>

           <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="p-8 bg-gray-50/5 rounded-[40px] border border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Target size={18} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Profit Targets</span>
                 </div>
                 <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-black text-gray-400">الهدف 1</span>
                    <span className="text-base font-black text-emerald-500 tabular-nums">${activeAnalysis.targets.tp1.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-black text-gray-400">الهدف الأقصى</span>
                    <span className="text-base font-black text-[#f9a885] tabular-nums">${activeAnalysis.targets.tp3.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>

              <div className="p-8 bg-gray-50/5 rounded-[40px] border border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-blue-500" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Entry & Security</span>
                 </div>
                 <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                    <span className="text-[10px] font-black text-gray-400">نطاق التمركز</span>
                    <span className="text-sm font-black text-white tabular-nums" dir="ltr">{activeAnalysis.entry_range}</span>
                 </div>
                 <div className="flex justify-between items-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                    <span className="text-[10px] font-black text-red-400">وقف الخسارة</span>
                    <span className="text-base font-black text-red-500 tabular-nums">${activeAnalysis.targets.sl.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>
           </div>

           <div className="mt-auto pt-10 flex flex-col items-center gap-6">
              {/* شبكة نقاط ناميكس السيادية 2x2 */}
              <div className="grid grid-cols-2 gap-2">
                 <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                 <div className="h-2 w-2 rounded-full bg-[#f9a885] shadow-[0_0_8px_#f9a885]" />
                 <div className="h-2 w-2 rounded-full bg-[#f9a885] shadow-[0_0_8px_#f9a885]" />
                 <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white]" />
              </div>
              <p className="text-[10px] font-black text-white/30 tracking-[0.6em] uppercase">POWERED BY NAMIX AI CORE</p>
           </div>
        </div>
      </div>
    </div>
  );
}
