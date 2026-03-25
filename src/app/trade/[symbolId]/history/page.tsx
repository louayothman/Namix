
"use client";

import { use, useEffect, useState, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  History, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Zap,
  ChevronDown
} from "lucide-react";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit, doc } from "firebase/firestore";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

function HistoryContent({ params }: { params: Promise<{ symbolId: string }> }) {
  const resolvedParams = use(params);
  const symbolId = resolvedParams.symbolId;
  const router = useRouter();
  const db = useFirestore();
  const [localUser, setLocalUser] = useState<any>(null);
  const [limitCount, setLimitCount] = useState(10);

  const symbolRef = useMemoFirebase(() => doc(db, "trading_symbols", symbolId), [db, symbolId]);
  const { data: asset } = useDoc(symbolRef);

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      setLocalUser(JSON.parse(userSession));
    } else {
      router.push("/login");
    }
  }, [router]);

  const tradesQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "trades"),
      where("userId", "==", localUser.id),
      where("symbolId", "==", symbolId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
  }, [db, localUser?.id, symbolId, limitCount]);

  const { data: trades, isLoading, error } = useCollection(tradesQuery);

  const stats = useMemo(() => {
    if (!trades || trades.length === 0) return { buyCount: 0, sellCount: 0, buyPercent: 50, sellPercent: 50 };
    const buys = trades.filter(t => t.tradeType === 'buy').length;
    const sells = trades.filter(t => t.tradeType === 'sell').length;
    const total = trades.length;
    return {
      buyCount: buys,
      sellCount: sells,
      buyPercent: Math.round((buys / total) * 100),
      sellPercent: Math.round((sells / total) * 100)
    };
  }, [trades]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right relative" dir="rtl">
      <div className="absolute top-8 right-6 z-50">
        <button 
          onClick={() => router.push(`/trade/${symbolId}`)} 
          className="h-12 w-12 rounded-[20px] bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#002d4d] hover:shadow-xl transition-all active:scale-90 group"
        >
          <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="relative z-10 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] justify-start">
            <Activity className="h-3 w-3 animate-pulse" />
            Operational Ledger Node
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">
            سجل تداولات {asset?.name || '...'}
          </h1>
          <p className="text-muted-foreground font-bold text-[11px] flex items-center gap-2">
             <Sparkles className="h-3.5 w-3.5 text-[#f9a885]" /> تحليل البصمة الرقمية والنمو الاستراتيجي.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-[40px] border-none bg-red-50 text-red-900 p-8 shadow-2xl animate-in zoom-in-95 relative z-10">
          <div className="flex items-start gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-inner shrink-0">
                <AlertCircle className="h-8 w-8 text-red-500" />
             </div>
             <div className="space-y-2">
                <AlertTitle className="font-black text-lg">مطلوب إنشاء فهرس</AlertTitle>
                <AlertDescription className="text-[12px] font-bold leading-relaxed opacity-80">
                  يرجى إنشاء الفهرس المطلوب في Firebase Console لضمان جلب البيانات.
                </AlertDescription>
                <div className="pt-4">
                  {error.message.includes("https://") && (
                    <a 
                      href={"https://" + error.message.split("https://")[1].split(" ")[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#002d4d] text-[#f9a885] px-6 py-3 rounded-full font-black text-[10px] uppercase underline mt-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      إنشاء الفهرس الآن
                    </a>
                  )}
                </div>
             </div>
          </div>
        </Alert>
      )}

      <Card className="border-none shadow-sm rounded-[48px] bg-white/80 backdrop-blur-xl overflow-hidden group hover:shadow-2xl transition-all border border-white/40 relative z-10">
        <CardContent className="p-8 md:p-12 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[24px] bg-[#002d4d] flex items-center justify-center shadow-lg text-[#f9a885] transition-transform group-hover:rotate-12 duration-700">
                <Activity size={32} />
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-black text-[#002d4d]">نظرة عامة</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance Hub</p>
              </div>
            </div>

            <div className="flex-1 w-full md:w-auto flex items-center gap-12 justify-center md:justify-end">
              <div className="text-center space-y-1">
                <div className="flex items-center gap-2 justify-center text-emerald-600 mb-1">
                  <TrendingUp size={16} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Buy</span>
                </div>
                <p className="text-4xl font-black text-[#002d4d] tabular-nums tracking-tighter">{stats.buyCount}</p>
              </div>
              <div className="h-12 w-px bg-gray-100 hidden md:block" />
              <div className="text-center space-y-1">
                <div className="flex items-center gap-2 justify-center text-red-500 mb-1">
                  <TrendingDown size={16} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sell</span>
                </div>
                <p className="text-4xl font-black text-[#002d4d] tabular-nums tracking-tighter">{stats.sellCount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-end px-2">
                <div className="text-right">
                   <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Momentum</p>
                   <p className="text-xs font-black text-emerald-600 tabular-nums">%{stats.buyPercent}</p>
                </div>
                <div className="text-left">
                   <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Pressure</p>
                   <p className="text-xs font-black text-red-500 tabular-nums">%{stats.sellPercent}</p>
                </div>
             </div>
             <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden flex shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${stats.buyPercent}%` }} transition={{ duration: 1.5 }} className="bg-emerald-500 h-full" />
                <motion.div initial={{ width: 0 }} animate={{ width: `${stats.sellPercent}%` }} transition={{ duration: 1.5 }} className="bg-red-500 h-full" />
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8 relative z-10">
         <div className="grid gap-5">
            {isLoading && limitCount === 10 ? (
              <div className="py-32 text-center flex flex-col items-center gap-6">
                 <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Syncing Nodes...</p>
              </div>
            ) : trades && trades.length > 0 ? (
              <>
                {trades.map((trade, i) => (
                  <motion.div key={trade.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
                      <CardContent className="p-8 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-8 w-full lg:w-auto">
                          <div className={cn(
                            "h-20 w-20 rounded-[32px] flex items-center justify-center shadow-inner transition-all",
                            trade.tradeType === 'buy' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                          )}>
                            {trade.tradeType === 'buy' ? <TrendingUp size={36}/> : <TrendingDown size={36}/>}
                          </div>
                          <div className="text-right space-y-2">
                             <div className="flex items-center gap-4">
                                <h3 className="text-3xl font-black text-[#002d4d] tabular-nums tracking-tighter">${trade.amount.toLocaleString()}</h3>
                                <Badge className={cn("font-black text-[10px] border-none px-4 py-1.5 rounded-xl", trade.result === 'win' ? "bg-emerald-500 text-white" : trade.result === 'lose' ? "bg-red-500 text-white" : "bg-orange-100 text-orange-600")}>
                                  {trade.result === 'win' ? 'SUCCESS' : trade.result === 'lose' ? 'FAILED' : 'PENDING'}
                                </Badge>
                             </div>
                             <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Entry: <span className="text-[#002d4d] font-black">${trade.entryPrice.toLocaleString()}</span></p>
                          </div>
                        </div>
                        <div className="flex-1 w-full lg:w-auto lg:border-r lg:border-gray-50 lg:pr-12 grid grid-cols-2 gap-10 text-right">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-300 uppercase">Execution</p>
                              <div className="flex items-center gap-3 text-[#002d4d] font-black text-sm">
                                 <Clock size={16} className="text-blue-400" />
                                 {trade.createdAt && format(new Date(trade.createdAt), "dd MMM, HH:mm", { locale: ar })}
                              </div>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase">Outcome</p>
                              <p className={cn("text-2xl font-black tabular-nums tracking-tighter", trade.result === 'win' ? "text-emerald-600" : trade.result === 'lose' ? "text-red-600" : "text-gray-300")}>
                                {trade.result === 'win' ? `+$${trade.expectedProfit.toFixed(2)}` : trade.result === 'lose' ? `-$${trade.amount.toFixed(2)}` : '...'}
                              </p>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {trades.length >= limitCount && (
                  <div className="flex justify-center pt-10">
                    <Button onClick={() => setLimitCount(prev => prev + 10)} disabled={isLoading} className="h-16 px-12 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-2xl active:scale-95 group transition-all">
                      {isLoading ? <Loader2 className="animate-spin h-5 w-5 ml-2" /> : <ChevronDown className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform" />}
                      عرض 10 صفقات إضافية
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-48 text-center flex flex-col items-center gap-8 bg-white/40 border-2 border-dashed border-gray-100 rounded-[64px]">
                 <History className="h-12 w-12 text-gray-200" />
                 <p className="text-lg font-black text-[#002d4d] uppercase tracking-widest">No Historical Nodes</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

export default function TradeHistoryPage({ params }: { params: Promise<{ symbolId: string }> }) {
  return (
    <Shell hideMobileNav>
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" /></div>}>
        <HistoryContent params={params} />
      </Suspense>
    </Shell>
  );
}
