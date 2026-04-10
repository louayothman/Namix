
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
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Globe,
  Radar,
  Loader2
} from "lucide-react";
import { OrderBook } from "./OrderBook";
import { MarketTrades } from "./MarketTrades";
import { useMarketStore } from "@/store/use-market-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { getHistoricalKlines } from "@/services/binance-service";
import { generateInternalHistory } from "@/lib/internal-market";

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

  useEffect(() => {
    if (!open) return;
    setDisplayData({
      change: storeChange || 0,
      high: storeStats?.high || 0,
      low: storeStats?.low || 0,
      volume: storeStats?.volume || 0
    });
  }, [open, storeChange, storeStats]);

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

  const liveSparklineData = useMemo(() => {
    if (sparklineData.length === 0 || !storePrice) return sparklineData;
    const newData = [...sparklineData];
    newData[newData.length - 1] = { value: storePrice };
    return newData;
  }, [sparklineData, storePrice]);

  const isUp = displayData.change >= 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 h-[88vh] bg-white rounded-t-[56px] border-none shadow-[0_-20px_100px_rgba(0,45,77,0.3)] z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
          
          <DrawerHeader className="px-8 pt-8 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-6 bg-white/80 backdrop-blur-xl relative z-20">
            <div className="flex items-center gap-4 text-right">
               <div className="h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl">
                  <Radar className="h-6 w-6 relative z-10 animate-pulse" />
               </div>
               <div className="space-y-0.5">
                 <DrawerTitle className="text-xl font-black text-[#002d4d]">الرؤية العميقة</DrawerTitle>
                 <div className="flex items-center gap-2 text-blue-500 font-black text-[7px] uppercase tracking-widest mt-1">
                    <Globe className="h-2 w-2" />
                    Market Analytics Protocol
                 </div>
               </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-3 py-1 rounded-full animate-pulse">
               PULSE ACTIVE
            </Badge>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 scrollbar-none pb-32">
            
            <section className="space-y-6 px-2">
               <div className="grid grid-cols-4 gap-2">
                 {[
                   { label: "التغيير", val: displayData.change, isP: true, icon: isUp ? TrendingUp : TrendingDown, c: isUp ? "text-emerald-500" : "text-red-500" },
                   { label: "الأعلى", val: displayData.high, icon: ChevronUp, c: "text-emerald-500" },
                   { label: "الأدنى", val: displayData.low, icon: ChevronDown, c: "text-red-500" },
                   { label: "الحجم", val: displayData.volume, icon: BarChart3, c: "text-blue-500" }
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 text-center">
                     <item.icon size={16} strokeWidth={3} className={item.c} />
                     <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-gray-400 uppercase">{item.label}</span>
                        <p className={cn("text-[10px] font-black tabular-nums", item.c)}>
                          {item.isP ? `${item.val >= 0 ? '+' : ''}${item.val.toFixed(2)}%` : `$${item.val?.toLocaleString()}`}
                        </p>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="relative h-12 w-full overflow-hidden">
                 {isChartLoading ? (
                   <div className="flex items-center justify-center h-full gap-2 opacity-20">
                      <Loader2 size={10} className="animate-spin" />
                   </div>
                 ) : (
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={liveSparklineData}>
                       <YAxis hide domain={['auto', 'auto']} />
                       <Area type="monotone" dataKey="value" stroke={isUp ? "#10b981" : "#ef4444"} strokeWidth={1.5} fillOpacity={0.1} fill={isUp ? "#10b981" : "#ef4444"} />
                     </AreaChart>
                   </ResponsiveContainer>
                 )}
               </div>
            </section>

            <section className="space-y-5">
               <OrderBook symbolId={asset.id} binanceSymbol={asset.binanceSymbol} />
            </section>

            <section className="space-y-5">
               <MarketTrades symbolId={asset.id} binanceSymbol={asset.binanceSymbol} />
            </section>

          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
