
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Loader2, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Coins, 
  Zap, 
  Trophy, 
  Crown, 
  Plus, 
  Trash2, 
  Wand2, 
  Target, 
  Gift, 
  Timer, 
  ShieldCheck,
  FileText,
  Gavel,
  History,
  Activity,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TEMPLATES DATA ---

const DESC_TEMPLATES = Array.from({ length: 20 }).map((_, i) => ({
  id: `d${i + 1}`,
  label: `بروتوكول نمو #${i + 1}`,
  content: [
    "برنامج شركاء ناميكس مصمم للنخبة الذين يسعون لبناء ثروة مستدامة عبر تنمية الشبكة. احصل على عمولات فورية عند تفعيل شركائك للعقود الاستثمارية.",
    "كن سفيراً لناميكس وساهم في تعزيز سيولة المنصة العالمية. نظام العمولات لدينا يضمن لك عائداً تصاعدياً يتناسب مع نشاط شبكتك المباشرة.",
    "ميثاق النمو المشترك: نحن نؤمن بأن نجاح ناميكس يعتمد على قوة شركائها. قمنا بهندسة هذا البرنامج ليكافئ الريادة والتميز في جذب الاستثمارات الذكية.",
    "انضم لطبقة القادة في ناميكس. استمتع بمزايا حصرية وعمولات مرتفعة عند دعوة المستثمرين الموثقين للمشاركة في بروتوكولاتنا المالية المتقدمة.",
    "تحويل العلاقات إلى أصول: مع ناميكس، كل شريك ينضم عبر رابطك هو لبنة في صرح ثروتك الرقمية. نظامنا يتبع أقصى درجات الشفافية في توزيع الأرباح."
  ][i % 5]
}));

const CHALLENGE_TEMPLATES = Array.from({ length: 20 }).map((_, i) => ({
  id: `c${i + 1}`,
  label: `ميثاق تحدي #${i + 1}`,
  rules: [
    { t: "دورة التجديد الذكي", d: "يتم تصفير النتائج وبدء دورة سباق جديدة كل يوم أحد الساعة 00:00 GMT لضمان تكافؤ الفرص للجميع." },
    { t: "معايير الاستحقاق", d: "يتم احتساب المراكز بناءً على إجمالي العمولات المحققة من شركاء المستوى الأول خلال الدورة الحالية فقط." },
    { t: "الأمان والامتثال", d: "تخضع كافة الإحالات لتدقيق آلي صارم؛ أي محاولة للتلاعب أو إنشاء حسابات وهمية تؤدي للحرمان من الجوائز وتجميد العمولات." }
  ]
}));

const LEADERBOARD_TEMPLATES = Array.from({ length: 20 }).map((_, i) => ({
  id: `l${i + 1}`,
  label: `قائمة متصدرين #${i + 1}`,
  entries: [
    { id: '1', name: ["ياسين الكردي", "فهد العتيبي", "Alex Rivers", "سلطان القاسمي", "Elena Volkov"][i % 5], yield: 15000 + (i * 1000), rank: 1 },
    { id: '2', name: ["محمد علي", "خالد بن زايد", "Marco Silva", "نورة الدوسري", "Kenji Sato"][i % 5], yield: 12000 + (i * 800), rank: 2 },
    { id: '3', name: ["ليلى حسن", "ريم الهاشمي", "Chloe Dupont", "أحمد منصور", "Sara Smith"][i % 5], yield: 9000 + (i * 600), rank: 3 },
    { id: '4', name: ["سارة خالد", "بدر الحربي", "Hans Meyer", "منى العبدالله", "Yuki Tanaka"][i % 5], yield: 6000 + (i * 400), rank: 4 },
    { id: '5', name: ["أحمد منصور", "فيصل السديري", "David Chen", "ليان حسن", "Ivan Petrov"][i % 5], yield: 3000 + (i * 200), rank: 5 }
  ]
}));

interface PartnershipSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function PartnershipSection({ data, onChange, onSave, saving }: PartnershipSectionProps) {
  
  const updateLeaderboardEntry = (idx: number, field: string, val: any) => {
    const entries = [...(data.manualLeaderboard || [])];
    entries[idx] = { ...entries[idx], [field]: val };
    onChange({ ...data, manualLeaderboard: entries });
  };

  const removeEntry = (idx: number) => {
    const entries = (data.manualLeaderboard || []).filter((_: any, i: number) => i !== idx);
    onChange({ ...data, manualLeaderboard: entries });
  };

  const addEntry = () => {
    const entries = data.manualLeaderboard || [];
    onChange({
      ...data,
      manualLeaderboard: [...entries, { id: Date.now().toString(), name: "مستثمر جديد", yield: 1000, rank: entries.length + 1 }]
    });
  };

  const applyLeaderboardTemplate = (templateId: string) => {
    const tpl = LEADERBOARD_TEMPLATES.find(t => t.id === templateId);
    if (tpl) onChange({ ...data, manualLeaderboard: tpl.entries });
  };

  const applyDescTemplate = (templateId: string) => {
    const tpl = DESC_TEMPLATES.find(t => t.id === templateId);
    if (tpl) onChange({ ...data, description: tpl.content });
  };

  const applyChallengeTemplate = (templateId: string) => {
    const tpl = CHALLENGE_TEMPLATES.find(t => t.id === templateId);
    if (tpl) {
      onChange({
        ...data,
        challengeRule1Title: tpl.rules[0].t,
        challengeRule1Desc: tpl.rules[0].d,
        challengeRule2Title: tpl.rules[1].t,
        challengeRule2Desc: tpl.rules[1].d,
        challengeRule3Title: tpl.rules[2].t,
        challengeRule3Desc: tpl.rules[2].d,
      });
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-left-6 duration-700 font-body text-right" dir="rtl">
      
      {/* 1. STRATEGIC GROWTH & COMMISSION */}
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-orange-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-orange-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <Share2 className="h-6 w-6" />
            </div>
            هندسة برنامج الشركاء والعمولات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="p-10 bg-gray-50 rounded-[48px] space-y-8 border border-gray-100 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <Label className="font-black text-[#002d4d] text-base">حالة البرنامج (Enabled)</Label>
                </div>
                <Switch 
                  checked={!!data.isEnabled} 
                  onCheckedChange={val => onChange({...data, isEnabled: val})}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4">نسبة عمولة الشريك المباشر (%)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={data.commissionRate ?? ""} 
                    onChange={e => onChange({...data, commissionRate: Number(e.target.value)})}
                    className="h-16 rounded-[24px] bg-white border-none font-black text-center text-3xl text-orange-600 shadow-md"
                  />
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-gray-200 text-xl">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                     <FileText className="h-4 w-4 text-gray-400" />
                     <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">وصف وشروط البرنامج</Label>
                  </div>
                  <Select onValueChange={applyDescTemplate}>
                    <SelectTrigger className="h-9 w-40 rounded-xl bg-gray-50 border-none font-black text-[9px] shadow-sm px-4">
                      <SelectValue placeholder="قوالب وصف (20)" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {DESC_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id} className="font-bold text-right">{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               <Textarea 
                 value={data.description || ""} 
                 onChange={e => onChange({...data, description: e.target.value})}
                 placeholder="اكتب ميثاق الشركاء هنا..."
                 className="min-h-[180px] rounded-[32px] bg-gray-50 border-none font-bold text-sm shadow-inner p-8 leading-loose text-right focus-visible:ring-2 focus-visible:ring-orange-500" 
               />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. CHALLENGE & REWARDS FORGE */}
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-100 bg-[#002d4d] text-white">
          <CardTitle className="text-xl font-black flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
              <Trophy className="h-6 w-6 text-[#f9a885]" />
            </div>
            مختبر التحديات والجوائز الأسبوعية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          <div className="grid gap-10 md:grid-cols-2">
             <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner space-y-8">
                <div className="flex items-center gap-3 pr-2">
                   <Gift className="h-5 w-5 text-orange-500" />
                   <h4 className="font-black text-sm text-[#002d4d]">ميزانية جوائز التحدي</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">إجمالي الجوائز ($)</Label>
                      <Input type="number" value={data.challengePrizePool ?? 1000} onChange={e => onChange({...data, challengePrizePool: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center text-emerald-600 shadow-sm" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">الجائزة الكبرى ($)</Label>
                      <Input type="number" value={data.challengeGrandPrize ?? 500} onChange={e => onChange({...data, challengeGrandPrize: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center text-[#f9a885] shadow-sm" />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">يوم وساعة التجديد</Label>
                   <Input value={data.challengeUpdateTiming ?? ""} onChange={e => onChange({...data, challengeUpdateTiming: e.target.value})} className="h-12 rounded-xl bg-white border-none font-black text-xs text-right px-6 shadow-sm" placeholder="مثلاً: يوم الأحد الساعة 00:00" />
                </div>
                <div className="pt-4 flex items-center justify-between px-4">
                   <Label className="text-[10px] font-black text-[#002d4d]">عدد الفائزين بالجوائز</Label>
                   <Input type="number" value={data.challengeTopWinners ?? 5} onChange={e => onChange({...data, challengeTopWinners: Number(e.target.value)})} className="h-9 w-20 rounded-lg bg-white border-none font-black text-center shadow-sm" />
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                   <div className="flex items-center gap-3">
                      <Gavel className="h-5 w-5 text-blue-600" />
                      <h4 className="font-black text-sm text-[#002d4d]">ميثاق التحدي (قواعد اللعبة)</h4>
                   </div>
                   <Select onValueChange={applyChallengeTemplate}>
                    <SelectTrigger className="h-9 w-40 rounded-xl bg-blue-50 border-none font-black text-[9px] text-blue-600 shadow-sm px-4">
                      <SelectValue placeholder="قوالب مواثيق (20)" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {CHALLENGE_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id} className="font-bold text-right">{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {[1, 2, 3].map(num => (
                  <div key={num} className="p-6 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-4 transition-all hover:bg-white hover:shadow-lg">
                     <div className="flex items-center gap-3">
                        <Badge className="h-7 w-7 rounded-lg bg-blue-600 text-white p-0 flex items-center justify-center font-black text-[10px] shadow-lg shadow-blue-900/20">{num}</Badge>
                        <Input 
                          placeholder={`عنوان القاعدة #${num}`} 
                          value={data[`challengeRule${num}Title`] || ""} 
                          onChange={e => onChange({...data, [`challengeRule${num}Title`]: e.target.value})}
                          className="h-10 rounded-xl bg-white border-none font-black text-[11px] px-4 shadow-sm"
                        />
                     </div>
                     <Textarea 
                        placeholder={`وصف القاعدة والميثاق #${num}`}
                        value={data[`challengeRule${num}Desc`] || ""} 
                        onChange={e => onChange({...data, [`challengeRule${num}Desc`]: e.target.value})}
                        className="min-h-[70px] rounded-2xl bg-white border-none font-bold text-[10px] p-5 leading-relaxed text-right shadow-inner"
                     />
                  </div>
                ))}
             </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. LEADERBOARD ORCHESTRATION */}
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-[#002d4d]">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            أوركسترا لوحة المتصدرين العالمية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          
          <div className="p-10 bg-gray-50 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100 shadow-inner">
             <div className="space-y-1 text-right">
                <h4 className="font-black text-lg text-[#002d4d] flex items-center gap-3 justify-end">
                   <Globe className="h-5 w-5 text-blue-500" /> مصدر بيانات المتصدرين
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select Data Orchestration Mode</p>
             </div>
             <div className="flex items-center gap-3 p-2 bg-white rounded-[28px] shadow-sm border border-gray-100">
                <button 
                  onClick={() => onChange({ ...data, leaderboardMode: 'real' })}
                  className={cn("px-10 h-12 rounded-2xl font-black text-[11px] transition-all", data.leaderboardMode === 'real' ? "bg-[#002d4d] text-white shadow-xl" : "text-gray-400 hover:bg-gray-50")}
                >
                  البيانات الحقيقية (Real)
                </button>
                <button 
                  onClick={() => onChange({ ...data, leaderboardMode: 'manual' })}
                  className={cn("px-10 h-12 rounded-2xl font-black text-[11px] transition-all", data.leaderboardMode === 'manual' ? "bg-orange-500 text-white shadow-xl" : "text-gray-400 hover:bg-gray-50")}
                >
                  البيانات المجهزة (Manual)
                </button>
             </div>
          </div>

          {data.leaderboardMode === 'manual' && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#002d4d] flex items-center gap-3">
                      <Target className="h-5 w-5 text-orange-500" />
                      هندسة قائمة المتصدرين المخصصة
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manual Node Configuration</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-gray-100 rounded-2xl flex items-center gap-2 pr-4">
                      <div className="flex items-center gap-2 text-[#002d4d] font-black text-[9px] uppercase tracking-widest">
                        <Wand2 className="h-3 w-3 text-blue-500" />
                        قوالب قوائم (20):
                      </div>
                      <Select onValueChange={applyLeaderboardTemplate}>
                        <SelectTrigger className="h-9 w-48 rounded-xl bg-white border-none font-black text-[9px] shadow-sm">
                          <SelectValue placeholder="اختر قائمة مجهزة..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                          {LEADERBOARD_TEMPLATES.map(t => (
                            <SelectItem key={t.id} value={t.id} className="font-bold text-right">{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addEntry} className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] h-11 px-8 shadow-lg active:scale-95 transition-all">
                      <Plus className="ml-2 h-4 w-4 text-[#f9a885]" /> إضافة سطر يدوي
                    </Button>
                  </div>
               </div>

               <div className="grid gap-4">
                  {data.manualLeaderboard?.map((entry: any, idx: number) => (
                    <div key={idx} className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 flex items-center gap-6 relative group transition-all hover:bg-white hover:shadow-xl">
                       <div className="h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center font-black text-lg shadow-inner">
                          {idx + 1}
                       </div>
                       <div className="flex-1 grid grid-cols-2 gap-8">
                          <div className="space-y-1.5 text-right">
                             <Label className="text-[9px] font-black text-gray-400 uppercase pr-4 tracking-widest">اسم القائد السيادي</Label>
                             <div className="relative">
                                <Input value={entry.name} onChange={e => updateLeaderboardEntry(idx, 'name', e.target.value)} className="h-12 rounded-xl bg-white border-none font-black text-sm px-10 shadow-sm" />
                                <Crown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-200" />
                             </div>
                          </div>
                          <div className="space-y-1.5 text-right">
                             <Label className="text-[9px] font-black text-gray-400 uppercase pr-4 tracking-widest">إجمالي العائد المحقق ($)</Label>
                             <div className="relative">
                                <Input type="number" value={entry.yield} onChange={e => updateLeaderboardEntry(idx, 'yield', Number(e.target.value))} className="h-12 rounded-xl bg-white border-none font-black text-sm text-emerald-600 px-10 shadow-sm text-center" />
                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-100" />
                             </div>
                          </div>
                       </div>
                       <button onClick={() => removeEntry(idx)} className="h-10 w-10 rounded-xl bg-white text-red-400 flex items-center justify-center hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                          <Trash2 className="h-5 w-5" />
                       </button>
                    </div>
                  ))}
                  {(!data.manualLeaderboard || data.manualLeaderboard.length === 0) && (
                    <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                       <Users className="h-16 w-16 text-[#002d4d]" />
                       <p className="text-xs font-black uppercase tracking-widest">قم بإضافة متصدرين أو اختر قالباً جاهزاً</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          <div className="p-8 bg-blue-50/30 rounded-[40px] border border-blue-100/50 flex items-start gap-6">
             <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <History className="h-7 w-7 text-blue-600" />
             </div>
             <div className="space-y-1.5 pt-1">
                <p className="text-xs font-black text-[#002d4d]">أرشفة دورات التحدي</p>
                <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed text-right">
                  يتم حفظ نتائج المتصدرين أسبوعياً في سجل الأرشيف؛ تغيير وضع البيانات (Real/Manual) يؤثر فوراً على ما يراه المستثمرون في صفحة السفراء لتعزيز استراتيجية النمو المختارة.
                </p>
             </div>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>تفعيل ونشر بروتوكول الشركاء المحدث</span>
                <Sparkles className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
