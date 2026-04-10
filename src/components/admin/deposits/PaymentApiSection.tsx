
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { 
  Globe, 
  Cpu, 
  KeyRound, 
  Database, 
  Save, 
  Loader2, 
  ShieldCheck, 
  Zap,
  Activity,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PaymentApiSection() {
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  const connectivityRef = useMemoFirebase(() => doc(db, "system_settings", "connectivity"), [db]);
  const { data: remoteConnectivity } = useDoc(connectivityRef);

  const [apiData, setApiData] = useState({ 
    binanceApiKey: "", 
    binanceApiSecret: "",
    nowPaymentsApiKey: "",
    nowPaymentsIpnSecret: ""
  });

  useEffect(() => {
    if (remoteConnectivity) setApiData({
      binanceApiKey: remoteConnectivity.binanceApiKey || "",
      binanceApiSecret: remoteConnectivity.binanceApiSecret || "",
      nowPaymentsApiKey: remoteConnectivity.nowPaymentsApiKey || "",
      nowPaymentsIpnSecret: remoteConnectivity.nowPaymentsIpnSecret || ""
    });
  }, [remoteConnectivity]);

  const handleSaveAPI = async () => {
    setSaving(true);
    try {
      await setDoc(connectivityRef, { ...apiData, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث البروتوكولات بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 text-right" dir="rtl">
      <div className="lg:col-span-8">
        <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-[#002d4d] p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Globe className="h-32 w-32" /></div>
            <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                <Cpu className="h-8 w-8 text-[#f9a885]" />
              </div>
              تكوين مفاتيح المزامنة والمدفوعات الآلية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            
            <div className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><KeyRound size={20} /></div>
                <h3 className="font-black text-lg text-[#002d4d]">بروتوكول NOWPayments (الإيداع الآلي)</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">API Key</Label>
                  <Input value={apiData.nowPaymentsApiKey} onChange={e => setApiData({...apiData, nowPaymentsApiKey: e.target.value})} className="h-14 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">IPN Secret Key</Label>
                  <Input type="password" value={apiData.nowPaymentsIpnSecret} onChange={e => setApiData({...apiData, nowPaymentsIpnSecret: e.target.value})} className="h-14 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner"><Database size={20} /></div>
                <h3 className="font-black text-lg text-[#002d4d]">بروتوكول Binance (مزامنة التدفق)</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">Binance API Key</Label>
                  <Input value={apiData.binanceApiKey} onChange={e => setApiData({...apiData, binanceApiKey: e.target.value})} className="h-14 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">Binance API Secret</Label>
                  <Input type="password" value={apiData.binanceApiSecret} onChange={e => setApiData({...apiData, binanceApiSecret: e.target.value})} className="h-14 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveAPI} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl active:scale-95 group transition-all">
              {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
                <div className="flex items-center gap-4">
                  <span>تثبيت بروتوكولات المزامنة السيادية</span>
                  <Save className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-8">
         <div className="p-10 bg-blue-600 rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Zap size={160} /></div>
            <div className="relative z-10 space-y-6">
               <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner"><ShieldCheck size={32} /></div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-black">أمن البيانات</h4>
                  <p className="text-[13px] font-bold text-blue-50 leading-[2.2]">يتم تشفير كافة المفاتيح السيادية قبل تخزينها. تأكد من تفعيل الـ Webhook في لوحة تحكم NOWPayments لضمان الأتمتة.</p>
               </div>
            </div>
         </div>

         <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 space-y-6 shadow-inner">
            <h4 className="font-black text-[11px] text-[#002d4d] uppercase tracking-widest px-2">إحصائيات الاتصال</h4>
            <div className="space-y-3">
               {[
                 { label: "حالة NOWPayments", val: apiData.nowPaymentsApiKey ? "Connected" : "Not Set", icon: Zap, c: "text-emerald-500" },
                 { label: "حالة Binance API", val: apiData.binanceApiKey ? "Connected" : "Not Set", icon: Activity, c: "text-orange-500" },
                 { label: "آخر تحديث", val: "لحظي", icon: History, c: "text-blue-500" },
               ].map((s, i) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                       <s.icon size={14} className={s.c} />
                       <span className="text-[10px] font-black text-[#002d4d]">{s.label}</span>
                    </div>
                    <span className="text-[10px] font-black tabular-nums">{s.val}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
