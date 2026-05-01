
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
  ChevronRight,
  KeyRound,
  Bot,
  Wand2,
  Lock,
  LineChart,
  Repeat,
  FileText,
  Globe,
  Volume2,
  ShieldAlert,
  Target
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const GREETING_TEMPLATES = [
  "مرحباً بك في ناميكس نكسوس، رفيقك التقني في رحلة الأصول الرقمية.",
  "أهلاً بك في قمرة قيادة ناميكس. استعد لاقتناص الفرص بأحدث الأنظمة الذكية.",
  "مرحباً بك! أنت الآن متصل بمحرك ناميكس المتطور لإدارة ونمو أصولك.",
  "أهلاً بك في عالم ناميكس، حيث تلتقي التكنولوجيا بالفرص الاستثمارية الحقيقية.",
  "نظام ناميكس المتكامل يرحب بك. نحن هنا لتمكينك من إدارة ثروتك الرقمية بدقة.",
  "مرحباً! أنت الآن في قلب ناميكس، النظام الأكثر استقراراً لتداول الأصول.",
  "أهلاً بك يا مستثمرنا الكريم. استكشف نبض الأسواق العالمية عبر منصتنا.",
  "مرحباً بك في ناميكس نكسوس. بوابة الوصول المباشر للسيولة والنمو.",
  "أهلاً بك! تواصل مع ناميكس لتجربة تداول احترافية وهادئة.",
  "مرحباً بك في قمرة التحكم الخاصة بك. ناميكس تضع القوة التقنية بين يديك.",
  "أهلاً بك في عصر الاستثمار الجديد مع ناميكس. استمتع بأعلى درجات الدقة والوضوح.",
  "مرحباً بك! ناميكس هو رادارك الشخصي لمراقبة واقتناص أفضل الفرص اللحظية.",
  "أهلاً بك في ناميكس. منظومتك الموثوقة لتنمية المحفظة وحماية رأس المال.",
  "مرحباً بك في المركز الموحد للأصول الرقمية. استعد للارتقاء بمركزك المالي.",
  "أهلاً بك! ناميكس نكسوس يمنحك الأمان والسرعة في تنفيذ قراراتك الاستثمارية.",
  "مرحباً بك في بيئة ناميكس المتطورة. حلول استثمارية ذكية تلائم تطلعاتك.",
  "أهلاً بك! اكتشف قوة التحليلات اللحظية مع محرك ناميكس المعتمد.",
  "مرحباً بك في ناميكس. حيث يتم تحويل البيانات إلى أرباح حقيقية في محفظتك.",
  "أهلاً بك يا شريك الهوية الرقمية. ناميكس تدعم مسار نموك المالي باستمرار.",
  "مرحباً بك! انضم للنخبة واستفد من رادار ناميكس لاكتشاف فجوات السيولة.",
  "أهلاً بك في نظام ناميكس. الأتمتة والذكاء في خدمة أهدافك الاستراتيجية.",
  "مرحباً بك! ناميكس توفر لك نافذة شفافة على الأسواق العالمية 24/7.",
  "أهلاً بك في رحاب ناميكس نكسوس. استمتع بتجربة تداول فريدة ومستقلة.",
  "مرحباً بك! المحرك التقني لناميكس جاهز لمعالجة طلباتك بأقصى سرعة.",
  "أهلاً بك في عالم الاستقرار المالي الرقمي مع منظومة ناميكس.",
  "مرحباً بك! استكشف كيف يغير الذكاء الاصطناعي قواعد اللعبة في ناميكس.",
  "أهلاً بك في قمرة ناميكس المركزية. تحكم في مستقبلك المالي بلمسة واحدة.",
  "مرحباً بك! ناميكس يجمع لك قوة البيانات وسهولة التنفيذ في مكان واحد.",
  "أهلاً بك يا مستثمر ناميكس المتميز. استعد لتجربة تداول مليئة بالفرص.",
  "مرحباً بك في ناميكس نكسوس. بوابتك الشاملة للنمو في اقتصاد المستقبل."
];

interface BotSettingsViewProps {
  botId: string;
  onBack: () => void;
}

export function BotSettingsView({ botId, onBack }: BotSettingsViewProps) {
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  
  const botRef = useMemoFirebase(() => doc(db, "system_settings", "telegram", "bots", botId), [db, botId]);
  const { data: botData, isLoading } = useDoc(botRef);
  
  const [basicInfo, setBasicInfo] = useState({ name: "", token: "" });
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (botData) {
      setBasicInfo({
        name: botData.name || "",
        token: botData.token || ""
      });
      setConfig(botData.config || {
        welcomeText: GREETING_TEMPLATES[0],
        signalSignature: "Powered by NAMIX",
        broadcastFreq: 5,
        minConfidence: 60,
        whaleAlerts: true,
        autoPinSignals: false,
        showCharts: true,
        maintenanceMode: false,
        strictMode: true,
        hapticAlerts: true,
        narrativeEnabled: true,
        autoPilotSupport: true,
        adminReports: false,
        allowGlobalBroadcast: true,
        voiceBriefing: false,
        antiSpam: true
      });
    }
  }, [botData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(botRef, { 
        name: basicInfo.name,
        token: basicInfo.token,
        config, 
        updatedAt: new Date().toISOString() 
      }, { merge: true });
      toast({ title: "تم تثبيت الإعدادات بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل تحديث القاعدة" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-40 text-center flex flex-col items-center gap-4">
         <Loader2 className="animate-spin h-10 w-10 text-gray-200" />
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مزامنة العقدة المستقلة...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 text-right font-body pb-32" dir="rtl">
       
       <div className="grid gap-8 lg:grid-cols-12">
          {/* Identity & Token Matrix */}
          <div className="lg:col-span-7 space-y-8">
             <Card className="rounded-[48px] border-none shadow-sm p-10 space-y-8 bg-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                   <KeyRound size={120} />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                      <Bot size={24} />
                   </div>
                   <div className="text-right">
                      <h4 className="font-black text-xl text-[#002d4d]">هوية محطة البث</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Node Identity & Credentials</p>
                   </div>
                </div>

                <div className="grid gap-6 relative z-10">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">الاسم الإداري للبوت</Label>
                      <Input 
                        value={basicInfo.name} 
                        onChange={e => setBasicInfo({...basicInfo, name: e.target.value})}
                        className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner" 
                        placeholder="Namix Global Node"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">توكن تلغرام (Bot Token)</Label>
                      <div className="relative">
                         <Input 
                           value={basicInfo.token} 
                           onChange={e => setBasicInfo({...basicInfo, token: e.target.value})}
                           className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-[10px] px-8 pl-12 shadow-inner text-left" 
                           dir="ltr"
                         />
                         <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                   </div>
                </div>
             </Card>

             <Card className="rounded-[48px] border-none shadow-sm p-10 space-y-6 bg-white">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <Label className="font-black text-sm text-[#002d4d]">رسالة الترحيب المخصصة</Label>
                   </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="h-9 rounded-xl bg-orange-50 text-orange-600 font-black text-[9px] gap-2 active:scale-95 transition-all">
                            <Wand2 size={14} /> استدعاء قالب ذكي
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[320px] rounded-[28px] border-none shadow-2xl p-2 bg-white/95 backdrop-blur-xl z-[1002]" align="end" dir="rtl">
                         <div className="px-4 py-2 border-b border-gray-50 mb-1">
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Sovereign Greeting Matrix</p>
                         </div>
                         <ScrollArea className="h-[300px]">
                            {GREETING_TEMPLATES.map((tpl, i) => (
                              <DropdownMenuItem key={i} onClick={() => setConfig({...config, welcomeText: tpl})} className="font-bold text-[10px] py-3.5 px-5 rounded-2xl transition-all cursor-pointer mb-1 text-right text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                                 {tpl.substring(0, 45)}...
                              </DropdownMenuItem>
                            ))}
                         </ScrollArea>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
                <textarea 
                  value={config.welcomeText || ""} 
                  onChange={e => setConfig({...config, welcomeText: e.target.value})}
                  className="w-full min-h-[160px] rounded-[32px] bg-gray-50 border-none p-8 font-bold text-xs leading-loose shadow-inner outline-none focus:ring-2 focus:ring-blue-500/10 transition-all scrollbar-none" 
                  placeholder="اكتب رسالة الترحيب التي تظهر عند ضغط /start..."
                />
             </Card>
          </div>

          {/* Configuration Matrix - Column 2 */}
          <div className="lg:col-span-5 space-y-8">
             <Card className="rounded-[48px] border-none shadow-sm p-10 space-y-8 bg-white">
                <div className="flex items-center gap-3">
                   <Timer className="h-5 w-5 text-emerald-500" />
                   <h4 className="font-black text-sm text-[#002d4d]">ضبط محرك النبض</h4>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">تردد البث التلقائي (دقيقة)</Label>
                      <Input 
                        type="number" 
                        value={config.broadcastFreq || 5} 
                        onChange={e => setConfig({...config, broadcastFreq: Number(e.target.value)})} 
                        className="h-12 rounded-xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" 
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">أدنى حد للثقة المسموح به (%)</Label>
                      <Input 
                        type="number" 
                        value={config.minConfidence || 60} 
                        onChange={e => setConfig({...config, minConfidence: Number(e.target.value)})} 
                        className="h-12 rounded-xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" 
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">توقيع الإشارات (Signature)</Label>
                      <Input 
                        value={config.signalSignature || ""} 
                        onChange={e => setConfig({...config, signalSignature: e.target.value})} 
                        className="h-12 rounded-xl bg-gray-50 border-none font-black text-[11px] px-6 text-center shadow-inner" 
                        placeholder="Powered by NAMIX"
                      />
                   </div>
                </div>
             </Card>

             <div className="p-8 bg-blue-50/50 rounded-[48px] border border-blue-100 flex items-start gap-4">
                <Sparkles size={20} className="text-blue-500 shrink-0 mt-1" />
                <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">
                   تأكد من مراجعة الإعدادات المنطقية بعناية؛ فتعطيل "دعم التداول الآلي" سيمنع المستخدمين من تنفيذ الصفقات عبر هذا البوت تحديداً.
                </p>
             </div>
          </div>
       </div>

       {/* 12 Advanced Dynamic Toggles */}
       <Card className="rounded-[64px] border-none shadow-2xl bg-[#002d4d] text-white p-12 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transition-transform group-hover:rotate-12 duration-1000"><Cpu size={250} /></div>
          
          <div className="grid gap-6 md:grid-cols-2 relative z-10">
             {[
               { id: 'whaleAlerts', label: 'رادار تحركات الحيتان الكبرى', icon: Activity, c: 'text-orange-400' },
               { id: 'autoPinSignals', label: 'تثبيت الإشارات الهامة تلقائياً', icon: Bell, c: 'text-blue-400' },
               { id: 'showCharts', label: 'إرفاق الرسوم البيانية مع الإشارات', icon: LineChart, c: 'text-emerald-400' },
               { id: 'maintenanceMode', label: 'وضع الصيانة الشامل لهذا البوت', icon: Zap, c: 'text-red-400' },
               { id: 'strictMode', label: 'حماية: تعطيل الأوامر أثناء التقلب', icon: ShieldAlert, c: 'text-purple-400' },
               { id: 'hapticAlerts', label: 'تفعيل التنبيهات اللمسية والوميضية', icon: Sparkles, c: 'text-[#f9a885]' },
               { id: 'narrativeEnabled', label: 'تفعيل محرك السرد التوليدي الحي', icon: FileText, c: 'text-cyan-400' },
               { id: 'autoPilotSupport', label: 'دعم محرك التداول الآلي للمستثمرين', icon: Repeat, c: 'text-blue-500' },
               { id: 'adminReports', label: 'إرسال تقرير إحصائي دوري للمشرف', icon: Target, c: 'text-emerald-300' },
               { id: 'allowGlobalBroadcast', label: 'السماح باستلام رسائل البث الموحد', icon: Globe, c: 'text-blue-200' },
               { id: 'voiceBriefing', label: 'تفعيل الموجز الصوتي الذكي (TTS)', icon: Volume2, c: 'text-pink-400' },
               { id: 'antiSpam', label: 'تفعيل فلتر الحماية من الطلبات المتكررة', icon: ShieldCheck, c: 'text-emerald-500' },
             ].map(feat => (
               <div key={feat.id} className="flex items-center justify-between p-5 bg-white/5 rounded-[28px] border border-white/5 hover:bg-white/10 transition-all group/feat">
                  <div className="flex items-center gap-4">
                     <div className={cn("h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner group-hover/feat:scale-110 transition-transform", feat.c)}>
                        <feat.icon size={18} />
                     </div>
                     <span className="text-[11px] font-black text-blue-50/80">{feat.label}</span>
                  </div>
                  <Switch 
                    checked={!!config[feat.id]} 
                    onCheckedChange={val => setConfig({...config, [feat.id]: val})} 
                    className="data-[state=checked]:bg-[#f9a885] scale-110" 
                  />
               </div>
             ))}
          </div>
          
          <div className="pt-16 flex flex-col items-center gap-6 relative z-10">
             <Button 
               onClick={handleSave} 
               disabled={saving} 
               className="h-20 px-24 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-xl shadow-2xl active:scale-95 transition-all group/save"
             >
                {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <div className="flex items-center gap-4">
                    <span>تثبيت ومعايرة العقدة الاستراتيجية</span> 
                    <Save size={24} className="transition-transform group-hover/save:rotate-12" />
                  </div>
                )}
             </Button>
             <button onClick={onBack} className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] hover:text-[#f9a885] transition-colors">إلغاء والعودة للمصفوفة</button>
          </div>
       </Card>
    </div>
  );
}
