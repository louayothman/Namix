
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Target, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Plane, 
  Car, 
  Home, 
  Briefcase,
  ShieldCheck,
  Coins,
  Loader2,
  Lightbulb,
  ShieldAlert,
  Repeat,
  ArrowUpRight,
  ChevronLeft,
  Ship,
  Gem,
  Award
} from "lucide-react";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { DepositSheet } from "@/components/deposit/DepositSheet";

type GuidanceStep = "goal" | "parameters" | "calculating" | "blueprint";

export default function GuidancePage() {
  const [step, setStep] = useState<GuidanceStep>("goal");
  const [loading, setLoading] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const router = useRouter();
  const [data, setData] = useState({ goalId: "", targetAmount: "2500", months: "6" });
  const db = useFirestore();
  const marketingDocRef = useMemoFirebase(() => doc(db, "system_settings", "marketing"), [db]);
  const { data: marketingConfig } = useDoc(marketingDocRef);
  const plansQuery = useMemoFirebase(() => query(collection(db, "investment_plans"), where("isActive", "==", true)), [db]);
  const { data: plans } = useCollection(plansQuery);
  const availableGoals = useMemo(() => marketingConfig?.simulatorGoals || [], [marketingConfig]);
  const selectedGoal = useMemo(() => availableGoals.find((g: any) => g.id === data.goalId), [data.goalId, availableGoals]);

  const strategy = useMemo(() => {
    if (!plans || plans.length === 0 || !selectedGoal) return null;
    const target = Number(data.targetAmount);
    const months = Number(data.months);
    const targetDays = months * 30;
    const MAX_TRIAL_CAPITAL = marketingConfig?.guidanceMaxInitialCapital || 1000;
    let pool = plans;
    if (selectedGoal.linkedPlanId && selectedGoal.linkedPlanId !== "none") pool = plans.filter(p => p.id === selectedGoal.linkedPlanId);
    if (pool.length === 0) pool = plans;
    const results = pool.map(plan => {
      let durationInDays = plan.durationValue || 1;
      if (plan.durationUnit === 'hours') durationInDays = plan.durationValue / 24;
      if (plan.durationUnit === 'minutes') durationInDays = plan.durationValue / 1440;
      const profitFactor = 1 + (plan.profitPercent / 100);
      const cycles = Math.floor(targetDays / durationInDays);
      const requiredInitial = target / Math.pow(profitFactor, cycles);
      return { plan, requiredInitial, cycles, durationInDays, profitFactor };
    });
    let best = results.filter(r => r.requiredInitial <= MAX_TRIAL_CAPITAL).sort((a, b) => b.plan.profitPercent - a.plan.profitPercent)[0];
    let isCapped = false;
    let requiredCapital = 0;
    let finalExpected = 0;
    if (best) {
      requiredCapital = Math.ceil(best.requiredInitial);
      finalExpected = target;
    } else {
      best = results.sort((a, b) => b.plan.profitPercent - a.plan.profitPercent)[0];
      requiredCapital = MAX_TRIAL_CAPITAL;
      finalExpected = Math.floor(MAX_TRIAL_CAPITAL * Math.pow(best.profitFactor, best.cycles));
      isCapped = true;
    }
    return { plan: best.plan, requiredCapital, finalExpected, cycles: best.cycles, isCapped, logic: `تم اختيار بروتوكول ${best.plan.title} (عائد %${best.plan.profitPercent})؛ سنعتمد استراتيجية التدوير المركب لـ ${best.cycles} دورة تشغيلية للوصول للهدف.` };
  }, [plans, data, marketingConfig, selectedGoal]);

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = { Plane, Car, Briefcase, Home, Target, Ship, Gem, Award };
    const IconComp = iconMap[iconName] || Target;
    return <IconComp className="h-6 w-6" />;
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.3em]"><Sparkles className="h-3 w-3" />Sovereign Guidance Compass</div>
            <h1 className="text-3xl font-black text-[#002d4d]">بوصلة التوجيه</h1>
            <p className="text-muted-foreground font-bold text-[10px]">هندسة المسار المالي لتحقيق طموحاتك الاستثمارية.</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-12 w-12 border border-gray-50 active:scale-95 transition-all"><ChevronRight className="h-6 w-6 text-[#002d4d]" /></Button>
        </div>

        {step === "goal" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-2 gap-4">
              {availableGoals.map((goal: any) => (
                <button key={goal.id} onClick={() => setData({ ...data, goalId: goal.id, targetAmount: goal.target.toString() })} className={cn("p-6 rounded-[40px] border-2 flex flex-col items-center gap-4 transition-all active:scale-95 text-center relative overflow-hidden group", data.goalId === goal.id ? "border-[#002d4d] bg-[#002d4d]/5 shadow-xl" : "border-gray-50 bg-white hover:border-blue-100")}>
                  <div className={cn("h-14 w-14 rounded-[22px] flex items-center justify-center shadow-inner", data.goalId === goal.id ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-blue-500")}>{getIcon(goal.icon)}</div>
                  <div className="space-y-1">
                    <span className={cn("font-black text-sm block", data.goalId === goal.id ? "text-[#002d4d]" : "text-gray-500")}>{goal.labelAr}</span>
                    <span className="text-[10px] font-bold text-gray-300">${goal.target.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
            <Button disabled={!data.goalId} onClick={() => setStep("parameters")} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-2xl">تحديد الجدول الزمني</Button>
          </div>
        )}

        {step === "parameters" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="p-8 bg-[#002d4d] rounded-[48px] text-white flex items-center justify-between relative overflow-hidden">
               <div className="flex items-center gap-6 relative z-10">
                  <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">{getIcon(selectedGoal?.icon || "Target")}</div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em]">Active Goal Milestone</p>
                     <h4 className="text-2xl font-black">{selectedGoal?.labelAr}</h4>
                  </div>
               </div>
            </div>
            <div className="space-y-8 px-2">
              <div className="space-y-3">
                <Label className="font-black text-[#002d4d] text-xs pr-4 uppercase tracking-widest">المبلغ المستهدف ($)</Label>
                <Input type="number" value={data.targetAmount} onChange={e => setData({...data, targetAmount: e.target.value})} className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl text-[#002d4d]" />
              </div>
              <div className="space-y-3">
                <Label className="font-black text-[#002d4d] text-xs pr-4 uppercase tracking-widest">الجدول الزمني (شهور)</Label>
                <Input type="number" value={data.months} onChange={e => setData({...data, months: e.target.value})} className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl text-blue-600" />
              </div>
            </div>
            <Button onClick={() => { setStep("calculating"); setTimeout(() => setStep("blueprint"), 2500); }} className="w-full h-16 rounded-full bg-[#002d4d] text-[#f9a885] font-black text-lg">تشغيل محرك الهندسة المالية</Button>
          </div>
        )}

        {step === "calculating" && (
          <div className="flex flex-col items-center justify-center py-32 gap-8">
            <div className="h-24 w-24 border-[4px] border-gray-100 border-t-[#f9a885] rounded-full animate-spin" />
            <p className="text-xl font-black text-[#002d4d]">جاري محاكاة تدوير الأرباح...</p>
          </div>
        )}

        {step === "blueprint" && strategy && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="p-10 bg-[#002d4d] rounded-[64px] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-8">
                <div className="text-right">
                   <p className="text-[10px] text-blue-200/40 font-black uppercase tracking-widest">Recommended Initial Inflow</p>
                   <h3 className="text-5xl font-black tabular-nums tracking-tighter">${strategy.requiredCapital.toLocaleString()}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 text-right">
                      <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Estimated Goal</p>
                      <p className="text-2xl font-black text-[#f9a885]">${strategy.finalExpected.toLocaleString()}</p>
                   </div>
                   <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 text-right">
                      <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Operating Cycles</p>
                      <p className="text-2xl font-black text-emerald-400">{strategy.cycles} دورات</p>
                   </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 space-y-4 shadow-inner">
               <div className="flex items-center gap-3 pr-1"><Lightbulb className="h-5 w-5 text-blue-600" /><h5 className="font-black text-sm text-[#002d4d]">منطق الاستراتيجية</h5></div>
               <p className="text-[13px] font-bold text-gray-500 leading-[2] pr-1">{strategy.logic}</p>
            </div>
            <div className="grid gap-4">
               <Button onClick={() => setDepositOpen(true)} className="h-16 rounded-[28px] bg-blue-600 text-white font-black">تعزيز السيولة بمبلغ ${strategy.requiredCapital}</Button>
               <Button onClick={() => router.push(`/invest?planId=${strategy.plan.id}`)} className="h-16 rounded-[28px] bg-[#002d4d] text-white font-black">تفعيل عقد {strategy.plan.title}</Button>
            </div>
          </div>
        )}
      </div>
      <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
    </Shell>
  );
}
