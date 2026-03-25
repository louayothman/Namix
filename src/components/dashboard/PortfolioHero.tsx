
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, ArrowDown, ArrowDownCircle, UserCircle, TrendingUp, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PortfolioHeroProps {
  user: any;
  totalLiveProfits: number;
  vaultYield: number;
  unreadCount: number;
  isVaultEnabled: boolean;
  calculatedTier: any;
  insuranceConfig: any;
  onDeposit: () => void;
  onWithdraw: () => void;
}

/**
 * @fileOverview نبض المحفظة السيادي v8.7 - Asset Protection Edition
 * إضافة مؤشر تغطية الأصول (Asset Coverage) بتصميم فاخر يظهر عند تفعيل بروتوكول الحماية.
 */
export function PortfolioHero({ 
  user, 
  totalLiveProfits, 
  unreadCount, 
  insuranceConfig,
  onDeposit, 
  onWithdraw 
}: PortfolioHeroProps) {
  return (
    <div className="relative w-full">
      <Card className="border-none shadow-[0_48px_100px_-12px_rgba(0,45,77,0.4)] rounded-b-[64px] bg-[#002d4d] text-white overflow-hidden relative group transition-all duration-1000">
        
        {/* Sovereign Atomic Backdrop - Reduced Size (50% Smaller) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           <div className="absolute -top-10 -right-10 md:-top-12 md:-right-12 grid grid-cols-2 gap-6 md:gap-8 opacity-[0.02] transform scale-[0.7] md:scale-[0.95] rotate-[12deg]">
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-white" />
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-[#f9a885]" />
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-[#f9a885]" />
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-white" />
           </div>

           {/* Dynamic Atmosphere Glow */}
           <motion.div 
             animate={{ 
               scale: [1, 1.1, 1],
               opacity: [0.1, 0.15, 0.1],
             }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-blue-500/20 rounded-full blur-[120px]" 
           />
        </div>

        <CardContent className="p-8 md:p-12 pt-12 md:pt-16 space-y-12 relative z-10">
          
          {/* Top Identity Node */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-3">
               <Logo size="sm" className="scale-110 brightness-200" />
               
               {/* Sovereign Asset Coverage Indicator */}
               {insuranceConfig?.isFundVisible && (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 backdrop-blur-md shadow-inner group/protect"
                 >
                    <ShieldCheck className="h-2.5 w-2.5 text-emerald-400 group-hover/protect:scale-110 transition-transform" />
                    <span className="text-[7px] font-black text-emerald-400/80 uppercase tracking-widest leading-none">
                      Covered: ${insuranceConfig.fundSize?.toLocaleString()}
                    </span>
                 </motion.div>
               )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left space-y-0.5 mr-2">
                <h1 className="text-sm font-black tracking-tight leading-none text-white">{user?.displayName || '...'}</h1>
                <p className="text-[7px] text-blue-200/40 font-black uppercase tracking-[0.2em] mt-1 text-left">Verified Sovereign</p>
              </div>
              
              <div className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl backdrop-blur-3xl border border-white/10">
                <Link href="/notifications" className="relative h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
                  <Bell className="h-4.5 w-4.5 text-[#f9a885]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border-2 border-[#002d4d]"></span>
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

          {/* Master Balance Display - Purified */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                 الرصيد <span className="text-[7px] opacity-40 ml-1 font-bold">Balance</span>
               </span>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl md:text-8xl font-black leading-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.4)] tabular-nums tracking-tighter flex items-baseline gap-3 text-white"
            >
              <span className="text-white/20 text-3xl md:text-4xl font-bold">$</span>
              {(user?.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.h2>

            {/* Balanced Financial Intelligence Stream - Perfect Centering */}
            <div className="grid grid-cols-2 gap-0 mt-8 pt-2 w-full relative">
               {/* Vertical Separator - Centered */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-[0.5px] bg-white/5" />

               <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1.5">
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                       الاستثمارات <span className="text-[6px] opacity-40 ml-1">Investments</span>
                     </p>
                  </div>
                  <p className="text-xl font-black text-white tabular-nums tracking-tighter">
                    ${(user?.activeInvestmentsTotal || 0).toLocaleString()}
                  </p>
               </div>

               <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1.5">
                     <p className="text-[9px] font-black text-[#f9a885]/40 uppercase tracking-widest">
                       الأرباح <span className="text-[6px] opacity-40 ml-1">Yield</span>
                     </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-[#f9a885] opacity-20" />
                    <p className="text-xl font-black text-[#f9a885] tabular-nums tracking-tighter">
                      +${totalLiveProfits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Strategic Actions */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <button 
              onClick={onDeposit}
              className="h-16 rounded-[28px] bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-orange-900/40 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              <ArrowDown className="h-4 w-4 relative z-10 transition-transform group-hover:translate-y-1" />
              <span className="relative z-10">تعزيز الرصيد</span>
            </button>
            
            <button 
              onClick={onWithdraw}
              className="h-16 rounded-[28px] bg-white/5 hover:bg-white/10 text-white backdrop-blur-3xl border border-white/10 font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group"
            >
              <ArrowDownCircle className="h-4 w-4 rotate-180 text-[#f9a885] transition-transform group-hover:-translate-y-1" />
              <span>سحب الرصيد</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
