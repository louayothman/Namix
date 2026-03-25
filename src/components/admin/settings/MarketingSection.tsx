
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
  Activity, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Timer, 
  Navigation, 
  Loader2, 
  Target, 
  Plus, 
  Trash2, 
  Sparkles, 
  Link as LinkIcon,
  Plane,
  Car,
  Home,
  Award,
  Globe,
  Wand2,
  Ship,
  Gem,
  Coins,
  Repeat
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { cn } from "@/lib/utils";

interface MarketingSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

const GOAL_TEMPLATES = [
  { id: 'vacation', labelAr: "عطلة الأحلام العالمية", labelEn: "Luxury World Tour", target: 5000, icon: "Plane" },
  { id: 'car', labelAr: "اقتناء سيارة رياضية", labelEn: "Luxury Sport Car", target: 45000, icon: "Car" },
  { id: 'home', labelAr: "فيلا الأحلام الخاصة", labelEn: "Dream Mansion", target: 250000, icon: "Home" },
  { id: 'business', labelAr: "إطلاق مشروع ريادي", labelEn: "Startup Venture", target: 15000, icon: "Briefcase" },
  { id: 'yacht', labelAr: "يخت سيادي خاص", labelEn: "Sovereign Yacht", target: 500000, icon: "Ship" },
  { id: 'jewelry', labelAr: "استثمار في الأصول النادرة", labelEn: "Rare Assets", target: 10000, icon: "Gem" },
  { id: 'retirement', labelAr: "صندوق التقاعد الذهبي", labelEn: "Golden Retirement", target: 100000, icon: "Award" },
  { id: 'education', labelAr: "بروتوكول التعليم النخبوية", labelEn: "Elite Education", target: 30000, icon: "Target" },
];

export function MarketingSection({ data, onChange, onSave, saving }: MarketingSectionProps) {
  const db = useFirestore();
  const plansQuery = useMemoFirebase(() => query(collection(db, "investment_plans"), where("isActive", "==", true)), [db]);
  const { data: plans } = useCollection(plansQuery);

  const handleAddGoal = () => {
    const goals = data.simulatorGoals || [];
    onChange({
      ...data,
      simulatorGoals: [...goals, { id: Date.now().toString(), labelAr: "هدف جديد", labelEn: "New Goal", target: 1000, icon: "Target", linkedPlanId: "" }]
    });
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = GOAL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      const goals = data.simulatorGoals || [];
      onChange({
        ...data,
        simulatorGoals: [...goals, { 
          id: Date.now().toString(), 
          labelAr: template.labelAr, 
          labelEn: template.labelEn, 
          target: template.target, 
          icon: template.icon, 
          linkedPlanId: "" 
        }]
      });
    }
  };

  const handleUpdateGoal = (id: string, field: string, value: any) => {
    const goals = (data.simulatorGoals || []).map((g: any) => 
      g.id === id ? { ...g, [field]: value } : g
    );
    onChange({ ...data, simulatorGoals: goals });
  };

  const handleRemoveGoal = (id: string) => {
    const goals = (data.simulatorGoals || []).filter((g: any) => g.id !== id);
    onChange({ ...data, simulatorGoals: goals });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-purple-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-purple-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            بروتوكول الظهور والبوصلة الاستشارية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="p-10 bg-gray-50 rounded-[48px] space-y-6 border border-gray-100 shadow-inner">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-black text-purple-900 uppercase pr-4">نص شريط الأنباء</Label>
                  <Switch checked={data.isTickerEnabled} onCheckedChange={val => onChange({...data, isTickerEnabled: val})} className="data-[state=checked]:bg-purple-600 scale-75" />
                </div>
                <Textarea value={data.tickerText || ""} onChange={e => onChange({...data, tickerText: e.target.value})} className="min-h-[140px] rounded-[28px] bg-white border-none font-bold text-sm shadow-sm p-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-10 bg-purple-50/30 rounded-[48px] border border-purple-100 space-y-6 flex flex-col justify-between">
                   <Label className="text-[11px] font-black text-purple-900 uppercase pr-4">كفاءة محاكي الأرباح (%)</Label>
                   <Input type="number" value={data.simulatorRatio ?? ""} onChange={e => onChange({...data, simulatorRatio: Number(e.target.value)})} className="h-16 rounded-[24px] bg-white border-none font-black text-center text-3xl text-purple-600 shadow-md" />
                </div>
                <div className="p-10 bg-blue-50/30 rounded-[48px] border border-blue-100 space-y-6 flex flex-col justify-between">
                   <Label className="text-[11px] font-black text-blue-900 uppercase pr-4">سقف سيولة البوصلة ($)</Label>
                   <Input type="number" value={data.guidanceMaxInitialCapital ?? ""} onChange={e => onChange({...data, guidanceMaxInitialCapital: Number(e.target.value)})} className="h-16 rounded-[24px] bg-white border-none font-black text-center text-3xl text-blue-600 shadow-md" />
                   <p className="text-[8px] text-blue-400 font-bold text-center">الحد الأقصى للرأس مال المقترح للمستثمرين الجدد في البوصلة.</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-white border border-gray-100 rounded-[48px] shadow-sm space-y-10">
               <div className="grid gap-6">
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Activity className="h-3 w-3" /> السحوبات المؤكدة ($)</Label>
                     <div className="grid grid-cols-2 gap-2">
                        <Input type="number" value={data.withdrawalsMin} onChange={e => onChange({...data, withdrawalsMin: Number(e.target.value)})} className="h-12 rounded-xl bg-gray-50 border-none font-black text-xs text-center" />
                        <Input type="number" value={data.withdrawalsMax} onChange={e => onChange({...data, withdrawalsMax: Number(e.target.value)})} className="h-12 rounded-xl bg-gray-50 border-none font-black text-xs text-center" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Users className="h-3 w-3" /> المستثمرون النشطون</Label>
                     <div className="grid grid-cols-2 gap-2">
                        <Input type="number" value={data.activeUsersMin} onChange={e => onChange({...data, activeUsersMin: Number(e.target.value)})} className="h-12 rounded-xl bg-gray-50 border-none font-black text-xs text-center" />
                        <Input type="number" value={data.activeUsersMax} onChange={e => onChange({...data, activeUsersMax: Number(e.target.value)})} className="h-12 rounded-xl bg-gray-50 border-none font-black text-xs text-center" />
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-2"><Timer className="h-3 w-3" /> سرعة التحديث (ثانية)</Label>
                     <Input type="number" value={data.statsUpdateFreq} onChange={e => onChange({...data, statsUpdateFreq: Number(e.target.value)})} className="h-12 rounded-xl bg-purple-50/50 border-none font-black text-center text-purple-600" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Navigation className="h-3 w-3" /> أقصى قفزة زيادة</Label>
                     <Input type="number" value={data.statsStepMax} onChange={e => onChange({...data, statsStepMax: Number(e.target.value)})} className="h-12 rounded-xl bg-emerald-50/50 border-none font-black text-center text-emerald-600" />
                  </div>
               </div>
            </div>
          </div>

          {/* SIMULATOR GOALS MANAGEMENT */}
          <div className="space-y-10 pt-10 border-t border-gray-50">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-1 text-right">
                <h3 className="text-2xl font-black text-[#002d4d] flex items-center gap-3">
                  <Target className="h-7 w-7 text-[#f9a885]" />
                  محاكي الأهداف وهندسة التدوير المركب
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Compounding Yield Engineering Protocol</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-1 bg-gray-100 rounded-2xl flex items-center gap-2 pr-4">
                  <div className="flex items-center gap-2 text-[#002d4d] font-black text-[9px] uppercase tracking-widest">
                    <Wand2 className="h-3 w-3 text-blue-500" />
                    قوالب جاهزة:
                  </div>
                  <Select onValueChange={handleApplyTemplate}>
                    <SelectTrigger className="h-9 w-48 rounded-xl bg-white border-none font-black text-[9px] shadow-sm">
                      <SelectValue placeholder="اختر هدفاً لإضافته..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {GOAL_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id} className="font-bold text-right">{t.labelAr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddGoal} className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] h-11 px-8 shadow-lg active:scale-95">
                  <Plus className="ml-2 h-4 w-4 text-[#f9a885]" /> إضافة هدف مخصص
                </Button>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {data.simulatorGoals?.map((goal: any) => (
                <div key={goal.id} className="p-10 bg-gray-50/50 rounded-[56px] border border-gray-100 space-y-8 relative group/goal transition-all hover:bg-white hover:shadow-xl hover:border-blue-50">
                  <button onClick={() => handleRemoveGoal(goal.id)} className="absolute top-8 left-8 h-10 w-10 rounded-2xl bg-white text-red-400 opacity-0 group-hover/goal:opacity-100 transition-all flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-sm">
                    <Trash2 className="h-5 w-5" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">العنوان (عربي)</Label>
                      <Input value={goal.labelAr} onChange={e => handleUpdateGoal(goal.id, 'labelAr', e.target.value)} className="h-12 rounded-2xl bg-white border-none font-black text-sm text-right px-6 shadow-inner" />
                    </div>
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-black text-gray-400 uppercase pl-4 tracking-widest">Title (English)</Label>
                      <Input value={goal.labelEn} onChange={e => handleUpdateGoal(goal.id, 'labelEn', e.target.value)} className="h-12 rounded-2xl bg-white border-none font-black text-sm text-left px-6 shadow-inner" dir="ltr" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">المبلغ المستهدف ($)</Label>
                      <div className="relative">
                        <Input type="number" value={goal.target} onChange={e => handleUpdateGoal(goal.id, 'target', Number(e.target.value))} className="h-14 rounded-2xl bg-white border-none font-black text-center text-xl text-emerald-600 shadow-inner" />
                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-100" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">الأيقونة المعتمدة</Label>
                      <Select value={goal.icon} onValueChange={val => handleUpdateGoal(goal.id, 'icon', val)}>
                        <SelectTrigger className="h-14 rounded-2xl bg-white border-none font-black text-xs shadow-inner px-6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                          <SelectItem value="Plane" className="font-bold">سفر (Plane)</SelectItem>
                          <SelectItem value="Car" className="font-bold">مركبة (Car)</SelectItem>
                          <SelectItem value="Home" className="font-bold">عقار (Home)</SelectItem>
                          <SelectItem value="Briefcase" className="font-bold">عمل (Business)</SelectItem>
                          <SelectItem value="Target" className="font-bold">هدف (Target)</SelectItem>
                          <SelectItem value="Award" className="font-bold">جائزة (Award)</SelectItem>
                          <SelectItem value="Ship" className="font-bold">يخت (Ship)</SelectItem>
                          <SelectItem value="Gem" className="font-bold">أصول (Gem)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        <LinkIcon className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">بروتوكول التدوير المخصص</span>
                      </div>
                      <Badge className="bg-blue-500 text-white font-black text-[8px] border-none px-3 py-1 rounded-full shadow-lg">SMART MATCHING</Badge>
                    </div>
                    <Select value={goal.linkedPlanId} onValueChange={val => handleUpdateGoal(goal.id, 'linkedPlanId', val)}>
                      <SelectTrigger className="h-12 rounded-2xl bg-white border-none font-black text-xs shadow-sm px-6 text-right">
                        <SelectValue placeholder="اربط الهدف بخطة استثمارية معينة..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                        <SelectItem value="none" className="font-bold">لا يوجد ربط (اختيار آلي للأفضل)</SelectItem>
                        {plans?.map(p => (
                          <SelectItem key={p.id} value={p.id} className="font-bold">{p.title} (%{p.profitPercent})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 px-2 text-blue-400 mt-1">
                       <Repeat className="h-3 w-3" />
                       <p className="text-[8px] font-bold">ستقوم البوصلة بحساب تدوير الأرباح (Compound) لهذه الخطة تحديداً.</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!data.simulatorGoals || data.simulatorGoals.length === 0) && (
                <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-20">
                   <Target className="h-16 w-16 text-[#002d4d]" />
                   <p className="text-xs font-black uppercase tracking-[0.5em]">لا توجد أهداف مدرجة في المحاكي حالياً</p>
                </div>
              )}
            </div>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all hover:bg-[#001d33] active:scale-[0.98] group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>تفعيل التحديثات الاستراتيجية للبوصلة</span>
                <Sparkles className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
