
"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerPortal,
  DrawerOverlay
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Activity, 
  Layers, 
  Zap, 
  ShieldCheck, 
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Globe,
  Sparkles,
  Radar,
  Loader2
} from "lucide-react";
import { OrderBook } from "./OrderBook";
import { MarketTrades } from "./MarketTrades";
import { useMarketStore } from "@/store/use-market-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { getHistoricalKlines } from "@/services/binance-service";
import { generateInternalHistory } from "@/lib/internal-market";

/**
 * @fileOverview مفاعل الاستخبارات السيادي v23.0 - Ultra-Thin Pulse Edition
 * تم تحويل الخط البياني ليكون رشيقاً جداً وتحت الإحصائيات مباشرة.
 * يتحدث الرسم البياني كل ثانية بمرونة فائقة ليعكس السعر اللحظي ضمن الـ 24 نقطة التاريخية.
 */

interface MarketIntelligenceOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
}

export function MarketIntelligenceOverlay({ open, onOpenChange, asset }: MarketIntelligenceOverlayProps) {
  const storePrice = useMarketStore(state => state.prices[asset?.id]);
  const storeStats = useMarketStore(state => state.marketStats[asset?.id]);
  const storeChange = useMarketStore(state => state.dailyChanges[asset?.id]);
  
  const [displayData, setDisplayData] = useState<any>({ change: 0, high: 0, low: 0, volume: 0 });
  const [sparklineData, setSparklineData] = useState<any[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(true);

  // مزامنة الإحصائيات كل ثانية واحدة (1s Throttle)
  useEffect(() => {
    if (!open) return;
    
    const sync = () => {
      setDisplayData({
        change: storeChange || 0,
        high: storeStats?.high || 0,
        low: storeStats?.low || 0,
        volume: storeStats?.volume || 0
      });
    };

    sync();
    const interval = setInterval(sync, 1000);
    return () => clearInterval(interval);
  }, [open, storeChange, storeStats]);

  // جلب السجل التاريخي (24 نقطة) وتحديثها لحظياً
  useEffect(() => {
    if (!open || !asset) return;

    const fetchHistory = async () => {
      setIsChartLoading(true);
      try {
        let data: any[] = [];
        if (asset.priceSource === 'binance') {
          data = await getHistoricalKlines(asset.binanceSymbol, '1h', 24);
        } else {
          data = generateInternalHistory(asset.id, asset, 24);
        }
        
        const formatted = data.map(d => ({ value: d.close || d.value }));
        setSparklineData(formatted);
      } catch (e) {
        console.error("Sparkline Sync Error:", e);
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchHistory();
  }, [open, asset]);

  // تحديث آخر نقطة في الرسم البياني مع النبض السعري اللحظي لضمان الحركة الانسيابية
  const liveSparklineData = useMemo(() => {
    if (sparklineData.length === 0 || !storePrice) return sparklineData;
    const newData = [...sparklineData];
    newData[newData.length - 1] = { value: storePrice };
    return newData;
  }, [sparklineData, storePrice]);

  const isUp = displayData.change >= 0;

  const pulseItems = [
    { 
      label: "التغيير", 
      en: "Change", 
      val: displayData.change, 
      isPercent: true, 
      icon: isUp ? TrendingUp : TrendingDown,
      color: isUp ? "text-emerald-500" : "text-red-500"
    },
    { 
      label: "الأعلى", 
      en: "High", 
      val: displayData.high, 
      icon: ChevronUp,
      color: "text-emerald-500"
    },
    { 
      label: "الأدنى", 
      en: "Low", 
      val: displayData.low, 
      icon: ChevronDown,
      color: "text-red-500"
    },
    { 
      label: "الحجم", 
      en: "Volume", 
      val: displayData.volume, 
      icon: BarChart3,
      color: "text-blue-500"
    }
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 h-[88vh] bg-white rounded-t-[56px] border-none shadow-[0_-20px_100px_rgba(0,45,77,0.3)] z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
          
          <DrawerHeader className="px-8 pt-8 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-6 bg-white/80 backdrop-blur-xl relative z-20">
            <div className="flex items-center gap-4 text-right">
               <div className="h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl relative overflow-hidden">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-10 bg-gradient-to-tr from-white to-transparent" />
                  <Radar className="h-6 w-6 relative z-10 animate-pulse" />
               </div>
               <div className="space-y-0.5">
                 <DrawerTitle className="text-xl font-black text-[#002d4d] tracking-normal leading-none">الرؤية العميقة</DrawerTitle>
                 <div className="flex items-center gap-2 text-blue-500 font-black text-[7px] uppercase tracking-widest mt-1">
                    <Globe className="h-2 w-2" />
                    Global Intelligence Node
                 </div>
               </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-3 py-1 rounded-full animate-pulse">
               1S PULSE ACTIVE
            </Badge>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scrollbar-none pb-32 bg-gradient-to-b from-white to-gray-50/20">
            
            {/* نبض السوق: الصف العلوي للإحصائيات والصف السفلي للرسم الرشيق */}
            <section className="space-y-6 px-2">
               <div className="flex items-center gap-3">
                  <div className="h-1 w-4 bg-[#f9a885] rounded-full" />
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-[10px] font-black text-[#002d4d] tracking-normal uppercase">نبض السوق</h4>
                    <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Live Pulse</span>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {/* الصف الأول: الإحصائيات الأربعة بأسلوب نانو نقي */}
                  <div className="grid grid-cols-4 gap-2">
                    {pulseItems.map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 text-center min-w-0">
                        <item.icon size={16} strokeWidth={3} className={cn("shrink-0", item.color)} />
                        <div className="space-y-0.5">
                            <div className="flex items-center justify-center gap-1 opacity-40">
                              <span className="text-[8px] font-black text-[#002d4d] tracking-normal truncate">{item.label}</span>
                            </div>
                            <p className={cn("text-[10px] font-black tabular-nums tracking-tighter truncate", item.color)}>
                              {item.isPercent 
                                ? `${item.val >= 0 ? '+' : ''}${item.val.toFixed(2)}%`
                                : item.en === 'Volume' 
                                  ? Math.round(item.val).toLocaleString()
                                  : `$${item.val?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '...'}`
                              }
                            </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* الصف الثاني: الخط البياني فائق الرشاقة مع التحديث اللحظي الانسيابي */}
                  <div className="relative h-12 w-full overflow-hidden">
                    {isChartLoading ? (
                      <div className="flex items-center justify-center h-full gap-2 opacity-20">
                         <Loader2 size={10} className="animate-spin" />
                         <span className="text-[7px] font-black uppercase tracking-widest">Syncing Points...</span>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={liveSparklineData}>
                          <YAxis hide domain={['auto', 'auto']} />
                          <defs>
                            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.15}/>
                              <stop offset="95%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={isUp ? "#10b981" : "#ef4444"} 
                            strokeWidth={1.5}
                            fillOpacity={1} 
                            fill="url(#colorPulse)" 
                            isAnimationActive={true}
                            animationDuration={800}
                            animationEasing="ease-in-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50" />
                  </div>
               </div>
            </section>

            {/* دفتر الطلبات - فخامة متكاملة */}
            <section className="space-y-5">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                        <Layers size={16} />
                     </div>
                     <div className="flex items-baseline gap-2">
                        <h4 className="text-[10px] font-black text-[#002d4d] tracking-normal">دفتر الطلبات</h4>
                        <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Order Book Node</span>
                     </div>
                  </div>
               </div>
               <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,45,77,0.08)] rounded-[48px] bg-white border border-gray-50 overflow-hidden group relative">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Layers size={160} /></div>
                  <CardContent className="p-8 relative z-10">
                     <OrderBook symbolId={asset.id} binanceSymbol={asset.binanceSymbol} />
                  </CardContent>
               </Card>
            </section>

            {/* رادار الصفقات - تدفق حي ثنائي اللغة */}
            <section className="space-y-5">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                        <Activity size={16} />
                     </div>
                     <div className="flex items-baseline gap-2">
                        <h4 className="text-[10px] font-black text-[#002d4d] tracking-normal">رادار الصفقات</h4>
                        <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Live Execution Feed</span>
                     </div>
                  </div>
               </div>
               <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,45,77,0.08)] rounded-[48px] bg-white border border-gray-100 overflow-hidden group relative">
                  <div className="absolute bottom-0 left-0 p-10 opacity-[0.02] rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Zap size={160} /></div>
                  <CardContent className="p-8 relative z-10">
                     <MarketTrades symbolId={asset.id} binanceSymbol={asset.binanceSymbol} />
                  </CardContent>
               </Card>
            </section>

            {/* تحليل الزخم - البعد الاستراتيجي */}
            <section className="space-y-5">
               <div className="flex items-center gap-3 px-2">
                  <div className="h-8 w-8 rounded-xl bg-orange-50 text-[#f9a885] flex items-center justify-center shadow-sm">
                     <Sparkles size={16} />
                  </div>
                  <div className="flex items-baseline gap-2">
                     <h4 className="text-[10px] font-black text-[#002d4d] tracking-normal">تحليل الزخم</h4>
                     <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Momentum Map</span>
                  </div>
               </div>
               <div className="p-10 bg-[#002d4d] rounded-[56px] text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                  <div className="absolute top-0 left-0 p-10 opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                     <TrendingUp size={140} />
                  </div>
                  <div className="relative z-10 grid grid-cols-2 gap-10">
                     {[
                       { label: "قوة الشراء", en: "Buy Strength", val: "64%", color: "text-emerald-400", icon: TrendingUp },
                       { label: "ضغط البيع", en: "Sell Pressure", val: "36%", color: "text-red-400", icon: TrendingDown },
                       { label: "حالة السيولة", en: "Liquidity Status", val: "Vibrant", color: "text-blue-400", icon: Activity },
                       { label: "مؤشر الثقة", en: "Confidence Index", val: "High", color: "text-[#f9a885]", icon: ShieldCheck }
                     ].map((item, i) => (
                       <div key={i} className="space-y-2 group/stat">
                          <div className="flex flex-col text-right">
                             <span className="text-[9px] font-black text-white/40 tracking-normal leading-none">{item.label}</span>
                             <span className="text-[6px] font-black text-white/20 uppercase tracking-widest mt-1">{item.en}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <item.icon size={12} className={cn(item.color, "opacity-40 group-hover/stat:opacity-100 transition-opacity")} />
                             <p className={cn("text-lg font-black tabular-nums tracking-tighter", item.color)}>{item.val}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

          </div>

          <footer className="p-6 bg-gray-50/80 backdrop-blur-md border-t border-gray-100 flex flex-col items-center justify-center gap-3 shrink-0 relative z-30">
             <div className="flex items-center gap-3 opacity-20 select-none">
                <Radar size={10} className="text-[#002d4d] animate-pulse" />
                <p className="text-[7px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Namix Intelligence Terminal v23.0</p>
             </div>
          </footer>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
