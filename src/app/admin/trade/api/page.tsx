
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Cpu, 
  ChevronRight, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Loader2, 
  Sparkles,
  RefreshCcw,
  Activity
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

/**
 * @fileOverview مركز إدارة مفاتيح الربط v1.0
 * عزل إدارة API في صفحة مستقلة داخل قمرة التداول.
 */

export default function APIManagementPage() {
  const router = useRouter();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);

  const connectivityRef = useMemoFirebase(() => doc(db, "system_settings", "connectivity"), [db]);
  const { data: remoteConnectivity } = useDoc(connectivityRef);
  
  const [apiData, setApiData] = useState<any>({ 
    finnhubApiKey: "", 
    finnhubLabel: "Official Finnhub Global"
  });

  useEffect(() => {
    if (remoteConnectivity) {
      setApiData({
        finnhubApiKey: remoteConnectivity.finnhubApiKey || "",
        finnhubLabel: remoteConnectivity.finnhubLabel || "Official Finnhub Global"
      });
    }
  }, [remoteConnectivity]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(connectivityRef, { ...apiData, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث بروتوكولات الاتصال" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل تحديث البيانات" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-4xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#002d4d] flex items-center gap-3">
              <Cpu className="h-6 w-6 text-purple-600" />
              ضبط بروتوكولات API
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">External Connectivity Hub</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-12 px-6 font-black text-[10px] active:scale-95">
            <ChevronRight className="ml-2 h-4 w-4" /> العودة للقمرة
          </Button>
        </div>

        <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white group">
          <CardHeader className="bg-[#002d4d] p-10 border-b border-white/10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Globe className="h-32 w-32" /></div>
            <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                <Zap className="h-8 w-8 text-[#f9a885]" />
              </div>
              مركز مزامنة Finnhub.io
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            
            <div className="space-y-8">
               <div className="space-y-3">
                  <Label className="font-black text-[11px] text-gray-400 uppercase pr-4">تسمية المصدر (API Label)</Label>
                  <Input 
                    value={apiData.finnhubLabel} 
                    onChange={e => setApiData({...apiData, finnhubLabel: e.target.value})}
                    className="h-14 rounded-xl bg-gray-50 border-none font-black text-sm px-8 shadow-inner"
                    placeholder="مثال: Finnhub Node A"
                  />
               </div>

               <div className="space-y-3">
                  <Label className="font-black text-[11px] text-gray-400 uppercase pr-4">Finnhub API Key</Label>
                  <div className="relative">
                    <Input 
                      value={apiData.finnhubApiKey} 
                      onChange={e => setApiData({...apiData, finnhubApiKey: e.target.value})}
                      className="h-14 rounded-xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner text-left"
                      dir="ltr"
                      placeholder="Enter Key..."
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                       <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-5">
               <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <RefreshCcw className="h-6 w-6 text-blue-600" />
               </div>
               <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed pt-1">
                 يسمح لك Finnhub بجلب بيانات الأسهم والسلع والفوركس. تأكد من أن المفتاح نشط لضمان استمرار نبض السوق اللحظي لكافة المستثمرين.
               </p>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl transition-all active:scale-95 group">
              {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <div className="flex items-center gap-3">
                  <span>تثبيت بروتوكول المزامنة المحدث</span>
                  <Sparkles className="h-5 w-5 text-[#f9a885]" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-3 opacity-20 pt-10 select-none">
           <Activity size={12} className="text-[#002d4d] animate-pulse" />
           <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Connection Infrastructure Node v1.0</p>
        </div>
      </div>
    </Shell>
  );
}
