
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
import { ShieldCheck, Sparkles, Loader2, Coins, UserPlus, Cpu } from "lucide-react";

// Modular Components
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { SettingsMenu } from "@/components/admin/settings/SettingsMenu";
import { WithdrawMethodsSection } from "@/components/admin/settings/WithdrawMethodsSection";
import { DepositLogicSection } from "@/components/admin/settings/DepositLogicSection";
import { WithdrawLogicSection } from "@/components/admin/settings/WithdrawLogicSection";
import { TiersSection } from "@/components/admin/settings/TiersSection";
import { MarketingSection } from "@/components/admin/settings/MarketingSection";
import { VoucherLogicSection } from "@/components/admin/settings/VoucherLogicSection";
import { VaultBonusSection } from "@/components/admin/settings/VaultBonusSection";
import { PartnershipSection } from "@/components/admin/settings/PartnershipSection";
import { ContentSection } from "@/components/admin/settings/ContentSection";
import { LegalSection } from "@/components/admin/settings/LegalSection";
import { LandingPageSection } from "@/components/admin/settings/LandingPageSection";

type SettingSection = 'menu' | 'withdraw_logic' | 'deposit_logic' | 'withdraw_methods' | 'tiers' | 'marketing' | 'content' | 'legal' | 'partnership' | 'vault_bonus' | 'onboarding' | 'insurance' | 'voucher_logic' | 'binance' | 'landing_page';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('menu');
  const [saving, setSaving] = useState(false);
  const db = useFirestore();

  // --- Real-time Data Refs ---
  const binanceRef = useMemoFirebase(() => doc(db, "system_settings", "binance"), [db]);
  const { data: remoteBinance } = useDoc(binanceRef);
  const [binanceData, setBinanceData] = useState<any>({ apiKey: "", apiSecret: "" });

  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: remoteLanding } = useDoc(landingRef);
  const [landingData, setLandingData] = useState<any>({});

  const onboardingRef = useMemoFirebase(() => doc(db, "system_settings", "onboarding"), [db]);
  const { data: remoteOnboarding } = useDoc(onboardingRef);
  const [onboardingData, setOnboardingOnboardingData] = useState<any>({});

  const insuranceRef = useMemoFirebase(() => doc(db, "system_settings", "insurance"), [db]);
  const { data: remoteInsurance } = useDoc(insuranceRef);
  const [insuranceData, setInsuranceData] = useState<any>({});

  const rulesRef = useMemoFirebase(() => doc(db, "system_settings", "withdrawal_rules"), [db]);
  const { data: remoteRules } = useDoc(rulesRef);
  const [rulesData, setRulesData] = useState<any>({});

  const vaultBonusRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: remoteVaultBonus } = useDoc(vaultBonusRef);
  const [vaultBonusData, setVaultBonusData] = useState<any>({});

  const voucherRef = useMemoFirebase(() => doc(db, "system_settings", "voucher_rules"), [db]);
  const { data: remoteVoucher } = useDoc(voucherRef);
  const [voucherData, setVoucherData] = useState<any>({});

  const tiersRef = useMemoFirebase(() => doc(db, "system_settings", "investor_tiers"), [db]);
  const { data: remoteTiers } = useDoc(tiersRef);
  const [tiersList, setTiersList] = useState<any[]>([]);

  const marketingRef = useMemoFirebase(() => doc(db, "system_settings", "marketing"), [db]);
  const { data: remoteMarketing } = useDoc(marketingRef);
  const [marketingData, setMarketingData] = useState<any>({});

  const partnershipRef = useMemoFirebase(() => doc(db, "system_settings", "partnership"), [db]);
  const { data: remotePartnership } = useDoc(partnershipRef);
  const [partnershipData, setPartnershipData] = useState<any>({});

  const legalRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: remoteLegal } = useDoc(legalRef);
  const [legalData, setLegalData] = useState<any>({});

  useEffect(() => {
    if (remoteBinance) setBinanceData(remoteBinance);
    if (remoteLanding) setLandingData(remoteLanding);
    if (remoteOnboarding) setOnboardingOnboardingData(remoteOnboarding);
    if (remoteInsurance) setInsuranceData(remoteInsurance);
    if (remoteRules) setRulesData(remoteRules);
    if (remoteVaultBonus) setVaultBonusData(remoteVaultBonus);
    if (remoteVoucher) setVoucherData(remoteVoucher);
    if (remoteTiers) setTiersList(remoteTiers.list || []);
    if (remoteMarketing) setMarketingData(remoteMarketing);
    if (remotePartnership) setPartnershipData(remotePartnership);
    if (remoteLegal) setLegalData(remoteLegal);
  }, [remoteBinance, remoteLanding, remoteOnboarding, remoteInsurance, remoteRules, remoteTiers, remoteMarketing, remoteVoucher, remoteVaultBonus, partnershipRef, remoteLegal]);

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
      <div className="max-w-6xl mx-auto space-y-10 px-6 pt-10 pb-24 font-body">
        
        <SettingsHeader 
          activeSection={activeSection} 
          onBack={() => setActiveSection('menu')} 
        />

        {activeSection === 'menu' && (
          <SettingsMenu onSelect={(id) => setActiveSection(id as any)} />
        )}

        {activeSection === 'landing_page' && (
          <LandingPageSection 
            data={landingData} 
            onChange={setLandingData} 
            onSave={() => handleSaveDoc(landingRef, landingData, "واجهة الهبوط")} 
            saving={saving} 
          />
        )}

        {activeSection === 'binance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-6">
            <Card className="rounded-[48px] border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-blue-600 p-10 border-b border-white/10 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu className="h-32 w-32" /></div>
                <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                    <Cpu className="h-8 w-8 text-[#f9a885]" />
                  </div>
                  إدارة بروتوكول Binance API
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="grid gap-8">
                  <div className="space-y-3">
                    <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">Binance API Key</Label>
                    <Input 
                      value={binanceData.apiKey || ""} 
                      onChange={e => setBinanceData({...binanceData, apiKey: e.target.value})}
                      className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner"
                      placeholder="أدخل مفتاح الـ API..."
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">Binance API Secret</Label>
                    <Input 
                      type="password"
                      value={binanceData.apiSecret || ""} 
                      onChange={e => setBinanceData({...binanceData, apiSecret: e.target.value})}
                      className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner"
                      placeholder="••••••••••••••••••••••••"
                    />
                  </div>
                </div>

                <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-5">
                   <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                   </div>
                   <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed pt-1">
                     تستخدم هذه المفاتيح لتأمين الاتصال بمحفظة الإيداعات الخاصة بك للتحقق من وصول المبالغ لحظياً. تأكد من منح صلاحيات "Read Only" و "Deposit History" فقط لهذه المفاتيح في بينانس.
                   </p>
                </div>

                <Button onClick={() => handleSaveDoc(binanceRef, binanceData, "إعدادات بينانس")} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl transition-all active:scale-95 group">
                  {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                    <div className="flex items-center gap-3">
                      <span>تثبيت مفاتيح الوصول السيادية</span>
                      <Cpu className="h-5 w-5 text-[#f9a885]" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'onboarding' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-6">
            <Card className="rounded-[48px] border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-blue-50/50 p-10 border-b border-gray-50">
                <CardTitle className="text-xl font-black text-[#002d4d] flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  إعدادات الرصيد الترحيبي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pr-4">مبلغ رصيد النمو للمستثمرين الجدد ($)</Label>
                  <Input 
                    type="number" 
                    value={onboardingData.trialCreditAmount ?? ""} 
                    onChange={e => setOnboardingOnboardingData({...onboardingData, trialCreditAmount: Number(e.target.value)})}
                    className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl text-blue-600 shadow-inner"
                  />
                  <p className="text-[10px] font-bold text-gray-400 text-right pr-4">يُمنح هذا الرصيد لمرة واحدة فقط عند تسجيل الحساب لأول مرة.</p>
                </div>
                <Button onClick={() => handleSaveDoc(onboardingRef, onboardingData, "رصيد الترحيب")} disabled={saving} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black">
                  {saving ? <Loader2 className="animate-spin h-5 w-5" /> : "اعتماد إعدادات الترحيب"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'insurance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-6">
            <Card className="rounded-[48px] border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-emerald-50/50 p-10 border-b border-gray-100">
                <CardTitle className="text-xl font-black text-emerald-700 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-inner">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  صندوق حماية رأس المال
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                  <div className="space-y-1">
                    <Label className="font-black text-base text-[#002d4d]">عرض العداد الحي للمستثمرين</Label>
                    <p className="text-[10px] font-bold text-gray-400">تفعيل هذه الميزة يزيد من موثوقية المنصة للمستخدمين الجدد.</p>
                  </div>
                  <Switch checked={!!insuranceData.isFundVisible} onCheckedChange={val => setInsuranceData({...insuranceData, iIsFundVisible: val})} />
                </div>
                <div className="space-y-4">
                  <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pr-4">حجم صندوق الحماية الفعلي ($)</Label>
                  <Input 
                    type="number" 
                    value={insuranceData.fundSize ?? ""} 
                    onChange={e => setInsuranceData({...insuranceData, fundSize: Number(e.target.value)})}
                    className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl text-emerald-600 shadow-inner"
                  />
                </div>
                <Button onClick={() => handleSaveDoc(insuranceRef, insuranceData, "صندوق الحماية")} disabled={saving} className="w-full h-16 rounded-full bg-emerald-600 text-white font-black">
                  {saving ? <Loader2 className="animate-spin h-5 w-5" /> : "تفعيل بروتوكول الحماية المحدث"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'vault_bonus' && (
          <VaultBonusSection 
            data={vaultBonusData} 
            onChange={setVaultBonusData} 
            onSave={() => handleSaveDoc(vaultBonusRef, vaultBonusData, "المكافآت والخزنة")}
            saving={saving}
          />
        )}

        {activeSection === 'voucher_logic' && (
          <VoucherLogicSection 
            data={voucherData} 
            onChange={setVoucherData} 
            onSave={() => handleSaveDoc(voucherRef, voucherData, "قوانين القسائم")}
            saving={saving}
          />
        )}

        {activeSection === 'withdraw_methods' && (
          <WithdrawMethodsSection />
        )}

        {activeSection === 'deposit_logic' && (
          <DepositLogicSection />
        )}

        {activeSection === 'withdraw_logic' && (
          <WithdrawLogicSection 
            data={rulesData} 
            onChange={setRulesData} 
            onSave={() => handleSaveDoc(rulesRef, rulesData, "قوانين السحب")}
            saving={saving}
          />
        )}

        {activeSection === 'partnership' && (
          <PartnershipSection 
            data={partnershipData} 
            onChange={setPartnershipData} 
            onSave={() => handleSaveDoc(partnershipRef, partnershipData, "نظام الشركاء")}
            saving={saving}
          />
        )}

        {activeSection === 'tiers' && (
          <TiersSection 
            tiers={tiersList} 
            onChange={setTiersList} 
            onSave={() => handleSaveDoc(tiersRef, { list: tiersList }, "نظام الرتب")}
            saving={saving}
          />
        )}

        {activeSection === 'marketing' && (
          <MarketingSection 
            data={marketingData} 
            onChange={setMarketingData} 
            onSave={() => handleSaveDoc(marketingRef, marketingData, "إعدادات الظهور")}
            saving={saving}
          />
        )}

        {activeSection === 'content' && (
          <ContentSection 
            data={legalData} 
            onChange={setLegalData} 
            onSave={() => handleSaveDoc(legalRef, legalData, "قاعدة المعرفة")}
            saving={saving}
          />
        )}

        {activeSection === 'legal' && (
          <LegalSection 
            data={legalData} 
            onChange={setLegalData} 
            onSave={() => handleSaveDoc(legalRef, legalData, "المواثيق القانونية")}
            saving={saving}
          />
        )}

        {/* Branding Footer */}
        <div className="flex flex-col items-center gap-4 pt-10 opacity-30">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.6em] tracking-none">Namix Core System v4.8.2</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-200" />
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
