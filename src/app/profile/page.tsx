
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
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { PinSetupDialog } from "@/components/profile/PinSetupDialog";
import { SuccessDialog } from "@/components/profile/SuccessDialog";

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [pinSetupOpen, setPinSetupOpen] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [autoInvestSuccess, setAutoInvestSuccess] = useState(false);
  const [autoInvestOffSuccess, setAutoInvestOffSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) setUser(JSON.parse(userSession));
    else router.push("/login");
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

  // محرك احتساب الرتبة اللحظي للملف الشخصي
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
    if (action === "setup-pin") setPinSetupOpen(true);
    if (action === "verify") setEditProfileOpen(true);
  }, [searchParams]);

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#002d4d]" />
    </div>
  );

  return (
    <Shell isAdmin={dbUser?.role === 'admin'}>
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-3xl font-black text-[#002d4d] tracking-tight">ملفي الشخصي</h1>
            <div className="flex items-center gap-2 text-blue-500 font-black text-[7px] md:text-[9px] uppercase tracking-widest">
               <Sparkles size={10} className="text-[#f9a885]" />
               Sovereign Account Control
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-100/50 p-1.5 rounded-full border border-gray-100">
             <button 
               onClick={() => setSettingsOpen(true)} 
               className="h-10 w-10 md:h-11 md:w-11 flex items-center justify-center text-[#002d4d] active:scale-90 transition-all hover:text-blue-600"
             >
               <Settings className="h-5 w-5 md:h-5 md:w-5" />
             </button>
             <button 
               onClick={() => router.back()} 
               className="h-10 w-10 md:h-11 md:w-11 flex items-center justify-center text-[#002d4d] active:scale-90 transition-all hover:text-blue-600"
             >
               <ChevronLeft className="h-6 w-6 md:h-6 md:w-6" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
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
           <div className="lg:col-span-8 space-y-10 md:space-y-14">
              <GrowthSection dbUser={dbUser} onToggleSuccess={(val) => val ? setAutoInvestSuccess(true) : setAutoInvestOffSuccess(true)} />
              <FinancialSection />
              <SupportSection />
              <div className="lg:hidden pt-4">
                <LogoutButton onLogout={() => { localStorage.removeItem("namix_user"); window.location.href = "/"; }} />
              </div>
           </div>
        </div>

        <SettingsHubDialog open={settingsOpen} onOpenChange={setSettingsOpen} onOpenEdit={() => setEditProfileOpen(true)} onOpenPassword={() => setChangePasswordOpen(true)} onOpenPin={() => setPinSetupOpen(true)} />
        <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} user={user} dbUser={dbUser} onSuccess={() => setProfileSuccess(true)} />
        <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} userId={user.id} dbUser={dbUser} />
        <PinSetupDialog open={pinSetupOpen} onOpenChange={setPinSetupOpen} dbUser={dbUser} />

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
