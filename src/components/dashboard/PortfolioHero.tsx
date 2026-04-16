
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ArrowDown, ArrowDownCircle, UserCircle, TrendingUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PortfolioHeroProps {
  user: any;
  totalLiveProfits: number;
  unreadCount: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function PortfolioHero({ 
  user, 
  totalLiveProfits, 
  unreadCount, 
  onDeposit, 
  onWithdraw 
}: PortfolioHeroProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'USDT' | 'ETH'>('BTC');
  const [greeting, setGreeting] = useState("");
  const prices = useMarketStore(state => state.prices);

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "صباح الخير";
    if (hour >= 12 && hour < 18) return "طاب يومك";
    return "مساء الخير";
  }, []);

  useEffect(() => {
    // تعيين التحية الزمنية فوراً عند التحميل
    setGreeting(timeGreeting);

    // تفعيل بروتوكول التبديل التلقائي بعد 10 ثوانٍ
    const timer = setTimeout(() => {
      setGreeting("Welcome Back");
    }, 10000);

    return () => clearTimeout(timer);
  }, [timeGreeting]);

  const approximateBalance = useMemo(() => {
    const balance = user?.totalBalance || 0;
    if (selectedCurrency === 'USDT') return balance;
    
    const btcPrice = Object.entries(prices).find(([id]) => id.toUpperCase().includes('BTC'))?.[1] || 60000;
    const ethPrice = Object.entries(prices).find(([id]) => id.toUpperCase().includes('ETH'))?.[1] || 3000;

    if (selectedCurrency === 'BTC') return balance / btcPrice;
    if (selectedCurrency === 'ETH') return balance / ethPrice;
    return balance;
  }, [user?.totalBalance, selectedCurrency, prices]);

  return (
    <div className="relative w-full">
      <Card className="border-none shadow-none rounded-t-none rounded-b-[64px] bg-[#8899AA] text-white overflow-hidden relative group">
        
        {/* Sovereign Backdrop: Huge Animated Namix Icon at Bottom-Left */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           <motion.div 
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="absolute -bottom-24 -left-24 opacity-[0.04] flex items-center justify-center"
           >
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white shadow-2xl" />
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#f9a885] shadow-2xl" />
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#f9a885] shadow-2xl" />
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white shadow-2xl" />
              </div>
           </motion.div>
        </div>

        <CardContent className="p-8 md:p-12 pt-10 md:pt-12 space-y-10 relative z-10">
          
          {/* Header Strip - Identity Focused */}
          <div className="flex items-center justify-between">
            <div className="text-right space-y-0.5">
               <AnimatePresence mode="wait">
                  <motion.p 
                    key={greeting}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-bold text-white/40 uppercase tracking-widest"
                  >
                    {greeting}
                  </motion.p>
               </AnimatePresence>
               <h1 className="text-lg font-black tracking-tight text-white">{user?.displayName || '...'}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl backdrop-blur-3xl border border-white/10">
                <Link href="/notifications" className="relative h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
                  <Bell className="h-4 w-4 text-[#f9a885]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 border-2 border-[#8899AA]"></span>
                    </span>
                  )}
                </Link>
                <Link href="/profile">
                  <button className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-90">
                    <UserCircle className="h-4.5 w-4.5 text-white" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Financial Row: Balance (Right) vs Stats (Left) */}
          <div className="flex flex-row items-center justify-between w-full">
            
            {/* Right Side: Primary Balance (Larger) */}
            <div className="flex flex-col items-start text-right space-y-1">
              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">الرصيد المتاح</span>
              <h2 className="text-5xl md:text-7xl font-black leading-none tabular-nums tracking-tighter text-white flex items-baseline gap-2">
                <span className="text-white/20 text-2xl md:text-3xl font-bold">$</span>
                {(user?.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              
              <div className="flex items-center gap-1.5 px-1">
                 <p className="text-[11px] font-black text-white/50 tabular-nums tracking-tight" dir="ltr">
                    ≈ {selectedCurrency === 'BTC' ? approximateBalance.toFixed(8) : approximateBalance.toFixed(selectedCurrency === 'USDT' ? 2 : 6)} {selectedCurrency}
                 </p>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-4 w-4 rounded-md hover:bg-white/10 flex items-center justify-center transition-all outline-none">
                         <ChevronDown size={12} className="text-[#f9a885]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="rounded-2xl border-none shadow-2xl p-1.5 min-w-[90px] bg-white/95 backdrop-blur-xl z-[1002]" dir="rtl">
                       {(['BTC', 'USDT', 'ETH'] as const).map(curr => (
                         <DropdownMenuItem 
                           key={curr} 
                           onClick={() => setSelectedCurrency(curr)}
                           className={cn(
                             "text-[10px] font-black py-2.5 px-4 rounded-xl cursor-pointer justify-center transition-all mb-1",
                             selectedCurrency === curr ? "bg-[#002d4d] text-white" : "text-gray-400 hover:bg-gray-50"
                           )}
                         >
                           {curr}
                         </DropdownMenuItem>
                       ))}
                    </DropdownMenuContent>
                 </DropdownMenu>
              </div>
            </div>

            {/* Left Side: Clean Vertical Stats (Text next to Value) */}
            <div className="flex flex-col items-end gap-6 border-r border-white/10 pr-6">
               <div className="text-right flex items-center gap-3">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">الاستثمارات</p>
                  <p className="text-xl font-black text-white tabular-nums tracking-tighter leading-none">
                    ${(user?.activeInvestmentsTotal || 0).toLocaleString()}
                  </p>
               </div>
               <div className="text-right flex items-center gap-3">
                  <p className="text-[9px] font-black text-[#f9a885]/40 uppercase tracking-widest leading-none">الأرباح</p>
                  <p className="text-xl font-black text-[#f9a885] tabular-nums tracking-tighter leading-none">
                    +${totalLiveProfits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
               </div>
            </div>
          </div>

          {/* Action Buttons Strip */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
            <button onClick={onDeposit} className="h-14 rounded-[28px] bg-[#f9a885] text-[#002d4d] font-black text-[13px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              <ArrowDown className="h-4 w-4 relative z-10" />
              <span className="relative z-10">استلام</span>
            </button>
            <button onClick={onWithdraw} className="h-14 rounded-[28px] bg-white/5 text-white backdrop-blur-3xl border border-white/10 font-black text-[13px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group">
              <ArrowDownCircle className="h-4 w-4 rotate-180 text-[#f9a885]" />
              <span>إرسال</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
