
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { 
  ChevronLeft, 
  Settings, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Zap,
  ZapOff
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, onSnapshot, query, collection, where } from "firebase/firestore";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { GrowthSection } from "@/components/profile/GrowthSection";
import { FinancialSection } from "@/components/profile/FinancialSection";
import { SupportSection } from "@/components/profile/SupportSection";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { SuccessDialog } from "@/components/profile/SuccessDialog";

/**
 * @fileOverview صفحة الملف الشخصي v24.0 - Full Ledger Accounting
 * تم تحديث محرك الاحتساب ليعتمد على السجلات السيادية الموثقة فقط.
 */

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [autoInvestSuccess, setAutoInvestSuccess] = useState(false);
  const [autoInvestOffSuccess, setAutoInvestOffSuccess] = useState(false);
  
  const router = useRouter();
  const db = useFirestore();

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      setUser(JSON.parse(userSession));
    } else {
      router.push("/login");
    }
  }, [router]);

  const userDocRef = useMemoFirebase(() => user?.id ? doc(db, "users", user.id) : null, [db, user?.id]);
  const { data: dbUser } = useDoc(userDocRef);

  const tiersDocRef = useMemoFirebase(() => doc(db, "system_settings", "investor_tiers"), [db]);
  const { data: tiersData } = useDoc(tiersDocRef);

  // --- محرك الاحتساب المحاسبي السيادي (Sovereign Ledger Engine) ---

  const investmentsQuery = useMemoFirebase(() => {
    if (!user?.id) return null;
    return query(collection(db, "investments"), where("userId", "==", user.id));
  }, [db, user?.id]);
  const { data: investments } = useCollection(investmentsQuery);

  const depositsQuery = useMemoFirebase(() => {
    if (!user?.id) return null;
    return query(collection(db, "deposit_requests"), where("userId", "==", user.id), where("status", "==", "approved"));
  }, [db, user?.id]);
  const { data: allDeposits } = useCollection(depositsQuery);

  const withdrawalsQuery = useMemoFirebase(() => {
    if (!user?.id) return null;
    return query(collection(db, "withdraw_requests"), where("userId", "==", user.id), where("status", "==", "approved"));
  }, [db, user?.id]);
  const { data: allWithdrawals } = useCollection(withdrawalsQuery);

  const tradesQuery = useMemoFirebase(() => {
    if (!user?.id) return null;
    return query(collection(db, "trades"), where("userId", "==", user.id));
  }, [db, user?.id]);
  const { data: allTrades } = useCollection(tradesQuery);

  const dynamicFinancials = useMemo(() => {
    if (!dbUser || !allDeposits || !allWithdrawals || !investments || !allTrades) {
      return { balance: 0, profits: 0, activeInvestments: 0 };
    }

    const initialBonus = dbUser.welcomeBonus || 0;
    const totalDeposits = allDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalWithdrawals = allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    // العقود الاستثمارية المكتملة والمعالجة فقط (isProcessed true)
    const maturedInvs = investments.filter(i => i.status === 'completed' && i.isProcessed === true);
    const maturedProfits = maturedInvs.reduce((sum, i) => sum + (i.expectedProfit || 0), 0);
    const maturedCapitals = maturedInvs.reduce((sum, i) => sum + (i.amount || 0), 0);

    // العقود النشطة (تخصم من الرصيد)
    const activeInvs = investments.filter(i => i.status === 'active');
    const activeInvestmentsTotal = activeInvs.reduce((sum, i) => sum + (i.amount || 0), 0);

    // الصفقات المكتملة والرابحة
    const winTrades = allTrades.filter(t => t.status === 'closed' && t.result === 'win');
    const tradeWinProfits = winTrades.reduce((sum, t) => sum + (t.expectedProfit || 0), 0);
    const tradeWinCapitals = winTrades.reduce((sum, t) => sum + (t.amount || 0), 0);

    // الصفقات الخاسرة (رأس المال يخصم نهائياً)
    const loseTrades = allTrades.filter(t => t.status === 'closed' && t.result === 'lose');
    const tradeLossCapitals = loseTrades.reduce((sum, t) => sum + (t.amount || 0), 0);

    // الصفقات المفتوحة (تخصم من الرصيد كاستثمار نشط)
    const openTrades = allTrades.filter(t => t.status === 'open');
    const openTradesAmount = openTrades.reduce((sum, t) => sum + (t.amount || 0), 0);

    // تطبيق المعادلة السيادية:
    // (المكافأة + الإيداعات + أرباح المكتملة + رؤوس أموال المكتملة + أرباح الصفقات الرابحة + رؤوس أموال الصفقات الرابحة)
    // - (السحوبات + رؤوس أموال العقود النشطة + رؤوس أموال الصفقات المفتوحة + رؤوس أموال الصفقات الخاسرة)
    const balance = (initialBonus + totalDeposits + maturedProfits + maturedCapitals + tradeWinProfits + tradeWinCapitals) 
                    - (totalWithdrawals + activeInvestmentsTotal + openTradesAmount + tradeLossCapitals);

    return {
      balance: Math.max(0, balance),
      profits: maturedProfits + tradeWinProfits,
      activeInvestments: activeInvestmentsTotal + openTradesAmount
    };
  }, [dbUser, allDeposits, allWithdrawals, investments, allTrades]);

  useEffect(() => {
    if (user?.id) {
      const q = query(collection(db, "users"), where("referredBy", "==", user.id));
      const unsub = onSnapshot(q, (snap) => setReferralCount(snap.size));
      return () => unsub();
    }
  }, [user?.id, db]);

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

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#002d4d]" />
    </div>
  );

  return (
    <Shell isAdmin={dbUser?.role === 'admin'}>
      <div className="max-w-6xl mx-auto space-y-12 px-6 pt-8 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-3xl font-black text-[#002d4d] tracking-tight leading-none">ملفي الشخصي</h1>
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-widest mt-1">
               <Sparkles size={10} className="text-[#f9a885]" />
               Sovereign Account Control
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-2xl border border-gray-100 shadow-inner">
             <button 
               onClick={() => router.push("/settings")} 
               className="h-10 w-10 flex items-center justify-center text-[#002d4d] hover:text-blue-600 transition-all active:scale-90 outline-none"
             >
               <Settings className="h-6 w-6" />
             </button>
             <button 
               onClick={() => router.push("/home")} 
               className="h-10 w-10 flex items-center justify-center text-[#002d4d] hover:text-[#f9a885] transition-all active:scale-90 outline-none"
             >
               <ChevronLeft className="h-7 w-7" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
           <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              <ProfileHero 
                user={{ ...dbUser, totalBalance: dynamicFinancials.balance }} 
                referralCount={referralCount} 
                totalInvestments={dynamicFinancials.activeInvestments} 
                calculatedTier={calculatedTier}
              />
              <div className="hidden lg:block">
                <LogoutButton onLogout={() => { localStorage.removeItem("namix_user"); window.location.href = "/"; }} />
              </div>
           </div>
           <div className="lg:col-span-8 space-y-10">
              <GrowthSection dbUser={dbUser} onToggleSuccess={(val) => val ? setAutoInvestSuccess(true) : setAutoInvestOffSuccess(true)} />
              <FinancialSection />
              <SupportSection />
              <div className="lg:hidden pt-4">
                <LogoutButton onLogout={() => { localStorage.removeItem("namix_user"); window.location.href = "/"; }} />
              </div>
           </div>
        </div>

        <SuccessDialog open={autoInvestSuccess} onOpenChange={setAutoInvestSuccess} title="تم تنشيط محرك النمو" description="بروتوكول إعادة الاستثمار التلقائي فعال الآن." icon={Zap} type="auto-invest" />
        <SuccessDialog open={autoInvestOffSuccess} onOpenChange={setAutoInvestOffSuccess} title="تم تعليق محرك النمو" description="لقد تم تعطيل بروتوكول إعادة الاستثمار التلقائي بنجاح." icon={ZapOff} type="auto-invest-off" />
      </div>
    </Shell>
  );
}

export default function ProfilePage() {
  return (
    <Shell isPublic>
      <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d]" /></div>}>
        <ProfileContent />
      </Suspense>
    </Shell>
  );
}
