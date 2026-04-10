
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
import { ShieldCheck, Sparkles, Loader2, Coins, UserPlus, Cpu, Globe, Zap, BarChart3, TrendingUp, KeyRound, Lock } from "lucide-react";

// Modular Components
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { SettingsMenu } from "@/components/admin/settings/SettingsMenu";
// ... other imports stay same

type SettingSection = 'menu' | 'withdraw_logic' | 'deposit_logic' | 'withdraw_methods' | 'tiers' | 'marketing' | 'content' | 'legal' | 'partnership' | 'vault_bonus' | 'onboarding' | 'insurance' | 'voucher_logic' | 'connectivity' | 'landing_page';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('menu');
  const [saving, setSaving] = useState(false);
  const db = useFirestore();

  const connectivityRef = useMemoFirebase(() => doc(db, "system_settings", "connectivity"), [db]);
  const { data: remoteConnectivity } = useDoc(connectivityRef);
  const [connectivityData, setConnectivityData] = useState<any>({ 
    binanceApiKey: "", 
    binanceApiSecret: "",
    nowPaymentsApiKey: "",
    nowPaymentsIpnSecret: ""
  });

  // ... (Other useEffects and data fetching remain unchanged)

  useEffect(() => {
    if (remoteConnectivity) setConnectivityData({ ...connectivityData, ...remoteConnectivity });
  }, [remoteConnectivity]);

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
          <SettingsMenu onSelect={(id) => setActiveSection(id as any)} />
        )}

        {activeSection === 'connectivity' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-left-6">
            <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-[#002d4d] p-10 border-b border-white/10 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Globe className="h-32 w-32" /></div>
                <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                    <Zap className="h-8 w-8 text-[#f9a885]" />
                  </div>
                  مركز مزامنة البيانات الخارجية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-12">
                
                {/* BINANCE CONFIG */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                       <Cpu className="h-5 w-5 text-orange-500" />
                    </div>
                    <h3 className="font-black text-lg text-[#002d4d]">بروتوكول Binance (العملات الرقمية)</h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="font-black text-[11px] text-gray-400 uppercase pr-4">Binance API Key</Label>
                      <Input value={connectivityData.binanceApiKey || ""} onChange={e => setConnectivityData({...connectivityData, binanceApiKey: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-black text-[11px] text-gray-400 uppercase pr-4">Binance API Secret</Label>
                      <Input type="password" value={connectivityData.binanceApiSecret || ""} onChange={e => setConnectivityData({...connectivityData, binanceApiSecret: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* NOWPAYMENTS CONFIG */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                       <KeyRound className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-black text-lg text-[#002d4d]">بروتوكول NOWPayments (الإيداع الآلي)</h3>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label className="font-black text-[11px] text-gray-400 uppercase pr-4">NOWPayments API Key</Label>
                      <Input value={connectivityData.nowPaymentsApiKey || ""} onChange={e => setConnectivityData({...connectivityData, nowPaymentsApiKey: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-black text-[11px] text-gray-400 uppercase pr-4">IPN Secret Key</Label>
                      <Input type="password" value={connectivityData.nowPaymentsIpnSecret || ""} onChange={e => setConnectivityData({...connectivityData, nowPaymentsIpnSecret: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-5">
                   <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                   </div>
                   <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed pt-1">
                     تم دمج بروتوكول NOWPayments لتمكين الإيداع الآلي عبر الحسابات الشخصية. تأكد من إدخال IPN Secret وتفعيل رابط الـ Webhook في لوحة تحكم المزود لضمان حقن الرصيد اللحظي.
                   </p>
                </div>

                <Button onClick={() => handleSaveDoc(connectivityRef, connectivityData, "توصيلات الأسواق والمدفوعات")} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl transition-all active:scale-95 group">
                  {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                    <div className="flex items-center gap-3">
                      <span>تثبيت بروتوكولات الربط السيادية</span>
                      <Sparkles className="h-5 w-5 text-[#f9a885] rotate-12" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ... (Other activeSection cases remain unchanged) */}

        <div className="flex flex-col items-center gap-4 pt-10 opacity-30">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.6em]">Namix System v7.0.0</p>
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
