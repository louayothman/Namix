
"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, onSnapshot, doc, orderBy, updateDoc, increment, arrayUnion, limit, addDoc } from "firebase/firestore";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
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
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Logo size="sm" className="grayscale contrast-50" />
    </motion.div>
    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] animate-pulse">Syncing Node...</p>
  </div>
);

export default function HomePage() {
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
  const [calcAmount, setCalcAmount] = useState("1000");
  
  const router = useRouter();
  const db = useFirestore();

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
      orderBy("createdAt", "desc"),
      limit(10)
    );
  }, [db, localUser?.id]);
  const { data: investments, isLoading: loadingInv } = useCollection(investmentsQuery);

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

    return { current: achievedTier || list[0], next: nextTier, progress, remaining };
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

  const processMaturedInvestments = useCallback(async () => {
    if (!investments || processingReward || !localUser?.id) return;
    const activeOnly = investments.filter(i => i.status === 'active');
    const currentTime = new Date();
    const matured = activeOnly.filter(inv => !inv.isProcessed && currentTime >= new Date(inv.endTime));
    if (matured.length === 0) return;
    
    try {
      for (const inv of matured) {
        const totalPayout = inv.amount + (inv.expectedProfit || 0);
        await updateDoc(doc(db, "users", localUser.id), {
          totalBalance: increment(totalPayout),
          totalProfits: increment(inv.expectedProfit || 0),
          activeInvestmentsTotal: increment(-inv.amount)
        });
        await updateDoc(doc(db, "investments", inv.id), {
          status: "completed",
          isProcessed: true,
          completedAt: new Date().toISOString()
        });
        await addDoc(collection(db, "notifications"), {
          userId: localUser.id,
          title: "اكتمل الاستثمار! 💰",
          message: `اكتمل استثمار ${inv.planTitle} لمبلغ $${totalPayout.toFixed(2)}.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [investments, localUser?.id, db, processingReward]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      processMaturedInvestments();
    }, 500);
    return () => clearInterval(timer);
  }, [processMaturedInvestments]);

  if (!localUser) return null;

  return (
    <Shell>
      <div className="pb-32 overflow-x-hidden font-body bg-[#fcfdfe] relative" dir="rtl">
        <Suspense fallback={<SectionLoader />}>
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
          <Suspense fallback={<SectionLoader />}><ServiceGateway /></Suspense>
          <Suspense fallback={<SectionLoader />}><EliteWatchlist favorites={favorites} /></Suspense>
          <Suspense fallback={<SectionLoader />}><FeaturedProtocols plans={featuredPlans} onSelect={setSelectedPlan} /></Suspense>
          <Suspense fallback={<SectionLoader />}><InvestmentInventory investments={investments || null} isLoading={loadingInv} now={now} /></Suspense>
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
          <Suspense fallback={<SectionLoader />}><UpcomingEvents scheduledPlans={scheduledPlans} /></Suspense>
          <Suspense fallback={<SectionLoader />}><GuidanceCenter /></Suspense>
          <Suspense fallback={<SectionLoader />}><NewsTicker marketingConfig={marketingConfig} /></Suspense>
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
