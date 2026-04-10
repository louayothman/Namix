
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

/**
 * @fileOverview صفحة ضبط تداول ناميكس v2.0 - Clean Core
 * تم تطهير الصفحة من الخيارات غير الفعالة وحصرها في الضوابط الجوهرية.
 */
export default function TradeConfigPage() {
  const router = useRouter();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);

  // استخدام وثيقة موحدة للضبط العالمي لضمان التزامن
  const globalRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: remoteGlobal } = useDoc(globalRef);
  const [globalData, setGlobalData] = useState<any>({});

  // استخدام وثيقة مستقلة للمخاطر
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
      toast({ title: "تم تحديث البروتوكولات بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ في القاعدة السيادية" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-6xl mx-auto space-y-16 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Header - Fixed & Clear */}
        <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#002d4d] flex items-center gap-3">
              <Zap className="h-6 w-6 text-emerald-600" />
              ضبط تداول ناميكس
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Policy Calibration Hub</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-12 px-6 font-black text-[10px] active:scale-95 shadow-sm transition-all hover:shadow-md">
            <ChevronRight className="ml-2 h-4 w-4" /> العودة للقمرة
          </Button>
        </div>

        {/* 1. Global Market Controls */}
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex items-center gap-4 px-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><Activity size={20} /></div>
              <h2 className="text-xl font-black text-[#002d4d]">المفاعلات والضوابط العالمية</h2>
           </div>
           <GlobalMarketControls 
             data={globalData} 
             onChange={setGlobalData} 
             onSave={() => handleSaveDoc(globalRef, globalData)}
             saving={saving}
           />
        </section>

        {/* 2. Risk Command Center */}
        <section className="space-y-10 pt-10 border-t border-gray-50 animate-in fade-in slide-in-from-bottom-6 duration-1000">
           <div className="flex items-center gap-4 px-4">
              <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner"><ShieldAlert size={20} /></div>
              <h2 className="text-xl font-black text-[#002d4d]">إدارة مخاطر السيولة</h2>
           </div>
           <RiskCommandCenter 
             data={riskData} 
             onChange={setRiskData} 
             onSave={() => handleSaveDoc(riskRef, riskData)}
             saving={saving}
           />
        </section>

        {/* System Branding Footer */}
        <div className="flex flex-col items-center gap-4 pt-12 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Sovereign Engine v2.0.5</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>

      </div>
    </Shell>
  );
}
