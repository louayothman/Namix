"use client";

import React, { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, onSnapshot, doc, orderBy, increment, arrayUnion, limit, addDoc } from "firebase/firestore";
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
    return query(collection(db, "investments"), where("userId", "==", localUser.id), orderBy("createdAt", "desc"), limit(10));
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
        const progress = Math.min(Math.max(differenceInMilliseconds(now, start) / differenceInMilliseconds(end, start), 0), 1);
        return { accruedProfit: acc.accruedProfit + (progress * (inv.expectedProfit || 0)) };
      } catch (e) { return acc; }
    }, { accruedProfit: 0 });
  }, [investments, now]);

  const totalLiveProfits = displayUser ? (displayUser.totalProfits || 0) + liveStats.accruedProfit : 0;

  const calculatedTier = useMemo(() => {
    if (!displayUser || !tiersData?.list) return null;
    const list = tiersData.list;
    const currentStats = { balance: displayUser.totalBalance || 0, profits: displayUser.totalProfits || 0, historical: (displayUser.activeInvestmentsTotal || 0) + (displayUser.totalProfits || 0), invites: referralCount };
    const achievedTier = [...list].sort((a,b) => (b.minBalance + b.minTotalProfits) - (a.minBalance + a.minTotalProfits)).find(t => currentStats.balance >= t.minBalance && currentStats.profits >= (t.minTotalProfits || 0) && currentStats.historical >= (t.minHistoricalInvest || 0) && currentStats.invites >= (t.minInvites || 0));
    const nextTier = [...list].sort((a,b) => a.minBalance - b.minBalance).find(t => currentStats.balance < t.minBalance || currentStats.invites < (t.minInvites || 0));
    return { current: achievedTier || list[0], next: nextTier, progress: nextTier ? (currentStats.balance / nextTier.minBalance) * 100 : 100, remaining: {} };
  }, [tiersData, displayUser, referralCount]);

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
    if (!investments || !localUser?.id) return;
    const matured = investments.filter(inv => inv.status === 'active' && !inv.isProcessed && new Date() >= new Date(inv.endTime));
    for (const inv of matured) {
      const totalPayout = inv.amount + (inv.expectedProfit || 0);
      await updateDoc(doc(db, "users", localUser.id), { totalBalance: increment(totalPayout), totalProfits: increment(inv.expectedProfit || 0), activeInvestmentsTotal: increment(-inv.amount) });
      await updateDoc(doc(db, "investments", inv.id), { status: "completed", isProcessed: true, completedAt: new Date().toISOString() });
      await addDoc(collection(db, "notifications"), { userId: localUser.id, title: "اكتمل الاستثمار! 💰", message: `اكتمل استثمار ${inv.planTitle} لمبلغ $${totalPayout.toFixed(2)}.`, type: "success", isRead: false, createdAt: new Date().toISOString() });
    }
  }, [investments, localUser?.id, db]);

  useEffect(() => {
    const timer = setInterval(() => { setNow(new Date()); processMaturedInvestments(); }, 1000);
    return () => clearInterval(timer);
  }, [processMaturedInvestments]);

  if (!localUser) return null;

  return (
    <Shell>
      <div className="pb-32 bg-[#fcfdfe] relative" dir="rtl">
        <Suspense fallback={<SectionLoader />}>
          <PortfolioHero user={displayUser} totalLiveProfits={totalLiveProfits} vaultYield={0} unreadCount={unreadCount} isVaultEnabled={!!vaultConfig?.isVaultEnabled} calculatedTier={calculatedTier} insuranceConfig={insuranceConfig} onDeposit={() => setDepositOpen(true)} onWithdraw={() => setWithdrawOpen(true)} />
        </Suspense>

        <div className="container mx-auto px-6 space-y-12 relative z-10 mt-12">
          <Suspense fallback={<SectionLoader />}><ServiceGateway /></Suspense>
          <Suspense fallback={<SectionLoader />}><EliteWatchlist favorites={favorites} /></Suspense>
          <Suspense fallback={<SectionLoader />}><FeaturedProtocols plans={featuredPlans} onSelect={setSelectedPlan} /></Suspense>
          <Suspense fallback={<SectionLoader />}><InvestmentInventory investments={investments || null} isLoading={loadingInv} now={now} /></Suspense>
          <Suspense fallback={<SectionLoader />}><TierProgress calculatedTier={calculatedTier} referralCount={referralCount} hasUnclaimedReward={false} processingReward={processingReward} rewardNotice={rewardNotice} onClaimReward={() => {}} onDeposit={() => setDepositOpen(true)} /></Suspense>
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