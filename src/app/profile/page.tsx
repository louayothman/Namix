
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, onSnapshot, query, collection, where } from "firebase/firestore";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { GrowthSection } from "@/components/profile/GrowthSection";
import { FinancialSection } from "@/components/profile/FinancialSection";
import { SupportSection } from "@/components/profile/SupportSection";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { SettingsHubDialog } from "@/components/profile/SettingsHubDialog";
import { SuccessDialog } from "@/components/profile/SuccessDialog";

/**
 * @fileOverview صفحة الملف الشخصي السيادي v12.0 - Stability & Speed Update
 * تم إعادة بناء الصفحة لتكون خالية من القيم الاعتباطية التي قد تسبب تعطل النظام.
 */

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [autoInvestSuccess, setAutoInvestSuccess] = useState(false);
  const [autoInvestOffSuccess, setAutoInvestOffSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
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
      balance: dbUser.totalBalance || 0,
      profits: dbUser.totalProfits || 0,
      historical: (dbUser.activeInvestmentsTotal || 0) + (dbUser.totalProfits || 0),
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
  }, [dbUser, tiersData, referralCount]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "setup-pin" || action === "verify") setSettingsOpen(true);
  }, [searchParams]);

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#002d4d]" />
    </div>
  );

  return (
    <Shell isAdmin={dbUser?.role === 'admin'}>
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 px-6 pt-8 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-3xl font-black text-[#002d4d] tracking-tight leading-none">ملفي الشخصي</h1>
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-widest mt-1">
               <Sparkles size={10} className="text-[#f9a885]" />
               Sovereign Account Control
            </div>
          </div>

          {/* كبسولة التحكم الشفافة */}
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setSettingsOpen(true)} 
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
                user={dbUser || user} 
                referralCount={referralCount} 
                totalInvestments={dbUser?.activeInvestmentsTotal || 0} 
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

        <SettingsHubDialog 
          open={settingsOpen} 
          onOpenChange={setSettingsOpen} 
          user={user}
          dbUser={dbUser}
          onProfileUpdate={() => setProfileSuccess(true)}
        />

        <SuccessDialog open={profileSuccess} onOpenChange={setProfileSuccess} title="تم تحديث الهوية" description="تم تأمين وحفظ بياناتك الشخصية المحدثة بنجاح." icon={ShieldCheck} type="profile" />
        <SuccessDialog open={autoInvestSuccess} onOpenChange={setAutoInvestSuccess} title="تم تنشيط محرك النمو" description="بروتوكول إعادة الاستثمار التلقائي فعال الآن." icon={Zap} type="auto-invest" />
        <SuccessDialog open={autoInvestOffSuccess} onOpenChange={setAutoInvestOffSuccess} title="تم تعليق محرك النمو" description="لقد تم تعطيل بروتوكول إعادة الاستثمار التلقائي بنجاح." icon={ZapOff} type="auto-invest-off" />
      </div>
    </Shell>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d]" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
