
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowDown, ArrowDownCircle, Award, Coins, ShieldCheck, TrendingUp, History, CreditCard, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

interface ManagedPortfolioHeroProps {
  user: any;
  totalLiveProfits: number;
  unreadCount: number;
  calculatedTier: any;
  aggregateStats: { totalDeposited: number, totalWithdrawn: number };
  onDeposit: () => void;
  onWithdraw: () => void;
  onInvest: () => void;
}

export function ManagedPortfolioHero({ 
  user, 
  totalLiveProfits, 
  unreadCount, 
  calculatedTier,
  aggregateStats,
  onDeposit, 
  onWithdraw,
  onInvest
}: ManagedPortfolioHeroProps) {
  return (
    <div className="relative w-full">
      <Card className="border-none shadow-[0_40px_70px_-12px_rgba(136,153,170,0.3)] rounded-b-[64px] bg-[#8899AA] text-white overflow-hidden relative group transition-all duration-700">
        
        {/* Sovereign Backdrop: Giant Static iX on the LEFT */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 text-[450px] md:text-[550px] font-black text-white/[0.04] leading-none select-none tracking-tighter italic rounded-[100px]" style={{ fontFamily: 'sans-serif' }}>
              iX
           </div>
           <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f9a885]/5 rounded-full blur-[120px]" />
        </div>

        <CardContent className="p-6 md:p-8 space-y-6 relative z-10">
          
          {/* Managed User Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-right">
              <div className="relative h-12 w-12 rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
                <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
              </div>
              <div className="space-y-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-black tracking-tight">{user?.displayName || '...'}</h1>
                  {calculatedTier && (
                    <Badge className={cn("text-[7px] font-black border-none px-2.5 py-0.5 rounded-md shadow-sm", `bg-${calculatedTier.color}-500/40 text-white`)}>
                      {calculatedTier.name}
                    </Badge>
                  )}
                </div>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mt-0.5">Oversight Management Active</p>
              </div>
            </div>
            <Logo size="sm" className="scale-110 brightness-200" />
          </div>

          {/* Managed Balance Display */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-xs font-black text-white/80">السيولة المدارة</span>
               <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-0.5">Managed Liquidity</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black leading-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] tabular-nums tracking-tighter flex items-baseline gap-2">
              <span className="text-white/20 text-2xl font-bold">$</span>
              {(user?.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>

          {/* Managed Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                 <span className="text-[9px] font-black text-white/90">رأس المال</span>
                 <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Capital</span>
              </div>
              <p className="text-sm font-black text-white tabular-nums">${(user?.activeInvestmentsTotal || 0).toLocaleString()}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                 <span className="text-[9px] font-black text-[#f9a885]">الأرباح</span>
                 <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Yield</span>
              </div>
              <p className="text-sm font-black text-[#f9a885] tabular-nums">${totalLiveProfits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                 <span className="text-[9px] font-black text-emerald-400">إيداعات</span>
                 <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Inflow</span>
              </div>
              <p className="text-sm font-black text-emerald-400 tabular-nums">${aggregateStats.totalDeposited.toLocaleString()}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                 <span className="text-[9px] font-black text-red-400">سحوبات</span>
                 <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">Outflow</span>
              </div>
              <p className="text-sm font-black text-red-400 tabular-nums">${aggregateStats.totalWithdrawn.toLocaleString()}</p>
            </div>
          </div>

          {/* Administrative Control Hub */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button 
              onClick={onDeposit}
              className="h-11 rounded-[20px] bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[9px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border-none"
            >
              <ArrowDown className="h-3 w-3" />
              <span>إيداع <span className="opacity-30">Deposit</span></span>
            </button>
            <button 
              onClick={onInvest}
              className="h-11 rounded-[20px] bg-white/10 hover:bg-white/20 text-white backdrop-blur-3xl border border-white/20 font-black text-[9px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
            >
              <TrendingUp className="h-3 w-3 text-[#f9a885]" />
              <span>استثمار <span className="opacity-30">Invest</span></span>
            </button>
            <button 
              onClick={onWithdraw}
              className="h-11 rounded-[20px] bg-white/10 hover:bg-white/20 text-white backdrop-blur-3xl border border-white/20 font-black text-[9px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
            >
              <ArrowDownCircle className="h-3 w-3 rotate-180 text-red-400" />
              <span>سحب <span className="opacity-30">Withdraw</span></span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
