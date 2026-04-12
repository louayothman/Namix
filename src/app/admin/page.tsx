"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import dynamic from 'next/dynamic';
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import { parseISO, differenceInMilliseconds, addDays, isBefore } from "date-fns";
import { Loader2 } from "lucide-react";

const AdminHeader = dynamic(() => import("@/components/admin/dashboard/AdminHeader").then(m => ({ default: m.AdminHeader })), { ssr: false });
const TreasuryReactor = dynamic(() => import("@/components/admin/dashboard/TreasuryReactor").then(m => ({ default: m.TreasuryReactor })), { ssr: false });
const LiabilityReactor = dynamic(() => import("@/components/admin/dashboard/LiabilityReactor").then(m => ({ default: m.LiabilityReactor })), { ssr: false });
const GrowthReactor = dynamic(() => import("@/components/admin/dashboard/GrowthReactor").then(m => ({ default: m.GrowthReactor })), { ssr: false });
const UserIntelligenceReactor = dynamic(() => import("@/components/admin/dashboard/UserIntelligenceReactor").then(m => ({ default: m.UserIntelligenceReactor })), { ssr: false });
const OperationalTerminal = dynamic(() => import("@/components/admin/dashboard/OperationalTerminal").then(m => ({ default: m.OperationalTerminal })), { ssr: false });
const MarketPulseReactor = dynamic(() => import("@/components/admin/dashboard/MarketPulseReactor").then(m => ({ default: m.MarketPulseReactor })), { ssr: false });

const ReactorLoader = () => (
  <div className="h-[200px] flex flex-col items-center justify-center gap-3 bg-gray-50/50 rounded-[48px] border border-gray-100 border-dashed opacity-40">
    <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
    <p className="text-[9px] font-normal text-gray-300 uppercase tracking-widest">تهيئة المحرك...</p>
  </div>
);

export default function AdminDashboard() {
  const db = useFirestore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: allUsers } = useCollection(usersQuery);

  const investmentsQuery = useMemoFirebase(() => collection(db, "investments"), [db]);
  const { data: allInvestments } = useCollection(investmentsQuery);

  const allDepositsQuery = useMemoFirebase(() => collection(db, "deposit_requests"), [db]);
  const { data: allDeposits } = useCollection(allDepositsQuery);

  const allWithdrawalsQuery = useMemoFirebase(() => collection(db, "withdraw_requests"), [db]);
  const { data: allWithdrawals } = useCollection(allWithdrawalsQuery);

  const symbolsQuery = useMemoFirebase(() => collection(db, "trading_symbols"), [db]);
  const { data: allSymbols } = useCollection(symbolsQuery);

  const tradingGlobalRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: tradingGlobal } = useDoc(tradingGlobalRef);

  const totalUserBalances = useMemo(() => allUsers?.reduce((sum, u) => sum + (u.totalBalance || 0), 0) || 0, [allUsers]);
  const activeInvestments = useMemo(() => allInvestments?.filter(inv => inv.status === 'active') || [], [allInvestments]);
  const activeVolume = useMemo(() => activeInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0, [activeInvestments]);
  const liquidityEfficiency = totalUserBalances > 0 ? (activeVolume / totalUserBalances) * 100 : 0;
  
  const totalApprovedDeposits = useMemo(() => allDeposits?.filter(d => d.status === 'approved').reduce((sum, d) => sum + (d.amount || 0), 0) || 0, [allDeposits]);
  const totalApprovedWithdrawals = useMemo(() => allWithdrawals?.filter(w => w.status === 'approved').reduce((sum, w) => sum + (w.amount || 0), 0) || 0, [allWithdrawals]);

  const totalLiveAccruedProfits = useMemo(() => {
    if (!activeInvestments) return 0;
    return activeInvestments.reduce((sum, inv) => {
      try {
        const start = parseISO(inv.startTime);
        const end = parseISO(inv.endTime);
        const totalMs = differenceInMilliseconds(end, start);
        const elapsedMs = differenceInMilliseconds(now, start);
        const progress = Math.min(Math.max(elapsedMs / totalMs, 0), 1);
        return sum + (progress * (inv.expectedProfit || 0));
      } catch (e) { return sum; }
    }, 0);
  }, [activeInvestments, now]);

  const totalLiabilities = totalUserBalances + totalLiveAccruedProfits;
  const solvencyRatio = totalLiabilities > 0 ? (totalApprovedDeposits / totalLiabilities) * 100 : 0;

  const next7DaysOutflow = useMemo(() => {
    if (!activeInvestments) return 0;
    const sevenDaysFromNow = addDays(now, 7);
    return activeInvestments
      .filter(inv => {
        try {
          const end = parseISO(inv.endTime);
          return isBefore(end, sevenDaysFromNow);
        } catch (e) { return false; }
      })
      .reduce((sum, inv) => sum + (inv.amount + (inv.expectedProfit || 0)), 0);
  }, [activeInvestments, now]);

  const confidenceIndex = useMemo(() => {
    const yesterday = addDays(new Date(), -1);
    const recentDeps = allDeposits?.filter(d => d.status === 'approved' && parseISO(d.createdAt) > yesterday).reduce((sum, d) => sum + d.amount, 0) || 0;
    const recentWiths = allWithdrawals?.filter(w => w.status === 'approved' && parseISO(w.createdAt) > yesterday).reduce((sum, w) => sum + w.amount, 0) || 0;
    if (recentWiths === 0) return recentDeps > 0 ? 100 : 50;
    return (recentDeps / (recentDeps + recentWiths)) * 100;
  }, [allDeposits, allWithdrawals]);

  const reinvestmentRate = useMemo(() => {
    if (!allUsers || allUsers.length === 0) return 0;
    const usersWithInvestments = allUsers.filter(u => (allInvestments?.filter(inv => inv.userId === u.id).length || 0) > 0);
    const usersWithMultipleInvestments = usersWithInvestments.filter(u => (allInvestments?.filter(inv => inv.userId === u.id).length || 0) > 1);
    return usersWithInvestments.length > 0 ? (usersWithMultipleInvestments.length / usersWithInvestments.length) * 100 : 0;
  }, [allUsers, allInvestments]);

  return (
    <Shell isAdmin>
      <div className="space-y-8 pb-32 px-6 max-w-[1600px] mx-auto pt-10">
        <Suspense fallback={<div className="h-16 w-full bg-gray-50 rounded-full animate-pulse" />}>
          <AdminHeader />
        </Suspense>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<ReactorLoader />}>
                <TreasuryReactor totalUserBalances={totalUserBalances} activeVolume={activeVolume} liquidityEfficiency={liquidityEfficiency} confidenceIndex={confidenceIndex} totalApprovedDeposits={totalApprovedDeposits} totalApprovedWithdrawals={totalApprovedWithdrawals} userCount={allUsers?.length || 0} />
              </Suspense>
              <Suspense fallback={<ReactorLoader />}>
                <LiabilityReactor totalLiabilities={totalLiabilities} solvencyRatio={solvencyRatio} totalLiveAccruedProfits={totalLiveAccruedProfits} totalUserBalances={totalUserBalances} next7DaysOutflow={next7DaysOutflow} pendingWithdrawalsCount={allWithdrawals?.filter(w => w.status === 'pending').length || 0} totalApprovedDeposits={totalApprovedDeposits} />
              </Suspense>
            </div>
            <Suspense fallback={<ReactorLoader />}>
              <OperationalTerminal activeInvestments={activeInvestments} now={now} />
            </Suspense>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Suspense fallback={<ReactorLoader />}>
              <MarketPulseReactor symbolsCount={allSymbols?.filter(s => s.isActive).length || 0} globalProfitRate={tradingGlobal?.defaultProfitRate || 80} aiEnabled={!!tradingGlobal?.aiEnabled} />
            </Suspense>
            <Suspense fallback={<ReactorLoader />}>
              <GrowthReactor reinvestmentRate={reinvestmentRate} pendingDepositsCount={allDeposits?.filter(d => d.status === 'pending').length || 0} pendingWithdrawalsCount={allWithdrawals?.filter(w => w.status === 'pending').length || 0} />
            </Suspense>
            <Suspense fallback={<ReactorLoader />}>
              <UserIntelligenceReactor newUsersCount={allUsers?.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length || 0} onlineUsersCount={allUsers?.filter(u => u.lastActive && new Date().getTime() - new Date(u.lastActive).getTime() < 300000).length || 0} />
            </Suspense>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-12 opacity-20 select-none">
           <p className="text-[11px] font-normal text-[#002d4d] uppercase tracking-widest text-center">محرك ناميكس للتحكم المتقدم</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />)}
           </div>
        </div>
      </div>
    </Shell>
  );
}