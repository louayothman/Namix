
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout, Sparkles, Loader2, Save } from "lucide-react";

interface LandingPageSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function LandingPageSection({ data, onChange, onSave, saving }: LandingPageSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700 text-right" dir="rtl">
      <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-[#002d4d] p-10 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Layout className="h-32 w-32" /></div>
          <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
              <Layout className="h-8 w-8 text-[#f9a885]" />
            </div>
            إدارة واجهة صفحة الهبوط
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-10">
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">العنوان الترحيبي (Subtitle)</Label>
              <Input 
                value={data.welcomeSubtitle || ""} 
                onChange={e => onChange({...data, welcomeSubtitle: e.target.value})}
                className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner text-right"
                placeholder="مثال: مرحباً بك في مستقبل الاستثمار الذكي"
              />
            </div>

            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">العنوان الرئيسي (Hero Title)</Label>
              <Input 
                value={data.welcomeTitle || ""} 
                onChange={e => onChange({...data, welcomeTitle: e.target.value})}
                className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner text-right"
                placeholder="مثال: ناميكس: حيث تلتقي التقنية بالثروة."
              />
            </div>

            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">الوصف التعريفي (Description)</Label>
              <Textarea 
                value={data.welcomeDescription || ""} 
                onChange={e => onChange({...data, welcomeDescription: e.target.value})}
                className="min-h-[120px] rounded-[32px] bg-gray-50 border-none font-bold text-sm p-8 leading-loose shadow-inner text-right"
                placeholder="اكتب وصفاً جذاباً للمنصة..."
              />
            </div>
          </div>

          <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-5">
             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="h-6 w-6 text-blue-600" />
             </div>
             <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed pt-1">
               التعديلات التي تجريها هنا ستظهر فوراً لكافة الزوار في القسم الأول من صفحة الهبوط. تأكد من استخدام لغة تسويقية قوية تعكس سيادة المنصة.
             </p>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl transition-all active:scale-95 group">
            {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <div className="flex items-center gap-3">
                <span>تحديث ميثاق واجهة الترحيب</span>
                <Save className="h-5 w-5 text-[#f9a885]" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
