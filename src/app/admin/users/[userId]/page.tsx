
"use client";

import { useEffect, useState, useCallback, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Loader2, PieChart, ArrowUpCircle, ArrowDownCircle, Briefcase, History, Sparkles, ShieldCheck, Zap, Coins, Clock } from "lucide-react";
import { DepositSheet } from "@/components/deposit/DepositSheet";
import { WithdrawSheet } from "@/components/withdraw/WithdrawSheet";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, onSnapshot, doc, orderBy, updateDoc, increment, addDoc, getDocs } from "firebase/firestore";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Modular Components
import { ManagedPortfolioHero } from "@/components/admin/users/ManagedPortfolioHero";
import { ManagedInvestmentList } from "@/components/admin/users/ManagedInvestmentList";
import { UserFinancialLedger } from "@/components/admin/users/UserFinancialLedger";

/**
 * @fileOverview صفحة إدارة المستثمر للمشرف v2.0 - Sovereign Ledger Engine
 * تم توحيد منطق الاحتساب المالي لضمان دقة السيادة المالية.
 */
export default function ManagedDashboardPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [dbUser, setDbUser] = useState<any>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [processingPayouts, setProcessingPayouts] = useState(false);
  const [now, setNow] = useState(new Date());
  const [referralCount, setReferralCount] = useState(0);
  
  const router = useRouter();
  const db = useFirestore();

  const tiersDocRef = useMemoFirebase(() => doc(db, "system_settings", "investor_tiers"), [db]);
  const { data: tiersData } = useDoc(tiersDocRef);

  const investmentsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(
      collection(db, "investments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
  }, [db, userId]);

  const { data: allInvestments, isLoading: loadingInv } = useCollection(investmentsQuery);

  const depositsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(
      collection(db, "deposit_requests"),
      where("userId", "==", userId),
      where("status", "==", "approved")
    );
  }, [db, userId]);
  const { data: allDeposits } = useCollection(depositsQuery);

  const withdrawalsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(
      collection(db, "withdraw_requests"),
      where("userId", "==", userId),
      where("status", "==", "approved")
    );
  }, [db, userId]);
  const { data: allWithdrawals } = useCollection(withdrawalsQuery);

  const tradesQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(collection(db, "trades"), where("userId", "==", userId));
  }, [db, userId]);
  const { data: allTrades } = useCollection(tradesQuery);

  const activeInvestments = useMemo(() => allInvestments?.filter(i => i.status === 'active') || [], [allInvestments]);

  // --- محرك الاحتساب المحاسبي السيادي (Sovereign Ledger Engine) ---

  const dynamicFinancials = useMemo(() => {
    if (!dbUser || !allDeposits || !allWithdrawals || !allInvestments || !allTrades) {
      return { balance: 0, profits: 0, activeInvestments: 0, totalDeposited: 0, totalWithdrawn: 0 };
    }

    const initialBonus = dbUser.welcomeBonus || 0;
    const totalDeposits = allDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalWithdrawals = allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    // العقود المكتملة والمعالجة فقط
    const maturedInvs = allInvestments.filter(i => i.status === 'completed' && i.isProcessed === true);
    const maturedProfits = maturedInvs.reduce((sum, i) => sum + (i.expectedProfit || 0), 0);
    const maturedCapitals = maturedInvs.reduce((sum, i) => sum + (i.amount || 0), 0);

    const activeInvestmentsTotal = activeInvestments.reduce((sum, i) => sum + (i.amount || 0), 0);

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
      activeInvestments: activeInvestmentsTotal + openTradesAmount,
      totalDeposited: totalDeposits,
      totalWithdrawn: totalWithdrawals
    };
  }, [dbUser, allDeposits, allWithdrawals, allInvestments, allTrades, activeInvestments]);

  const liveStats = useMemo(() => {
    if (!activeInvestments || activeInvestments.length === 0) return { accruedProfit: 0 };
    return activeInvestments.reduce((acc, inv) => {
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
  }, [activeInvestments, now]);

  const calculatedTier = useMemo(() => {
    if (!dbUser || !tiersData?.list) return null;
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

    return currentTier;
  }, [dbUser, tiersData, referralCount, dynamicFinancials]);

  const totalLiveProfits = dynamicFinancials.profits + liveStats.accruedProfit;

  const getProgressData = (startTime: string, endTime: string, expectedProfit: number) => {
    try {
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      const totalMs = differenceInMilliseconds(end, start);
      const elapsedMs = differenceInMilliseconds(now, start);
      const percent = Math.min(Math.max(Math.floor((elapsedMs / totalMs) * 100), 0), 100);
      const accrued = (Math.min(Math.max(elapsedMs / totalMs, 0), 1) * expectedProfit);
      return { percent, accrued };
    } catch (e) { return { percent: 0, accrued: 0 }; }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (userId) {
      const userRef = doc(db, "users", userId);
      const unsubUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) setDbUser(snap.data());
      });
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("isRead", "==", false)
      );
      const unsubNotifs = onSnapshot(q, (snap) => setUnreadCount(snap.size));

      const refQ = query(collection(db, "users"), where("referredBy", "==", userId));
      const unsubRefs = onSnapshot(refQ, (snap) => setReferralCount(snap.size));

      return () => {
        unsubUser();
        unsubNotifs();
        unsubRefs();
      };
    }
  }, [userId, db]);

  const processMaturedInvestments = useCallback(async () => {
    if (!activeInvestments || activeInvestments.length === 0 || processingPayouts || !userId) return;
    const currentTime = now.getTime();
    const matured = activeInvestments.filter(inv => 
      !inv.isProcessed && 
      currentTime >= new Date(inv.endTime).getTime() + 5000
    );

    if (matured.length === 0) return;
    setProcessingPayouts(true);
    try {
      for (const inv of matured) {
        const totalPayout = inv.amount + (inv.expectedProfit || 0);
        // تحديث حالة العقد وبصمة المعالجة، السجل سيقوم بتحرير السيولة ديناميكياً
        await updateDoc(doc(db, "investments", inv.id), {
          status: "completed",
          isProcessed: true,
          completedAt: new Date().toISOString()
        });
        
        await addDoc(collection(db, "notifications"), {
          userId: userId,
          title: "اكتمل الاستثمار! 💰",
          message: `اكتمل استثمار ${inv.planTitle} لمبلغ $${totalPayout.toFixed(2)}. تم تحرير السيولة والارباح لحساب المستثمر.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingPayouts(false);
    }
  }, [activeInvestments, userId, db, processingPayouts, now]);

  useEffect(() => {
    processMaturedInvestments();
  }, [processMaturedInvestments]);

  if (!dbUser) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" />
    </div>
  );

  return (
    <Shell isAdmin managedUserId={userId} managedUserName={dbUser.displayName}>
      <div className="space-y-10 pb-24">
        
        <ManagedPortfolioHero 
          user={{ ...dbUser, totalBalance: dynamicFinancials.balance, activeInvestmentsTotal: dynamicFinancials.activeInvestments }}
          totalLiveProfits={totalLiveProfits}
          unreadCount={unreadCount}
          calculatedTier={calculatedTier}
          aggregateStats={{ totalDeposited: dynamicFinancials.totalDeposited, totalWithdrawn: dynamicFinancials.totalWithdrawn }}
          onDeposit={() => setDepositOpen(true)}
          onWithdraw={() => setWithdrawOpen(true)}
          onInvest={() => router.push(`/admin/users/${userId}/invest`)}
        />

        <div className="container mx-auto px-6">
          <Tabs defaultValue="active" className="w-full space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black text-[#002d4d]">البصمة المالية السيادية</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Comprehensive Financial Ledger Protocol</p>
               </div>
               <TabsList className="h-12 p-1 bg-gray-100 rounded-2xl border-none">
                  <TabsTrigger value="active" className="rounded-xl px-6 font-black text-[10px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">العقود النشطة</TabsTrigger>
                  <TabsTrigger value="deposits" className="rounded-xl px-6 font-black text-[10px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">سجل الإيداع</TabsTrigger>
                  <TabsTrigger value="withdrawals" className="rounded-xl px-6 font-black text-[10px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">سجل السحب</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl px-6 font-black text-[10px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">الأرشيف الاستثماري</TabsTrigger>
               </TabsList>
            </div>

            <TabsContent value="active" className="mt-0 outline-none">
              <ManagedInvestmentList 
                investments={activeInvestments}
                isLoading={loadingInv}
                getProgressData={getProgressData}
              />
            </TabsContent>

            <TabsContent value="deposits" className="mt-0 outline-none">
               <UserFinancialLedger type="deposit" data={allDeposits || []} />
            </TabsContent>

            <TabsContent value="withdrawals" className="mt-0 outline-none">
               <UserFinancialLedger type="withdraw" data={allWithdrawals || []} />
            </TabsContent>

            <TabsContent value="history" className="mt-0 outline-none">
               <UserFinancialLedger type="investment" data={allInvestments?.filter(i => i.status === 'completed') || []} />
            </TabsContent>
          </Tabs>
        </div>

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        <WithdrawSheet open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      </div>
    </Shell>
  );
}
