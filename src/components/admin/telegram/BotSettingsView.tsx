
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  Loader2, 
  MessageSquare, 
  Zap, 
  Timer, 
  ShieldCheck, 
  Activity, 
  Bell, 
  Layout, 
  Cpu, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

interface BotSettingsViewProps {
  botId: string;
  onBack: () => void;
}

export function BotSettingsView({ botId, onBack }: BotSettingsViewProps) {
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  
  const botRef = useMemoFirebase(() => doc(db, "system_settings", "telegram", "bots", botId), [db, botId]);
  const { data: botData, isLoading } = useDoc(botRef);
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (botData?.config) {
      setConfig(botData.config);
    } else {
      // Default configurations for new bots
      setConfig({
        welcomeText: "مرحباً بك في ناميكس نكسوس\n\nأنت الآن في قلب المحرك الأكثر تقدماً لإدارة الأصول الرقمية. يرجى تفعيل هويتك الرقمية للوصول لقمرة القيادة الموحدة.",
        signalSignature: "Powered by NAMIX AI",
        broadcastFreq: 5,
        minConfidence: 60,
        whaleAlerts: true,
        autoPinSignals: false,
        showCharts: true,
        maintenanceMode: false,
        strictMode: true,
        hapticAlerts: true
      });
    }
  }, [botData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(botRef, { config, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث إعدادات البوت بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-40 text-center flex flex-col items-center gap-4">
         <Loader2 className="animate-spin h-10 w-10 text-gray-200" />
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جاري تحميل مصفوفة البيانات...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 text-right font-body" dir="rtl">
       <div className="grid gap-8 md:grid-cols-2">
          {/* 1. Bot Greeting Customization */}
          <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
             <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <Label className="font-black text-sm text-[#002d4d]">رسالة الترحيب المخصصة</Label>
             </div>
             <textarea 
               value={config.welcomeText || ""} 
               onChange={e => setConfig({...config, welcomeText: e.target.value})}
               className="w-full min-h-[120px] rounded-3xl bg-gray-50 border-none p-6 font-bold text-xs leading-loose shadow-inner outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" 
             />
          </Card>

          {/* 2. Signal Signature */}
          <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
             <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-orange-500" />
                <Label className="font-black text-sm text-[#002d4d]">توقيع إشارات التداول</Label>
             </div>
             <Input 
               value={config.signalSignature || ""} 
               onChange={e => setConfig({...config, signalSignature: e.target.value})} 
               className="h-14 rounded-2xl bg-gray-50 border-none font-black px-6 shadow-inner text-right" 
             />
             <p className="text-[10px] text-gray-300 font-bold pr-2">يظهر هذا النص في تذييل كل إشارة مرسلة.</p>
          </Card>

          {/* 3. Frequency & Threshold */}
          <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
             <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-emerald-500" />
                <Label className="font-black text-sm text-[#002d4d]">فترة البث الآلي (دقائق)</Label>
             </div>
             <Input 
               type="number" 
               value={config.broadcastFreq || 5} 
               onChange={e => setConfig({...config, broadcastFreq: Number(e.target.value)})} 
               className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl shadow-inner" 
             />
          </Card>

          <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
             <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-purple-500" />
                <Label className="font-black text-sm text-[#002d4d]">أدنى حد للثقة بالبث الآلي (%)</Label>
             </div>
             <Input 
               type="number" 
               value={config.minConfidence || 60} 
               onChange={e => setConfig({...config, minConfidence: Number(e.target.value)})} 
               className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl shadow-inner" 
             />
          </Card>
       </div>

       {/* 10 Advanced Feature Toggles */}
       <Card className="rounded-[56px] border-none shadow-xl bg-[#002d4d] text-white p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transition-transform group-hover:rotate-12 duration-1000"><Cpu size={200} /></div>
          <div className="relative z-10 grid gap-8 md:grid-cols-2">
             {[
               { id: 'whaleAlerts', label: 'رادار تحركات الحيتان (Whale Alerts)', icon: Activity },
               { id: 'autoPinSignals', label: 'تثبيت الإشارات الهامة تلقائياً', icon: Bell },
               { id: 'showCharts', label: 'إرفاق الرسوم البيانية مع الإشارات', icon: Layout },
               { id: 'maintenanceMode', label: 'وضع الصيانة الشامل للبوت', icon: Zap },
               { id: 'strictMode', label: 'تعطيل أوامر التداول أثناء التقلب', icon: Cpu },
               { id: 'hapticAlerts', label: 'تفعيل التنبيهات اللمسية (TMA)', icon: Sparkles },
             ].map(feat => (
               <div key={feat.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group/feat">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#f9a885] shadow-inner group-hover/feat:scale-110 transition-transform">
                        <feat.icon className="h-5 w-5" />
                     </div>
                     <span className="text-[11px] font-black">{feat.label}</span>
                  </div>
                  <Switch 
                    checked={!!config[feat.id]} 
                    onCheckedChange={val => setConfig({...config, [feat.id]: val})} 
                    className="data-[state=checked]:bg-[#f9a885]" 
                  />
               </div>
             ))}
          </div>
          
          <div className="pt-12 flex justify-center relative z-10">
             <Button 
               onClick={handleSave} 
               disabled={saving} 
               className="h-20 px-20 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-xl shadow-2xl active:scale-95 transition-all group"
             >
                {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <div className="flex items-center gap-4">
                    <span>حفظ التعديلات الخاصة بهذا البوت</span> 
                    <Save size={24} className="transition-transform group-hover:rotate-12" />
                  </div>
                )}
             </Button>
          </div>
       </Card>
    </div>
  );
}
