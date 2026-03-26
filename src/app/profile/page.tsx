
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { ChevronRight, Settings, Loader2 } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, onSnapshot, query, collection, where } from "firebase/firestore";
import Link from "next/link";

// Modular Components
import { ProfileHero } from "@/components/profile/ProfileHero";
import { GrowthSection } from "@/components/profile/GrowthSection";
import { FinancialSection } from "@/components/profile/FinancialSection";
import { SupportSection } from "@/components/profile/SupportSection";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { SettingsHubDialog } from "@/components/profile/SettingsHubDialog";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog";
import { PinSetupDialog } from "@/components/profile/PinSetupDialog";
import { GiftVoucherDialog } from "@/components/profile/GiftVoucherDialog";
import { SuccessDialog } from "@/components/profile/SuccessDialog";
import { ShieldCheck, Zap, ZapOff, Gift, Coins } from "lucide-react";

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  
  // Dialog States
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [pinSetupOpen, setPinSetupOpen] = useState(false);
  const [giftVoucherOpen, setGiftVoucherOpen] = useState(false);
  
  // Success States
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [autoInvestSuccess, setAutoInvestSuccess] = useState(false);
  const [autoInvestOffSuccess, setAutoInvestOffSuccess] = useState(false);
  const [voucherCreateSuccess, setVoucherCreateSuccess] = useState(false);
  const [voucherRedeemSuccess, setVoucherRedeemSuccess] = useState(false);
  const [redeemedAmount, setRedeemAmount] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");

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

  useEffect(() => {
    if (user?.id) {
      const q = query(collection(db, "users"), where("referredBy", "==", user.id));
      const unsub = onSnapshot(q, (snap) => setReferralCount(snap.size));
      return () => unsub();
    }
  }, [user?.id, db]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "issue-voucher") setGiftVoucherOpen(true);
    if (action === "setup-pin") setPinSetupOpen(true);
    if (action === "verify") setEditProfileOpen(true);
  }, [searchParams]);

  if (!user) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d]" /></div>;

  return (
    <Shell isAdmin={dbUser?.role === 'admin'}>
      <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Superior Header Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => router.back()} 
               className="h-12 w-12 rounded-[20px] bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#002d4d] active:scale-90 transition-all hover:shadow-md"
             >
               <ChevronRight className="h-6 w-6" />
             </button>
             <div className="space-y-0.5">
                <h1 className="text-2xl font-black text-[#002d4d] tracking-tight">ملفي الشخصي</h1>
                <p className="text-[8px] font-black text-blue-50 uppercase tracking-widest leading-none">Sovereign Management</p>
             </div>
          </div>
          
          <button 
            onClick={() => setSettingsOpen(true)}
            className="h-12 w-12 rounded-[20px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl active:scale-90 transition-all"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <ProfileHero 
          user={dbUser || user} 
          referralCount={referralCount}
          totalInvestments={dbUser?.activeInvestmentsTotal || 0}
        />

        <div className="space-y-8">
          <GrowthSection 
            dbUser={dbUser} 
            onOpenVouchers={() => setGiftVoucherOpen(true)}
            onToggleSuccess={(val) => val ? setAutoInvestSuccess(true) : setAutoInvestOffSuccess(true)}
          />

          <FinancialSection />

          <SupportSection />
        </div>
        
        <LogoutButton onLogout={() => { localStorage.removeItem("namix_user"); router.push("/login"); }} />

        {/* DIALOGS HUB */}
        <SettingsHubDialog 
          open={settingsOpen} 
          onOpenChange={setSettingsOpen} 
          onOpenEdit={() => setEditProfileOpen(true)}
          onOpenPassword={() => setChangePasswordOpen(true)}
          onOpenPin={() => setPinSetupOpen(true)}
        />

        <EditProfileDialog 
          open={editProfileOpen} 
          onOpenChange={setEditProfileOpen} 
          user={user}
          dbUser={dbUser}
          onSuccess={() => setProfileSuccess(true)}
        />

        <ChangePasswordDialog 
          open={changePasswordOpen}
          onOpenChange={changePasswordOpen}
          userId={user.id}
          dbUser={dbUser}
        />

        <PinSetupDialog 
          open={pinSetupOpen} 
          onOpenChange={setPinSetupOpen} 
          dbUser={dbUser} 
        />

        <GiftVoucherDialog 
          open={giftVoucherOpen} 
          onOpenChange={setGiftVoucherOpen}
          user={user}
          dbUser={dbUser}
          onIssueSuccess={(code) => { setVoucherCode(code); setVoucherCreateSuccess(true); }}
          onRedeemSuccess={(amt) => { setRedeemAmount(amt); setVoucherRedeemSuccess(true); }}
        />

        {/* FEEDBACK OVERLAYS */}
        <SuccessDialog open={profileSuccess} onOpenChange={setProfileSuccess} title="تم تحديث الهوية" description="تم تأمين وحفظ بياناتك الشخصية المحدثة بنجاح." icon={ShieldCheck} type="profile" />
        <SuccessDialog open={autoInvestSuccess} onOpenChange={setAutoInvestSuccess} title="تم تنشيط محرك النمو" description="بروتوكول إعادة الاستثمار التلقائي فعال الآن." icon={Zap} type="auto-invest" />
        <SuccessDialog open={autoInvestOffSuccess} onOpenChange={setAutoInvestOffSuccess} title="تم تعليق محرك النمو" description="لقد تم تعطيل بروتوكول إعادة الاستثمار التلقائي بنجاح." icon={ZapOff} type="auto-invest-off" />
        <SuccessDialog open={voucherCreateSuccess} onOpenChange={setVoucherCreateSuccess} title="تم إصدار الصك" description="تم إصدار قسيمة الهدية بنجاح وتم خصم المبلغ من رصيدك." icon={Gift} type="voucher-create" extraData={voucherCode} />
        <SuccessDialog open={voucherRedeemSuccess} onOpenChange={setVoucherRedeemSuccess} title="اكتمال تدفق السيولة" description={`تم التحقق من الصك الاستثمار بنجاح. تمت إضافة مبلغ $${redeemedAmount} إلى محفظتك.`} icon={Coins} type="voucher-redeem" />
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
