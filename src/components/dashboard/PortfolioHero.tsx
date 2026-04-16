
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ArrowDown, ArrowDownCircle, UserCircle, TrendingUp, ChevronDown } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";
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
  const prices = useMarketStore(state => state.prices);

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
        
        {/* Sovereign Backdrop: Static iX Branding */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           <div className="absolute left-[-5%] top-1/2 -translate-y-1/2 text-[300px] md:text-[400px] font-black text-white/[0.03] leading-none tracking-tighter italic rounded-[100px]">
              iX
           </div>
        </div>

        <CardContent className="p-8 md:p-12 pt-12 md:pt-16 space-y-12 relative z-10">
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-3">
               <Logo size="sm" lightText className="scale-110" />
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left space-y-0.5 mr-2">
                <h1 className="text-sm font-normal tracking-tight text-white">{user?.displayName || '...'}</h1>
              </div>
              
              <div className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl backdrop-blur-3xl border border-white/10">
                <Link href="/notifications" className="relative h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
                  <Bell className="h-4.5 w-4.5 text-[#f9a885]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border-2 border-[#8899AA]"></span>
                    </span>
                  )}
                </Link>
                <Link href="/profile">
                  <button className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-90">
                    <UserCircle className="h-5 w-5 text-white" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <span className="text-[11px] text-white/60 uppercase">الرصيد المتاح</span>
            <h2 className="text-6xl md:text-8xl font-normal leading-none tabular-nums tracking-tighter flex items-baseline gap-3 text-white">
              <span className="text-white/20 text-3xl md:text-4xl">$</span>
              {(user?.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>

            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md mt-2 group/approx active:scale-95 transition-all">
               <p className="text-[11px] font-black text-white/80 tabular-nums tracking-tight" dir="ltr">
                  ≈ {selectedCurrency === 'BTC' ? approximateBalance.toFixed(8) : approximateBalance.toFixed(selectedCurrency === 'USDT' ? 2 : 6)} {selectedCurrency}
               </p>
               
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-5 w-5 rounded-md hover:bg-white/10 flex items-center justify-center transition-all outline-none">
                       <ChevronDown size={14} className="text-[#f9a885]" />
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

            <div className="grid grid-cols-2 gap-0 mt-8 pt-2 w-full relative">
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-[0.5px] bg-white/10" />
               <div className="flex flex-col items-center">
                  <p className="text-[10px] text-white/20 uppercase mb-1.5">الاستثمارات</p>
                  <p className="text-xl font-normal text-white tabular-nums">${(user?.activeInvestmentsTotal || 0).toLocaleString()}</p>
               </div>
               <div className="flex flex-col items-center">
                  <p className="text-[10px] text-[#f9a885]/40 uppercase mb-1.5">الأرباح</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-[#f9a885] opacity-40" />
                    <p className="text-xl font-normal text-[#f9a885] tabular-nums">+${totalLiveProfits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <button onClick={onDeposit} className="h-16 rounded-[28px] bg-[#f9a885] text-[#002d4d] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              <ArrowDown className="h-4 w-4 relative z-10" />
              <span className="relative z-10">استلام</span>
            </button>
            <button onClick={onWithdraw} className="h-16 rounded-[28px] bg-white/5 text-white backdrop-blur-3xl border border-white/10 font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group">
              <ArrowDownCircle className="h-4 w-4 rotate-180 text-[#f9a885]" />
              <span>إرسال</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
