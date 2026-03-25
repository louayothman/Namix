
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Users, 
  Gift, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Loader2, 
  ChevronLeft,
  TrendingUp,
  Wallet,
  Briefcase,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TierProgressProps {
  calculatedTier: any;
  referralCount: number;
  hasUnclaimedReward: boolean;
  processingReward: boolean;
  rewardNotice: string | null;
  onClaimReward: () => void;
  onDeposit: () => void;
}

/**
 * @fileOverview خارطة طريق النمو v8.0 - Sovereign Spirit Edition
 * تصميم نابض بالحياة يعتمد على البيانات الصافية والأيقونات الحرة في الزوايا.
 * تم إلغاء البطاقات الفرعية لضمان رشاقة قصوى وفخامة بصرية.
 */
export function TierProgress({ 
  calculatedTier, 
  hasUnclaimedReward, 
  processingReward, 
  onClaimReward, 
  onDeposit 
}: TierProgressProps) {
  if (!calculatedTier) return null;

  const current = calculatedTier.current;
  const next = calculatedTier.next;
  const remaining = calculatedTier.remaining || { balance: 0, profits: 0, invites: 0, historical: 0 };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-body" dir="rtl">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse shadow-[0_0_8px_#f9a885]" />
          <h3 className="text-xs font-black text-[#002d4d] uppercase tracking-wider">خارطة طريق النمو</h3>
        </div>
        <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.4em]">Growth Intelligence Engine</p>
      </div>

      <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,45,77,0.12)] rounded-[56px] bg-white overflow-hidden relative border border-gray-50/50 group transition-all duration-1000 hover:shadow-[0_48px_80px_-20px_rgba(0,45,77,0.18)]">
        
        {/* Sovereign Rank Icon - Floating in the Corner (Orange & Direct) */}
        <div className="absolute top-8 left-8 z-20">
           <motion.div
             animate={{ 
               y: [0, -5, 0],
               rotate: [0, 5, 0]
             }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="text-[#f9a885] drop-shadow-[0_10px_20px_rgba(249,168,133,0.3)]"
           >
              <Award size={48} strokeWidth={1.5} />
           </motion.div>
        </div>

        {/* Soul Particles - Background Vibrancy */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
           <motion.div 
             animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
             transition={{ duration: 20, repeat: Infinity }}
             className="absolute top-10 right-20 text-[#002d4d]"
           >
              <Sparkles size={120} />
           </motion.div>
           <motion.div 
             animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
             transition={{ duration: 15, repeat: Infinity }}
             className="absolute bottom-10 left-40 text-[#f9a885]"
           >
              <Zap size={80} />
           </motion.div>
        </div>

        <CardContent className="p-10 md:p-14 relative z-10 space-y-10">
          
          {/* Top Identity Block */}
          <div className="flex flex-col items-start gap-2 pr-2">
             <div className="flex items-center gap-3">
                <h4 className="text-2xl font-black text-[#002d4d] tracking-tight">{current.name}</h4>
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
               المستوى الاستراتيجي الحالي
             </p>
          </div>

          {/* Core Progress Hub */}
          <div className="space-y-6">
             <div className="flex items-end justify-between px-2">
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Progress to Next Milestone</p>
                   <p className="text-sm font-black text-blue-600 tabular-nums">%{Math.round(calculatedTier.progress || 0)} <span className="text-[10px] text-gray-300 font-bold mr-1">مكتمل</span></p>
                </div>
                <div className="text-left">
                   <Badge variant="outline" className="border-gray-100 text-gray-400 font-black text-[8px] px-3 py-1 rounded-lg">
                      LEVEL: {current.badgeLabel || "OPERATIONAL"}
                   </Badge>
                </div>
             </div>

             {/* Light Path Progress Bar */}
             <div className="relative h-1 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculatedTier.progress || 0}%` }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="absolute right-0 h-full bg-gradient-to-l from-[#002d4d] via-blue-600 to-indigo-400 rounded-full"
                >
                   <motion.div 
                     animate={{ x: ['100%', '-100%'] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                   />
                </motion.div>
             </div>

             {/* Requirements Stream - Simplified No-Card Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-10 pt-4">
                {[
                  { label: "رصيد المحفظة", val: remaining.balance, icon: Wallet, unit: "$" },
                  { label: "صافي الأرباح", val: remaining.profits, icon: TrendingUp, unit: "$" },
                  { label: "دعوات الشركاء", val: remaining.invites, icon: Users, unit: "" },
                  { label: "حجم التداول", val: remaining.historical, icon: Briefcase, unit: "$" }
                ].map((req, i) => {
                  const isDone = (req.val || 0) <= 0;
                  return (
                    <div key={i} className="flex flex-col gap-2.5 transition-all duration-700">
                      <div className="flex items-center gap-2 pr-1">
                        <req.icon size={12} className={cn(isDone ? "text-emerald-500" : "text-gray-300")} />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{req.label}</span>
                      </div>
                      <div className="flex items-center justify-between pr-1 border-r-2 border-gray-50">
                         {isDone ? (
                           <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
                              <ShieldCheck size={14} className="text-emerald-500" />
                              <span className="text-[11px] font-black text-emerald-600">مكتمل</span>
                           </div>
                         ) : (
                           <div className="flex flex-col">
                              <span className="text-lg font-black text-[#002d4d] tabular-nums tracking-tighter">
                                {req.unit}{Number(req.val || 0).toLocaleString()}
                              </span>
                              <span className="text-[7px] font-bold text-gray-300 uppercase leading-none">Remaining</span>
                           </div>
                         )}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Integrated Action Reward Block */}
          <div className="pt-4">
            <AnimatePresence mode="wait">
              {hasUnclaimedReward ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 bg-[#002d4d] rounded-[36px] flex items-center justify-between shadow-2xl shadow-blue-900/30 group/reward overflow-hidden relative border border-white/10"
                >
                   {/* Golden Shimmer Effect */}
                   <motion.div 
                     animate={{ x: ['-100%', '200%'] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#f9a885]/10 to-transparent skew-x-[-25deg]"
                   />
                   
                   <div className="flex items-center gap-5 relative z-10">
                      <div className="h-12 w-12 rounded-[18px] bg-[#f9a885] flex items-center justify-center shadow-lg shadow-orange-900/20">
                         <Gift size={22} className="text-[#002d4d] animate-bounce" />
                      </div>
                      <div className="text-right">
                         <p className="text-[11px] font-black text-white/60 leading-none">مكافأة الاستحقاق جاهزة</p>
                         <div className="flex items-baseline gap-1 mt-1.5">
                            <span className="text-2xl font-black text-[#f9a885] tabular-nums">${current.rewardAmount}</span>
                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Inflow</span>
                         </div>
                      </div>
                   </div>
                   <Button 
                     onClick={onClaimReward} 
                     disabled={processingReward}
                     className="h-12 rounded-2xl bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-xs px-8 relative z-10 active:scale-95 transition-all shadow-xl"
                   >
                      {processingReward ? <Loader2 className="h-4 w-4 animate-spin" /> : "استلام المكافأة"}
                   </Button>
                </motion.div>
              ) : next ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50/50 rounded-[36px] border border-gray-100 group/next">
                   <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-[18px] bg-white flex items-center justify-center text-blue-500 shadow-sm transition-transform group-hover/next:scale-110">
                         <Target size={20} />
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-[#002d4d]">الهدف القادم: {next.name}</p>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md">NEW REWARD</Badge>
                         </div>
                         <p className="text-[9px] font-bold text-gray-400 mt-1">بانتظارك مكافأة سيادية بقيمة <span className="text-[#f9a885] font-black">${next.rewardAmount}</span> عند الترقية.</p>
                      </div>
                   </div>
                   <Button 
                     onClick={onDeposit}
                     variant="ghost" 
                     className="h-11 rounded-2xl bg-white text-[#002d4d] font-black text-[10px] px-8 shadow-sm hover:bg-[#002d4d] hover:text-[#f9a885] transition-all group/btn active:scale-95"
                   >
                      تسريع مسار النمو <ChevronLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                   </Button>
                </div>
              ) : (
                <div className="p-6 bg-emerald-50/50 rounded-[36px] border border-emerald-100/50 flex items-center justify-center gap-4">
                   <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                      <ShieldCheck size={16} />
                   </div>
                   <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">لقد بلغت قمة بروتوكول السيادة المالية</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
