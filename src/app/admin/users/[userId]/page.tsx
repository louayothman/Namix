
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

export default function ManagedDashboardPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [dbUser, setDbUser] = useState<any>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [processingPayouts, setProcessingPayouts] = useState(false);
  const [now, setNow] = useState(new Date());
  const [aggregateStats, setAggregateStats] = useState({ totalDeposited: 0, totalWithdrawn: 0 });
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
      orderBy("createdAt", "desc")
    );
  }, [db, userId]);
  const { data: allDeposits } = useCollection(depositsQuery);

  const withdrawalsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(
      collection(db, "withdraw_requests"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
  }, [db, userId]);
  const { data: allWithdrawals } = useCollection(withdrawalsQuery);

  const activeInvestments = useMemo(() => allInvestments?.filter(i => i.status === 'active') || [], [allInvestments]);

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

  useEffect(() => {
    if (allDeposits && allWithdrawals) {
      const depSum = allDeposits.filter(d => d.status === 'approved').reduce((sum, d) => sum + (d.amount || 0), 0);
      const withSum = allWithdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + (w.amount || 0), 0);
      setAggregateStats({ totalDeposited: depSum, totalWithdrawn: withSum });
    }
  }, [allDeposits, allWithdrawals]);

  const calculatedTier = useMemo(() => {
    if (!dbUser || !tiersData?.list) return null;
    const list = tiersData.list;
    const currentStats = {
      balance: dbUser.totalBalance || 0,
      profits: dbUser.totalProfits || 0,
      historical: (dbUser.activeInvestmentsTotal || 0) + (dbUser.totalProfits || 0),
      invites: referralCount
    };

    const sortedTiers = [...list].sort((a,b) => (b.minBalance || 0) - (a.minBalance || 0));
    
    const achieved = sortedTiers.find(t => 
      currentStats.balance >= (t.minBalance || 0) &&
      currentStats.profits >= (t.minTotalProfits || 0) &&
      currentStats.historical >= (t.minHistoricalInvest || 0) &&
      currentStats.invites >= (t.minInvites || 0)
    );

    return achieved || null;
  }, [dbUser, tiersData, referralCount]);

  const totalLiveProfits = dbUser ? (dbUser.totalProfits || 0) + liveStats.accruedProfit : 0;

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
    // تأخير معالجة المستحقات لـ 5 ثوانٍ بعد انتهاء الوقت لضمان الشفافية البصرية للمستثمر
    const matured = activeInvestments.filter(inv => 
      !inv.isProcessed && 
      currentTime >= new Date(inv.endTime).getTime() + 5000
    );

    if (matured.length === 0) return;
    setProcessingPayouts(true);
    try {
      for (const inv of matured) {
        const totalPayout = inv.amount + (inv.expectedProfit || 0);
        await updateDoc(doc(db, "users", userId), {
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
          userId: userId,
          title: "اكتمل الاستثمار! 💰",
          message: `اكتمل استثمار ${inv.planTitle} لمبلغ $${totalPayout.toFixed(2)}.`,
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
          user={dbUser}
          totalLiveProfits={totalLiveProfits}
          unreadCount={unreadCount}
          calculatedTier={calculatedTier}
          aggregateStats={aggregateStats}
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
