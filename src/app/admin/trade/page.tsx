
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, setDoc, collection, query, orderBy } from "firebase/firestore";
import { 
  Globe, 
  ShieldAlert,
  LayoutGrid,
  Activity,
  Zap,
  ShieldCheck,
  Target,
  Sparkles,
  HeartPulse,
  BrainCircuit,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMarketSync } from "@/hooks/use-market-sync";

// Modular Reactors
import { GlobalMarketControls } from "@/components/admin/trade/GlobalMarketControls";
import { AssetForge } from "@/components/admin/trade/AssetForge";
import { RiskCommandCenter } from "@/components/admin/trade/RiskCommandCenter";
import { MarketInventory } from "@/components/admin/trade/MarketInventory";
import { AIIntelligenceControls } from "@/components/admin/trade/AIIntelligenceControls";

export default function NamixTradingAdminPage() {
  const [saving, setSaving] = useState(false);
  const db = useFirestore();

  const globalRef = useMemoFirebase(() => doc(db, "system_settings", "trading_global"), [db]);
  const { data: remoteGlobal } = useDoc(globalRef);
  const [globalData, setGlobalData] = useState<any>({});

  const riskRef = useMemoFirebase(() => doc(db, "system_settings", "trading_risk"), [db]);
  const { data: remoteRisk } = useDoc(riskRef);
  const [riskData, setRiskData] = useState<any>({});

  const aiRef = useMemoFirebase(() => doc(db, "system_settings", "trading_ai"), [db]);
  const { data: remoteAI } = useDoc(aiRef);
  const [aiData, setAIData] = useState<any>({});

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), orderBy("createdAt", "desc")), [db]);
  const { data: symbols, isLoading: loadingSymbols } = useCollection(symbolsQuery);

  // تفعيل محرك المزامنة العالمي لجلب الأسعار لحظياً في لوحة الإدارة
  useMarketSync(symbols || []);

  useEffect(() => {
    if (remoteGlobal) setGlobalData(remoteGlobal);
    if (remoteRisk) setRiskData(remoteRisk);
    if (remoteAI) setAIData(remoteAI);
  }, [remoteGlobal, remoteRisk, remoteAI]);

  const handleSaveDoc = async (ref: any, data: any) => {
    setSaving(true);
    try {
      await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-6xl mx-auto space-y-12 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Golden Ratio Header - Bilingual Sync */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              Sovereign Trading Infrastructure <span className="opacity-30 mx-2">•</span> البنية التحتية للتداول
            </div>
            <h1 className="text-3xl font-black text-[#002d4d] tracking-tight">
              ناميكس للتداول
              <span className="text-[10px] font-bold text-gray-300 uppercase mr-3">Trading Hub Console</span>
            </h1>
            <p className="text-muted-foreground font-bold text-[10px] flex items-center gap-2">
               <Sparkles className="h-3.5 w-3.5 text-[#f9a885]" /> قمرة التحكم السيادية لإدارة نبض الأسواق والمخاطر لحظياً.
            </p>
          </div>
          <AssetForge />
        </div>

        {/* Fluid Command Chain */}
        <div className="space-y-24">
          
          {/* Reactor 01: Global Core */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner"><Globe className="h-6 w-6" /></div>
                   <h2 className="text-2xl font-black text-[#002d4d]">الضبط العالمي <span className="text-[10px] font-bold text-gray-300 uppercase mr-2">Global Protocol</span></h2>
                </div>
                <div className="h-1 w-20 bg-gradient-to-l from-blue-100 to-transparent rounded-full" />
             </div>
             <GlobalMarketControls 
               data={globalData} 
               onChange={setGlobalData} 
               onSave={() => handleSaveDoc(globalRef, globalData)}
               saving={saving}
             />
          </section>

          {/* Reactor 02: AI Intelligence Calibration */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner"><BrainCircuit className="h-6 w-6" /></div>
                   <h2 className="text-2xl font-black text-[#002d4d]">معايرة الذكاء <span className="text-[10px] font-bold text-gray-300 uppercase mr-2">AI Neural Tuning</span></h2>
                </div>
                <div className="h-1 w-20 bg-gradient-to-l from-blue-100 to-transparent rounded-full" />
             </div>
             <AIIntelligenceControls 
               data={aiData} 
               onChange={setAIData} 
               onSave={() => handleSaveDoc(aiRef, aiData)}
               saving={saving}
             />
          </section>

          {/* Reactor 03: Risk Matrix */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-[22px] bg-red-50 text-red-600 flex items-center justify-center shadow-inner"><ShieldAlert className="h-6 w-6" /></div>
                   <h2 className="text-2xl font-black text-[#002d4d]">مركز المخاطر <span className="text-[10px] font-bold text-red-300 uppercase mr-2">Security Shield</span></h2>
                </div>
                <div className="h-1 w-20 bg-gradient-to-l from-red-100 to-transparent rounded-full" />
             </div>
             <RiskCommandCenter 
               data={riskData} 
               onChange={setRiskData} 
               onSave={() => handleSaveDoc(riskRef, riskData)}
               saving={saving}
             />
          </section>

          {/* Reactor 04: Market Inventory */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><LayoutGrid className="h-6 w-6" /></div>
                   <h2 className="text-2xl font-black text-[#002d4d]">جرد الأسواق <span className="text-[10px] font-bold text-gray-300 uppercase mr-2">Inventory Pulse</span></h2>
                </div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[9px] px-5 py-1.5 rounded-full shadow-lg">{symbols?.length || 0} أصل نشط</Badge>
                   <div className="h-1 w-20 bg-gradient-to-l from-emerald-100 to-transparent rounded-full" />
                </div>
             </div>
             <MarketInventory symbols={symbols || []} isLoading={loadingSymbols} />
          </section>

        </div>

        {/* Sovereign Footer */}
        <div className="flex flex-col items-center gap-4 pt-24 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em] tracking-none">Namix Sovereign Engine v11.0.4</p>
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
