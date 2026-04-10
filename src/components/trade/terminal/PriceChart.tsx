
/**
 * @fileOverview محرك الرسم البياني الاحترافي v25.0 - Finnhub Sync Stabilized
 * تم إصلاح عطل جلب البيانات التاريخية لـ Finnhub عبر ترميز الرموز وتأمين سلاسل البيانات.
 */

"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CrosshairMode, LineStyle, LogicalRange } from "lightweight-charts";
import { 
  BarChart3, 
  LineChart, 
  Activity, 
  Check,
  AreaChart,
  StretchHorizontal,
  RefreshCcw,
  Loader2,
  TrendingUp,
  TrendingDown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getHistoricalKlines } from "@/services/binance-service";
import { getFinnhubCandles } from "@/app/actions/finnhub-actions";
import { generateInternalHistory } from "@/lib/internal-market";
import { calculateIndicators } from "@/lib/indicators";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore } from "@/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { settleTrade } from "@/app/actions/trading-actions";

interface PriceChartProps {
  asset: any;
  livePrice: number | null;
}

type ChartStyle = 'candles' | 'line' | 'area' | 'bars';

function ActiveTradeBubble({ trade, livePrice, series, chart }: { trade: any, livePrice: number | null, series: ISeriesApi<any> | null, chart: IChartApi | null }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<'open' | 'reporting' | 'expired'>('open');
  const [localResult, setLocalResult] = useState<'win' | 'lose' | null>(null);
  const [yCoord, setYCoord] = useState<number | null>(null);
  const settledRef = useRef(false);

  useEffect(() => {
    const updateCoords = () => {
      if (series && chart) {
        const y = series.priceToCoordinate(trade.entryPrice);
        if (y !== null) setYCoord(y);
      }
    };
    
    let frameId: number;
    const loop = () => {
      updateCoords();
      frameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frameId);
  }, [series, chart, trade.entryPrice]);

  useEffect(() => {
    const end = new Date(trade.endTime).getTime();
    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0 && !settledRef.current && status === 'open' && livePrice !== null) {
        settledRef.current = true;
        const isWin = trade.tradeType === 'buy' ? livePrice > trade.entryPrice : livePrice < trade.entryPrice;
        setLocalResult(isWin ? 'win' : 'lose');
        setStatus('reporting');
        settleTrade(trade.id, livePrice).catch(console.error);
        setTimeout(() => setStatus('expired'), 3500);
      }
    };
    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, [trade.endTime, trade.id, trade.entryPrice, trade.tradeType, livePrice, status]);

  const isCurrentWin = useMemo(() => {
    if (livePrice === null) return true;
    return trade.tradeType === 'buy' ? livePrice > trade.entryPrice : livePrice < trade.entryPrice;
  }, [livePrice, trade.entryPrice, trade.tradeType]);

  if (status === 'expired' || yCoord === null) return null;

  const accentColor = status === 'reporting' 
    ? (localResult === 'win' ? "emerald" : "orange")
    : (isCurrentWin ? "emerald" : "orange");

  return (
    <>
      <div 
        className={cn(
          "absolute left-0 right-0 h-[1.5px] transition-colors duration-700 pointer-events-none z-[151]",
          accentColor === 'emerald' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-[#f9a885] shadow-[0_0_15px_rgba(249,168,133,0.4)]"
        )}
        style={{ top: yCoord }}
      />

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: yCoord - 18 }}
        exit={{ x: -100, opacity: 0 }}
        className="absolute left-0 z-[160] pointer-events-none pl-4"
      >
        <div className={cn(
          "flex items-center gap-3 h-9 px-4 rounded-r-2xl border-l-[4px] shadow-2xl backdrop-blur-3xl transition-all duration-500",
          accentColor === 'emerald' 
            ? "bg-emerald-600/90 border-emerald-400 text-white" 
            : "bg-[#f9a885]/90 border-white text-[#002d4d]"
        )}>
          {trade.tradeType === 'buy' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <div className="flex flex-col items-start leading-tight">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tabular-nums tracking-tighter">${trade.amount}</span>
                <span className="text-[7px] font-bold opacity-60 uppercase tracking-widest">{trade.tradeType}</span>
             </div>
             {status === 'reporting' ? (
               <span className="text-[6px] font-black uppercase tracking-[0.2em] animate-pulse">{localResult === 'win' ? 'SUCCESS' : 'SETTLED'}</span>
             ) : (
               <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-white/40 animate-pulse" />
                  <span className="text-[8px] font-black tabular-nums">{timeLeft}s</span>
               </div>
             )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === ",") return <span className="w-[4px] inline-block text-center">{digit}</span>;
  const num = parseInt(digit);
  return (
    <div className="relative h-5 w-[10px] overflow-hidden inline-block leading-none">
      <motion.div animate={{ y: -num * 20 }} transition={{ type: "spring", stiffness: 400, damping: 35 }} className="absolute top-0 left-0 flex flex-col items-center">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <div key={n} className="h-5 flex items-center justify-center font-black">{n}</div>)}
      </motion.div>
    </div>
  );
}

export function PriceChart({ asset, livePrice }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const currentBarRef = useRef<any>(null);
  const lastCandleTimeRef = useRef<number>(0);
  
  const [currentStyle, setCurrentStyle] = useState<ChartStyle>('candles');
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const indicatorSeriesRef = useRef<Record<string, ISeriesApi<any> | ISeriesApi<any>[]>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartReady, setIsChartReady] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [priceY, setPriceY] = useState<number | null>(null);
  const [isUp, setIsUp] = useState(true);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

  const db = useFirestore();

  const fetchMoreHistory = useCallback(async () => {
    if (isFetchingMore || !history.length || !asset) return;
    
    setIsFetchingMore(true);
    try {
      const firstCandleTime = history[0].time;
      const to = firstCandleTime - 1;
      const from = to - (24 * 60 * 60);
      
      let moreData: any[] = [];
      
      if (asset.priceSource === 'binance' && asset.binanceSymbol) {
        moreData = await getHistoricalKlines(asset.binanceSymbol, '1m', 1440, firstCandleTime * 1000 - (24 * 60 * 60 * 1000));
      } else if (asset.priceSource === 'finnhub') {
        const res = await getFinnhubCandles(asset.externalTicker || asset.code, '1', from, to);
        if (res.success) moreData = res.data;
      }
      
      if (moreData.length > 0) {
        setHistory(prev => {
          const combined = [...moreData, ...prev];
          const unique = Array.from(new Map(combined.map(item => [item.time, item])).values());
          return unique.sort((a, b) => a.time - b.time);
        });
      }
    } catch (e) {
      console.error("Deep History Fetch Error:", e);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, history, asset]);

  useEffect(() => {
    if (!chartContainerRef.current || !asset) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#94a3b8", fontSize: 10, fontFamily: 'Tajawal' },
      grid: { vertLines: { visible: false }, horzLines: { color: "rgba(241, 245, 249, 0.02)" } },
      crosshair: { mode: CrosshairMode.Normal, vertLine: { labelVisible: true, style: LineStyle.Dashed }, horzLine: { labelVisible: false } },
      timeScale: { 
        borderVisible: false, 
        timeVisible: true, 
        secondsVisible: true, 
        rightOffset: 100,
        barSpacing: 12,
      },
      rightPriceScale: { borderVisible: false, autoScale: true, scaleMargins: { top: 0.15, bottom: 0.25 } },
      localization: { priceFormatter: (price: number) => price > 1000 ? Math.round(price).toLocaleString() : price.toFixed(2) },
    });

    chartRef.current = chart;

    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
    volumeSeriesRef.current = volumeSeries;

    chart.timeScale().subscribeVisibleLogicalRangeChange((range: LogicalRange | null) => {
      if (range && range.from < 50) {
        fetchMoreHistory();
      }
    });

    const initFetch = async () => {
      setIsLoading(true);
      try {
        let data: any[] = [];
        const to = Math.floor(Date.now() / 1000);
        const from = to - (24 * 60 * 60);

        if (asset.priceSource === 'binance' && asset.binanceSymbol) {
          data = await getHistoricalKlines(asset.binanceSymbol, '1m', 1440);
        } else if (asset.priceSource === 'finnhub') {
          const res = await getFinnhubCandles(asset.externalTicker || asset.code, '1', from, to);
          if (res.success && res.data?.length) data = res.data;
        } else {
          data = generateInternalHistory(asset.id, asset, 1000);
        }

        if (data.length > 0) {
          setHistory(data);
          lastCandleTimeRef.current = data[data.length - 1].time;
          currentBarRef.current = { ...data[data.length - 1] };
          
          if (chartRef.current) {
            applyStyle('candles', data);
            volumeSeries.setData(data.map(d => ({ time: d.time, value: d.volume || 0, color: d.close >= d.open ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' })));
            chartRef.current.timeScale().setVisibleLogicalRange({ from: data.length - 30, to: data.length + 30 });
            setIsChartReady(true);
          }
        }
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    initFetch();

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    });
    resizeObserver.observe(chartContainerRef.current);
    
    return () => { 
      resizeObserver.disconnect(); 
      if (chartRef.current) { 
        chartRef.current.remove(); 
        chartRef.current = null;
        mainSeriesRef.current = null;
      }
    };
  }, [asset?.id]);

  useEffect(() => {
    if (isChartReady && mainSeriesRef.current && history.length) {
      if (['candles', 'bars'].includes(currentStyle)) {
        mainSeriesRef.current.setData(history);
      } else {
        mainSeriesRef.current.setData(history.map(d => ({ time: d.time, value: d.close })));
      }
      if (volumeSeriesRef.current) {
        volumeSeriesRef.current.setData(history.map(d => ({ 
          time: d.time, 
          value: d.volume || 0, 
          color: d.close >= d.open ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' 
        })));
      }
      refreshIndicators(history);
    }
  }, [history, isChartReady]);

  useEffect(() => {
    if (!asset?.id) return;
    const userSession = localStorage.getItem("namix_user");
    if (!userSession) return;
    const user = JSON.parse(userSession);
    const q = query(collection(db, "trades"), where("userId", "==", user.id), where("symbolId", "==", asset.id), where("status", "==", "open"));
    const unsub = onSnapshot(q, (snap) => {
      setActiveTrades(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [asset?.id, db]);

  const applyStyle = (style: ChartStyle, data?: any[]) => {
    if (!chartRef.current) return;
    const currentData = data || history;
    
    if (mainSeriesRef.current) {
      try {
        chartRef.current.removeSeries(mainSeriesRef.current);
      } catch (e) {}
    }
    
    const baseOptions = { priceLineVisible: false, lastValueVisible: false, priceFormat: { type: 'price', precision: 4, minMove: 0.0001 } as const };
    let series;
    if (style === 'candles') series = chartRef.current.addCandlestickSeries({ ...baseOptions, upColor: '#10b981', downColor: '#ef4444', borderUpColor: '#10b981', borderDownColor: '#ef4444', wickUpColor: '#10b981', wickDownColor: '#ef4444' });
    else if (style === 'area') series = chartRef.current.addAreaSeries({ ...baseOptions, lineColor: '#3b82f6', topColor: 'rgba(59, 130, 246, 0.12)', bottomColor: 'transparent', lineWidth: 3 });
    else if (style === 'bars') series = chartRef.current.addBarSeries({ ...baseOptions, upColor: '#10b981', downColor: '#ef4444' });
    else series = chartRef.current.addLineSeries({ ...baseOptions, color: '#3b82f6', lineWidth: 3 });
    
    if (currentData.length > 0) {
      if (['candles', 'bars'].includes(style)) series.setData(currentData);
      else series.setData(currentData.map((d: any) => ({ time: d.time, value: d.close })));
    }
    mainSeriesRef.current = series;
    setCurrentStyle(style);
    refreshIndicators(currentData);
  };

  const refreshIndicators = (data: any[]) => {
    if (!chartRef.current || !data || data.length === 0) return;
    Object.values(indicatorSeriesRef.current).forEach(s => {
      try {
        if (Array.isArray(s)) s.forEach(sub => chartRef.current?.removeSeries(sub));
        else chartRef.current?.removeSeries(s);
      } catch (e) {}
    });
    indicatorSeriesRef.current = {};
    const results = calculateIndicators(data);
    activeIndicators.forEach(ind => {
      if (ind === 'Bollinger Bands') {
        const upper = chartRef.current!.addLineSeries({ color: 'rgba(59, 130, 246, 0.4)', lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
        const middle = chartRef.current!.addLineSeries({ color: 'rgba(249, 168, 133, 0.5)', lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
        const lower = chartRef.current!.addLineSeries({ color: 'rgba(59, 130, 246, 0.4)', lineWidth: 1, lastValueVisible: false, priceLineVisible: false });
        upper.setData(data.map((d, i) => ({ time: d.time, value: results.bb[i]?.upper })).filter(v => v.value != null));
        middle.setData(data.map((d, i) => ({ time: d.time, value: results.bb[i]?.middle })).filter(v => v.value != null));
        lower.setData(data.map((d, i) => ({ time: d.time, value: results.bb[i]?.lower })).filter(v => v.value != null));
        indicatorSeriesRef.current[ind] = [upper, middle, lower];
      } else {
        const isOscillator = ['RSI (14)', 'MACD', 'Stochastic', 'ATR'].includes(ind);
        const series = chartRef.current!.addLineSeries({ color: ind.includes('EMA') ? '#f9a885' : '#3b82f6', lineWidth: 1.5, priceLineVisible: false, lastValueVisible: false, priceScaleId: isOscillator ? 'oscillator' : 'right' });
        if (isOscillator) chartRef.current!.priceScale('oscillator').applyOptions({ scaleMargins: { top: 0.75, bottom: 0.05 } });
        let indData: any[] = [];
        if (ind === 'EMA 7') indData = results.ema7;
        else if (ind === 'EMA 25') indData = results.ema25;
        else if (ind === 'EMA 100') indData = results.ema100;
        else if (ind === 'SMA 20') indData = results.sma20;
        else if (ind === 'SMA 50') indData = results.sma50;
        else if (ind === 'RSI (14)') indData = results.rsi;
        else if (ind === 'MACD') indData = results.macd.map((m: any) => m?.MACD);
        else if (ind === 'ATR') indData = results.atr;
        else if (ind === 'Stochastic') indData = results.stoch.map((s: any) => s?.k);
        if (indData.length > 0) {
          series.setData(data.map((d, i) => ({ time: d.time, value: indData[i] })).filter(v => v.value != null));
          indicatorSeriesRef.current[ind] = series;
        }
      }
    });
  };

  useEffect(() => { if (history.length > 0) refreshIndicators(history); }, [activeIndicators]);

  useEffect(() => {
    if (!mainSeriesRef.current || livePrice === null || !currentBarRef.current) return;
    const currentTimeBucket = Math.floor(Date.now() / 1000 / 60) * 60;
    if (currentTimeBucket > lastCandleTimeRef.current) {
      lastCandleTimeRef.current = currentTimeBucket;
      currentBarRef.current = { time: currentTimeBucket, open: livePrice, high: livePrice, low: livePrice, close: livePrice };
    } else {
      currentBarRef.current = { ...currentBarRef.current, high: Math.max(currentBarRef.current.high, livePrice), low: Math.min(currentBarRef.current.low, livePrice), close: livePrice };
    }
    if (['candles', 'bars'].includes(currentStyle)) mainSeriesRef.current.update(currentBarRef.current);
    else mainSeriesRef.current.update({ time: currentBarRef.current.time, value: livePrice });
    if (volumeSeriesRef.current) volumeSeriesRef.current.update({ time: currentBarRef.current.time, value: currentBarRef.current.volume || 0, color: livePrice >= currentBarRef.current.open ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' });
    
    const coord = mainSeriesRef.current.priceToCoordinate(livePrice);
    if (coord !== null) setPriceY(coord);
    if (prevPrice !== null) setIsUp(livePrice >= prevPrice);
    setPrevPrice(livePrice);
  }, [livePrice, currentStyle]);

  const handleScrollToRealTime = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().applyOptions({ barSpacing: 12 });
      chartRef.current.timeScale().scrollToPosition(0, true);
    }
  };

  return (
    <div className="w-full h-full relative bg-[#fcfdfe] overflow-hidden font-body">
      
      <div className="absolute inset-0 z-[150] pointer-events-none overflow-hidden">
        <AnimatePresence>
          {isChartReady && activeTrades.map((trade) => (
            <ActiveTradeBubble 
              key={trade.id} 
              trade={trade} 
              livePrice={livePrice} 
              series={mainSeriesRef.current} 
              chart={chartRef.current} 
            />
          ))}
        </AnimatePresence>

        {priceY !== null && livePrice !== null && (
          <motion.div 
            animate={{ y: priceY - 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute right-[70px] w-full flex items-center justify-end z-[155]"
          >
             <div className="relative h-6 w-6 flex items-center justify-center">
                <div className={cn(
                  "absolute h-full w-full rounded-full opacity-30 animate-pulse-ring",
                  isUp ? "bg-emerald-400" : "bg-red-400"
                )} />
                <div className={cn(
                  "h-2 w-2 rounded-full shadow-[0_0_20px_currentColor] border-2 border-white z-10 transition-colors duration-500",
                  isUp ? "bg-emerald-500 text-emerald-500" : "bg-red-500 text-red-500"
                )} />
             </div>
          </motion.div>
        )}
      </div>

      <div className="absolute top-4 left-4 z-[100] flex justify-start pointer-events-none">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 p-1 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-full shadow-lg">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button className="h-7 w-7 rounded-full flex items-center justify-center text-[#002d4d] outline-none hover:bg-gray-50 transition-colors"><Activity size={14} /></button></DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-[24px] border-none shadow-2xl p-1 min-w-[180px] bg-white/95 z-[1002]" align="start" dir="rtl">
                  <ScrollArea className="h-[240px]">
                    {["EMA 7", "EMA 25", "EMA 100", "SMA 20", "SMA 50", "RSI (14)", "MACD", "Bollinger Bands", "ATR", "Stochastic"].map(opt => (
                      <DropdownMenuItem key={opt} onClick={() => setActiveIndicators(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])} className="rounded-xl text-[10px] font-black py-2.5 px-4 cursor-pointer flex items-center justify-between">
                        <span>{opt}</span>{activeIndicators.includes(opt) && <Check size={12} className="text-emerald-500"/>}
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button className="h-7 w-7 rounded-full flex items-center justify-center text-gray-400 outline-none hover:bg-gray-50 transition-colors">{currentStyle === 'candles' ? <BarChart3 size={14} /> : <LineChart size={14} />}</button></DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-[24px] border-none shadow-2xl p-1 min-w-[140px] bg-white/95 z-[1002]" align="start" dir="rtl">
                  {[{ id: 'candles', label: 'الشموع', icon: BarChart3 }, { id: 'line', label: 'الخط', icon: LineChart }, { id: 'area', label: 'المساحة', icon: AreaChart }, { id: 'bars', label: 'الأعمدة', icon: StretchHorizontal }].map(s => (
                    <DropdownMenuItem key={s.id} onClick={() => applyStyle(s.id as any)} className="rounded-xl text-[10px] font-black py-2.5 px-4 cursor-pointer flex items-center gap-3">
                      <s.icon size={12} className="text-gray-400" /><span>{s.label}</span>{currentStyle === s.id && <Check size={12} className="mr-auto text-blue-500" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button onClick={handleScrollToRealTime} className="h-7 w-7 rounded-full flex items-center justify-center text-blue-600 outline-none hover:bg-blue-50 transition-all active:scale-90" title="إعادة السعر للمنتصف والحجم الطبيعي"><RefreshCcw size={14} /></button>
            </div>
            {isFetchingMore && (
              <div className="h-7 px-3 bg-white/90 border border-gray-100 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md animate-in fade-in">
                 <Loader2 size={10} className="animate-spin text-blue-500" />
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Loading True History...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {priceY !== null && (
          <motion.div initial={false} animate={{ y: priceY - 12 }} transition={{ type: "spring", stiffness: 450, damping: 35 }} className="absolute right-0 z-[120] pointer-events-none" style={{ width: '100%' }}>
            <div className={cn("absolute right-[70px] top-[12px] h-[1px] w-[200vw] border-t border-solid transition-colors duration-500 opacity-30 shadow-[0_0_10px_currentColor]", isUp ? "border-emerald-400 text-emerald-400" : "border-red-400 text-red-400")} />
            
            <div className={cn("absolute right-0 px-2 py-1.5 rounded-l-lg flex items-center justify-center min-w-[70px] h-[24px] shadow-2xl transition-all duration-500 border-l border-white/20", isUp ? "bg-emerald-500" : "bg-red-500")}>
              <div className="flex items-center text-white text-[11px] tabular-nums tracking-tighter" dir="ltr">{(livePrice || 0).toFixed(2).split("").map((char, i) => <AnimatedDigit key={i} digit={char} />)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && <div className="absolute inset-0 z-[110] bg-white/60 flex flex-col items-center justify-center gap-4"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">معايرة الرسم الحقيقي...</p></div>}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
