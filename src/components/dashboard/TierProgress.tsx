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
  Briefcase
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

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
          <h3 className="text-xs font-normal text-[#002d4d] uppercase">مسار النمو الاحترافي</h3>
        </div>
        <p className="text-[8px] text-gray-400 uppercase tracking-widest">Growth Intelligence Node</p>
      </div>

      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden relative border border-gray-50/50 group">
        <div className="absolute top-8 left-8 z-20">
           <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="text-[#f9a885]">
              <Award size={48} strokeWidth={1.5} />
           </motion.div>
        </div>

        <CardContent className="p-10 md:p-14 relative z-10 space-y-10">
          <div className="flex flex-col items-start gap-2 pr-2">
             <div className="flex items-center gap-3">
                <h4 className="text-2xl font-normal text-[#002d4d] tracking-tight">{current.name}</h4>
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">المستوى الحالي في النظام</p>
          </div>

          <div className="space-y-6">
             <div className="flex items-end justify-between px-2">
                <p className="text-sm font-normal text-blue-600 tabular-nums">%{Math.round(calculatedTier.progress || 0)} <span className="text-[10px] text-gray-300 mr-1">مكتمل</span></p>
                <Badge variant="outline" className="border-gray-100 text-gray-400 font-normal text-[8px] px-3 py-1 rounded-lg">
                   LEVEL: {current.badgeLabel || "ACTIVE"}
                </Badge>
             </div>

             <div className="relative h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${calculatedTier.progress || 0}%` }} transition={{ duration: 2 }} className="absolute right-0 h-full bg-blue-600 rounded-full" />
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-10 pt-4">
                {[
                  { label: "رصيد المحفظة", val: remaining.balance, icon: Wallet, unit: "$" },
                  { label: "صافي الأرباح", val: remaining.profits, icon: TrendingUp, unit: "$" },
                  { label: "دعوات الشركاء", val: remaining.invites, icon: Users, unit: "" },
                  { label: "حجم التداول", val: remaining.historical, icon: Briefcase, unit: "$" }
                ].map((req, i) => {
                  const isDone = (req.val || 0) <= 0;
                  return (
                    <div key={i} className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 pr-1">
                        <req.icon size={12} className={cn(isDone ? "text-emerald-500" : "text-gray-300")} />
                        <span className="text-[9px] font-normal text-gray-400 uppercase">{req.label}</span>
                      </div>
                      <div className="flex items-center justify-between pr-1 border-r-2 border-gray-50">
                         {isDone ? (
                           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /><span className="text-[11px] font-normal text-emerald-600">مكتمل</span></div>
                         ) : (
                           <div className="flex flex-col">
                              <span className="text-lg font-normal text-[#002d4d] tabular-nums tracking-tighter">{req.unit}{Number(req.val || 0).toLocaleString()}</span>
                              <span className="text-[7px] text-gray-300 uppercase">متبقي</span>
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-[#002d4d] rounded-[36px] flex items-center justify-between shadow-2xl relative overflow-hidden">
                   <div className="flex items-center gap-5 relative z-10">
                      <div className="h-12 w-12 rounded-[18px] bg-[#f9a885] flex items-center justify-center"><Gift size={22} className="text-[#002d4d]" /></div>
                      <div className="text-right">
                         <p className="text-[11px] text-white/60">مكافأة الاستحقاق جاهزة</p>
                         <p className="text-2xl font-normal text-[#f9a885] tabular-nums">${current.rewardAmount}</p>
                      </div>
                   </div>
                   <Button onClick={onClaimReward} disabled={processingReward} className="h-12 rounded-2xl bg-[#f9a885] text-[#002d4d] font-normal text-xs px-8 shadow-xl">
                      {processingReward ? <Loader2 className="h-4 w-4 animate-spin" /> : "استلام المكافأة"}
                   </Button>
                </motion.div>
              ) : next ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50/50 rounded-[36px] border border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-[18px] bg-white flex items-center justify-center text-blue-500 shadow-sm"><Target size={20} /></div>
                      <div className="text-right">
                         <p className="text-sm font-normal text-[#002d4d]">الهدف القادم: {next.name}</p>
                         <p className="text-[9px] text-gray-400 mt-1">بانتظارك مكافأة عند الترقية بقيمة <span className="text-[#f9a885] font-normal">${next.rewardAmount}</span>.</p>
                      </div>
                   </div>
                   <Button onClick={onDeposit} variant="ghost" className="h-11 rounded-2xl bg-white text-[#002d4d] font-normal text-[10px] px-8 shadow-sm hover:bg-[#002d4d] hover:text-[#f9a885] transition-all">
                      تسريع النمو <ChevronLeft className="mr-2 h-4 w-4" />
                   </Button>
                </div>
              ) : (
                <div className="p-6 bg-emerald-50/50 rounded-[36px] border border-emerald-100/50 flex items-center justify-center gap-4">
                   <ShieldCheck size={16} className="text-emerald-500" />
                   <p className="text-[11px] text-emerald-700 uppercase tracking-widest">لقد بلغت قمة مستويات النظام المتقدم</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}