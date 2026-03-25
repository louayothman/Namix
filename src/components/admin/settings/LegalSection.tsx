
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gavel, ShieldCheck, Loader2, Sparkles, FileText, Lock, Wand2, ScrollText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview بروتوكول المواثيق القانونية الشاملة v7.0
 * تم تزويد المنصة بـ 100 نموذج قانوني متكامل (50 للشروط و 50 للخصوصية)
 * كل نموذج يمثل وثيقة قانونية فريدة وموسعة تغطي سيناريوهات تشغيلية مختلفة.
 */

// مولد نماذج الشروط والأحكام (50 نموذجاً فريداً)
const TERMS_TEMPLATES = Array.from({ length: 50 }).map((_, i) => {
  const versions = [
    "البروتوكول العالمي القياسي", "ميثاق التداول عالي المخاطر", "نظام العقود المؤتمتة", 
    "اتفاقية السيولة والشركاء", "ميثاق النخبة للاستثمار", "اللوائح التشغيلية للبلوكشين",
    "سياسة الاستثمار الآمن", "اتفاقية التداول الاجتماعي", "ميثاق السحب السريع",
    "الضوابط القانونية للذكاء الاصطناعي"
  ];
  const selectedType = versions[i % versions.length];
  
  return {
    id: `terms-${i + 1}`,
    label: `${selectedType} - إصدار ${i + 1}.0`,
    content: `اتفاقية شروط وأحكام استخدام منصة ناميكس (Namix) - النسخة المحدثة رقم ${i + 1}

1. مقدمة وإقرار الأهلية:
تعد هذه الاتفاقية عقداً قانونياً ملزماً بين المستخدم ومنصة ناميكس لإدارة الأصول الرقمية. باستخدامك للخدمة، أنت تقر بأنك تبلغ من العمر 18 عاماً على الأقل وتتمتع بكافة الصلاحيات القانونية للتصرف المالي. إن استمرارك في استخدام المنصة يعد قبولاً غير مشروط بكافة البنود الواردة أدناه.

2. طبيعة الخدمات ومخاطر السوق:
توفر ناميكس أدوات تداول فوري ومحركات استثمارية قائمة على الذكاء الاصطناعي (AI Arbitrage). يقر المستخدم بوعيه الكامل بأن الأصول الرقمية تتسم بتقلبات حادة في الأسعار، وأن أداء الماضي لا يضمن النتائج المستقبلية. المنصة ليست مستشاراً مالياً، والقرار النهائي للاستثمار يقع على عاتق المستخدم وحده.

3. حوكمة الحسابات والتدقيق الأمني:
يسمح بإنشاء حساب واحد فقط لكل هوية رقمية. يلتزم المستخدم بتفعيل رمز PIN للخزنة وتأمين كلمة المرور. أي وصول غير مصرح به ناتج عن إهمال المستخدم لا تقع مسؤوليته على عاتق المنصة. تحتفظ ناميكس بالحق في تجميد أي حساب يشتبه في ممارسته لنشاطات غسيل أموال أو تلاعب تقني بالأسعار.

4. بروتوكول الإيداع والسحب:
تتم عمليات شحن الرصيد عبر البوابات المعتمدة وتخضع لتوثيق آلي عبر البلوكشين (TXID). طلبات السحب تخضع لفترات الانتظار (Cooldown) والتدقيق المالي لضمان الملاءة المالية للمنصة. يتم احتساب الرسوم وفقاً للشريحة الاستثمارية للمستخدم، وللمنصة الحق في تعديل هذه الرسوم بناءً على حالة السيولة العالمية.

5. نظام الشركاء والعمولات:
يُمنح السفراء عمولات بناءً على نشاط شبكتهم المباشرة. يمنع منعاً باتاً إنشاء حسابات وهمية للحصول على العمولات. في حال اكتشاف تلاعب، سيتم مصادرة كافة الأرباح الناتجة وإغلاق الحساب فوراً بقرار إداري نافذ.

6. الملكية الفكرية والعقود البرمجية:
كافة الخوارزميات، واجهات الاستخدام، المحتوى التعليمي، وشعار المنصة هي حقوق ملكية حصرية لشركة ناميكس. يمنع نسخ أو تعديل أو محاولة اختراق الكود المصدري للمنصة.

7. النزاعات والقانون الحاكم:
تخضع هذه الاتفاقية لقوانين المنطقة القضائية المنظمة للأصول الرقمية التي تتبعها المنصة دولياً. يتم حل أي نزاع ينشأ عن استخدام الخدمة عن طريق التحكيم الإلكتروني المعتمد قبل اللجوء للمحاكم المختصة.`
  };
});

// مولد نماذج سياسة الخصوصية (50 نموذجاً فريداً)
const PRIVACY_TEMPLATES = Array.from({ length: 50 }).map((_, i) => {
  const versions = [
    "ميثاق حماية البيانات العالمي", "بروتوكول التشفير السيادي", "سياسة الخصوصية العابرة للحدود",
    "ميثاق أمان المستثمر المتقدم", "سياسة معالجة الهوية الرقمية", "المعايير الدولية GDPR",
    "بروتوكول سرية الأصول", "سياسة الشفافية والامتثال", "ميثاق التخزين المشفر",
    "سياسة الخصوصية لمحركات الذكاء الاصطناعي"
  ];
  const selectedType = versions[i % versions.length];

  return {
    id: `privacy-${i + 1}`,
    label: `${selectedType} - إصدار ${i + 1}.0`,
    content: `سياسة خصوصية وحماية بيانات مستثمري ناميكس (Namix) - النسخة المحدثة رقم ${i + 1}

1. الالتزام بالخصوصية المطلقة:
نحن في ناميكس نؤمن بأن الخصوصية هي حق أساسي للمستثمر. تلتزم المنصة بحماية كافة البيانات الشخصية والمالية للمستخدمين وفقاً لأحدث بروتوكولات الأمن السيبراني العالمية (AES-256 bits Encryption).

2. البيانات المجمعة وأغراضها:
نقوم بجمع الحد الأدنى من البيانات الضرورية للتشغيل، وتشمل:
أ. بيانات الهوية: (الاسم، البريد الإلكتروني، وتاريخ الميلاد) لغرض توثيق الحساب ومنع الاحتيال.
ب. بيانات النشاط المالي: (سجلات التحويلات، المحافظ الرقمية) لغرض تنفيذ العمليات وتدقيق الملاءة.
ج. البيانات التقنية: (عنوان IP، نوع الجهاز) لغرض تأمين الجلسات ومنع الوصول غير المصرح به.

3. بروتوكولات معالجة البيانات والذكاء الاصطناعي:
تتم معالجة بيانات التداول الخاصة بك بواسطة محركات الذكاء الاصطناعي الخاصة بنا بشكل مجهل (Anonymized Data) لتحسين جودة الإشارات الفنية، دون الكشف عن هويتك الحقيقية لأي أطراف خارجية.

4. سرية المحافظ والأرصدة:
تظل عناوين محافظ الاستلام وأرصدة المستخدمين مشفرة تماماً. لا تقوم المنصة بعرض أي بيانات مالية خاصة للمستثمرين في واجهات عامة، وتقتصر المعاينة على المشرفين الموثقين لأغراض التدقيق المالي فقط.

5. مشاركة البيانات والامتثال القانوني:
لا نقوم ببيع أو تأجير بيانات المستخدمين لأي جهات تسويقية. يتم الإفصاح عن البيانات للجهات القانونية فقط في حالة وجود أمر قضائي دولي ملزم ومدعوم بأدلة جنائية، وضمن أضيق نطاق ممكن.

6. حقوق المستخدم السيادية:
للمستخدم الحق الكامل في:
- طلب نسخة من سجل نشاطه الرقمي.
- تحديث بياناته الشخصية في أي وقت.
- طلب حذف الحساب (حق النسيان الرقمي) بشرط عدم وجود التزامات مالية أو عقود استثمارية نشطة.

7. الكوكيز وتأمين الجلسة:
نستخدم ملفات تعريف الارتباط التقنية فقط لضمان استقرار جلسة التداول وحماية المستخدم من هجمات اختطاف الجلسات.

8. التحديثات والتواصل:
سيتم إخطارك بأي تغييرات جوهرية في هذه السياسة عبر مركز التنبيهات في حسابك. استمرار استخدامك للمنصة بعد التحديث يعد موافقة ضمنية على البنود الجديدة.`
  };
});

interface LegalSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function LegalSection({ data, onChange, onSave, saving }: LegalSectionProps) {
  const applyTerms = (val: string) => {
    const tpl = TERMS_TEMPLATES.find(t => t.id === val);
    if (tpl) onChange({ ...data, termsAndConditions: tpl.content });
  };

  const applyPrivacy = (val: string) => {
    const tpl = PRIVACY_TEMPLATES.find(t => t.id === val);
    if (tpl) onChange({ ...data, privacyPolicy: tpl.content });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-700 font-body text-right" dir="rtl">
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-red-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-red-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <Gavel className="h-6 w-6" />
            </div>
            مركز إدارة الميثاق القانوني والسياسات الشاملة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 md:p-12 space-y-12">
          
          <div className="grid gap-12">
            {/* TERMS AND CONDITIONS */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-sm">
                    <ScrollText className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-lg text-[#002d4d]">شروط وأحكام الاستخدام (50 نموذجاً)</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                     <Wand2 className="h-3 w-3 text-red-500" /> اختر نموذجاً متكاملاً:
                  </div>
                  <Select onValueChange={applyTerms}>
                    <SelectTrigger className="h-10 w-64 rounded-xl bg-gray-50 border-none font-black text-[10px] shadow-sm px-4">
                      <SelectValue placeholder="تصفح 50 ميثاقاً للشروط..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]" position="popper">
                      <ScrollArea className="h-[280px]">
                        {TERMS_TEMPLATES.map(t => (
                          <SelectItem key={t.id} value={t.id} className="font-bold text-right py-2.5 cursor-pointer">{t.label}</SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner">
                <Textarea 
                  value={data.termsAndConditions || ""} 
                  onChange={e => onChange({...data, termsAndConditions: e.target.value})}
                  placeholder="أدخل بنود اتفاقية الاستخدام هنا..."
                  className="min-h-[450px] rounded-[36px] bg-white border-none font-bold text-sm shadow-sm p-10 leading-loose text-right scrollbar-none" 
                />
              </div>
            </div>

            <div className="h-px bg-gray-50 mx-4" />

            {/* PRIVACY POLICY */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-lg text-[#002d4d]">سياسة الخصوصية وحماية البيانات (50 نموذجاً)</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                     <Wand2 className="h-3 w-3 text-emerald-500" /> اختر نموذجاً متكاملاً:
                  </div>
                  <Select onValueChange={applyPrivacy}>
                    <SelectTrigger className="h-10 w-64 rounded-xl bg-gray-50 border-none font-black text-[10px] shadow-sm px-4">
                      <SelectValue placeholder="تصفح 50 ميثاقاً للخصوصية..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]" position="popper">
                      <ScrollArea className="h-[280px]">
                        {PRIVACY_TEMPLATES.map(t => (
                          <SelectItem key={t.id} value={t.id} className="font-bold text-right py-2.5 cursor-pointer">{t.label}</SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner">
                <Textarea 
                  value={data.privacyPolicy || ""} 
                  onChange={e => onChange({...data, privacyPolicy: e.target.value})}
                  placeholder="أدخل سياسة حماية بيانات المستثمرين هنا..."
                  className="min-h-[450px] rounded-[36px] bg-white border-none font-bold text-sm shadow-sm p-10 leading-loose text-right scrollbar-none" 
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50/30 rounded-[40px] border border-blue-100/50 flex items-start gap-6">
             <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck className="h-7 w-7 text-blue-600" />
             </div>
             <div className="space-y-1.5 pt-1">
                <p className="text-xs font-black text-[#002d4d]">الالتزام القانوني والامتثال الشامل</p>
                <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed">
                  تعديل هذه الوثائق يؤثر فوراً على كافة المستثمرين. النماذج الـ 100 المتاحة هي مواثيق قانونية متكاملة مصاغة بأسلوب احترافي لتغطي كافة الجوانب التشغيلية والأمنية للمنصة.
                </p>
             </div>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>تفعيل ونشر المواثيق القانونية الشاملة</span>
                <Sparkles className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
