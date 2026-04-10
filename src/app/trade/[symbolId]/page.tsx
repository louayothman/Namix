
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
  AlertCircle
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
  <div className="flex flex-col items-center justify-center h-full gap-6 bg-gray-50/20 backdrop-blur-sm">
    <div className="relative">
      <div className="h-16 w-16 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <ShieldCheck className="h-6 w-6 text-[#002d4d]" />
      </div>
    </div>
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Market Node...</p>
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
      <div className="flex flex-col h-[100dvh] w-full bg-white font-body select-none overflow-hidden relative">
        
        <header className="h-[74px] bg-white px-4 md:px-8 flex items-center justify-between shrink-0 z-[120] border-b border-gray-50 shadow-sm">
           <div className="flex items-center gap-3">
              <motion.button onClick={toggleFavorite} whileTap={{ scale: 1.4 }} className={cn("h-10 w-10 rounded-2xl flex items-center justify-center transition-all shadow-inner border border-gray-100 group", isFavorite ? "bg-orange-50 text-[#f9a885] border-orange-100" : "bg-gray-50 text-gray-300 hover:text-[#f9a885]")}>
                <AnimatePresence mode="wait">
                  <motion.div key={isFavorite ? 'active' : 'inactive'} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                    <Star size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                  </motion.div>
                </AnimatePresence>
              </motion.button>
              <div className="text-right flex flex-col justify-center">
                 <h2 className="text-sm md:text-xl font-black text-[#002d4d] tracking-tight">{asset?.name}</h2>
                 <div className="flex items-center gap-1.5 opacity-30 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-widest tracking-normal">Sovereign Node</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 h-10 px-3 bg-gray-50/80 border border-gray-100 rounded-full shadow-inner">
                 <p className="text-[11px] md:text-[13px] font-black text-[#002d4d] tabular-nums tracking-tighter">
                   ${dbUser?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                 </p>
                 <div className="h-3 w-px bg-gray-200" />
                 <button 
                   onClick={() => setDepositOpen(true)} 
                   className="h-6 w-6 rounded-full text-[#002d4d] hover:text-[#f9a885] flex items-center justify-center transition-all active:scale-90"
                 >
                    <Plus size={14} />
                 </button>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setAiOpen(true)}
                  className="h-9 w-9 md:h-10 md:w-10 rounded-xl border border-gray-100 flex items-center justify-center bg-transparent active:scale-90 transition-all shadow-sm"
                  title="NAMIX AI"
                >
                   <NamixAIIcon />
                </button>

                <button 
                  onClick={() => setInsightOpen(true)} 
                  className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all shadow-sm active:scale-90 relative overflow-hidden group/radar" 
                  title="الرؤية العميقة"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute h-full w-full rounded-full border border-blue-100 opacity-20 animate-ping duration-[3s]" />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute h-[150%] w-[150%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.05)_180deg,rgba(59,130,246,0.3)_360deg)] rounded-full pointer-events-none"
                  />
                  <Radar size={16} className="relative z-10 animate-pulse" />
                </button>

                <button onClick={() => setHistoryOpen(true)} className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all shadow-sm active:scale-90" title="سجل التداول"><Clock size={16} /></button>
                <button onClick={() => router.back()} className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#002d4d] border border-gray-100 active:scale-90 shadow-inner"><ChevronLeft size={18} /></button>
              </div>
           </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          <section className="flex-1 relative bg-white overflow-hidden">
             <Suspense fallback={<TerminalLoader />}>
               {asset.priceSource === 'binance' ? (
                 <PriceChart asset={asset} livePrice={livePrice || asset.currentPrice} />
               ) : (
                 <InternalPriceChart asset={asset} livePrice={livePrice || asset.currentPrice} />
               )}
             </Suspense>
          </section>

          <footer className="lg:w-[380px] w-full bg-white z-[110] flex flex-col justify-center shrink-0 relative p-3 md:p-4 lg:p-5 h-auto lg:h-auto border-t lg:border-t-0 lg:border-r border-gray-50">
             <Suspense fallback={<div className="h-[200px] w-full bg-gray-50 rounded-3xl animate-pulse" />}>
               <OrderPanel asset={asset} livePrice={livePrice || asset.currentPrice} globalConfig={globalConfig} riskConfig={riskConfig} onOpenDeposit={() => setDepositOpen(true)} />
             </Suspense>
          </footer>
        </div>

        <Drawer open={aiOpen} onOpenChange={setAiOpen}>
          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
            <DrawerContent className="fixed bottom-0 left-0 right-0 h-[82vh] max-h-[82vh] bg-white rounded-t-[44px] border-none shadow-2xl z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
              <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-4">
                <div className="flex items-center gap-4 text-right">
                   <div className="h-10 w-10 rounded-xl flex items-center justify-center">
                      <NamixAIIcon />
                   </div>
                   <div className="space-y-0.5">
                     <DrawerTitle className="text-lg font-black text-[#002d4d] tracking-normal leading-none">تحليل NAMIX AI</DrawerTitle>
                     <p className="text-[#f9a885] font-black text-[7px] uppercase tracking-widest mt-1 tracking-normal">Sovereign Intelligence Core</p>
                   </div>
                </div>
                <button onClick={() => setAiOpen(false)} className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all active:scale-90">
                   <X size={18} />
                </button>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto p-5 md:p-8 scrollbar-none pb-24">
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
