"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
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
import { Badge } from "@/components/ui/badge";
import { WatchlistHero } from "@/components/trade/watchlist/WatchlistHero";
import { MarketGrid } from "@/components/trade/watchlist/MarketGrid";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMarketStore } from "@/store/use-market-store";
import { useMarketSync } from "@/hooks/use-market-sync";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview بوابة الأسواق الحية v15.2 - Refined Command Layout
 * تم نقل أزرار التحكم لليسار وتحديث نصوص التحميل وتطهير التذييل.
 */
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
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      try {
        const parsed = JSON.parse(userSession);
        const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => { if (snap.exists()) setDbUser(snap.data()); });
        return () => unsub();
      } catch (e) { router.push("/login"); }
    }
  }, [db, router]);

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
    let result = rawSymbols.filter(s => 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
         <div className="relative">
            <div className="h-24 w-24 md:h-28 md:w-28 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-[#002d4d] animate-pulse" />
            </div>
         </div>
         <div className="text-center space-y-3 px-6">
            <h4 className="text-xl md:text-2xl font-black text-[#002d4d]">تحميل أسواق الكريبتو</h4>
         </div>
      </div>
    );
  }

  if (globalConfig?.isTradingEnabled === false) {
    return (
      <Shell hideMobileNav>
        <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-8 bg-white font-body" dir="rtl">
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
                 <h2 className="text-3xl font-black text-[#002d4d] tracking-tight leading-none">بوابة الأسواق مغلقة</h2>
                 <p className="text-gray-500 font-bold leading-loose text-sm px-4">
                    نعتذر، محطة التداول تخضع حالياً لعملية صيانة وتحديث دورية لتعزيز الأداء وضمان دقة البيانات اللحظية. سنعود للعمل في أقرب وقت.
                 </p>
              </div>

              <div className="grid gap-4 w-full px-6">
                 <Button onClick={() => router.push("/home")} className="h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">العودة للرئيسية</Button>
                 <div className="flex items-center justify-center gap-3 opacity-30 mt-4">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">Security Maintenance Protocol Active</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell hideMobileNav>
      <div className="max-w-[1400px] mx-auto space-y-10 px-4 md:px-8 lg:px-10 pt-8 pb-32 font-body text-right" dir="rtl">
        
        {/* Responsive Strategy Header - Blocks opposite to each other */}
        <div className="flex flex-row items-center justify-between gap-8 px-2">
           {/* RIGHT: Markets Title */}
           <div className="text-right space-y-1">
              <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight leading-none">الأسواق</h1>
              <div className="flex items-center gap-2 opacity-40">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Global Nexus Feed Active</span>
              </div>
           </div>

           {/* LEFT: Command Matrix (Search, Sort, Back) */}
           <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-[24px] border border-gray-100 shadow-inner">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-10 px-4 rounded-xl flex items-center gap-2 shadow-sm border border-gray-100 bg-white text-gray-400 hover:text-[#002d4d] transition-all active:scale-95 outline-none">
                      <ArrowUpDown size={16} />
                      <span className="text-[10px] font-black hidden sm:inline-block">تصفية</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-[28px] border-none shadow-2xl p-2 min-w-[220px] bg-white/95 backdrop-blur-xl z-[1002]" dir="rtl">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                       <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Sort Protocol</p>
                    </div>
                    {[
                      { id: 'default', label: 'الترتيب التلقائي' }, 
                      { id: 'name', label: 'الفرز حسب الاسم' }, 
                      { id: 'price', label: 'السعر (الأعلى للأقل)' }
                    ].map(item => (
                      <DropdownMenuItem key={item.id} onClick={() => setSortBy(item.id as any)} className="font-black text-[11px] py-3.5 px-5 rounded-2xl transition-all cursor-pointer mb-1 justify-between">
                        {item.label}
                        {sortBy === item.id && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)} 
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-95 border",
                    isSearchOpen ? "bg-[#002d4d] text-[#f9a885] border-transparent shadow-lg" : "bg-white text-gray-400 border-gray-100 shadow-sm"
                  )}
                >
                  {isSearchOpen ? <X size={18}/> : <Search size={18}/>}
                </button>
              </div>

              <button 
                onClick={() => router.back()} 
                className="h-10 w-10 rounded-xl flex items-center justify-center border border-gray-100 bg-white text-gray-400 hover:bg-gray-50 transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
           </div>
        </div>

        {/* Dynamic Animated Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }} 
              animate={{ height: 'auto', opacity: 1, y: 0 }} 
              exit={{ height: 0, opacity: 0, y: -10 }} 
              className="overflow-hidden"
            >
              <div className="relative group px-2 max-w-3xl mx-auto py-2">
                <Input 
                  autoFocus 
                  placeholder="ابحث عن أصل مالي، عملة، أو كود تداول..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="h-16 rounded-[32px] bg-white border border-gray-100 font-bold text-sm px-14 shadow-2xl text-right focus-visible:ring-4 focus-visible:ring-blue-500/5 transition-all" 
                />
                <Search className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-500/40" />
                <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Scanning...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Elite Favorites Section */}
        {favorites.length > 0 && !searchQuery && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center gap-4 px-4">
                <div className="h-8 w-8 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center shadow-inner">
                   <Star size={16} fill="currentColor" />
                </div>
                <div className="text-right">
                   <h2 className="text-lg font-black text-[#002d4d] leading-none">المحفظة النخبوية</h2>
                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sovereign Watchlist</p>
                </div>
             </div>
             <WatchlistHero favorites={favorites} />
          </section>
        )}

        {/* Global Live Markets Grid */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                 <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
                    <Activity size={16} />
                 </div>
                 <div className="text-right">
                    <h2 className="text-lg font-black text-[#002d4d] leading-none">الأسواق المباشرة</h2>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Asset Inventory</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner tracking-widest">
                    {filteredSymbols.length} NODES
                 </Badge>
              </div>
           </div>
           
           <div className="relative">
              {filteredSymbols.length === 0 ? (
                <div className="py-32 text-center flex flex-col items-center gap-6 bg-white/40 border-2 border-dashed border-gray-100 rounded-[64px] opacity-40">
                   <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center shadow-inner">
                      <Zap size={32} className="text-[#002d4d]" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xl font-black text-[#002d4d] uppercase tracking-widest">No Matches Found</p>
                      <p className="text-sm font-bold text-gray-400">لم يتم العثور على أصول تطابق معايير البحث.</p>
                   </div>
                </div>
              ) : (
                <MarketGrid symbols={filteredSymbols} isLoading={false} />
              )}
           </div>
        </section>

        {/* System Branding Footer - Clean Edition */}
        <div className="flex flex-col items-center gap-4 pt-24 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em] text-center">Namix Market Infrastructure</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
