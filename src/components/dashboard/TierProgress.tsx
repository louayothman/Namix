
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Users, 
  Gift, 
  Target, 
  ShieldCheck, 
  Loader2, 
  ChevronLeft,
  TrendingUp,
  Wallet,
  Briefcase,
  Sparkles
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

  const statusIcons = [
    { label: "رصيد المحفظة", val: remaining.balance, icon: Wallet, unit: "$" },
    { label: "صافي الأرباح", val: remaining.profits, icon: TrendingUp, unit: "$" },
    { label: "دعوات الشركاء", val: remaining.invites, icon: Users, unit: "" },
    { label: "حجم التداول", val: remaining.historical, icon: Briefcase, unit: "$" }
  ];

  return (
    <div className="space-y-6 font-body" dir="rtl">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
          <h3 className="text-xs font-black text-[#002d4d] uppercase tracking-normal">مسار النمو الاحترافي</h3>
        </div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Growth Intelligence Node</p>
      </div>

      <Card className="border-none shadow-xl rounded-[48px] md:rounded-[56px] bg-white overflow-hidden relative border border-gray-50/50 group transition-all duration-700 hover:shadow-2xl">
        <div className="absolute top-8 left-8 z-20">
           <motion.div 
             animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }} 
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
             className={cn("transition-colors duration-1000", `text-${current.color || 'blue'}-500`)}
           >
              <Award size={48} strokeWidth={1.5} />
           </motion.div>
        </div>

        <CardContent className="p-8 md:p-14 relative z-10 space-y-10">
          <div className="flex flex-col items-start gap-2 pr-2">
             <div className="flex items-center gap-3">
                <h4 className="text-2xl font-black text-[#002d4d] tracking-tight">{current.name}</h4>
                <Badge className={cn("text-[8px] font-black border-none px-3 py-1 rounded-full", `bg-${current.color || 'blue'}-50 text-${current.color || 'blue'}-600`)}>
                   {current.badgeLabel || "ACTIVE"}
                </Badge>
             </div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المستوى الاستراتيجي الحالي</p>
          </div>

          <div className="space-y-6">
             <div className="flex items-end justify-between px-2">
                <p className="text-sm font-black text-blue-600 tabular-nums">%{Math.round(calculatedTier.progress || 0)} <span className="text-[10px] text-gray-300 mr-1 font-bold">مكتمل</span></p>
                <div className="flex items-center gap-1.5 opacity-40">
                   <Sparkles size={10} className="text-blue-500" />
                   <span className="text-[7px] font-black uppercase tracking-widest">Next Target: {next?.name || 'Max Level'}</span>
                </div>
             </div>

             <div className="relative h-1.5 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${calculatedTier.progress || 0}%` }} 
                  transition={{ duration: 2, ease: "circOut" }} 
                  className="absolute right-0 h-full bg-gradient-to-l from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.2)]" 
                />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-10 pt-4">
                {statusIcons.map((req, i) => {
                  const isDone = (req.val || 0) <= 0;
                  return (
                    <div key={i} className="flex flex-col gap-3 group/stat">
                      <div className="flex items-center gap-2 pr-1 transition-all">
                        <req.icon size={14} className={cn("transition-colors duration-500", isDone ? "text-emerald-500" : "text-gray-300")} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{req.label}</span>
                      </div>
                      <div className="flex items-center justify-between pr-2 border-r-2 border-gray-50 transition-colors group-hover/stat:border-blue-500/20">
                         {isDone ? (
                           <div className="flex items-center gap-2">
                              <ShieldCheck size={16} className="text-emerald-500 fill-emerald-50" />
                              <span className="text-[12px] font-black text-emerald-600">مكتمل</span>
                           </div>
                         ) : (
                           <div className="flex flex-col">
                              <span className="text-xl font-black text-[#002d4d] tabular-nums tracking-tighter leading-none">
                                {req.unit}{Number(req.val || 0).toLocaleString()}
                              </span>
                              <span className="text-[8px] text-gray-300 uppercase font-bold mt-1 tracking-widest">متبقي للترقية</span>
                           </div>
                         )}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="pt-4">
            <AnimatePresence mode="wait">
              {hasUnclaimedReward ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="p-6 bg-[#002d4d] rounded-[40px] flex items-center justify-between shadow-2xl relative overflow-hidden group/reward"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
                   <div className="flex items-center gap-5 relative z-10">
                      <div className="h-14 w-14 rounded-2xl bg-[#f9a885] flex items-center justify-center shadow-lg transition-transform group-hover/reward:scale-110">
                        <Gift size={26} className="text-[#002d4d]" />
                      </div>
                      <div className="text-right">
                         <p className="text-[11px] text-white/60 font-bold uppercase tracking-widest">مكافأة الاستحقاق جاهزة</p>
                         <p className="text-3xl font-black text-[#f9a885] tabular-nums tracking-tighter">${current.rewardAmount}</p>
                      </div>
                   </div>
                   <Button onClick={onClaimReward} disabled={processingReward} className="h-14 rounded-2xl bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-xs px-10 shadow-xl active:scale-95 transition-all">
                      {processingReward ? <Loader2 className="h-5 w-5 animate-spin" /> : "استلام المكافأة"}
                   </Button>
                </motion.div>
              ) : next ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 shadow-inner">
                   <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-gray-50 transition-transform hover:rotate-12">
                        <Target size={26} />
                      </div>
                      <div className="text-right space-y-1">
                         <h5 className="font-black text-lg text-[#002d4d]">الهدف القادم: {next.name}</h5>
                         <p className="text-[11px] text-gray-400 font-bold leading-relaxed max-w-[280px]">
                           بانتظارك مكافأة مالية فورية بقيمة <span className="text-[#f9a885] font-black">${next.rewardAmount}</span> عند تحقيق كافة الشروط.
                         </p>
                      </div>
                   </div>
                   <Button 
                     onClick={onDeposit} 
                     className="h-14 w-full md:w-auto rounded-full bg-white border border-gray-200 text-[#002d4d] hover:bg-[#002d4d] hover:text-white font-black text-[10px] px-10 shadow-sm transition-all active:scale-95 group/btn"
                   >
                      تسريع نمو الرتبة <ChevronLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                   </Button>
                </div>
              ) : (
                <div className="p-10 bg-emerald-50/50 rounded-[40px] border border-emerald-100/50 flex flex-col items-center justify-center text-center gap-4">
                   <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center shadow-lg text-emerald-500 animate-bounce">
                      <ShieldCheck size={32} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="font-black text-xl text-emerald-700">لقد بلغت قمة النظام</h4>
                      <p className="text-[11px] text-emerald-600/60 font-bold uppercase tracking-[0.2em]">Sovereign Peak Achievement</p>
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
