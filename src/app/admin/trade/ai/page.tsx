
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { AIIntelligenceControls } from "@/components/admin/trade/AIIntelligenceControls";
import { Button } from "@/components/ui/button";
import { ChevronRight, BrainCircuit, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function AIConfigPage() {
  const router = useRouter();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);

  const aiRef = useMemoFirebase(() => doc(db, "system_settings", "trading_ai"), [db]);
  const { data: remoteAI } = useDoc(aiRef);
  const [aiData, setAIData] = useState<any>({});

  useEffect(() => {
    if (remoteAI) setAIData(remoteAI);
  }, [remoteAI]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(aiRef, { ...aiData, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث ذكاء ناميكس" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-6xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#002d4d] flex items-center gap-3">
              <BrainCircuit className="h-6 w-6 text-blue-600" />
              ضبط NAMIX AI
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Neural Calibration Terminal</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-12 px-6 font-black text-[10px] active:scale-95">
            <ChevronRight className="ml-2 h-4 w-4" /> العودة للقمرة
          </Button>
        </div>

        <AIIntelligenceControls 
          data={aiData} 
          onChange={setAIData} 
          onSave={handleSave} 
          saving={saving} 
        />
      </div>
    </Shell>
  );
}
