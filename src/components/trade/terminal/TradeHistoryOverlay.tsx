
"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerPortal,
  DrawerOverlay
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  ChevronDown,
  Activity
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface TradeHistoryOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbolId: string;
  assetName?: string;
}

export function TradeHistoryOverlay({ open, onOpenChange, symbolId, assetName }: TradeHistoryOverlayProps) {
  const db = useFirestore();
  const [localUser, setLocalUser] = useState<any>(null);
  const [limitCount, setLimitCount] = useState(10);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
  }, [open]);

  // 1. استعلام الإحصائيات الشامل
  const allStatsQuery = useMemoFirebase(() => {
    if (!localUser?.id || !open) return null;
    return query(
      collection(db, "trades"),
      where("userId", "==", localUser.id),
      where("symbolId", "==", symbolId)
    );
  }, [db, localUser?.id, symbolId, open]);

  // 2. استعلام العرض المتدرج
  const tradesQuery = useMemoFirebase(() => {
    if (!localUser?.id || !open) return null;
    return query(
      collection(db, "trades"),
      where("userId", "==", localUser.id),
      where("symbolId", "==", symbolId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
  }, [db, localUser?.id, symbolId, limitCount, open]);

  const { data: allTradesForStats } = useCollection(allStatsQuery);
  const { data: trades, isLoading, error } = useCollection(tradesQuery);

  const stats = useMemo(() => {
    const source = allTradesForStats || [];
    if (source.length === 0) return { buyCount: 0, sellCount: 0, buyPercent: 50, sellPercent: 50, totalCount: 0 };
    const buys = source.filter(t => t.tradeType === 'buy').length;
    const sells = source.filter(t => t.tradeType === 'sell').length;
    const total = source.length;
    return {
      buyCount: buys,
      sellCount: sells,
      buyPercent: Math.round((buys / total) * 100),
      sellPercent: Math.round((sells / total) * 100),
      totalCount: total
    };
  }, [allTradesForStats]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 h-[92vh] bg-white rounded-t-[48px] border-none shadow-2xl z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
          
          <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-6">
            <div className="flex items-center gap-4 text-right">
               <div className="h-12 w-12 rounded-[20px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl">
                  <History className="h-6 w-6" />
               </div>
               <div className="space-y-0.5">
                 <DrawerTitle className="text-xl font-black text-[#002d4d]">سجل تداولات {assetName || '...'}</DrawerTitle>
                 <p className="text-[#f9a885] font-black text-[8px] uppercase tracking-widest">Operational Ledger Node</p>
               </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-none space-y-8">
            
            {error && (
              <Alert variant="destructive" className="rounded-[32px] border-none bg-red-50 text-red-900 p-6 animate-in zoom-in-95">
                <div className="flex items-start gap-4">
                   <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                   <div className="space-y-2">
                      <AlertTitle className="font-black text-sm text-right">مطلوب إنشاء فهرس للبيانات</AlertTitle>
                      <AlertDescription className="text-[10px] font-bold text-right opacity-80 leading-relaxed">
                        يرجى إنشاء الفهرس المطلوب في Firebase Console لضمان جلب البيانات التاريخية.
                      </AlertDescription>
                      {error.message.includes("https://") && (
                        <a 
                          href={"https://" + error.message.split("https://")[1].split(" ")[0]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase underline mt-2"
                        >
                          <ExternalLink className="h-3 w-3" /> إنشاء الفهرس الآن
                        </a>
                      )}
                   </div>
                </div>
              </Alert>
            )}

            <Card className="border-none shadow-sm rounded-[40px] bg-gray-50/50 overflow-hidden border border-gray-100 group">
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[24px] bg-[#002d4d] flex items-center justify-center shadow-lg text-[#f9a885] transition-transform group-hover:rotate-12 duration-700">
                        <Activity size={32} />
                      </div>
                      <div className="text-right">
                        <h3 className="text-2xl font-black text-[#002d4d]">نظرة عامة شاملة</h3>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total History Insight</p>
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
                      <div className="h-12 w-px bg-gray-200 hidden md:block" />
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
                         <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Historical Momentum</p>
                         <p className="text-xs font-black text-emerald-600 tabular-nums">%{stats.buyPercent}</p>
                      </div>
                      <div className="text-left">
                         <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Sell Pressure</p>
                         <p className="text-xs font-black text-red-500 tabular-nums">%{stats.sellPercent}</p>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${stats.buyPercent}%` }} transition={{ duration: 1.5 }} className="bg-emerald-500 h-full" />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${stats.sellPercent}%` }} transition={{ duration: 1.5 }} className="bg-red-500 h-full" />
                   </div>
                   <p className="text-center text-[9px] font-bold text-gray-300 mt-2">إجمالي الصفقات المحللة: {stats.totalCount} صفقة</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {isLoading && limitCount === 10 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Ledger Nodes...</p>
                </div>
              ) : trades && trades.length > 0 ? (
                <>
                  <div className="grid gap-3">
                    {trades.map((trade, i) => (
                      <motion.div key={trade.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden group transition-all hover:shadow-md border border-gray-50">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "h-12 w-12 rounded-[18px] flex items-center justify-center shadow-inner",
                                trade.tradeType === 'buy' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                              )}>
                                {trade.tradeType === 'buy' ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
                              </div>
                              <div className="text-right">
                                 <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter">${trade.amount.toLocaleString()}</h3>
                                    <Badge className={cn("font-black text-[7px] border-none px-2.5 py-0.5 rounded-lg", trade.result === 'win' ? "bg-emerald-500 text-white" : trade.result === 'lose' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400")}>
                                      {trade.result === 'win' ? 'SUCCESS' : trade.result === 'lose' ? 'CLOSED' : 'PENDING'}
                                    </Badge>
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-2.5 w-2.5 text-gray-300" />
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                      {trade.createdAt && format(new Date(trade.createdAt), "dd MMM, HH:mm", { locale: ar })}
                                    </p>
                                 </div>
                              </div>
                            </div>
                            <div className="text-left">
                               <p className={cn("text-lg font-black tabular-nums tracking-tighter leading-none break-all", trade.result === 'win' ? "text-emerald-600" : trade.result === 'lose' ? "text-red-600" : "text-gray-300")}>
                                 {trade.result === 'win' ? `+$${trade.expectedProfit.toFixed(2)}` : trade.result === 'lose' ? `-$${trade.amount.toFixed(2)}` : '...'}
                               </p>
                               <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-1">Outcome Yield</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  {trades.length >= limitCount && (
                    <div className="flex justify-center pt-6 pb-10">
                      <Button onClick={() => setLimitCount(prev => prev + 10)} disabled={isLoading} className="h-14 px-10 rounded-full bg-gray-50 hover:bg-[#002d4d] text-gray-400 hover:text-white font-black text-[10px] transition-all border-none shadow-sm active:scale-95 group">
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2 group-hover:translate-y-1 transition-transform" />}
                        عرض المزيد من السجلات
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-32 text-center flex flex-col items-center gap-6 opacity-20 border-2 border-dashed border-gray-100 rounded-[40px]">
                   <History className="h-12 w-12 text-[#002d4d]" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Historical Nodes Found</p>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
