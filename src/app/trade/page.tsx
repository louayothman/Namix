
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
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
  ArrowUpDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WatchlistHero } from "@/components/trade/watchlist/WatchlistHero";
import { MarketGrid } from "@/components/trade/watchlist/MarketGrid";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useMarketStore } from "@/store/use-market-store";
import { useMarketSync } from "@/hooks/use-market-sync";

/**
 * @fileOverview محطة مراقبة الأسواق السيادية v12.0 - Background Sync Edition
 * تم إصلاح جلب الأسعار لتعمل في الخلفية بتردد 0.1 ثانية ومعايرة الواجهة كل 5 ثوانٍ.
 */
export default function TradeWatchlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'price'>('default');
  const [dbUser, setDbUser] = useState<any>(null);
  const [isCalibrating, setIsCalibrating] = useState(true);
  
  const router = useRouter();
  const db = useFirestore();

  // استهلاك بيانات المتجر المركزي
  const prices = useMarketStore(state => state.prices);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      const parsed = JSON.parse(session);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
        if (snap.exists()) setDbUser(snap.data());
      });
      return () => unsub();
    }
  }, [db]);

  const symbolsQuery = useMemoFirebase(() => query(
    collection(db, "trading_symbols"), 
    where("isActive", "==", true)
  ), [db]);
  
  const { data: rawSymbols, isLoading: loadingSymbols } = useCollection(symbolsQuery);

  // تفعيل المزامنة المركزية الموحدة في الخلفية (0.1 ثانية)
  useMarketSync(rawSymbols || []);

  // بروتوكول المعايرة: الخروج من التحميل فور بدء تدفق البيانات من المتجر
  useEffect(() => {
    if (!loadingSymbols) {
      if (!rawSymbols || rawSymbols.length === 0) {
        setIsCalibrating(false);
      } else if (Object.keys(prices).length > 0) {
        // ننتظر برهة لضمان جلب كافة الأسعار
        const timer = setTimeout(() => setIsCalibrating(false), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [loadingSymbols, rawSymbols, prices]);

  const enrichedSymbols = useMemo(() => {
    if (!rawSymbols) return [];
    return rawSymbols.map(s => ({
      ...s,
      currentPrice: prices[s.id] || s.currentPrice
    }));
  }, [rawSymbols, prices]);

  const filteredSymbols = useMemo(() => {
    let result = enrichedSymbols.filter(s => 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    else if (sortBy === 'price') result = [...result].sort((a, b) => (displayPrices[b.id] || 0) - (displayPrices[a.id] || 0));
    return result;
  }, [enrichedSymbols, searchQuery, sortBy]);

  const favorites = useMemo(() => {
    if (!enrichedSymbols || !dbUser?.favoriteSymbols) return [];
    return enrichedSymbols.filter(s => dbUser.favoriteSymbols.includes(s.id));
  }, [enrichedSymbols, dbUser?.favoriteSymbols]);

  if (loadingSymbols || isCalibrating) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white space-y-10 animate-in fade-in duration-1000 font-body">
         <div className="relative">
            <div className="h-28 w-28 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <ShieldCheck className="h-10 w-10 text-[#002d4d] animate-pulse" />
            </div>
            <div className="absolute -inset-4 border border-blue-50 rounded-full animate-ping opacity-20" />
         </div>
         <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.4em]">
               <Zap className="h-2.5 w-2.5 animate-pulse" />
               Nexus Hub Calibration
            </div>
            <h4 className="text-2xl font-black text-[#002d4d]">معايرة الأسواق الحية...</h4>
            <p className="text-[10px] text-gray-400 font-bold max-w-[240px] leading-relaxed">جاري جلب نبض الأسعار في الخلفية لضمان عرض لحظي موثق.</p>
         </div>
      </div>
    );
  }

  return (
    <Shell hideMobileNav>
      <div className="max-w-[1400px] mx-auto space-y-12 px-6 md:px-10 pt-10 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex items-center justify-between px-2 pt-2 gap-8">
           <div className="text-right space-y-1">
              <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight leading-none">الأسواق</h1>
              <div className="flex items-center gap-2 opacity-40">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Direct Nexus Feed Active</span>
              </div>
           </div>

           <div className="flex items-center gap-2.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 md:h-12 md:w-12 rounded-[18px] flex items-center justify-center transition-all active:scale-90 shadow-inner border border-gray-100 bg-white text-gray-400 hover:text-[#002d4d] hover:bg-gray-50/50 outline-none">
                    <ArrowUpDown size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={12} className="rounded-[32px] border-none shadow-2xl p-3 min-w-[220px] font-body bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in duration-300 z-[1002]" dir="rtl">
                  {[
                    { id: 'default', label: 'الترتيب التلقائي', color: 'orange' }, 
                    { id: 'name', label: 'الفرز حسب الاسم', color: 'blue' }, 
                    { id: 'price', label: 'السعر (الأعلى للأقل)', color: 'emerald' }
                  ].map(item => (
                    <DropdownMenuItem key={item.id} onClick={() => setSortBy(item.id as any)} className={cn("font-black text-[12px] py-4 px-6 rounded-[22px] transition-all cursor-pointer mb-1 justify-center", sortBy === item.id ? `bg-${item.color}-50 text-${item.color}-600` : "text-gray-500 hover:bg-gray-50")}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={cn("h-10 w-10 md:h-12 md:w-12 rounded-[18px] flex items-center justify-center transition-all active:scale-90 shadow-inner border border-gray-100", isSearchOpen ? "bg-red-50 text-red-500 border-red-100" : "bg-white text-gray-400 hover:text-[#002d4d] hover:bg-gray-50/50")}>
                 {isSearchOpen ? <X size={18}/> : <Search size={18}/>}
              </button>

              <button onClick={() => router.push('/')} className="h-10 w-10 md:h-12 md:w-12 rounded-[18px] flex items-center justify-center transition-all active:scale-90 shadow-inner border border-gray-100 bg-white text-gray-400 hover:text-[#002d4d] hover:bg-gray-50/50">
                 <ChevronLeft size={20} className="transition-transform hover:-translate-x-1" />
              </button>
           </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0, y: -20 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -20 }} className="overflow-hidden">
              <div className="relative group px-2 max-w-2xl mx-auto">
                <Input autoFocus placeholder="ابحث عن أصل مالي في القاعدة السيادية..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-16 rounded-[32px] bg-gray-50 border-none font-bold text-sm px-14 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500 transition-all text-right" />
                <Search className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {favorites.length > 0 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <Star className="h-5 w-5 text-orange-400 fill-orange-400" />
                   <div className="text-right">
                      <h2 className="text-lg font-black text-[#002d4d] leading-none">المحفظة النخبوية</h2>
                      <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.3em] mt-1.5">Elite Sovereign Watchlist</p>
                   </div>
                </div>
             </div>
             <WatchlistHero favorites={favorites} />
          </section>
        )}

        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                 <Activity className="h-6 w-6 text-blue-500" />
                 <div className="text-right">
                    <h2 className="text-xl font-black text-[#002d4d] leading-none">الأسواق المباشرة</h2>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Live Operational Markets</p>
                 </div>
              </div>
           </div>
           {/* محرك العرض المخفف (5 ثوانٍ) مدمج داخل المكون */}
           <MarketGrid symbols={filteredSymbols} isLoading={false} />
        </section>

        <footer className="flex flex-col items-center gap-6 py-16 opacity-20 select-none">
           <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-[#f9a885] fill-[#f9a885]" />
              <p className="text-xs font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Sovereign Desk v12.0</p>
           </div>
        </footer>
      </div>
    </Shell>
  );
}
