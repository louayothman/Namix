
"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, onSnapshot, doc, orderBy, updateDoc, increment, addDoc, arrayUnion } from "firebase/firestore";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useMarketSync } from "@/hooks/use-market-sync";

// التحميل الكسول المتقدم لتقليل حجم الحزمة الأولية
const PortfolioHero = lazy(() => import("@/components/dashboard/PortfolioHero").then(m => ({ default: m.PortfolioHero })));
const EliteWatchlist = lazy(() => import("@/components/dashboard/EliteWatchlist").then(m => ({ default: m.EliteWatchlist })));
const FeaturedProtocols = lazy(() => import("@/components/dashboard/FeaturedProtocols").then(m => ({ default: m.FeaturedProtocols })));
const ServiceGateway = lazy(() => import("@/components/dashboard/ServiceGateway").then(m => ({ default: m.ServiceGateway })));
const InvestmentInventory = lazy(() => import("@/components/dashboard/InvestmentInventory").then(m => ({ default: m.InvestmentInventory })));
const TierProgress = lazy(() => import("@/components/dashboard/TierProgress").then(m => ({ default: m.TierProgress })));
const YieldSimulator = lazy(() => import("@/components/dashboard/YieldSimulator").then(m => ({ default: m.YieldSimulator })));
const GlobalStats = lazy(() => import("@/components/dashboard/GlobalStats").then(m => ({ default: m.GlobalStats })));
const NewsTicker = lazy(() => import("@/components/dashboard/NewsTicker").then(m => ({ default: m.NewsTicker })));
const UpcomingEvents = lazy(() => import("@/components/dashboard/UpcomingEvents").then(m => ({ default: m.UpcomingEvents })));
const GuidanceCenter = lazy(() => import("@/components/dashboard/GuidanceCenter").then(m => ({ default: m.GuidanceCenter })));
const ActivationDialog = lazy(() => import("@/components/invest/ActivationDialog").then(m => ({ default: m.ActivationDialog })));
const DepositSheet = lazy(() => import("@/components/deposit/DepositSheet").then(m => ({ default: m.DepositSheet })));
const WithdrawSheet = lazy(() => import("@/components/withdraw/WithdrawSheet").then(m => ({ default: m.WithdrawSheet })));

const SectionLoader = () => (
  <div className="flex flex-col items-center justify-center py-12 gap-4 opacity-40">
    <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Syncing Node...</p>
  </div>
);

export default function DashboardPage() {
  const [localUser, setLocalUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [processingReward, setProcessingReward] = useState(false);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [now, setNow] = useState(new Date());
  
  const [dynamicStats, setDynamicStats] = useState({
    withdrawals: 0,
    activeUsers: 0,
    investments: 0
  });

  const [calcAmount, setCalcAmount] = useState("1000");
  
  const router = useRouter();
  const db = useFirestore();

  // جلب البيانات الأساسية
  const marketingDocRef = useMemoFirebase(() => doc(db, "system_settings", "marketing"), [db]);
  const { data: marketingConfig } = useDoc(marketingDocRef);

  const tiersDocRef = useMemoFirebase(() => doc(db, "system_settings", "investor_tiers"), [db]);
  const { data: tiersData } = useDoc(tiersDocRef);

  const vaultDocRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: vaultConfig } = useDoc(vaultDocRef);

  const insuranceRef = useMemoFirebase(() => doc(db, "system_settings", "insurance"), [db]);
  const { data: insuranceConfig } = useDoc(insuranceRef);

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), where("isActive", "==", true)), [db]);
  const { data: allSymbols } = useCollection(symbolsQuery);

  // تفعيل المزامنة المركزية للأسعار
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

  const investmentsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "investments"),
      where("userId", "==", localUser.id),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
  }, [db, localUser?.id]);
  const { data: investments, isLoading: loadingInv } = useCollection(investmentsQuery);

  const displayUser = dbUser || localUser;

  const favorites = useMemo(() => {
    if (!allSymbols || !displayUser?.favoriteSymbols) return [];
    return allSymbols.filter(s => displayUser.favoriteSymbols.includes(s.id));
  }, [allSymbols, displayUser?.favoriteSymbols]);

  const liveStats = useMemo(() => {
    if (!investments || investments.length === 0) return { accruedProfit: 0 };
    return investments.reduce((acc, inv) => {
      try {
        const start = parseISO(inv.startTime);
        const end = parseISO(inv.endTime);
        const totalMs = differenceInMilliseconds(end, start);
        const elapsedMs = differenceInMilliseconds(now, start);
        const progress = Math.min(Math.max(elapsedMs / totalMs, 0), 1);
        const currentProfit = progress * (inv.expectedProfit || 0);
        return { accruedProfit: acc.accruedProfit + currentProfit };
      } catch (e) { return acc; }
    }, { accruedProfit: 0 });
  }, [investments, now]);

  const totalLiveProfits = displayUser ? (displayUser.totalProfits || 0) + liveStats.accruedProfit : 0;

  const calculatedTier = useMemo(() => {
    if (!displayUser || !tiersData?.list) return null;
    const list = tiersData.list;
    const currentStats = {
      balance: displayUser.totalBalance || 0,
      profits: displayUser.totalProfits || 0,
      historical: (displayUser.activeInvestmentsTotal || 0) + (displayUser.totalProfits || 0),
      invites: referralCount
    };

    const achievedTier = [...list]
      .sort((a,b) => (b.minBalance + b.minTotalProfits) - (a.minBalance + a.minTotalProfits))
      .find(t => 
        currentStats.balance >= t.minBalance &&
        currentStats.profits >= (t.minTotalProfits || 0) &&
        currentStats.historical >= (t.minHistoricalInvest || 0) &&
        currentStats.invites >= (t.minInvites || 0)
      );

    const nextTier = [...list]
      .sort((a,b) => a.minBalance - b.minBalance)
      .find(t => 
        currentStats.balance < t.minBalance || 
        currentStats.invites < (t.minInvites || 0) ||
        currentStats.profits < (t.minTotalProfits || 0) ||
        currentStats.historical < (t.minHistoricalInvest || 0)
      );

    let progress = 0;
    const remaining: any = { balance: 0, invites: 0, profits: 0, historical: 0 };

    if (nextTier) {
      const balanceProgress = Math.min((currentStats.balance / (nextTier.minBalance || 1)) * 100, 100);
      const inviteProgress = nextTier.minInvites > 0 ? Math.min((currentStats.invites / nextTier.minInvites) * 100, 100) : 100;
      const profitProgress = nextTier.minTotalProfits > 0 ? Math.min((currentStats.profits / nextTier.minTotalProfits) * 100, 100) : 100;
      const historicalProgress = nextTier.minHistoricalInvest > 0 ? Math.min((currentStats.historical / nextTier.minHistoricalInvest) * 100, 100) : 100;
      
      progress = (balanceProgress + inviteProgress + profitProgress + historicalProgress) / 4;

      if (currentStats.balance < nextTier.minBalance) remaining.balance = nextTier.minBalance - currentStats.balance;
      if (currentStats.invites < (nextTier.minInvites || 0)) remaining.invites = (nextTier.minInvites || 0) - currentStats.invites;
      if (currentStats.profits < (nextTier.minTotalProfits || 0)) remaining.profits = (nextTier.minTotalProfits || 0) - currentStats.profits;
      if (currentStats.historical < (nextTier.minHistoricalInvest || 0)) remaining.historical = (nextTier.minHistoricalInvest || 0) - currentStats.historical;
    }

    return { 
      current: achievedTier || list[0], 
      next: nextTier, 
      progress,
      remaining
    };
  }, [tiersData, displayUser, referralCount]);

  const handleClaimReward = async () => {
    if (!dbUser || !calculatedTier?.current || processingReward || !localUser?.id) return;
    const currentTierId = calculatedTier.current.id;
    const rewardAmount = calculatedTier.current.rewardAmount || 0;
    
    setProcessingReward(true);
    try {
      await updateDoc(doc(db, "users", localUser.id), {
        totalBalance: increment(rewardAmount),
        claimedTierRewards: arrayUnion(currentTierId)
      });
      setRewardNotice(`تمت إضافة $${rewardAmount} لمحفظتك بنجاح!`);
      setTimeout(() => setRewardNotice(null), 5000);
    } catch (e) { console.error(e); } finally { setProcessingReward(false); }
  };

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (!userSession) {
      router.push("/login");
    } else {
      const parsed = JSON.parse(userSession);
      if (parsed.role === 'admin') {
        router.push("/admin");
        return;
      }
      setLocalUser(parsed);
      const userRef = doc(db, "users", parsed.id);
      const unsubUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) setDbUser(snap.data());
      });
      const q = query(collection(db, "notifications"), where("userId", "==", parsed.id), where("isRead", "==", false));
      const unsubNotifs = onSnapshot(q, (snap) => setUnreadCount(snap.size));
      const refQuery = query(collection(db, "users"), where("referredBy", "==", parsed.id));
      const unsubRef = onSnapshot(refQuery, (snap) => setReferralCount(snap.size));
      return () => { unsubUser(); unsubNotifs(); unsubRef(); };
    }
  }, [router, db]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 500);
    return () => clearInterval(timer);
  }, []);

  if (!localUser) return null;

  return (
    <Shell>
      <div className="pb-32 overflow-x-hidden font-body bg-[#fcfdfe] relative" dir="rtl">
        
        <Suspense fallback={<div className="h-[400px] w-full bg-[#002d4d] animate-pulse rounded-b-[64px]" />}>
          <PortfolioHero 
            user={displayUser}
            totalLiveProfits={totalLiveProfits}
            vaultYield={0}
            unreadCount={unreadCount}
            isVaultEnabled={vaultConfig?.isVaultEnabled}
            calculatedTier={calculatedTier}
            insuranceConfig={insuranceConfig}
            onDeposit={() => setDepositOpen(true)}
            onWithdraw={() => setWithdrawOpen(true)}
          />
        </Suspense>

        <div className="container mx-auto px-6 space-y-12 relative z-10 mt-12">
          <Suspense fallback={<SectionLoader />}>
            <ServiceGateway />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <EliteWatchlist favorites={favorites} />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <FeaturedProtocols plans={featuredPlans} onSelect={setSelectedPlan} />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <InvestmentInventory investments={investments || null} isLoading={loadingInv} now={now} />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <TierProgress 
              calculatedTier={calculatedTier}
              referralCount={referralCount}
              hasUnclaimedReward={false}
              processingReward={processingReward}
              rewardNotice={rewardNotice}
              onClaimReward={handleClaimReward}
              onDeposit={() => setDepositOpen(true)}
            />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <YieldSimulator 
              marketingConfig={marketingConfig}
              calcAmount={calcAmount}
              onAmountChange={setCalcAmount}
              onIncrement={() => setCalcAmount(prev => (parseInt(prev || "0") + 100).toString())}
              onDecrement={() => setCalcAmount(prev => Math.max(0, parseInt(prev || "0") - 100).toString())}
            />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <UpcomingEvents scheduledPlans={scheduledPlans} />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <GuidanceCenter />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <GlobalStats marketingConfig={marketingConfig} dynamicStats={dynamicStats} />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <NewsTicker marketingConfig={marketingConfig} />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
          <WithdrawSheet 
            open={withdrawOpen} 
            onOpenChange={setWithdrawOpen} 
            onOpenDeposit={() => { setWithdrawOpen(false); setTimeout(() => setDepositOpen(true), 300); }} 
          />
          <ActivationDialog 
            plan={selectedPlan} 
            onClose={() => setSelectedPlan(null)} 
            dbUser={dbUser} 
            onOpenDeposit={() => { setSelectedPlan(null); setDepositOpen(true); }}
          />
        </Suspense>
      </div>
    </Shell>
  );
}
