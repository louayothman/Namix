
"use client";

import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Star, 
  Sparkles, 
  Clock, 
  Target, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  Power, 
  ShieldCheck,
  TrendingUp,
  Activity,
  Briefcase,
  ChevronLeft,
  Zap,
  AlertTriangle,
  Wand2,
  Coins,
  Users,
  BarChart3,
  ArrowUpRight,
  Database,
  Timer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, serverTimestamp, query } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from "@/firebase/non-blocking-updates";

const PLAN_TEMPLATES = [
  { id: 'starter', label: "بروتوكول البداية الذكية", data: { title: "بروتوكول البداية الذكية", profitPercent: 12, durationValue: 7, durationUnit: "days", min: 50, max: 1000, features: "سحب أسبوعي, مخاطر منخفضة, دعم أساسي" } },
  { id: 'growth', label: "محرك النمو المتسارع", data: { title: "محرك النمو المتسارع", profitPercent: 28, durationValue: 14, durationUnit: "days", min: 1000, max: 10000, features: "أولوية السحب, نمو مضاعف, حماية جزئية" } },
  { id: 'elite', label: "صك السيادة الماسي", data: { title: "صك السيادة الماسي", profitPercent: 45, durationValue: 30, durationUnit: "days", min: 10000, max: 50000, features: "مدير حساب مخصص, عوائد نخبوية, حماية كاملة" } },
  { id: 'whale', label: "بروتوكول الحيتان العالمي", data: { title: "بروتوكول الحيتان العالمي", profitPercent: 75, durationValue: 60, durationUnit: "days", min: 50000, max: 999999, features: "عقود مؤسسية, تأمين دولي, سيولة ضخمة" } },
  { id: 'flash', label: "النبضة الوميضية", data: { title: "النبضة الوميضية", profitPercent: 8, durationValue: 24, durationUnit: "hours", min: 500, max: 5000, features: "عائد يومي سريع, متاح لفترة محدودة, سيولة فورية" } },
];

export default function AdminPlansPage() {
  const db = useFirestore();
  const plansQuery = useMemoFirebase(() => collection(db, "investment_plans"), [db]);
  const { data: plans, isLoading } = useCollection(plansQuery);

  const investmentsQuery = useMemoFirebase(() => collection(db, "investments"), [db]);
  const { data: allInvestments } = useCollection(investmentsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    profitPercent: "",
    durationValue: "",
    durationUnit: "days",
    min: "",
    max: "",
    features: "سحب تلقائي، دعم فني، مخاطر منخفضة",
    isPopular: false,
    isFlash: false,
    isActive: true,
    isScheduled: false,
    launchTime: "",
    closeTime: ""
  });

  const intelligenceReport = useMemo(() => {
    if (!plans || !allInvestments) return {};
    const report: Record<string, any> = {};
    
    plans.forEach(plan => {
      const planInvs = allInvestments.filter(inv => inv.planId === plan.id);
      const activeInvs = planInvs.filter(inv => inv.status === 'active');
      const completedInvs = planInvs.filter(inv => inv.status === 'completed');
      
      report[plan.id] = {
        activeUsers: new Set(activeInvs.map(inv => inv.userId)).size,
        usageCount: planInvs.length,
        totalVolume: planInvs.reduce((sum, inv) => sum + (inv.amount || 0), 0),
        realizedYield: completedInvs.reduce((sum, inv) => sum + (inv.expectedProfit || 0), 0),
        liveActiveVolume: activeInvs.reduce((sum, inv) => sum + (inv.amount || 0), 0)
      };
    });
    
    return report;
  }, [plans, allInvestments]);

  const handleApplyTemplate = (templateId: string) => {
    const template = PLAN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        title: template.data.title,
        profitPercent: template.data.profitPercent.toString(),
        durationValue: template.data.durationValue.toString(),
        durationUnit: template.data.durationUnit,
        min: template.data.min.toString(),
        max: template.data.max.toString(),
        features: template.data.features,
      });
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      title: "", 
      profitPercent: "", 
      durationValue: "", 
      durationUnit: "days", 
      min: "", 
      max: "", 
      features: "سحب تلقائي، دعم فني، مخاطر منخفضة",
      isPopular: false,
      isFlash: false,
      isActive: true,
      isScheduled: false,
      launchTime: "",
      closeTime: ""
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingId(plan.id);
    setFormData({
      title: plan.title,
      profitPercent: plan.profitPercent.toString(),
      durationValue: plan.durationValue ? plan.durationValue.toString() : "",
      durationUnit: plan.durationUnit || "days",
      min: plan.min.toString(),
      max: plan.max.toString(),
      features: plan.features?.join(",") || "",
      isPopular: plan.isPopular || false,
      isFlash: plan.isFlash || false,
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      isScheduled: plan.isScheduled || false,
      launchTime: plan.launchTime || "",
      closeTime: plan.closeTime || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.profitPercent || !formData.min || !formData.max) {
      return;
    }

    const planData = {
      title: formData.title,
      profitPercent: Number(formData.profitPercent),
      durationValue: formData.isScheduled ? null : Number(formData.durationValue),
      durationUnit: formData.isScheduled ? null : formData.durationUnit,
      min: Number(formData.min),
      max: formData.max === "∞" ? 999999999 : Number(formData.max),
      features: formData.features.split(",").map(f => f.trim()),
      isPopular: formData.isPopular,
      isFlash: formData.isFlash,
      isActive: formData.isActive,
      isScheduled: formData.isScheduled,
      launchTime: formData.isScheduled ? formData.launchTime : null,
      closeTime: formData.isScheduled ? formData.closeTime : null,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(db, "investment_plans", editingId), planData);
    } else {
      addDocumentNonBlocking(collection(db, "investment_plans"), { 
        ...planData, 
        createdAt: new Date().toISOString() 
      });
    }
    
    setIsDialogOpen(false);
  };

  const executeDelete = () => {
    if (deleteConfirmId) {
      deleteDocumentNonBlocking(doc(db, "investment_plans", deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const getUnitLabel = (unit: string) => {
    switch(unit) {
      case 'minutes': return 'دقيقة';
      case 'hours': return 'ساعة';
      default: return 'يوم';
    }
  };

  return (
    <Shell isAdmin>
      <div className="space-y-10 px-6 pt-10 pb-24 max-w-[1600px] mx-auto font-body text-right" dir="rtl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Investment Asset Repository
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">إدارة المنتجات الاستثمارية</h1>
            <p className="text-muted-foreground font-bold text-xs">تحكم سيادي في هندسة العوائد، الجدولة الزمنية، والحالة التشغيلية للمحفظة.</p>
          </div>
          
          <Button onClick={handleOpenAdd} className="rounded-full h-14 px-8 bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-2xl transition-all active:scale-95 group">
            <Plus className="ml-3 h-5 w-5 text-[#f9a885] transition-transform group-hover:rotate-90" />
            إدراج منتج استثماري جديد
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-40 flex flex-col items-center gap-4">
               <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري مزامنة مختبر الأصول...</p>
            </div>
          ) : plans && plans.length > 0 ? (
            plans.map((plan) => {
              const stats = intelligenceReport[plan.id] || { activeUsers: 0, usageCount: 0, totalVolume: 0, realizedYield: 0, liveActiveVolume: 0 };
              
              return (
                <Card key={plan.id} className={cn(
                  "border-none shadow-sm rounded-[56px] overflow-hidden bg-white relative transition-all hover:shadow-2xl hover:-translate-y-2 group flex flex-col",
                  !plan.isActive && "opacity-60 saturate-0 grayscale-[0.5]"
                )}>
                  {plan.isFlash && (
                    <div className="absolute top-8 left-8 z-10">
                      <Badge className="bg-red-500 text-white font-black border-none text-[9px] px-4 py-1.5 flex items-center gap-2 shadow-lg animate-pulse">
                        <Flame className="h-3.5 w-3.5 fill-white" /> FLASH DEAL
                      </Badge>
                    </div>
                  )}
                  {plan.isScheduled && (
                    <div className="absolute top-20 left-8 z-10">
                      <Badge className="bg-blue-600 text-white font-black border-none text-[9px] px-4 py-1.5 flex items-center gap-2 shadow-lg">
                        <Calendar className="h-3.5 w-3.5" /> SCHEDULED
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="p-10 pb-6 text-right">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={plan.isActive !== false} 
                          onCheckedChange={(val) => updateDocumentNonBlocking(doc(db, "investment_plans", plan.id), { isActive: val })}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                        <Badge className={cn(
                          "font-black border-none px-4 py-1.5 text-[9px] rounded-xl shadow-inner tracking-widest",
                          plan.isActive !== false ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                        )}>
                          {plan.isActive !== false ? "OPERATIONAL" : "DEACTIVATED"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button type="button" onClick={() => handleOpenEdit(plan)} className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm">
                            <Edit2 className="h-4 w-4" />
                         </button>
                         <button type="button" onClick={() => setDeleteConfirmId(plan.id)} className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm">
                            <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-[#002d4d] leading-tight">{plan.title}</CardTitle>
                    {plan.isScheduled && (
                      <p className="text-[9px] font-bold text-blue-500 mt-2 flex items-center gap-2">
                        <Timer className="h-3 w-3" />
                        موعد الإطلاق: {plan.launchTime ? new Date(plan.launchTime).toLocaleString('ar-EG') : 'غير محدد'}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="p-10 pt-0 space-y-8 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100/50 text-center relative overflow-hidden">
                        <Zap className="absolute top-0 right-0 p-2 h-10 w-10 text-emerald-200/20 rotate-12" />
                        <p className="text-[9px] text-gray-400 font-black uppercase mb-1 relative z-10">صافي الربح</p>
                        <p className="text-3xl font-black text-emerald-600 relative z-10">%{plan.profitPercent}</p>
                      </div>
                      <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 text-center relative overflow-hidden">
                        <Clock className="absolute top-0 right-0 p-2 h-10 w-10 text-blue-200/20 rotate-12" />
                        <p className="text-[9px] text-gray-400 font-black uppercase mb-1 relative z-10">الدورة الزمنية</p>
                        {plan.isScheduled ? (
                          <p className="text-sm font-black text-[#002d4d] relative z-10">محددة بالجدولة</p>
                        ) : (
                          <p className="text-2xl font-black text-[#002d4d] relative z-10">{plan.durationValue} {getUnitLabel(plan.durationUnit)}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[11px] font-black px-2">
                        <span className="text-gray-400 uppercase flex items-center gap-2"><Target className="h-4 w-4" /> الحد الأدنى</span>
                        <span className="text-[#002d4d] tabular-nums">${plan.min.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-black px-2">
                        <span className="text-gray-400 uppercase flex items-center gap-2"><Sparkles className="h-4 w-4" /> الحد الأعلى</span>
                        <span className="text-[#002d4d] tabular-nums">{plan.max >= 9999999 ? "مفتوح" : `$${plan.max.toLocaleString()}`}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 space-y-5">
                       <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-gray-50/50 rounded-[24px] border border-gray-100/50 space-y-1.5">
                             <div className="flex items-center gap-2">
                                <Users className="h-2.5 w-2.5 text-blue-400" />
                                <span className="text-[8px] font-black text-gray-400 uppercase">مستثمرون نشطون</span>
                             </div>
                             <p className="text-sm font-black text-[#002d4d] tabular-nums">{stats.activeUsers}</p>
                          </div>
                          <div className="p-4 bg-gray-50/50 rounded-[24px] border border-gray-100/50 space-y-1.5">
                             <div className="flex items-center gap-2">
                                <Database className="h-2.5 w-2.5 text-emerald-400" />
                                <span className="text-[8px] font-black text-gray-400 uppercase">إجمالي السيولة</span>
                             </div>
                             <p className="text-sm font-black text-emerald-600 tabular-nums">${stats.totalVolume.toLocaleString()}</p>
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-40 opacity-20 flex flex-col items-center gap-6">
               <Briefcase className="h-20 w-20 text-[#002d4d]" />
               <p className="text-xs font-black uppercase tracking-[0.5em]">لا توجد خطط استثمارية مدرجة حالياً</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[520px] overflow-hidden font-body text-right flex flex-col max-h-[90vh]" dir="rtl">
          <div className="bg-[#002d4d] p-10 text-white relative shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none">
                <ShieldCheck className="h-40 w-40" />
             </div>
             <div className="flex items-center gap-6 relative z-10">
                <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                   <Briefcase className="h-8 w-8 text-[#f9a885]" />
                </div>
                <div className="space-y-0.5">
                   <DialogTitle className="text-2xl font-black">{editingId ? "تحديث عقد استثماري" : "إدراج منتج جديد"}</DialogTitle>
                   <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Asset Configuration Protocol</p>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white scrollbar-none">
            {!editingId && (
              <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 space-y-4">
                <div className="flex items-center gap-2 pr-2 text-blue-600">
                  <Wand2 className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase">نماذج ناميكس الجاهزة</span>
                </div>
                <Select onValueChange={handleApplyTemplate}>
                  <SelectTrigger className="h-12 rounded-2xl bg-white border-none font-black text-xs shadow-sm px-6 text-right">
                    <SelectValue placeholder="اختر قالباً لتعبئة البيانات..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                    {PLAN_TEMPLATES.map(t => (
                      <SelectItem key={t.id} value={t.id} className="font-bold text-right">{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <Label className="text-[10px] font-black text-[#002d4d] uppercase cursor-pointer">نشط</Label>
                  <Switch checked={formData.isActive} onCheckedChange={val => setFormData({...formData, isActive: val})} className="data-[state=checked]:bg-emerald-500 scale-75" />
               </div>
               <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                  <Label className="text-[10px] font-black text-[#002d4d] uppercase cursor-pointer">Premium</Label>
                  <Switch checked={formData.isPopular} onCheckedChange={val => setFormData({...formData, isPopular: val})} className="data-[state=checked]:bg-[#f9a885] scale-75" />
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">عنوان الخطة الاستثمارية</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-base shadow-inner px-8 text-right" placeholder="مثال: الخطة الماسية للنمو" />
               </div>

               <div className="space-y-2 text-center">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">نسبة الربح (%)</Label>
                  <Input type="number" value={formData.profitPercent} onChange={e => setFormData({...formData, profitPercent: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center text-xl text-emerald-600 shadow-inner" />
               </div>

               {/* DURATION SECTION - RESTORED & CONDITIONAL */}
               {!formData.isScheduled && (
                 <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2 text-center">
                       <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مدة الاستثمار</Label>
                       <Input type="number" value={formData.durationValue} onChange={e => setFormData({...formData, durationValue: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center text-xl shadow-inner" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">وحدة الزمن</Label>
                       <Select value={formData.durationUnit} onValueChange={val => setFormData({...formData, durationUnit: val})}>
                          <SelectTrigger className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-sm shadow-inner px-6">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                             <SelectItem value="minutes" className="font-bold text-right">دقيقة</SelectItem>
                             <SelectItem value="hours" className="font-bold text-right">ساعة</SelectItem>
                             <SelectItem value="days" className="font-bold text-right">يوم</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
               )}

               {/* FUTURE SCHEDULING SECTION */}
               <div className="p-6 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <Label className="font-black text-[#002d4d] text-xs">جدولة اكتتاب آجل (Scheduled Launch)</Label>
                    </div>
                    <Switch checked={formData.isScheduled} onCheckedChange={val => setFormData({...formData, isScheduled: val})} className="data-[state=checked]:bg-blue-600 scale-75" />
                  </div>
                  
                  {formData.isScheduled && (
                    <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">تاريخ وساعة الانطلاق</Label>
                        <Input 
                          type="datetime-local" 
                          value={formData.launchTime} 
                          onChange={e => setFormData({...formData, launchTime: e.target.value})}
                          className="h-12 rounded-xl bg-white border-none font-black text-xs shadow-sm px-6 text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">تاريخ وساعة الإغلاق</Label>
                        <Input 
                          type="datetime-local" 
                          value={formData.closeTime} 
                          onChange={e => setFormData({...formData, closeTime: e.target.value})}
                          className="h-12 rounded-xl bg-white border-none font-black text-xs shadow-sm px-6 text-right"
                        />
                      </div>
                      <p className="text-[9px] text-blue-400 font-bold px-4 leading-relaxed">
                        * سيتم احتساب مدة الاستثمار تلقائياً لتنتهي عند حلول موعد الإغلاق المحدد أعلاه.
                      </p>
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 text-center">
                     <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الحد الأدنى ($)</Label>
                     <Input type="number" value={formData.min} onChange={e => setFormData({...formData, min: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center text-xl shadow-inner" />
                  </div>
                  <div className="space-y-2 text-center">
                     <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">الحد الأعلى ($)</Label>
                     <Input type="number" value={formData.max} onChange={e => setFormData({...formData, max: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center text-xl shadow-inner" />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">المميزات (افصل بفاصلة)</Label>
                  <Input value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="h-14 rounded-[24px] bg-gray-50 border-none font-bold text-xs shadow-inner px-8 text-right" />
               </div>
            </div>
          </div>

          <div className="p-10 bg-gray-50 border-t border-gray-100 shrink-0">
            <Button onClick={handleSave} className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl transition-all active:scale-95">
               {editingId ? "حفظ التعديلات المعتمدة" : "تفعيل المنتج في المختبر"}
            </Button>
            <button type="button" onClick={() => setIsDialogOpen(false)} className="w-full mt-4 text-[10px] font-black text-gray-400 hover:text-[#002d4d] uppercase tracking-widest transition-all">
               إلغاء العملية والعودة
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="rounded-[48px] border-none shadow-2xl p-10 max-w-[420px] font-body text-right" dir="rtl">
          <AlertDialogHeader className="items-center gap-6">
            <div className="h-20 w-20 rounded-[32px] bg-red-50 text-red-500 flex items-center justify-center animate-bounce shadow-inner">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-2xl font-black text-[#002d4d] tracking-normal">تحذير سيادي بالحذف</AlertDialogTitle>
              <div className="flex items-center justify-center gap-2 text-red-400 font-black text-[9px] uppercase tracking-[0.3em]">
                <ShieldCheck className="h-3 w-3" />
                Security Overwrite Protocol
              </div>
            </div>
            <AlertDialogDescription className="text-[13px] font-bold text-gray-500 leading-[2.2] px-2">
              أنت على وشك تنفيذ عملية حذف نهائية لهذا المنتج الاستثماري من قاعدة البيانات الأساسية. هل أنت متأكد من قرارك؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 sm:flex-col mt-8">
            <AlertDialogAction 
              onClick={executeDelete}
              className="w-full h-14 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-base shadow-xl active:scale-95 transition-all"
            >
              تأكيد الحذف النهائي
            </AlertDialogAction>
            <AlertDialogCancel 
              className="w-full h-14 rounded-full bg-gray-50 text-gray-400 border-none font-black text-xs hover:bg-gray-100 transition-all"
            >
              إلغاء العملية والعودة
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}
