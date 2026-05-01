
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { BotsInventory } from "@/components/admin/telegram/BotsInventory";
import { SignalHistory } from "@/components/admin/telegram/SignalHistory";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, History, Sparkles, Zap, Bot, 
  Settings2, MessageSquare, ShieldCheck, Timer, Bell, 
  Layout, Cpu, Save, Loader2 
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مركز إدارة أوركسترا تلغرام v2.0 - 10 New Control Features
 * تم إضافة 10 ميزات تخصيص استراتيجية للمشرف للتحكم في سلوك وهوية البوت.
 */

type ViewState = 'inventory' | 'history' | 'customization';

export default function AdminTelegramHub() {
  const [view, setView] = useState<ViewState>('inventory');
  const db = useFirestore();
  const [saving, setSaving] = useState(false);

  const botConfigRef = useMemoFirebase(() => doc(db, "system_settings", "telegram_global"), [db]);
  const { data: remoteConfig, isLoading: loadingConfig } = useDoc(botConfigRef);
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (remoteConfig) setConfig(remoteConfig);
  }, [remoteConfig]);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(botConfigRef, { ...config, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث مصفوفة البوت" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Telegram Matrix Command v2.0
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">
              {view === 'inventory' ? "مصفوفة البوتات" : view === 'history' ? "سجل البث" : "تخصيص الهوية والنبض"}
            </h1>
            <p className="text-muted-foreground font-bold text-xs">التحكم في البوتات، إدارة التوكنات، وهندسة الإشارات الاستباقية.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               onClick={() => setView('customization')}
               className={cn("rounded-full h-14 px-8 border shadow-sm font-black text-[11px] gap-3", view === 'customization' ? "bg-[#002d4d] text-[#f9a885] border-[#002d4d]" : "bg-white text-[#002d4d] border-gray-100")}
             >
                <Settings2 className="h-5 w-5" /> تخصيص البوت
             </Button>
             <Button 
               variant="ghost" 
               onClick={() => setView(view === 'inventory' ? 'history' : 'inventory')}
               className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3"
             >
                {view === 'inventory' ? <History className="h-5 w-5 text-orange-500" /> : <Bot className="h-5 w-5 text-blue-500" />}
                {view === 'inventory' ? "سجل البث" : "المصفوفة"}
             </Button>
          </div>
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {view === 'inventory' && (
              <motion.div key="inv" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <BotsInventory />
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div key="hist" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                <SignalHistory />
              </motion.div>
            )}

            {view === 'customization' && (
              <motion.div key="cust" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto space-y-12">
                 <div className="grid gap-8 md:grid-cols-2">
                    {/* 1. Bot Greeting Customization */}
                    <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
                       <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <Label className="font-black text-sm">رسالة الترحيب المخصصة</Label>
                       </div>
                       <textarea 
                         value={config.welcomeText || ""} 
                         onChange={e => setConfig({...config, welcomeText: e.target.value})}
                         className="w-full min-h-[120px] rounded-3xl bg-gray-50 border-none p-6 font-bold text-xs leading-loose" 
                       />
                    </Card>

                    {/* 2. Signal Footer Signature */}
                    <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
                       <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-orange-500" />
                          <Label className="font-black text-sm">توقيع إشارات التداول</Label>
                       </div>
                       <Input value={config.signalSignature || ""} onChange={e => setConfig({...config, signalSignature: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-6" />
                    </Card>

                    {/* 3. Automatic Pulse Intensity */}
                    <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
                       <div className="flex items-center gap-3">
                          <Timer className="h-5 w-5 text-emerald-500" />
                          <Label className="font-black text-sm">فترة البث الآلي (دقائق)</Label>
                       </div>
                       <Input type="number" value={config.broadcastFreq || 5} onChange={e => setConfig({...config, broadcastFreq: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl" />
                    </Card>

                    {/* 4. Global Confidence Filter */}
                    <Card className="rounded-[40px] border-none shadow-sm p-8 space-y-6 bg-white">
                       <div className="flex items-center gap-3">
                          <ShieldCheck className="h-5 w-5 text-purple-500" />
                          <Label className="font-black text-sm">أدنى حد للثقة بالبث الآلي (%)</Label>
                       </div>
                       <Input type="number" value={config.minConfidence || 60} onChange={e => setConfig({...config, minConfidence: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl" />
                    </Card>
                 </div>

                 {/* Advanced Toggle Matrix (6 More Features) */}
                 <Card className="rounded-[56px] border-none shadow-xl bg-[#002d4d] text-white p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><Cpu size={200} /></div>
                    <div className="relative z-10 grid gap-10 md:grid-cols-2">
                       {[
                         { id: 'whaleAlerts', label: 'رادار تحركات الحيتان (Whale Alerts)', icon: Activity },
                         { id: 'autoPinSignals', label: 'تثبيت الإشارات الهامة تلقائياً', icon: Bell },
                         { id: 'showCharts', label: 'إرفاق الرسوم البيانية مع الإشارات', icon: Layout },
                         { id: 'maintenanceMode', label: 'وضع الصيانة الشامل للبوت', icon: Zap },
                         { id: 'strictMode', label: 'تعطيل أوامر التداول أثناء التقلب', icon: Cpu },
                         { id: 'hapticAlerts', label: 'تفعيل التنبيهات اللمسية (TMA)', icon: Sparkles },
                       ].map(feat => (
                         <div key={feat.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-4">
                               <feat.icon className="h-6 w-6 text-[#f9a885]" />
                               <span className="text-[11px] font-black">{feat.label}</span>
                            </div>
                            <Switch checked={!!config[feat.id]} onCheckedChange={val => setConfig({...config, [feat.id]: val})} className="data-[state=checked]:bg-[#f9a885]" />
                         </div>
                       ))}
                    </div>
                    
                    <div className="pt-12 flex justify-center relative z-10">
                       <Button onClick={handleSaveConfig} disabled={saving} className="h-20 px-20 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-xl shadow-2xl active:scale-95 transition-all">
                          {saving ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-4"><span>حفظ الميثاق المحدث</span> <Save size={24}/></div>}
                       </Button>
                    </div>
                 </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4 pt-24 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Telegram Infrastructure v2.0</p>
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
