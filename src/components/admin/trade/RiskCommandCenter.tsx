
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ShieldAlert, Zap, Target, Loader2, Sparkles, Activity, ShieldCheck, HeartPulse, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskCommandCenterProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function RiskCommandCenter({ data, onChange, onSave, saving }: RiskCommandCenterProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 text-right" dir="rtl">
      <div className="lg:col-span-8 space-y-10">
        <Card className="rounded-[56px] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-red-50/20 p-10 border-b border-gray-50">
            <CardTitle className="text-xl font-black flex items-center gap-4 text-red-700">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              بروتوكول حماية المستثمر وإدارة المخاطر <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest mr-2">Risk Matrix</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12 space-y-12">
            
            <div className="grid gap-10 md:grid-cols-2">
               <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
                  <div className="flex items-center justify-between">
                     <Label className="font-black text-[#002d4d] text-base uppercase">وقف الخسارة اليومي (Daily Stop)</Label>
                     <Switch checked={!!data.dailyLossLimitEnabled} onCheckedChange={val => onChange({...data, dailyLossLimitEnabled: val})} className="data-[state=checked]:bg-red-500" />
                  </div>
                  <div className="relative">
                    <Input type="number" value={data.maxDailyLossPercent || 15} onChange={e => onChange({...data, maxDailyLossPercent: Number(e.target.value)})} className="h-16 rounded-[28px] bg-white border-none font-black text-center text-3xl text-red-600 shadow-md" />
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-gray-200 text-xl">%</span>
                  </div>
               </div>

               <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
                  <div className="flex items-center justify-between">
                     <Label className="font-black text-[#002d4d] text-base uppercase">تجميد الخسارة المتتالية</Label>
                     <Switch checked={!!data.consecutiveLossFreezeEnabled} onCheckedChange={val => onChange({...data, consecutiveLossFreezeEnabled: val})} className="data-[state=checked]:bg-red-500" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase pr-4">أقصى عدد صفقات خاسرة متتابعة</p>
                    <Input type="number" value={data.maxConsecutiveLosses || 3} onChange={e => onChange({...data, maxConsecutiveLosses: Number(e.target.value)})} className="h-14 rounded-2xl bg-white border-none font-black text-center text-2xl shadow-md" />
                  </div>
               </div>
            </div>

            <div className="p-10 bg-blue-50/30 rounded-[48px] border border-blue-100/50 space-y-10">
               <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-blue-900 flex items-center gap-3">
                    <BrainCircuit className="h-5 w-5" /> عتبة ثقة NAMIX AI
                  </h4>
                  <Badge className="bg-blue-600 text-white border-none font-black text-[9px] px-4 py-1.5 rounded-full shadow-lg">INTELLIGENCE OVERRIDE</Badge>
               </div>
               <div className="space-y-8 px-4">
                  <div className="flex justify-between text-[10px] font-black uppercase text-blue-400">
                     <span>حساسية التنفيذ الآلي</span>
                     <span className="text-blue-600 tabular-nums">%{data.aiConfidenceThreshold || 92} Confidence</span>
                  </div>
                  <Slider 
                    value={[data.aiConfidenceThreshold || 92]} 
                    min={70} 
                    max={100} 
                    step={1} 
                    onValueChange={([val]) => onChange({...data, aiConfidenceThreshold: val})}
                    className="[&>span]:bg-blue-600"
                  />
                  <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed text-center">كلما ارتفعت النسبة، زادت صرامة الذكاء الاصطناعي في تقديم إشارات الشراء/البيع لضمان أعلى معدلات النجاح.</p>
               </div>
            </div>

            <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all hover:bg-[#001d33]">
               {saving ? <Loader2 className="animate-spin h-8 w-8" /> : "اعتماد ميثاق الحماية والذكاء"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-10">
         <div className="p-10 bg-red-600 rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.1] pointer-events-none group-hover:scale-125 transition-transform duration-1000"><HeartPulse className="h-48 w-48" /></div>
            <div className="relative z-10 space-y-6">
               <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner"><ShieldAlert className="h-8 w-8 text-[#f9a885]" /></div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-black">حوكمة المخاطر</h4>
                  <p className="text-[13px] font-bold text-red-50 leading-[2.2]">تعمل هذه الضوابط كصمامات أمان ذكية؛ عند تفعيل "وقف الخسارة"، سيقوم النظام بتعطيل زر الشراء للمستثمر فور وصول خسائره للحد المحدد لضمان استقرار مركزه المالي.</p>
               </div>
            </div>
         </div>

         <div className="p-10 bg-white border border-gray-100 rounded-[48px] shadow-sm space-y-8">
            <div className="flex items-center gap-3 px-2">
               <Target className="h-5 w-5 text-emerald-500" />
               <h4 className="font-black text-sm text-[#002d4d]">أتمتة التشغيل الميكروني</h4>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase">تأمين بـ PIN</span>
                  <Switch checked={!!data.requirePinToTrade} onCheckedChange={val => onChange({...data, requirePinToTrade: val})} className="data-[state=checked]:bg-[#002d4d] scale-75" />
               </div>
               <div className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase">التدقيق الذاتي</span>
                  <Switch checked={!!data.autoCompliance} onCheckedChange={val => onChange({...data, autoCompliance: val})} className="data-[state=checked]:bg-[#002d4d] scale-75" />
               </div>
               <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 space-y-4">
                  <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">تذبذب الألياف (Internal Volatility)</p>
                  <Input type="number" step="0.1" value={data.internalVolatilityMult || 1.0} onChange={e => onChange({...data, internalVolatilityMult: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center text-emerald-600" />
                  <p className="text-[8px] text-emerald-600/60 font-bold text-center">مضاعف حركة السعر للأصول الداخلية.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
