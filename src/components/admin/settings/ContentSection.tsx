
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Edit2, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Loader2, 
  Sparkles, 
  MessageSquare, 
  Info, 
  Wand2, 
  BookOpen, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  Route, 
  Award, 
  TrendingUp, 
  Cpu, 
  Target,
  Globe,
  Type,
  FileText
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مستودع المحتوى المعرفي السيادي v8.0
 * تم إضافة قسم تعديل "عن المنصة" لتمكين المشرف من التحكم في الهوية النصية للشركة.
 */

const ACADEMY_TEMPLATES = Array.from({ length: 50 }).map((_, i) => ({
  id: `acad-${i + 1}`,
  title: [
    "مدخل إلى عالم الأصول الرقمية", "استراتيجية التداول الفوري المتقدمة", "محرك الذكاء الاصطناعي و Arbitrage", 
    "بروتوكول حماية رأس المال", "هندسة التدوير المركب (Compound)", "دليل السفراء والقادة", 
    "فهم الرسوم البيانية والشموع اليابانية", "إدارة المخاطر في العقود النشطة", "تأمين المحفظة ورمز PIN", 
    "تحليل نبض الأسواق العالمية", "أتمتة الاستثمار والنمو التلقائي", "مستويات الملاءة المالية للمستثمر", 
    "استخدام مؤشرات RSI و MACD", "كيفية قراءة عمق السوق", "استراتيجيات الاستثمار طويل الأمد", 
    "تداول العملات المستقرة (USDT)", "حوكمة العمولات والشبكة", "التوثيق اللحظي عبر Binance API", 
    "بوصلة التوجيه: هندسة الأهداف", "مستقبل الاقتصاد الرقمي مع ناميكس"
  ][i % 20] + ` (المستوى ${Math.floor(i/20) + 1})`,
  desc: "درس تعليمي شامل يشرح آليات العمل والنمو داخل منصة ناميكس المتطورة بأسلوب احترافي.",
  content: `محتوى الدرس رقم ${i + 1}:
هذا الدرس يقدم شرحاً مفصلاً لبروتوكول ناميكس. يتضمن المنهج كيفية مراقبة نبض الأسعار، اقتناص فجوات السيولة، واستخدام محركات الذكاء الاصطناعي لتعظيم العوائد.

أبرز المحاور:
1. فهم أساسيات تدفق السيولة في الشبكة.
2. استخدام أدوات التحليل الفني المدمجة في المنصة.
3. كيفية تفعيل العقود الاستراتيجية وإدارة الأرباح الجارية.
4. بروتوكولات الأمان القصوى لحماية الأرصدة والمحافظ.

يجب على المستثمر اتباع خطوات التدقيق الأمني وفهم دورة عمل العقود لضمان سيادته المالية الكاملة والوصول إلى أهدافه المخطط لها عبر بوصلة التوجيه.`,
  icon: ["Zap", "BrainCircuit", "ShieldCheck", "Route", "Award", "Target", "TrendingUp", "Cpu"][i % 8],
  color: "text-blue-500",
  bg: "bg-blue-50"
}));

const FAQ_TEMPLATES = Array.from({ length: 50 }).map((_, i) => ({
  id: `faq-${i + 1}`,
  q: [
    "كيف يتم توثيق الإيداعات عبر البلوكشين؟", "ما هي فترات انتظار السحب (Cooldown)؟", 
    "هل أموالي محمية في حال تقلب السوق؟", "كيف أستخدم بوصلة التوجيه المالي؟", 
    "ما هي عمولات الشركاء المباشرة؟", "كيف يتم تفعيل رمز PIN للخزنة؟", 
    "ما الفرق بين التداول الفوري والعقود؟", "هل يمكنني سحب رأس المال قبل انتهاء العقد? ", 
    "كيف يعمل نظام الرتب والمكافآت؟", "ما هو دور صندوق التأمين السيادي؟"
  ][i % 10] + ` (استفسار #${i + 1})`,
  a: `تتم هذه العملية وفقاً لبروتوكولات الأمان المعتمدة في ناميكس. يتم التحقق من كافة المعطيات برمجياً لضمان دقة التنفيذ وحماية الأصول. 

بشكل مفصل: نظام ناميكس يعتمد على التوثيق اللحظي عبر Binance API لضمان جلب المبالغ الحقيقية من البلوكشين وتجاهل الأخطاء البشرية. يمكنك دائماً مراجعة سجلاتك المالية في قسم البصمة المالية بملفك الشخصي، وفي حال وجود أي استفسار إضافي، يمكنك فتح تذكرة دعم مباشر مع فريقنا التقني المتاح على مدار الساعة.`
}));

interface ContentSectionProps {
  data: any;
  onChange: (newData: any) => void;
  academyData: any;
  onAcademyChange: (newData: any) => void;
  onSave: () => void;
  onAcademySave: () => void;
  saving: boolean;
}

export function ContentSection({ data, onChange, academyData, onAcademyChange, onSave, onAcademySave, saving }: ContentSectionProps) {
  
  const applyFaqTemplate = (val: string) => {
    const tpl = FAQ_TEMPLATES.find(t => t.id === val);
    if (tpl) {
      const faqs = data.faq || [];
      onChange({ ...data, faq: [...faqs, { q: tpl.q, a: tpl.a }] });
    }
  };

  const addFaq = () => {
    const faqs = data.faq || [];
    onChange({
      ...data,
      faq: [...faqs, { q: "سؤال جديد؟", a: "إجابة نموذجية شاملة هنا..." }]
    });
  };

  const updateFaq = (idx: number, field: 'q' | 'a', val: string) => {
    const faqs = [...(data.faq || [])];
    faqs[idx] = { ...faqs[idx], [field]: val };
    onChange({ ...data, faq: faqs });
  };

  const removeFaq = (idx: number) => {
    const faqs = (data.faq || []).filter((_: any, i: number) => i !== idx);
    onChange({ ...data, faq: faqs });
  };

  const addLesson = () => {
    const lessons = academyData.lessons || [];
    onAcademyChange({
      ...academyData,
      lessons: [...lessons, { id: Date.now().toString(), title: "درس جديد", desc: "وصف الدرس الشامل...", content: "المحتوى التعليمي السيادي الكامل...", icon: "BookOpen", color: "text-blue-500", bg: "bg-blue-50" }]
    });
  };

  const updateLesson = (idx: number, field: string, val: string) => {
    const lessons = [...(academyData.lessons || [])];
    lessons[idx] = { ...lessons[idx], [field]: val };
    onAcademyChange({ ...academyData, lessons });
  };

  const removeLesson = (idx: number) => {
    const lessons = (academyData.lessons || []).filter((_: any, i: number) => i !== idx);
    onAcademyChange({ ...academyData, lessons });
  };

  const applyAcademyTemplate = (val: string) => {
    const tpl = ACADEMY_TEMPLATES.find(t => t.id === val);
    if (tpl) {
      const lessons = academyData.lessons || [];
      onAcademyChange({
        ...academyData,
        lessons: [...lessons, { ...tpl, id: Date.now().toString() }]
      });
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-left-6 duration-700 font-body text-right" dir="rtl">
      
      {/* 1. CORPORATE IDENTITY (ABOUT US) MANAGEMENT */}
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-[#002d4d] text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Globe className="h-32 w-32" /></div>
          <CardTitle className="text-xl font-black flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
              <Info className="h-6 w-6 text-[#f9a885]" />
            </div>
            إدارة الهوية المؤسسية (عن ناميكس)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-10">
          <div className="grid gap-10">
            <div className="space-y-3 text-right">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4 flex items-center gap-2 justify-end">
                العنوان الترويجي (Tagline)
                <Type className="h-3.5 w-3.5 text-blue-500" />
              </Label>
              <Input 
                value={data.tagline || ""} 
                onChange={e => onChange({...data, tagline: e.target.value})}
                placeholder="مثال: حيث تحقق راحتك المالية الاحترافية"
                className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner text-right text-[#002d4d] text-lg"
              />
            </div>

            <div className="space-y-3 text-right">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4 flex items-center gap-2 justify-end">
                وصف المنصة (About Description)
                <FileText className="h-3.5 w-3.5 text-blue-500" />
              </Label>
              <Textarea 
                value={data.aboutUs || ""} 
                onChange={e => onChange({...data, aboutUs: e.target.value})}
                placeholder="اكتب قصة المنصة ورؤيتها الاستراتيجية هنا..."
                className="min-h-[200px] rounded-[32px] bg-gray-50 border-none font-bold text-sm p-8 leading-loose shadow-inner text-right scrollbar-none focus-visible:ring-2 focus-visible:ring-blue-500" 
              />
            </div>
          </div>

          <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6">
             <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="h-7 w-7 text-blue-600" />
             </div>
             <p className="text-[11px] font-bold text-blue-800/60 leading-[2.2] pt-1">
               هذه النصوص تظهر في نافذة "من نحن" التفاعلية وفي صفحة التعريف المستقلة. تأكد من صياغتها بأسلوب يعكس ريادة وموثوقية ناميكس العالمية.
             </p>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl active:scale-95 group transition-all">
            {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <div className="flex items-center gap-4">
                <span>تحديث الهوية المؤسسية</span>
                <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 2. ACADEMY MANAGEMENT SECTION */}
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-blue-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-blue-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            بروتوكول الأكاديمية (50 درساً شاملاً)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#002d4d]">إدارة المناهج التعليمية</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sovereign Academy Matrix</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 bg-gray-100 rounded-2xl flex items-center gap-2 pr-4">
                <div className="flex items-center gap-2 text-[#002d4d] font-black text-[9px] uppercase tracking-widest">
                  <Wand2 className="h-3 w-3 text-blue-500" /> قوالب الدروس:
                </div>
                <Select onValueChange={applyAcademyTemplate}>
                  <SelectTrigger className="h-9 w-56 rounded-xl bg-white border-none font-black text-[9px] shadow-sm">
                    <SelectValue placeholder="تصفح 50 درساً..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]" position="popper">
                    <ScrollArea className="h-[280px]">
                      {ACADEMY_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id} className="font-bold text-right py-2 cursor-pointer">{t.title}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addLesson} className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] h-11 px-8 shadow-lg active:scale-95">
                <Plus className="ml-2 h-4 w-4 text-[#f9a885]" /> إضافة درس يدوي
              </Button>
            </div>
          </div>

          <div className="grid gap-8">
            {academyData.lessons?.map((lesson: any, idx: number) => (
              <div key={idx} className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 space-y-8 relative group transition-all hover:bg-white hover:shadow-xl">
                <button onClick={() => removeLesson(idx)} className="absolute top-8 left-8 h-10 w-10 rounded-2xl bg-white text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-50 shadow-sm">
                  <Trash2 className="h-5 w-5" />
                </button>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">عنوان الدرس</Label>
                      <Input value={lesson.title} onChange={e => updateLesson(idx, 'title', e.target.value)} className="h-14 rounded-2xl bg-white border-none font-black text-sm px-8 shadow-inner" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">الأيقونة</Label>
                      <Select value={lesson.icon} onValueChange={val => updateLesson(idx, 'icon', val)}>
                         <SelectTrigger className="h-12 rounded-xl bg-white border-none font-black text-[10px] shadow-sm"><SelectValue /></SelectTrigger>
                         <SelectContent className="max-h-[250px] rounded-2xl border-none shadow-2xl">
                            <ScrollArea className="h-[200px]">
                              <SelectItem value="Zap">طاقة (Zap)</SelectItem>
                              <SelectItem value="BrainCircuit">ذكاء (Brain)</SelectItem>
                              <SelectItem value="ShieldCheck">أمان (Shield)</SelectItem>
                              <SelectItem value="Route">مسار (Route)</SelectItem>
                              <SelectItem value="Award">جائزة (Award)</SelectItem>
                              <SelectItem value="TrendingUp">نمو (Trend)</SelectItem>
                              <SelectItem value="Cpu">معالج (Cpu)</SelectItem>
                              <SelectItem value="Target">هدف (Target)</SelectItem>
                            </ScrollArea>
                         </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">المحتوى التعليمي المفصل</Label>
                    <Textarea value={lesson.content} onChange={e => updateLesson(idx, 'content', e.target.value)} className="min-h-[200px] rounded-[32px] bg-white border-none font-bold text-xs p-8 shadow-inner leading-loose scrollbar-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onAcademySave} disabled={saving} className="w-full h-20 rounded-full bg-blue-600 text-white font-black text-xl shadow-2xl transition-all group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>تحديث ونشر المنهج التعليمي</span>
                <BookOpen className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 3. FAQ MANAGEMENT SECTION */}
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-emerald-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-emerald-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <HelpCircle className="h-6 w-6" />
            </div>
            مركز الأسئلة الشائعة (50 استفساراً نموذجياً)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#002d4d]">تخصيص قاعدة المعرفة</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">FAQ Hub Ledger</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 bg-gray-100 rounded-2xl flex items-center gap-2 pr-4">
                <div className="flex items-center gap-2 text-[#002d4d] font-black text-[9px] uppercase tracking-widest">
                  <Wand2 className="h-3 w-3 text-emerald-500" /> قوالب الأسئلة:
                </div>
                <Select onValueChange={applyFaqTemplate}>
                  <SelectTrigger className="h-9 w-56 rounded-xl bg-white border-none font-black text-[9px] shadow-sm">
                    <SelectValue placeholder="تصفح 50 سؤالاً..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]" position="popper">
                    <ScrollArea className="h-[280px]">
                      {FAQ_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id} className="font-bold text-right py-2 cursor-pointer">{t.q}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addFaq} className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] h-11 px-8 shadow-lg active:scale-95">
                <Plus className="ml-2 h-4 w-4 text-[#f9a885]" /> إضافة سؤال يدوي
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {data.faq?.map((faq: any, idx: number) => (
              <div key={idx} className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 space-y-6 relative group transition-all hover:bg-white hover:shadow-lg">
                <button onClick={() => removeFaq(idx)} className="absolute top-6 left-6 h-9 w-9 rounded-xl bg-white text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-50 shadow-sm">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black text-[#002d4d] pr-4 uppercase tracking-widest">السؤال المطروح</Label>
                  <Input value={faq.q} onChange={e => updateFaq(idx, 'q', e.target.value)} className="h-12 rounded-xl bg-white border-none font-black text-sm px-6 shadow-inner" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black text-[#002d4d] pr-4 uppercase tracking-widest">الإجابة المعتمدة</Label>
                  <Textarea value={faq.a} onChange={e => updateFaq(idx, 'a', e.target.value)} className="min-h-[100px] rounded-[24px] bg-white border-none font-bold text-xs p-6 shadow-inner leading-loose scrollbar-none" />
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-emerald-600 text-white font-black text-xl shadow-2xl transition-all group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>تحديث ونشر قاعدة المعرفة</span>
                <Sparkles className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
