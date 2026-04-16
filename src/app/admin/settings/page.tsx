
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Sparkles, Loader2, Coins, UserPlus, Globe, Zap, BarChart3, TrendingUp, Lock } from "lucide-react";

// Modular Components
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { SettingsMenu } from "@/components/admin/settings/SettingsMenu";
import { WithdrawLogicSection } from "@/components/admin/settings/WithdrawLogicSection";
import { TiersSection } from "@/components/admin/settings/TiersSection";
import { MarketingSection } from "@/components/admin/settings/MarketingSection";
import { ContentSection } from "@/components/admin/settings/ContentSection";
import { LegalSection } from "@/components/admin/settings/LegalSection";
import { PartnershipSection } from "@/components/admin/settings/PartnershipSection";
import { VaultBonusSection } from "@/components/admin/settings/VaultBonusSection";
import { LandingPageSection } from "@/components/admin/settings/LandingPageSection";

/**
 * @fileOverview صفحة إعدادات المنصة المحدثة v11.0
 * تم إزالة صندوق التأمين وحماية رأس المال نهائياً بناءً على رغبة المستخدم.
 */

type SettingSection = 'menu' | 'withdraw_logic' | 'tiers' | 'marketing' | 'content' | 'legal' | 'partnership' | 'vault_bonus' | 'onboarding' | 'voucher_logic' | 'landing_page';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('menu');
  const [saving, setSaving] = useState(false);
  const db = useFirestore();

  // Settings State Hooks
  const withdrawRulesRef = useMemoFirebase(() => doc(db, "system_settings", "withdrawal_rules"), [db]);
  const { data: remoteWithdrawRules } = useDoc(withdrawRulesRef);
  const [withdrawRulesData, setWithdrawRulesData] = useState<any>({});

  const tiersRef = useMemoFirebase(() => doc(db, "system_settings", "investor_tiers"), [db]);
  const { data: remoteTiers } = useDoc(tiersRef);
  const [tiersData, setTiersData] = useState<any[]>([]);

  const marketingRef = useMemoFirebase(() => doc(db, "system_settings", "marketing"), [db]);
  const { data: remoteMarketing } = useDoc(marketingRef);
  const [marketingData, setMarketingData] = useState<any>({});

  const legalRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: remoteLegal } = useDoc(legalRef);
  const [legalData, setLegalData] = useState<any>({});

  const partnershipRef = useMemoFirebase(() => doc(db, "system_settings", "partnership"), [db]);
  const { data: remotePartnership } = useDoc(partnershipRef);
  const [partnershipData, setPartnershipData] = useState<any>({});

  const vaultBonusRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: remoteVaultBonus } = useDoc(vaultBonusRef);
  const [vaultBonusData, setVaultBonusData] = useState<any>({});

  const academyRef = useMemoFirebase(() => doc(db, "system_settings", "academy"), [db]);
  const { data: remoteAcademy } = useDoc(academyRef);
  const [academyData, setAcademyData] = useState<any>({});

  const onboardingRef = useMemoFirebase(() => doc(db, "system_settings", "onboarding"), [db]);
  const { data: remoteOnboarding } = useDoc(onboardingRef);
  const [onboardingData, setOnboardingData] = useState<any>({});

  const voucherRulesRef = useMemoFirebase(() => doc(db, "system_settings", "voucher_rules"), [db]);
  const { data: remoteVoucherRules } = useDoc(voucherRulesRef);
  const [voucherRulesData, setVoucherRulesData] = useState<any>({});

  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: remoteLanding } = useDoc(landingRef);
  const [landingData, setLandingData] = useState<any>({});

  useEffect(() => {
    if (remoteWithdrawRules) setWithdrawRulesData(remoteWithdrawRules);
    if (remoteTiers?.list) setTiersData(remoteTiers.list);
    if (remoteMarketing) setMarketingData(remoteMarketing);
    if (remoteLegal) setLegalData(remoteLegal);
    if (remotePartnership) setPartnershipData(remotePartnership);
    if (remoteVaultBonus) setVaultBonusData(remoteVaultBonus);
    if (remoteAcademy) setAcademyData(remoteAcademy);
    if (remoteOnboarding) setOnboardingData(remoteOnboarding);
    if (remoteVoucherRules) setVoucherRulesData(remoteVoucherRules);
    if (remoteLanding) setLandingData(remoteLanding);
  }, [remoteWithdrawRules, remoteTiers, remoteMarketing, remoteLegal, remotePartnership, remoteVaultBonus, remoteAcademy, remoteOnboarding, remoteVoucherRules, remoteLanding]);

  const handleSaveDoc = async (ref: any, data: any, title: string) => {
    setSaving(true);
    try {
      await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم التحديث بنجاح", description: `تم تحديث ${title} بنجاح.` });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-6xl mx-auto space-y-10 px-6 pt-10 pb-24 font-body text-right" dir="rtl">
        
        <SettingsHeader 
          activeSection={activeSection} 
          onBack={() => setActiveSection('menu')} 
        />

        {activeSection === 'menu' && (
          <SettingsMenu onSelect={(id) => {
            if (id === 'deposit_logic') { window.location.href = "/admin/deposits"; return; }
            if (id === 'withdraw_methods') { window.location.href = "/admin/withdrawals"; return; }
            setActiveSection(id as any);
          }} />
        )}

        {activeSection === 'withdraw_logic' && (
          <WithdrawLogicSection data={withdrawRulesData} onChange={setWithdrawRulesData} onSave={() => handleSaveDoc(withdrawRulesRef, withdrawRulesData, "قوانين السحب")} saving={saving} />
        )}

        {activeSection === 'tiers' && (
          <TiersSection tiers={tiersData} onChange={setTiersData} onSave={() => handleSaveDoc(tiersRef, { list: tiersData }, "نظام الرتب")} saving={saving} />
        )}

        {activeSection === 'marketing' && (
          <MarketingSection data={marketingData} onChange={setMarketingData} onSave={() => handleSaveDoc(marketingRef, marketingData, "التسويق والظهور")} saving={saving} />
        )}

        {activeSection === 'content' && (
          <ContentSection data={legalData} onChange={setLegalData} academyData={academyData} onAcademyChange={setAcademyData} onSave={() => handleSaveDoc(legalRef, legalData, "المحتوى")} onAcademySave={() => handleSaveDoc(academyRef, academyData, "الأكاديمية")} saving={saving} />
        )}

        {activeSection === 'legal' && (
          <LegalSection data={legalData} onChange={setLegalData} onSave={() => handleSaveDoc(legalRef, legalData, "المواثيق القانونية")} saving={saving} />
        )}

        {activeSection === 'partnership' && (
          <PartnershipSection data={partnershipData} onChange={setPartnershipData} onSave={() => handleSaveDoc(partnershipRef, partnershipData, "نظام الشركاء")} saving={saving} />
        )}

        {activeSection === 'vault_bonus' && (
          <VaultBonusSection data={vaultBonusData} onChange={setVaultBonusData} onSave={() => handleSaveDoc(vaultBonusRef, vaultBonusData, "الخزنة والمكافآت")} saving={saving} />
        )}

        {activeSection === 'landing_page' && (
          <LandingPageSection data={landingData} onChange={setLandingData} onSave={() => handleSaveDoc(landingRef, landingData, "صفحة الهبوط")} saving={saving} />
        )}

        {activeSection === 'onboarding' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-6">
            <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-blue-600 p-10 text-white flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-black flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
                    <UserPlus className="h-8 w-8 text-white" />
                  </div>
                  بروتوكول ترحيب المستثمرين الجدد
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner flex flex-col items-center gap-6">
                   <Label className="text-sm font-black text-[#002d4d]">رصيد التجربة المجاني عند التسجيل ($)</Label>
                   <Input type="number" value={onboardingData.trialCreditAmount ?? ""} onChange={e => setOnboardingData({...onboardingData, trialCreditAmount: Number(e.target.value)})} className="h-20 rounded-[32px] bg-white border-none font-black text-center text-5xl text-blue-600 shadow-lg max-w-[240px]" />
                </div>
                <Button onClick={() => handleSaveDoc(onboardingRef, onboardingData, "رصيد الترحيب")} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-xl active:scale-95">
                  {saving ? <Loader2 className="animate-spin h-6 w-6" /> : "اعتماد ميزانية الترحيب"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'voucher_logic' && (
          <WithdrawLogicSection data={voucherRulesData} onChange={setVoucherRulesData} onSave={() => handleSaveDoc(voucherRulesRef, voucherRulesData, "قوانين القسائم")} saving={saving} />
        )}

        <div className="flex flex-col items-center gap-4 pt-10 opacity-30">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.6em]">Namix System v11.0.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-200" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
