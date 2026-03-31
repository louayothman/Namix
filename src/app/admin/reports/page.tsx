
"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { differenceInMilliseconds, parseISO } from "date-fns";

// Modular Components via Dynamic Loading
const ReportsHeader = dynamic(() => import("@/components/admin/reports/ReportsHeader").then(m => ({ default: m.ReportsHeader })), { ssr: false });
const ProfitKPIs = dynamic(() => import("@/components/admin/reports/ProfitKPIs").then(m => ({ default: m.ProfitKPIs })), { ssr: false });
const YieldDistribution = dynamic(() => import("@/components/admin/reports/YieldDistribution").then(m => ({ default: m.YieldDistribution })), { ssr: false });
const LiquidityNodes = dynamic(() => import("@/components/admin/reports/LiquidityNodes").then(m => ({ default: m.LiquidityNodes })), { ssr: false });
const ReportsSidebar = dynamic(() => import("@/components/admin/reports/ReportsSidebar").then(m => ({ default: m.ReportsSidebar })), { ssr: false });

/**
 * @fileOverview صفحة التقارير المالية السيادية للمشرف v1.2
 * تم استخدام التحميل الديناميكي لتجزئة كود الرسوم البيانية الثقيلة (Recharts).
 */
export default function AdminReportsPage() {
  const db = useFirestore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  // --- Real-time Data Fetching ---
  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users, isLoading: loadingUsers } = useCollection(usersQuery);

  const depositsQuery = useMemoFirebase(() => collection(db, "deposit_requests"), [db]);
  const { data: deposits, isLoading: loadingDeposits } = useCollection(depositsQuery);

  const withdrawalsQuery = useMemoFirebase(() => collection(db, "withdraw_requests"), [db]);
  const { data: withdrawals, isLoading: loadingWithdrawals } = useCollection(withdrawalsQuery);

  const investmentsQuery = useMemoFirebase(() => collection(db, "investments"), [db]);
  const { data: investments, isLoading: loadingInvestments } = useCollection(investmentsQuery);

  const tradesQuery = useMemoFirebase(() => collection(db, "trades"), [db]);
  const { data: trades, isLoading: loadingTrades } = useCollection(tradesQuery);

  // --- Financial Calculations ---
  const stats = useMemo(() => {
    if (!users || !deposits || !withdrawals || !investments || !trades) return null;

    const approvedDeposits = deposits.filter(d => d.status === 'approved');
    const pendingDeposits = deposits.filter(d => d.status === 'pending');
    const totalDepositsValue = approvedDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
    const pendingDepositsValue = pendingDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);

    const depositsByMethod = approvedDeposits.reduce((acc: any, d) => {
      const name = d.methodName || "أخرى";
      acc[name] = (acc[name] || 0) + (d.amount || 0);
      return acc;
    }, {});

    const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved');
    const totalWithdrawalsValue = approvedWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    
    const withdrawalsByMethod = approvedWithdrawals.reduce((acc: any, w) => {
      const name = w.methodName || "أخرى";
      acc[name] = (acc[name] || 0) + (w.amount || 0);
      return acc;
    }, {});

    const tradeProfits = trades.filter(t => t.result === 'win').reduce((sum, t) => sum + (t.expectedProfit || 0), 0);
    const completedInvestProfits = investments.filter(i => i.status === 'completed').reduce((sum, i) => sum + (i.expectedProfit || 0), 0);
    const totalRewards = users.reduce((sum, u) => sum + (u.referralEarnings || 0), 0);

    const activeInvestments = investments.filter(i => i.status === 'active');
    const futureDueProfits = activeInvestments.reduce((sum, i) => sum + (i.expectedProfit || 0), 0);

    const totalUserBalances = users.reduce((sum, u) => sum + (u.totalBalance || 0), 0);
    const netPlatformProfit = totalDepositsValue - (totalUserBalances + futureDueProfits);

    return {
      totalDepositsValue,
      pendingDepositsValue,
      pendingDepositsCount: pendingDeposits.length,
      totalWithdrawalsValue,
      tradeProfits,
      investProfits: completedInvestProfits,
      futureDueProfits,
      totalRewards,
      totalUserBalances,
      netPlatformProfit,
      depositsByMethod,
      withdrawalsByMethod,
      userCount: users.length,
      solvencyRatio: (totalDepositsValue / (totalUserBalances + futureDueProfits || 1)) * 100
    };
  }, [users, deposits, withdrawals, investments, trades, now]);

  const isLoading = loadingUsers || loadingDeposits || loadingWithdrawals || loadingInvestments || loadingTrades;

  return (
    <Shell isAdmin>
      <div className="space-y-10 px-6 pt-10 pb-32 max-w-[1600px] mx-auto font-body text-right" dir="rtl">
        
        <ReportsHeader now={now} />

        {isLoading ? (
          <div className="py-48 text-center flex flex-col items-center gap-6">
             <div className="h-20 w-20 border-[3px] border-gray-100 border-t-emerald-500 rounded-full animate-spin" />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري تدقيق السجلات المالية وفهرسة الميزانية...</p>
          </div>
        ) : stats ? (
          <div className="space-y-12">
            
            <ProfitKPIs stats={stats} />

            <div className="grid gap-10 lg:grid-cols-12">
               <div className="lg:col-span-8 space-y-10">
                  <YieldDistribution stats={stats} />
                  <LiquidityNodes stats={stats} />
               </div>

               <div className="lg:col-span-4 space-y-10">
                  <ReportsSidebar stats={stats} />
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-10 opacity-20 select-none">
               <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em] text-center">Namix Sovereign Ledger v1.2.0</p>
               <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
               </div>
            </div>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}
