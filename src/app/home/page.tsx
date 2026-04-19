
"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, onSnapshot, doc, orderBy, increment, limit, addDoc, updateDoc } from "firebase/firestore";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { useMarketSync } from "@/hooks/use-market-sync";
import { Logo } from "@/components/layout/Logo";
import { motion } from "framer-motion";

const PortfolioHero = dynamic(() => import("@/components/dashboard/PortfolioHero").then(m => ({ default: m.PortfolioHero })), { ssr: false });
const EliteWatchlist = dynamic(() => import("@/components/dashboard/EliteWatchlist").then(m => ({ default: m.EliteWatchlist })), { ssr: false });
const FeaturedProtocols = dynamic(() => import("@/components/dashboard/FeaturedProtocols").then(m => ({ default: m.FeaturedProtocols })), { ssr: false });
const ServiceGateway = dynamic(() => import("@/components/dashboard/ServiceGateway").then(m => ({ default: m.ServiceGateway })), { ssr: false });
const InvestmentInventory = dynamic(() => import("@/components/dashboard/InvestmentInventory").then(m => ({ default: m.InvestmentInventory })), { ssr: false });
const TierProgress = dynamic(() => import("@/components/dashboard/TierProgress").then(m => ({ default: m.TierProgress })), { ssr: false });
const YieldSimulator = dynamic(() => import("@/components/dashboard/YieldSimulator").then(m => ({ default: m.YieldSimulator })), { ssr: false });
const NewsTicker = dynamic(() => import("@/components/dashboard/NewsTicker").then(m => ({ default: m.NewsTicker })), { ssr: false });
const UpcomingEvents = dynamic(() => import("@/components/dashboard/UpcomingEvents").then(m => ({ default: m.UpcomingEvents })), { ssr: false });
const GuidanceCenter = dynamic(() => import("@/components/dashboard/GuidanceCenter").then(m => ({ default: m.GuidanceCenter })), { ssr: false });
const ActivationDialog = dynamic(() => import("@/components/invest/ActivationDialog").then(m => ({ default: m.ActivationDialog })), { ssr: false });
const DepositSheet = dynamic(() => import("@/components/deposit/DepositSheet").then(m => ({ default: m.DepositSheet })), { ssr: false });
const WithdrawSheet = dynamic(() => import("@/components/withdraw/WithdrawSheet").then(m => ({ default: m.WithdrawSheet })), { ssr: false });

const SectionLoader = () => (
  <div className="flex flex-col items-center justify-center py-12 gap-6 opacity-40">
    <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
      <Logo size="sm" className="grayscale contrast-50" />
    </motion.div>
    <p className="text-[8px] font-normal text-gray-300 uppercase tracking-widest animate-pulse">مزامنة النظام...</p>
  </div>
);

export default function HomePage() {
  const [localUser, setLocalUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [processingPayouts, setProcessingPayouts] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [now, setNow] = useState(new Date());
  const [calcAmount, setCalcAmount] = useState("1000");
  
  const router = useRouter();
  const db = useFirestore();

  const marketingDocRef = useMemoFirebase(() => doc(db, "system_settings", "marketing"), [db]);
  const { data: marketingConfig } = useDoc(marketingDocRef);

  const tiersDocRef = useMemoFirebase(() => doc(db, "system_settings", "investor_tiers"), [db]);
  const { data: tiersData } = useDoc(tiersDocRef);

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), where("isActive", "==", true)), [db]);
  const { data: allSymbols } = useCollection(symbolsQuery);

  useMarketSync(allSymbols || []);

  const plansQuery = useMemoFirebase(() => query(collection(db, "investment_plans"), where("isActive", "==", true)), [db]);
  const { data: allPlans } = useCollection(plansQuery);

  const featuredPlans = useMemo(() => {
    if (!allPlans) return [];
    return allPlans.filter(p => p.isPopular || p.isFlash).slice(0, 3);
  }, [allPlans]);

  const scheduledPlans = useMemo(() => {
    if (!allPlans) return [];
    return allPlans.filter(p => p.isScheduled && new Date(p.launchTime) > now);
  }, [allPlans, now]);

  // --- محرك الاحتساب المحاسبي السيادي (Sovereign Ledger Engine) ---
  
  const investmentsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(collection(db, "investments"), where("userId", "==", localUser.id));
  }, [db, localUser?.id]);
  const { data: investments, isLoading: loadingInv } = useCollection(investmentsQuery);

  const depositsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(collection(db, "deposit_requests"), where("userId", "==", localUser.id), where("status", "==", "approved"));
  }, [db, localUser?.id]);
  const { data: allDeposits } = useCollection(depositsQuery);

  const withdrawalsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(collection(db, "withdraw_requests"), where("userId", "==", localUser.id), where("status", "==", "approved"));
  }, [db, localUser?.id]);
  const { data: allWithdrawals } = useCollection(withdrawalsQuery);

  const tradesQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(collection(db, "trades"), where("userId", "==", localUser.id));
  }, [db, localUser?.id]);
  const { data: allTrades } = useCollection(tradesQuery);

  const dynamicFinancials = useMemo(() => {
    if (!dbUser || !allDeposits || !allWithdrawals || !investments || !allTrades) {
      return { balance: 0, profits: 0, activeInvestments: 0 };
    }

    const initialBonus = dbUser.welcomeBonus || 0;
    const totalDeposits = allDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalWithdrawals = allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    // العقود الاستثمارية
    const completedInvs = investments.filter(i => i.status === 'completed');
    const maturedProfits = completedInvs.reduce((sum, i) => sum + (i.expectedProfit || 0), 0);
    const maturedCapitals = completedInvs.reduce((sum, i) => sum + (i.amount || 0), 0);

    const activeInvs = investments.filter(i => i.status === 'active');
    const activeInvestmentsTotal = activeInvs.reduce((sum, i) => sum + (i.amount || 0), 0);

    // الصفقات
    const winTrades = allTrades.filter(t => t.status === 'closed' && t.result === 'win');
    const tradeWinProfits = winTrades.reduce((sum, t) => sum + (t.expectedProfit || 0), 0);
    const tradeWinCapitals = winTrades.reduce((sum, t) => sum + (t.amount || 0), 0);

    const loseTrades = allTrades.filter(t => t.status === 'closed' && t.result === 'lose');
    const tradeLossCapitals = loseTrades.reduce((sum, t) => sum + (t.amount || 0), 0);

    const openTrades = allTrades.filter(t => t.status === 'open');
    const openTradesAmount = openTrades.reduce((sum, t) => sum + (t.amount || 0), 0);

    // تطبيق المعادلة السيادية الكاملة:
    // (المكافأة + الإيداعات + أرباح المكتملة + رؤوس أموال المكتملة + أرباح الصفقات الرابحة + رؤوس أموال الصفقات الرابحة)
    // - (السحوبات + رؤوس أموال العقود النشطة + رؤوس أموال الصفقات المفتوحة + رؤوس أموال الصفقات الخاسرة)
    const currentBalance = (initialBonus + totalDeposits + maturedProfits + maturedCapitals + tradeWinProfits + tradeWinCapitals) 
                          - (totalWithdrawals + activeInvestmentsTotal + openTradesAmount + tradeLossCapitals);

    return {
      balance: Math.max(0, currentBalance),
      profits: maturedProfits + tradeWinProfits,
      activeInvestments: activeInvestmentsTotal + openTradesAmount
    };
  }, [dbUser, allDeposits, allWithdrawals, investments, allTrades]);

  const displayUser = dbUser || localUser;

  const favorites = useMemo(() => {
    if (!allSymbols || !displayUser?.favoriteSymbols) return [];
    return allSymbols.filter(s => displayUser.favoriteSymbols.includes(s.id));
  }, [allSymbols, displayUser?.favoriteSymbols]);

  const liveStats = useMemo(() => {
    if (!investments) return { accruedProfit: 0 };
    const activeOnes = investments.filter(i => i.status === 'active');
    return activeOnes.reduce((acc, inv) => {
      try {
        const start = parseISO(inv.startTime);
        const end = parseISO(inv.endTime);
        const progress = Math.min(Math.max(differenceInMilliseconds(now, start) / differenceInMilliseconds(end, start), 0), 1);
        return { accruedProfit: acc.accruedProfit + (progress * (inv.expectedProfit || 0)) };
      } catch (e) { return acc; }
    }, { accruedProfit: 0 });
  }, [investments, now]);

  const totalLiveProfits = dynamicFinancials.profits + liveStats.accruedProfit;

  const calculatedTier = useMemo(() => {
    if (!displayUser || !tiersData?.list) return null;
    const list = [...tiersData.list].sort((a, b) => (a.minBalance || 0) - (b.minBalance || 0));
    const currentStats = { 
      balance: dynamicFinancials.balance, 
      profits: dynamicFinancials.profits, 
      historical: dynamicFinancials.activeInvestments + dynamicFinancials.profits, 
      invites: referralCount 
    };

    let currentTier = list[0];
    for (let i = list.length - 1; i >= 0; i--) {
      const t = list[i];
      if (
        currentStats.balance >= (t.minBalance || 0) &&
        currentStats.profits >= (t.minTotalProfits || 0) &&
        currentStats.historical >= (t.minHistoricalInvest || 0) &&
        currentStats.invites >= (t.minInvites || 0)
      ) {
        currentTier = t;
        break;
      }
    }

    const currentIndex = list.findIndex(t => t.id === currentTier.id);
    const nextTier = list[currentIndex + 1] || null;
    
    let remaining = { balance: 0, profits: 0, invites: 0, historical: 0 };
    let progress = 100;

    if (nextTier) {
      remaining = {
        balance: Math.max(0, (nextTier.minBalance || 0) - currentStats.balance),
        profits: Math.max(0, (nextTier.minTotalProfits || 0) - currentStats.profits),
        invites: Math.max(0, (nextTier.minInvites || 0) - currentStats.invites),
        historical: Math.max(0, (nextTier.minHistoricalInvest || 0) - currentStats.historical)
      };
      
      const balanceProg = (currentStats.balance / (nextTier.minBalance || 1)) * 100;
      progress = Math.min(Math.max(balanceProg, 0), 100);
    }

    return { current: currentTier, next: nextTier, progress, remaining };
  }, [tiersData, displayUser, referralCount, dynamicFinancials]);

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (!userSession) router.push("/login");
    else {
      const parsed = JSON.parse(userSession);
      if (parsed.role === 'admin') { router.push("/admin"); return; }
      setLocalUser(parsed);
      const unsubUser = onSnapshot(doc(db, "users", parsed.id), (snap) => { if (snap.exists()) setDbUser(snap.data()); });
      const unsubNotifs = onSnapshot(query(collection(db, "notifications"), where("userId", "==", parsed.id), where("isRead", "==", false)), (snap) => setUnreadCount(snap.size));
      const unsubRef = onSnapshot(query(collection(db, "users"), where("referredBy", "==", parsed.id)), (snap) => setReferralCount(snap.size));
      return () => { unsubUser(); unsubNotifs(); unsubRef(); };
    }
  }, [router, db]);

  const processMaturedInvestments = useCallback(async () => {
    if (!investments || !localUser?.id || processingPayouts) return;
    const currentTime = now.getTime();
    const matured = investments.filter(inv => 
      inv.status === 'active' && 
      !inv.isProcessed && 
      currentTime >= new Date(inv.endTime).getTime() + 5000
    );

    if (matured.length === 0) return;
    setProcessingPayouts(true);
    try {
      for (const inv of matured) {
        const totalPayout = inv.amount + (inv.expectedProfit || 0);
        // تحديث حالة العقد فقط، السجل سيقوم بتحديث الرصيد ديناميكياً
        await updateDoc(doc(db, "investments", inv.id), { status: "completed", isProcessed: true, completedAt: new Date().toISOString() });
        await addDoc(collection(db, "notifications"), { userId: localUser.id, title: "اكتمل الاستثمار! 💰", message: `اكتمل استثمار ${inv.planTitle} لمبلغ $${totalPayout.toFixed(2)}. تم تحرير رأس المال والارباح لمحفظتك.`, type: "success", isRead: false, createdAt: new Date().toISOString() });
      }
    } finally {
      setProcessingPayouts(false);
    }
  }, [investments, localUser?.id, db, now, processingPayouts]);

  useEffect(() => {
    const timer = setInterval(() => { 
      setNow(new Date()); 
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    processMaturedInvestments();
  }, [processMaturedInvestments]);

  if (!localUser) return null;

  return (
    <Shell>
      <div className="pb-32 bg-[#fcfdfe] relative" dir="rtl">
        <Suspense fallback={<SectionLoader />}>
          <PortfolioHero 
            user={{ ...displayUser, totalBalance: dynamicFinancials.balance, activeInvestmentsTotal: dynamicFinancials.activeInvestments }} 
            totalLiveProfits={totalLiveProfits} 
            unreadCount={unreadCount} 
            onDeposit={() => setDepositOpen(true)} 
            onWithdraw={() => setWithdrawOpen(true)} 
          />
        </Suspense>

        <div className="container mx-auto px-6 space-y-12 relative z-10 mt-12">
          <Suspense fallback={<SectionLoader />}><ServiceGateway /></Suspense>
          <Suspense fallback={<SectionLoader />}><EliteWatchlist favorites={favorites} /></Suspense>
          <Suspense fallback={<SectionLoader />}><FeaturedProtocols plans={featuredPlans} onSelect={setSelectedPlan} /></Suspense>
          <Suspense fallback={<SectionLoader />}><InvestmentInventory investments={investments || null} isLoading={loadingInv} now={now} /></Suspense>
          <Suspense fallback={<SectionLoader />}><TierProgress calculatedTier={calculatedTier} referralCount={referralCount} hasUnclaimedReward={false} processingReward={false} rewardNotice={null} onClaimReward={() => {}} onDeposit={() => setDepositOpen(true)} /></Suspense>
          <Suspense fallback={<SectionLoader />}><YieldSimulator marketingConfig={marketingConfig} calcAmount={calcAmount} onAmountChange={setCalcAmount} onIncrement={() => setCalcAmount(prev => (parseInt(prev || "0") + 100).toString())} onDecrement={() => setCalcAmount(prev => Math.max(0, parseInt(prev || "0") - 100).toString())} /></Suspense>
          <Suspense fallback={<SectionLoader />}><UpcomingEvents scheduledPlans={scheduledPlans} /></Suspense>
          <Suspense fallback={<SectionLoader />}><GuidanceCenter /></Suspense>
          <Suspense fallback={<SectionLoader />}><NewsTicker marketingConfig={marketingConfig} /></Suspense>
        </div>

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        <WithdrawSheet open={withdrawOpen} onOpenChange={setWithdrawOpen} />
        <ActivationDialog plan={selectedPlan} onClose={() => setSelectedPlan(null)} dbUser={dbUser} onOpenDeposit={() => { setSelectedPlan(null); setDepositOpen(true); }} />
      </div>
    </Shell>
  );
}
