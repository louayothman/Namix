
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { 
  Search, 
  Activity, 
  Star, 
  Sparkles, 
  X,
  ChevronLeft,
  ShieldCheck,
  Zap,
  ArrowUpDown,
  Hourglass,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { WatchlistHero } from "@/components/trade/watchlist/WatchlistHero";
import { MarketGrid } from "@/components/trade/watchlist/MarketGrid";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMarketStore } from "@/store/use-market-store";
import { useMarketSync } from "@/hooks/use-market-sync";
import { Button } from "@/components/ui/button";

export default function TradeWatchlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'price'>('default');
  const [dbUser, setDbUser] = useState<any>(null);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const router = useRouter();
  const db = useFirestore();
  const prices = useMarketStore(state => state.prices);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      const parsed = JSON.parse(session);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => { if (snap.exists()) setDbUser(snap.data()); });
      return () => unsub();
    }
  }, [db]);

  const globalConfigRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: globalConfig, isLoading: loadingConfig } = useDoc(globalConfigRef);

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), where("isActive", "==", true)), [db]);
  const { data: rawSymbols, isLoading: loadingSymbols } = useCollection(symbolsQuery);
  useMarketSync(rawSymbols || []);

  useEffect(() => {
    if (!loadingSymbols && !loadingConfig) {
      if (!rawSymbols || rawSymbols.length === 0) setIsCalibrating(false);
      else if (Object.keys(prices).length > 0) { setTimeout(() => setIsCalibrating(false), 800); }
    }
  }, [loadingSymbols, loadingConfig, rawSymbols, prices]);

  const filteredSymbols = useMemo(() => {
    if (!rawSymbols) return [];
    let result = rawSymbols.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.code?.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    else if (sortBy === 'price') result = [...result].sort((a, b) => (prices[b.id] || 0) - (prices[a.id] || 0));
    return result;
  }, [rawSymbols, searchQuery, sortBy, prices]);

  const favorites = useMemo(() => {
    if (!rawSymbols || !dbUser?.favoriteSymbols) return [];
    return rawSymbols.filter(s => dbUser.favoriteSymbols.includes(s.id));
  }, [rawSymbols, dbUser?.favoriteSymbols]);

  if (loadingSymbols || loadingConfig || isCalibrating) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white space-y-10 font-body">
         <div className="relative"><div className="h-28 w-28 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><ShieldCheck className="h-10 w-10 text-[#002d4d] animate-pulse" /></div></div>
         <div className="text-center space-y-3"><h4 className="text-2xl font-black text-[#002d4d]">معايرة الأسواق الحية...</h4><p className="text-[10px] text-gray-400 font-bold">جاري جلب نبض الأسعار في الخلفية لضمان عرض لحظي موثق.</p></div>
      </div>
    );
  }

  // بروتوكول توقف الخدمة التكتيكي
  if (globalConfig?.isTradingEnabled === false) {
    return (
      <Shell hideMobileNav>
        <div className="h-screen w-full flex flex-col items-center justify-center p-8 bg-white font-body" dir="rtl">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="flex flex-col items-center gap-10 max-w-md text-center"
           >
              <div className="relative">
                 <div className="h-32 w-32 bg-gray-50 rounded-[48px] flex items-center justify-center shadow-inner border border-gray-100">
                    <Hourglass size={64} className="text-blue-600 animate-pulse" />
                 </div>
                 <div className="absolute -top-4 -right-4 h-12 w-12 bg-[#002d4d] rounded-2xl flex items-center justify-center shadow-xl">
                    <AlertCircle size={24} className="text-[#f9a885]" />
                 </div>
              </div>

              <div className="space-y-4">
                 <h2 className="text-3xl font-black text-[#002d4d] tracking-tight">الخدمة متوقفة مؤقتاً</h2>
                 <p className="text-gray-500 font-bold leading-loose">
                    نعتذر، بوابة الأسواق الحية تخضع حالياً لعملية صيانة وتحديث دورية لتعزيز الأداء وضمان دقة البيانات. سنعود للعمل في أقرب وقت ممكن.
                 </p>
              </div>

              <div className="grid gap-4 w-full">
                 <Button onClick={() => router.push("/home")} className="h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">العودة للرئيسية</Button>
                 <div className="flex items-center justify-center gap-3 opacity-30 mt-4">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">System Maintenance Protocol Active</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell hideMobileNav>
      <div className="max-w-[1400px] mx-auto space-y-12 px-6 md:px-10 pt-10 pb-32 font-body text-right" dir="rtl">
        <div className="flex items-center justify-between px-2 pt-2 gap-8">
           <div className="text-right space-y-1"><h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">الأسواق</h1><div className="flex items-center gap-2 opacity-40"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[8px] md:text-[10px] font-black uppercase">Direct Nexus Feed Active</span></div></div>
           <div className="flex items-center gap-2.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button className="h-10 w-10 md:h-12 md:w-12 rounded-[18px] flex items-center justify-center shadow-inner border border-gray-100 bg-white text-gray-400"><ArrowUpDown size={18} /></button></DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-[32px] border-none shadow-2xl p-3 min-w-[220px] bg-white/95 backdrop-blur-xl z-[1002]" dir="rtl">
                  {[{ id: 'default', label: 'الترتيب التلقائي' }, { id: 'name', label: 'الفرز حسب الاسم' }, { id: 'price', label: 'السعر (الأعلى للأقل)' }].map(item => (<DropdownMenuItem key={item.id} onClick={() => setSortBy(item.id as any)} className="font-black text-[12px] py-4 px-6 rounded-[22px] transition-all cursor-pointer mb-1 justify-center">{item.label}</DropdownMenuItem>))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="h-10 w-10 md:h-12 md:w-12 rounded-[18px] flex items-center justify-center shadow-inner border border-gray-100">{isSearchOpen ? <X size={18}/> : <Search size={18}/>}</button>
              <button onClick={() => router.back()} className="h-10 w-10 md:h-12 md:w-12 rounded-[18px] flex items-center justify-center border border-gray-100 bg-white text-gray-400"><ChevronLeft size={20} /></button>
           </div>
        </div>

        <AnimatePresence>{isSearchOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="relative group px-2 max-w-2xl mx-auto"><Input autoFocus placeholder="ابحث عن أصل مالي..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-16 rounded-[32px] bg-gray-50 border-none font-bold text-sm px-14 shadow-inner text-right" /><Search className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-300" /></div></motion.div>)}</AnimatePresence>

        {favorites.length > 0 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center gap-4 px-4"><Star className="h-5 w-5 text-orange-400 fill-orange-400" /><h2 className="text-lg font-black text-[#002d4d]">المحفظة النخبوية</h2></div>
             <WatchlistHero favorites={favorites} />
          </section>
        )}

        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
           <div className="flex items-center gap-4 px-4"><Activity className="h-6 w-6 text-blue-500" /><h2 className="text-xl font-black text-[#002d4d]">الأسواق المباشرة</h2></div>
           <MarketGrid symbols={filteredSymbols} isLoading={false} />
        </section>
      </div>
    </Shell>
  );
}
