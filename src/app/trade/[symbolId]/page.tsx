
"use client";

import { useEffect, useState, use, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { 
  Plus,
  ShieldCheck,
  ChevronLeft,
  Clock,
  Star,
  Zap,
  TrendingUp,
  TrendingDown,
  Layers,
  Radar,
  BrainCircuit,
  X,
  Hourglass,
  AlertCircle,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";
import { useMarketSync } from "@/hooks/use-market-sync";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerPortal, DrawerOverlay } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const PriceChart = dynamic(() => import("@/components/trade/terminal/PriceChart").then(m => ({ default: m.PriceChart })), { ssr: false });
const InternalPriceChart = dynamic(() => import("@/components/trade/terminal/InternalPriceChart").then(m => ({ default: m.InternalPriceChart })), { ssr: false });
const OrderPanel = dynamic(() => import("@/components/trade/terminal/OrderPanel").then(m => ({ default: m.OrderPanel })), { ssr: false });
const DepositSheet = dynamic(() => import("@/components/deposit/DepositSheet").then(m => ({ default: m.DepositSheet })), { ssr: false });
const TradeHistoryOverlay = dynamic(() => import("@/components/trade/terminal/TradeHistoryOverlay").then(m => ({ default: m.TradeHistoryOverlay })), { ssr: false });
const MarketIntelligenceOverlay = dynamic(() => import("@/components/trade/terminal/MarketIntelligenceOverlay").then(m => ({ default: m.MarketIntelligenceOverlay })), { ssr: false });
const NamixAIContainer = dynamic(() => import("@/app/trade/ai/NamixAIContainer").then(m => ({ default: m.NamixAIContainer })), { ssr: false });

const TerminalLoader = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 bg-white">
    <div className="relative">
      <div className="h-16 w-16 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <ShieldCheck className="h-6 w-6 text-[#002d4d]" />
      </div>
    </div>
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Initializing Trading Node...</p>
  </div>
);

const NamixAIIcon = () => (
  <motion.div 
    className="grid grid-cols-2 gap-1"
    animate={{ 
      rotate: [0, 0, 360, 360],
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      times: [0, 0.2, 0.8, 1],
      ease: "easeInOut"
    }}
  >
    <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
    <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
    <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
    <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
  </motion.div>
);

export default function AssetTerminalPage({ params }: { params: Promise<{ symbolId: string }> }) {
  const { symbolId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  
  const livePrice = useMarketStore(state => state.prices[symbolId]);

  const symbolRef = useMemoFirebase(() => doc(db, "trading_symbols", symbolId), [db, symbolId]);
  const { data: asset, isLoading } = useDoc(symbolRef);

  useMarketSync(asset ? [asset] : []);

  const globalTradeRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: globalConfig, isLoading: loadingConfig } = useDoc(globalTradeRef);

  const riskRef = useMemoFirebase(() => doc(db, "system_settings", "trading_risk"), [db]);
  const { data: riskConfig } = useDoc(riskRef);

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      try {
        const parsed = JSON.parse(userSession);
        setDbUser(parsed);
        const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
          if (snap.exists()) {
            setDbUser({ ...snap.data(), id: snap.id });
          }
        });
        return () => unsub();
      } catch (e) { router.push("/login"); }
    } else { router.push("/login"); }
  }, [db, router]);

  const isFavorite = useMemo(() => dbUser?.favoriteSymbols?.includes(symbolId), [dbUser, symbolId]);

  const toggleFavorite = async () => {
    if (!dbUser?.id) return;
    try {
      const userRef = doc(db, "users", dbUser.id);
      if (isFavorite) await updateDoc(userRef, { favoriteSymbols: arrayRemove(symbolId) });
      else await updateDoc(userRef, { favoriteSymbols: arrayUnion(symbolId) });
    } catch (e) { console.error(e); }
  };

  if (isLoading || loadingConfig || !asset) return <TerminalLoader />;

  // بروتوكول توقف الخدمة التكتيكي للمحطات
  if (globalConfig?.isTradingEnabled === false) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-8 bg-white font-body" dir="rtl">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="flex flex-col items-center gap-8 max-w-sm text-center"
         >
            <div className="relative">
               <div className="h-24 w-24 bg-gray-50 rounded-[32px] flex items-center justify-center shadow-inner border border-gray-100">
                  <Hourglass size={48} className="text-blue-600 animate-pulse" />
               </div>
               <div className="absolute -top-2 -right-2 h-8 w-8 bg-[#002d4d] rounded-xl flex items-center justify-center shadow-xl">
                  <AlertCircle size={16} className="text-[#f9a885]" />
               </div>
            </div>
            <div className="space-y-3">
               <h2 className="text-2xl font-black text-[#002d4d]">المحطة قيد الصيانة</h2>
               <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                  نأسف، تم تعليق عمليات التداول اللحظي مؤقتاً لتحديث خوارزميات المزامنة السعرية.
               </p>
            </div>
            <Button onClick={() => router.push("/trade")} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95">العودة للأسواق</Button>
         </motion.div>
      </div>
    );
  }

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-[100dvh] w-full bg-[#fcfdfe] font-body select-none overflow-hidden relative" dir="rtl">
        
        {/* Luxury Glassmorphic Header */}
        <header className="h-[70px] bg-white/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between shrink-0 z-[120] border-b border-gray-100 shadow-sm">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()} 
                className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#002d4d] border border-gray-100 active:scale-90 shadow-inner"
              >
                <ChevronLeft size={20} className="rotate-180" />
              </button>
              
              <div className="h-8 w-px bg-gray-100 mx-1" />

              <div className="text-right flex flex-col justify-center">
                 <h2 className="text-base md:text-xl font-black text-[#002d4d] tracking-tight leading-none">{asset?.name}</h2>
                 <div className="flex items-center gap-1.5 opacity-40 mt-1.5">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-widest leading-none">{asset?.code} • Live</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-2 md:gap-4">
              {/* Common Action Node */}
              <div className="hidden sm:flex items-center gap-3 px-4 h-10 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-inner">
                 <p className="text-[11px] font-black text-[#002d4d] tabular-nums">
                   ${dbUser?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 <button onClick={() => setDepositOpen(true)} className="h-6 w-6 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all">
                    <Plus size={14} />
                 </button>
              </div>

              {/* Functional Controls Matrix */}
              <div className="flex items-center gap-1.5 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
                <button 
                  onClick={toggleFavorite}
                  className={cn(
                    "h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                    isFavorite ? "bg-white text-orange-400 shadow-sm" : "text-gray-300 hover:text-orange-400"
                  )}
                >
                   <Star size={18} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>

                <button 
                  onClick={() => setAiOpen(true)}
                  className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white shadow-sm flex items-center justify-center active:scale-90 transition-all"
                  title="NAMIX AI"
                >
                   <NamixAIIcon />
                </button>

                <button 
                  onClick={() => setInsightOpen(true)} 
                  className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white text-blue-500 hover:bg-blue-50 shadow-sm flex items-center justify-center active:scale-90" 
                  title="الرؤية العميقة"
                >
                  <Radar size={18} className="animate-pulse" />
                </button>

                <button 
                  onClick={() => setHistoryOpen(true)} 
                  className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white text-gray-400 hover:text-blue-600 shadow-sm flex items-center justify-center active:scale-90" 
                  title="سجل التداول"
                >
                  <Clock size={18} />
                </button>
              </div>
           </div>
        </header>

        {/* Unified Terminal Chassis */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Main Visual Reactor (Chart) */}
          <section className="flex-1 relative bg-white overflow-hidden border-b lg:border-b-0">
             <Suspense fallback={<TerminalLoader />}>
               {asset.priceSource === 'internal' ? (
                 <InternalPriceChart asset={asset} livePrice={livePrice || asset.currentPrice} />
               ) : (
                 <PriceChart asset={asset} livePrice={livePrice || asset.currentPrice} />
               )}
             </Suspense>
          </section>

          {/* Tactical Execution Sidebar (Order Panel) */}
          <aside className="lg:w-[380px] w-full bg-white z-[110] flex flex-col justify-center shrink-0 relative p-4 md:p-6 lg:border-r border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] lg:shadow-none">
             <Suspense fallback={<div className="h-[200px] w-full bg-gray-50 rounded-3xl animate-pulse" />}>
               <OrderPanel 
                 asset={asset} 
                 livePrice={livePrice || asset.currentPrice} 
                 globalConfig={globalConfig} 
                 riskConfig={riskConfig} 
                 onOpenDeposit={() => setDepositOpen(true)} 
               />
             </Suspense>
          </aside>
        </div>

        {/* Global Overlays & Drawer Components */}
        <Drawer open={aiOpen} onOpenChange={setAiOpen}>
          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
            <DrawerContent className="fixed bottom-0 left-0 right-0 h-[82vh] max-h-[82vh] bg-white rounded-t-[44px] border-none shadow-2xl z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
              <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-4">
                <div className="flex items-center gap-4 text-right">
                   <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-gray-50">
                      <NamixAIIcon />
                   </div>
                   <div className="space-y-0.5">
                     <DrawerTitle className="text-lg font-black text-[#002d4d] tracking-tight leading-none">تحليل NAMIX AI</DrawerTitle>
                     <p className="text-[#f9a885] font-black text-[7px] uppercase tracking-widest mt-1.5 leading-none">Sovereign Intelligence Core</p>
                   </div>
                </div>
                <button 
                  onClick={() => setAiOpen(false)} 
                  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90 shadow-inner"
                >
                   <X size={20} />
                </button>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-none pb-24">
                 <NamixAIContainer asset={asset} livePrice={livePrice} />
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>

        <TradeHistoryOverlay open={historyOpen} onOpenChange={setHistoryOpen} symbolId={symbolId} assetName={asset?.name} />
        <MarketIntelligenceOverlay open={insightOpen} onOpenChange={setInsightOpen} asset={asset} />
        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
      </div>
    </Shell>
  );
}
