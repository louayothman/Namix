
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
  Compass, 
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
  Award,
  ArrowRight
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
  
  const [data, setData] = useState({
    goalId: "",
    targetAmount: "2500",
    months: "6"
  });

  const db = useFirestore();
  
  const marketingDocRef = useMemoFirebase(() => doc(db, "system_settings", "marketing"), [db]);
  const { data: marketingConfig } = useDoc(marketingDocRef);

  const plansQuery = useMemoFirebase(() => query(collection(db, "investment_plans"), where("isActive", "==", true)), [db]);
  const { data: plans } = useCollection(plansQuery);

  const availableGoals = useMemo(() => {
    return marketingConfig?.simulatorGoals || [];
  }, [marketingConfig]);

  const selectedGoal = useMemo(() => {
    return availableGoals.find((g: any) => g.id === data.goalId);
  }, [data.goalId, availableGoals]);

  const strategy = useMemo(() => {
    if (!plans || plans.length === 0 || !selectedGoal) return null;
    
    const target = Number(data.targetAmount);
    const months = Number(data.months);
    const targetDays = months * 30;
    const MAX_TRIAL_CAPITAL = marketingConfig?.guidanceMaxInitialCapital || 1000;

    let pool = plans;
    if (selectedGoal.linkedPlanId && selectedGoal.linkedPlanId !== "none") {
      pool = plans.filter(p => p.id === selectedGoal.linkedPlanId);
    }
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

    let best = results
      .filter(r => r.requiredInitial <= MAX_TRIAL_CAPITAL)
      .sort((a, b) => b.plan.profitPercent - a.plan.profitPercent)[0];

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

    return {
      plan: best.plan,
      requiredCapital,
      finalExpected,
      cycles: best.cycles,
      isCapped,
      logic: `تم اختيار بروتوكول ${best.plan.title} (عائد %${best.plan.profitPercent})؛ سنعتمد استراتيجية التدوير المركب لـ ${best.cycles} دورة تشغيلية للوصول للهدف.`
    };
  }, [plans, data, marketingConfig, selectedGoal]);

  const handleStartAnalysis = () => {
    setLoading(true);
    setStep("calculating");
    setTimeout(() => {
      setLoading(false);
      setStep("blueprint");
    }, 2500);
  };

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = { Plane, Car, Briefcase, Home, Target, Ship, Gem, Award };
    const IconComp = iconMap[iconName] || Target;
    return <IconComp className="h-6 w-6" />;
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right">
        
        {/* Header - Luxury Style */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" />
              Sovereign Guidance Compass
            </div>
            <h1 className="text-3xl font-black text-[#002d4d]">بوصلة التوجيه</h1>
            <p className="text-muted-foreground font-bold text-[10px]">هندسة المسار المالي لتحقيق طموحاتك الاستثمارية.</p>
          </div>
          <button onClick={() => router.back()} className="h-12 w-12 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center text-[#002d4d] active:scale-95 transition-all">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Step Content */}
        <div className="relative">
          {step === "goal" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-black text-[#002d4d]">ما هو هدفك المالي القادم؟</h2>
                <p className="text-[11px] text-gray-400 font-bold leading-relaxed">اختر طموحك وسنقوم بحساب رأس المال والدورات الاستثمارية اللازمة للوصول إليه.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {availableGoals.map((goal: any) => (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setData({ ...data, goalId: goal.id, targetAmount: goal.target.toString() });
                    }}
                    className={cn(
                      "p-6 rounded-[40px] border-2 flex flex-col items-center gap-4 transition-all active:scale-95 text-center relative overflow-hidden group",
                      data.goalId === goal.id 
                        ? "border-[#002d4d] bg-[#002d4d]/5 shadow-xl" 
                        : "border-gray-50 bg-white hover:border-blue-100"
                    )}
                  >
                    <div className={cn("h-14 w-14 rounded-[22px] flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110", data.goalId === goal.id ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-blue-500")}>
                      {getIcon(goal.icon)}
                    </div>
                    <div className="space-y-1">
                      <span className={cn("font-black text-sm block", data.goalId === goal.id ? "text-[#002d4d]" : "text-gray-500")}>{goal.labelAr}</span>
                      <span className="text-[10px] font-bold text-gray-300 tabular-nums">${goal.target.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>

              <Button 
                disabled={!data.goalId}
                onClick={() => setStep("parameters")}
                className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-2xl transition-all active:scale-95"
              >
                تحديد الجدول الزمني
              </Button>
            </div>
          )}

          {step === "parameters" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="p-8 bg-[#002d4d] rounded-[48px] text-white flex items-center justify-between relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none">
                    {getIcon(selectedGoal?.icon || "Target")}
                 </div>
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                       {getIcon(selectedGoal?.icon || "Target")}
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em]">Active Goal Milestone</p>
                       <h4 className="text-2xl font-black">{selectedGoal?.labelAr}</h4>
                    </div>
                 </div>
              </div>

              <div className="space-y-8 px-2">
                <div className="space-y-3">
                  <Label className="font-black text-[#002d4d] text-xs pr-4 uppercase tracking-widest">المبلغ المستهدف (Target Amount $)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={data.targetAmount}
                      onChange={e => setData({...data, targetAmount: e.target.value})}
                      className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl text-[#002d4d] shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <Coins className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-100" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-black text-[#002d4d] text-xs pr-4 uppercase tracking-widest">الجدول الزمني للتحقيق (شهور)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={data.months}
                      onChange={e => setData({...data, months: e.target.value})}
                      className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl text-blue-600 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <Clock className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-100" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleStartAnalysis}
                  className="w-full h-16 rounded-full bg-[#002d4d] text-[#f9a885] font-black text-lg shadow-2xl active:scale-95 transition-all"
                >
                  تشغيل محرك الهندسة المالية
                </Button>
                <button onClick={() => setStep("goal")} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#002d4d] text-center">تغيير الهدف المختار</button>
              </div>
            </div>
          )}

          {step === "calculating" && (
            <div className="flex flex-col items-center justify-center py-32 gap-8 animate-in zoom-in-95 duration-1000">
              <div className="relative">
                <div className="h-24 w-24 border-[4px] border-gray-100 border-t-[#f9a885] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="h-8 w-8 text-[#002d4d] animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-xl font-black text-[#002d4d]">جاري محاكاة تدوير الأرباح...</h4>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] animate-pulse">Calculating Compounding Cycles & Yield Nodes</p>
              </div>
            </div>
          )}

          {step === "blueprint" && strategy && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              
              {/* Financial Blueprint Card */}
              <div className="p-10 bg-[#002d4d] rounded-[64px] text-white relative overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,45,77,0.3)]">
                <div className="absolute top-0 left-0 p-10 opacity-[0.05] pointer-events-none group-hover:scale-150 transition-transform duration-1000">
                  <Repeat className="h-48 w-48" />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center">
                     <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest">Compound Blueprint Verified</Badge>
                     <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  </div>
                  
                  <div className="text-right">
                     <p className="text-[10px] text-blue-200/40 font-black uppercase tracking-widest mb-1">Recommended Initial Inflow</p>
                     <h3 className="text-5xl font-black tabular-nums tracking-tighter">${strategy.requiredCapital.toLocaleString()}</h3>
                     <p className="text-xs font-bold text-white/60 mt-2">رأس مال البداية المقترح لتدوير الأرباح.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 text-right">
                        <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Estimated Goal</p>
                        <p className="text-2xl font-black tabular-nums text-[#f9a885]">${strategy.finalExpected.toLocaleString()}</p>
                     </div>
                     <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 text-right">
                        <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Operating Cycles</p>
                        <p className="text-2xl font-black tabular-nums text-emerald-400">{strategy.cycles} دورات</p>
                     </div>
                  </div>
                </div>
              </div>

              {strategy.isCapped && (
                <div className="p-6 bg-orange-50 rounded-[32px] border border-orange-100 flex items-start gap-4 shadow-inner">
                   <ShieldAlert className="h-6 w-6 text-orange-500 shrink-0 mt-1" />
                   <p className="text-[12px] font-bold text-orange-800 leading-relaxed text-right">تنبيه سيولة: تم تقييد رأس مال البداية بمبلغ ${ (marketingConfig?.guidanceMaxInitialCapital || 1000).toLocaleString() } بناءً على حدود المرحلة التجريبية الحالية. تم تعديل الهدف النهائي ليتناسب مع هذا السقف.</p>
                </div>
              )}

              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 space-y-4 shadow-inner group">
                 <div className="flex items-center gap-3 pr-1">
                    <Lightbulb className="h-5 w-5 text-blue-600 group-hover:rotate-12 transition-transform" />
                    <h5 className="font-black text-sm text-[#002d4d]">منطق الاستراتيجية (Strategy Rationale)</h5>
                 </div>
                 <p className="text-[13px] font-bold text-gray-500 leading-[2] pr-1">
                    {strategy.logic}
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-2 px-4">
                    <TrendingUp className="h-4 w-4 text-[#f9a885]" />
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Execution Roadmap Protocol</span>
                 </div>
                 
                 <div className="grid gap-4">
                    <div className="p-6 bg-white rounded-[40px] border border-gray-50 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all border-r-[6px] border-r-blue-500">
                       <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner font-black text-sm">1</div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 01: Liquidity Injection</p>
                             <p className="text-lg font-black text-[#002d4d]">شحن المحفظة بمبلغ ${strategy.requiredCapital.toLocaleString()}</p>
                          </div>
                       </div>
                       <Button 
                         onClick={() => setDepositOpen(true)}
                         className="h-12 w-full rounded-2xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-black text-xs border-none shadow-sm transition-all active:scale-95"
                       >
                          <ArrowUpRight className="ml-2 h-4 w-4" /> تنفيذ الإيداع المعتمد
                       </Button>
                    </div>

                    <div className="p-6 bg-white rounded-[40px] border border-gray-50 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all border-r-[6px] border-r-emerald-500">
                       <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-[18px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner font-black text-sm">2</div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 02: Protocol Activation</p>
                             <p className="text-lg font-black text-[#002d4d]">تفعيل بروتوكول {strategy.plan.title}</p>
                          </div>
                       </div>
                       <Button 
                         onClick={() => router.push(`/invest?planId=${strategy.plan.id}`)}
                         className="h-12 w-full rounded-2xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 font-black text-xs border-none shadow-sm transition-all active:scale-95"
                       >
                          <Zap className="ml-2 h-4 w-4" /> تفعيل العقد الاستراتيجي
                       </Button>
                    </div>

                    <div className="p-8 bg-gray-50/50 rounded-[40px] border border-gray-50 flex items-start gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-white text-orange-500 flex items-center justify-center shadow-sm shrink-0">
                          <Repeat className="h-6 w-6" />
                       </div>
                       <div className="text-right space-y-2">
                          <p className="text-xs font-black text-[#002d4d]">حوكمة التدوير المركب</p>
                          <p className="text-[12px] font-bold text-gray-400 leading-[2]">لتحقيق هذا الهدف، يجب تكرار العملية {strategy.cycles} مرات. في كل مرة، قم باستثمار "الأصل + الربح" بالكامل. يمكنك أتمتة ذلك عبر خيار Auto-Invest في ملفك الشخصي.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={() => { setStep("goal"); setData({ goalId: "", targetAmount: "2500", months: "6" }); }}
                  variant="ghost"
                  className="w-full text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2"
                >
                  <Repeat className="h-3 w-3" /> إعادة تصميم المسار الاستراتيجي
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
    </Shell>
  );
}
