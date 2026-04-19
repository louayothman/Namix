
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Link, Type, MousePointer2, Settings2, Sparkles } from "lucide-react";

/**
 * @fileOverview مفاعل هندسة القوالب البريدية v1.0
 * مكون مستقل لضبط الهوية البصرية للرسائل البريدية.
 */

interface EmailTemplateForgeProps {
  options: {
    primaryColor: string;
    textColor: string;
    buttonText: string;
    buttonLink: string;
    footerText: string;
  };
  onChange: (options: any) => void;
}

export function EmailTemplateForge({ options, onChange }: EmailTemplateForgeProps) {
  return (
    <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden group">
      <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600">
            <Settings2 className="h-5 w-5" />
          </div>
          <div className="text-right">
            <CardTitle className="text-base font-black text-[#002d4d]">تخصيص هوية الرسالة</CardTitle>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Email Visual Identity Forge</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase flex items-center gap-2">
              <Palette className="h-3 w-3" /> لون العناوين والأزرار
            </Label>
            <div className="flex items-center gap-3">
               <Input 
                 type="color" 
                 value={options.primaryColor} 
                 onChange={e => onChange({...options, primaryColor: e.target.value})}
                 className="h-12 w-20 p-1 rounded-xl bg-gray-50 border-none cursor-pointer"
               />
               <Input 
                 value={options.primaryColor} 
                 onChange={e => onChange({...options, primaryColor: e.target.value})}
                 className="h-12 flex-1 rounded-xl bg-gray-50 border-none font-mono text-[10px] text-center"
               />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase flex items-center gap-2">
              <Type className="h-3 w-3" /> لون نص الرسالة
            </Label>
            <div className="flex items-center gap-3">
               <Input 
                 type="color" 
                 value={options.textColor} 
                 onChange={e => onChange({...options, textColor: e.target.value})}
                 className="h-12 w-20 p-1 rounded-xl bg-gray-50 border-none cursor-pointer"
               />
               <Input 
                 value={options.textColor} 
                 onChange={e => onChange({...options, textColor: e.target.value})}
                 className="h-12 flex-1 rounded-xl bg-gray-50 border-none font-mono text-[10px] text-center"
               />
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-gray-50">
           <div className="flex items-center gap-2 pr-2 text-blue-600">
              <MousePointer2 className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase">زر التوجيه (Call to Action)</span>
           </div>
           <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                 <Label className="text-[9px] font-black text-gray-400 pr-4">نص الزر</Label>
                 <Input 
                   placeholder="مثال: انتقل لمحفظتك الآن" 
                   value={options.buttonText}
                   onChange={e => onChange({...options, buttonText: e.target.value})}
                   className="h-12 rounded-xl bg-gray-50 border-none font-bold text-xs" 
                 />
              </div>
              <div className="space-y-2">
                 <Label className="text-[9px] font-black text-gray-400 pr-4">رابط التوجيه</Label>
                 <div className="relative">
                   <Input 
                     placeholder="https://..." 
                     value={options.buttonLink}
                     onChange={e => onChange({...options, buttonLink: e.target.value})}
                     className="h-12 rounded-xl bg-gray-50 border-none font-mono text-[10px] pl-10" 
                     dir="ltr"
                   />
                   <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">نص تذييل الرسالة (Footer)</Label>
          <Textarea 
            value={options.footerText}
            onChange={e => onChange({...options, footerText: e.target.value})}
            placeholder="اكتب معلومات التواصل أو التنبيهات القانونية..."
            className="min-h-[80px] rounded-[24px] bg-gray-50 border-none font-bold text-[10px] p-6 leading-relaxed shadow-inner"
          />
        </div>

        <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
           <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
           <p className="text-[9px] font-bold text-blue-800/60 leading-relaxed">
             سيتم دمج هذه الإعدادات تلقائياً داخل قالب HTML احترافي عند اختيار قناة الإرسال عبر البريد الإلكتروني.
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
