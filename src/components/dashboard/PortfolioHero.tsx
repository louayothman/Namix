
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, ArrowDown, ArrowDownCircle, UserCircle, TrendingUp, ShieldCheck, Zap } from "lucide-react";
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
 * @fileOverview نبض المحفظة المورفي v9.5 - Sharp Top Edition
 * تم تصفير الحواف العلوية لتندمج المحفظة مع سقف الصفحة، مع الحفاظ على المفاعل السائل.
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
      <Card className="border-none shadow-[0_48px_100px_-12px_rgba(0,45,77,0.3)] rounded-t-none rounded-b-[64px] bg-[#8899AA] text-white overflow-hidden relative group transition-all duration-1000">
        
        {/* Sovereign Morphing Background Engine */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
           
           {/* المفاعل المورفي المركزي السائل */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
              
              {/* الترددات والنبضات المورفية المحيطة */}
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

              {/* الكائن المورفي الرئيسي */}
              <motion.div
                animate={{ 
                  borderRadius: [
                    "30% 70% 70% 30% / 30% 30% 70% 70%",
                    "50% 50% 20% 80% / 25% 80% 20% 75%",
                    "67% 33% 47% 53% / 37% 20% 80% 63%",
                    "30% 70% 70% 30% / 30% 30% 70% 70%"
                  ],
                  rotate: [0, 360],
                  scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-gradient-to-tr from-white/10 via-blue-100/5 to-transparent blur-[20px] shadow-[inset_0_0_50px_rgba(255,255,255,0.1)]"
              />
           </div>

           {/* إضاءات الأطراف التكيفية */}
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               opacity: [0.1, 0.2, 0.1],
             }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-200/10 rounded-full blur-[100px]" 
           />
        </div>

        <CardContent className="p-8 md:p-12 pt-12 md:pt-16 space-y-12 relative z-10">
          
          {/* Top Identity Node */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-3">
               <Logo size="sm" lightText className="scale-110" />
               
               {insuranceConfig?.isFundVisible && (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md shadow-inner group/protect"
                 >
                    <ShieldCheck className="h-2.5 w-2.5 text-[#f9a885] group-hover/protect:scale-110 transition-transform" />
                    <span className="text-[7px] font-black text-white/80 uppercase tracking-widest leading-none">
                      Covered: ${insuranceConfig.fundSize?.toLocaleString()}
                    </span>
                 </motion.div>
               )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left space-y-0.5 mr-2">
                <h1 className="text-sm font-black tracking-tight leading-none text-white">{user?.displayName || '...'}</h1>
                <p className="text-[7px] text-white/40 font-black uppercase tracking-[0.2em] mt-1 text-left">Verified Sovereign</p>
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

          {/* Master Balance Display */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                 الرصيد <span className="text-[7px] opacity-40 ml-1 font-bold">Balance</span>
               </span>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl md:text-8xl font-black leading-none drop-shadow-[0_25px_50px_rgba(0,0,0,0.2)] tabular-nums tracking-tighter flex items-baseline gap-3 text-white"
            >
              <span className="text-white/20 text-3xl md:text-4xl font-bold">$</span>
              {(user?.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.h2>

            <div className="grid grid-cols-2 gap-0 mt-8 pt-2 w-full relative">
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-[0.5px] bg-white/10" />

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
                    <TrendingUp size={12} className="text-[#f9a885] opacity-40" />
                    <p className="text-xl font-black text-[#f9a885] tabular-nums tracking-tighter">
                      +${totalLiveProfits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Strategic Actions */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <button 
              onClick={onDeposit}
              className="h-16 rounded-[28px] bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-orange-900/20 group relative overflow-hidden"
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
