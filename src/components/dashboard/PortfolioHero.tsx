"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, ArrowDown, ArrowDownCircle, UserCircle, TrendingUp, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

interface PortfolioHeroProps {
  user: any;
  totalLiveProfits: number;
  unreadCount: number;
  insuranceConfig: any;
  onDeposit: () => void;
  onWithdraw: () => void;
}

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
      <Card className="border-none shadow-none rounded-t-none rounded-b-[64px] bg-[#8899AA] text-white overflow-hidden relative group">
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    borderRadius: [
                      "40% 60% 70% 30% / 40% 40% 60% 60%",
                      "60% 40% 30% 70% / 60% 30% 70% 40%",
                      "30% 70% 70% 30% / 50% 60% 40% 50%",
                      "40% 60% 70% 30% / 40% 40% 60% 60%"
                    ],
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0, 0.1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 8 + (i * 2), 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 1.5
                  }}
                  className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-white/10 bg-white/5 backdrop-blur-3xl"
                />
              ))}
           </div>
        </div>

        <CardContent className="p-8 md:p-12 pt-12 md:pt-16 space-y-12 relative z-10">
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-3">
               <Logo size="sm" lightText className="scale-110" />
               {insuranceConfig?.isFundVisible && (
                 <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md shadow-inner">
                    <ShieldCheck className="h-2.5 w-2.5 text-[#f9a885]" />
                    <span className="text-[8px] text-white/80 uppercase tracking-widest">
                      مغطى: ${insuranceConfig.fundSize?.toLocaleString()}
                    </span>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left space-y-0.5 mr-2">
                <h1 className="text-sm font-normal tracking-tight text-white">{user?.displayName || '...'}</h1>
                <p className="text-[8px] text-white/40 uppercase mt-1">حساب موثق</p>
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
            <button onClick={onDeposit} className="h-16 rounded-[28px] bg-[#f9a885] text-[#002d4d] font-normal text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              <ArrowDown className="h-4 w-4 relative z-10" />
              <span className="relative z-10">إيداع الرصيد</span>
            </button>
            <button onClick={onWithdraw} className="h-16 rounded-[28px] bg-white/5 text-white backdrop-blur-3xl border border-white/10 font-normal text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group">
              <ArrowDownCircle className="h-4 w-4 rotate-180 text-[#f9a885]" />
              <span>سحب الأرباح</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}