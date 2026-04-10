
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { GlobalMarketControls } from "@/components/admin/trade/GlobalMarketControls";
import { RiskCommandCenter } from "@/components/admin/trade/RiskCommandCenter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, ShieldAlert, Sparkles, Loader2, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function TradeConfigPage() {
  const router = useRouter();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);

  const globalRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: remoteGlobal } = useDoc(globalRef);
  const [globalData, setGlobalData] = useState<any>({});

  const riskRef = useMemoFirebase(() => doc(db, "system_settings", "trading_risk"), [db]);
  const { data: remoteRisk } = useDoc(riskRef);
  const [riskData, setRiskData] = useState<any>({});

  useEffect(() => {
    if (remoteGlobal) setGlobalData(remoteGlobal);
    if (remoteRisk) setRiskData(remoteRisk);
  }, [remoteGlobal, remoteRisk]);

  const handleSaveDoc = async (ref: any, data: any) => {
    setSaving(true);
    try {
      await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث الضوابط" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-6xl mx-auto space-y-16 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#002d4d] flex items-center gap-3">
              <Zap className="h-6 w-6 text-emerald-600" />
              ضبط تداول ناميكس
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Trading Global Policy Forge</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-12 px-6 font-black text-[10px] active:scale-95">
            <ChevronRight className="ml-2 h-4 w-4" /> العودة للقمرة
          </Button>
        </div>

        <section className="space-y-10">
           <div className="flex items-center gap-4 px-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><Activity size={20} /></div>
              <h2 className="text-xl font-black text-[#002d4d]">الضوابط العالمية والسيولة</h2>
           </div>
           <GlobalMarketControls 
             data={globalData} 
             onChange={setGlobalData} 
             onSave={() => handleSaveDoc(globalRef, globalData)}
             saving={saving}
           />
        </section>

        <section className="space-y-10 pt-10 border-t border-gray-50">
           <div className="flex items-center gap-4 px-4">
              <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner"><ShieldAlert size={20} /></div>
              <h2 className="text-xl font-black text-[#002d4d]">إدارة المخاطر وصمامات الأمان</h2>
           </div>
           <RiskCommandCenter 
             data={riskData} 
             onChange={setRiskData} 
             onSave={() => handleSaveDoc(riskRef, riskData)}
             saving={saving}
           />
        </section>
      </div>
    </Shell>
  );
}
