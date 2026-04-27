"use client";

import React, { useState, useMemo, useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, UserCircle, ChevronDown, ChevronUp, Eye, EyeOff, Share2 } from "lucide-react";
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
import { IdentityCardDrawer } from "@/components/profile/IdentityCardDrawer";

/**
 * BalanceNode - مكوّن نانوي لعزل تحديثات الرصيد
 */
const BalanceNode = memo(({ balance, show }: { balance: number, show: boolean }) => {
  return (
    <h2 className="text-5xl md:text-7xl font-black leading-none tabular-nums tracking-tighter text-white flex items-baseline gap-2 gpu-accelerated">
      <span className="text-white/20 text-2xl md:text-3xl font-bold">$</span>
      {show 
        ? balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "••••••"
      }
    </h2>
  );
});
BalanceNode.displayName = "BalanceNode";

interface PortfolioHeroProps {
  user: any;
  totalLiveProfits: number;
  unreadCount: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  calculatedTier?: any;
}

export function PortfolioHero({ 
  user, 
  totalLiveProfits, 
  unreadCount, 
  onDeposit, 
  onWithdraw,
  calculatedTier
}: PortfolioHeroProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'USDT' | 'ETH'>('BTC');
  const [greeting, setGreeting] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'yield' | 'invest'>( 'yield');
  const [isCardOpen, setIsCardOpen] = useState(false);
  
  const prices = useMarketStore(state => state.prices);

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "صباح الخير";
    if (hour >= 12 && hour < 18) return "طاب يومك";
    return "مساء الخير";
  }, []);

  useEffect(() => {
    setGreeting(timeGreeting);
    const greetingInterval = setInterval(() => {
      setGreeting(prev => prev === "Welcome Back" ? timeGreeting : "Welcome Back");
    }, 10000);
    return () => clearInterval(greetingInterval);
  }, [timeGreeting]);

  useEffect(() => {
    const metricInterval = setInterval(() => {
      setActiveMetric(prev => prev === 'yield' ? 'invest' : 'yield');
    }, 8000);
    return () => clearInterval(metricInterval);
  }, []);

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
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           <div className="absolute -bottom-24 -left-24 opacity-[0.04] flex items-center justify-center animate-spin-slow">
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white shadow-2xl" />
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#f9a885] shadow-2xl" />
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#f9a885] shadow-2xl" />
                 <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white shadow-2xl" />
              </div>
           </div>
        </div>

        <CardContent className="p-8 md:p-12 pt-10 md:pt-12 space-y-10 relative z-10">
          
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
                {/* Sovereign ID Card Trigger */}
                <button 
                  onClick={() => setIsCardOpen(true)}
                  className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-90"
                  title="مشاركة هويتك السيادية"
                >
                  <Share2 className="h-4 w-4 text-white" />
                </button>

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

          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col items-start text-right space-y-1">
              <div className="flex items-baseline gap-1.5">
                 <span className="text-[11px] text-white/40 font-black uppercase tracking-widest">الرصيد <span className="text-[8px] opacity-60">Balance</span></span>
                 <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="h-6 w-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-all text-white/30 hover:text-white outline-none active:scale-90 ml-1"
                >
                  {showBalance ? <Eye size={10} /> : <EyeOff size={10} />}
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <BalanceNode balance={user?.totalBalance || 0} show={showBalance} />
              </div>
              
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

            <div className="flex flex-col items-end overflow-hidden h-[36px] min-w-[120px] justify-center relative">
               <AnimatePresence mode="wait">
                  {activeMetric === 'yield' ? (
                    <motion.div 
                      key="yield"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-right flex items-center justify-end gap-2 w-full gpu-accelerated"
                    >
                       <p className="text-[11px] font-black text-white/80 tabular-nums tracking-tighter leading-none">
                         ${totalLiveProfits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </p>
                       <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">الأرباح المحققة</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="invest"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-right flex items-center justify-end gap-2 w-full gpu-accelerated"
                    >
                       <p className="text-[11px] font-black text-white/80 tabular-nums tracking-tighter leading-none">
                         ${(user?.activeInvestmentsTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </p>
                       <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">رأس المال النشط</p>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={onDeposit}
              className="h-11 rounded-[20px] bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border-none relative overflow-hidden group/btn"
            >
              <div className="absolute right-2 opacity-10 pointer-events-none animate-bounce-slow">
                <ChevronDown size={44} strokeWidth={3} />
              </div>
              <span className="relative z-10">استلام <span className="opacity-30">Receive</span></span>
            </button>
            <button 
              onClick={onWithdraw}
              className="h-11 rounded-[20px] bg-white/10 hover:bg-white/20 text-white backdrop-blur-3xl border border-white/20 font-black text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl relative overflow-hidden group/btn"
            >
              <div className="absolute left-2 opacity-10 pointer-events-none animate-bounce-slow-reverse">
                <ChevronUp size={44} strokeWidth={3} />
              </div>
              <span className="relative z-10">إرسال <span className="opacity-30">Send</span></span>
            </button>
          </div>

        </CardContent>
      </Card>
      
      <IdentityCardDrawer 
        open={isCardOpen} 
        onOpenChange={setIsCardOpen} 
        user={user} 
        calculatedTier={calculatedTier} 
      />

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
          will-change: transform;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3.5s ease-in-out infinite;
          will-change: transform;
        }
        .animate-bounce-slow-reverse {
          animation: bounce-slow 3.5s ease-in-out infinite reverse;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
