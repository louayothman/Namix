
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Timer, Briefcase, Zap, ShieldCheck, Loader2, Activity, Target, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalMarketControlsProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

const UNIT_OPTIONS = [
  { id: 'seconds', label: 'ثانية' },
  { id: 'minutes', label: 'دقيقة' },
  { id: 'hours', label: 'ساعة' },
  { id: 'days', label: 'يوم' },
  { id: 'months', label: 'شهر' }
];

export function GlobalMarketControls({ data, onChange, onSave, saving }: GlobalMarketControlsProps) {
  
  const tradeDurations = data.tradeDurations || [];

  const addDurationOption = () => {
    const next = [...tradeDurations, { value: 60, unit: 'seconds' }];
    onChange({ ...data, tradeDurations: next });
  };

  const removeDurationOption = (idx: number) => {
    const next = tradeDurations.filter((_: any, i: number) => i !== idx);
    onChange({ ...data, tradeDurations: next });
  };

  const updateDurationOption = (idx: number, field: string, val: any) => {
    const next = [...tradeDurations];
    next[idx] = { ...next[idx], [field]: val };
    onChange({ ...data, tradeDurations: next });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 text-right" dir="rtl">
      <div className="lg:col-span-8 space-y-8">
        <Card className="rounded-[48px] border-none shadow-xl bg-white overflow-hidden group">
          <CardHeader className="bg-blue-50/20 p-8 border-b border-gray-50">
            <CardTitle className="text-xl font-black flex items-center gap-4 text-blue-700">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Globe className="h-6 w-6" />
              </div>
              الضبط العالمي الموحد <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mr-2">Market Core</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            
            <div className="grid gap-10 md:grid-cols-2">
               {/* 1. TRADE DURATIONS MANAGEMENT */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-3">
                       <Timer className="h-4 w-4 text-blue-500" />
                       <Label className="font-black text-[#002d4d] text-sm">خيارات مدد العقود</Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={addDurationOption}
                      className="h-8 rounded-xl bg-blue-50 text-blue-600 text-[9px] font-black px-4 active:scale-95 transition-all"
                    >
                      <Plus size={14} className="ml-1" /> إضافة خيار
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {tradeDurations.map((opt: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner group/opt animate-in fade-in slide-in-from-top-1">
                         <Input 
                           type="number" 
                           value={opt.value} 
                           onChange={e => updateDurationOption(i, 'value', Number(e.target.value))}
                           className="h-10 flex-1 rounded-xl bg-white border-none font-black text-center text-sm shadow-sm"
                         />
                         <Select value={opt.unit} onValueChange={val => updateDurationOption(i, 'unit', val)}>
                            <SelectTrigger className="h-10 w-28 rounded-xl bg-white border-none font-black text-[10px] shadow-sm">
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                               {UNIT_OPTIONS.map(u => (
                                 <SelectItem key={u.id} value={u.id} className="font-bold text-right py-2.5">{u.label}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                         <button 
                           onClick={() => removeDurationOption(i)}
                           className="h-10 w-10 rounded-xl bg-white text-red-400 flex items-center justify-center hover:bg-red-50 opacity-0 group-hover/opt:opacity-100 transition-all"
                         >
                            <Trash2 size={14} />
                         </button>
                      </div>
                    ))}
                    {tradeDurations.length === 0 && (
                      <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
                         <Timer size={24} />
                         <p className="text-[9px] font-black uppercase">No durations set</p>
                      </div>
                    )}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 pr-2">
                     <Zap className="h-4 w-4 text-orange-500" />
                     <Label className="font-black text-[#002d4d] text-sm">الربح العالمي الموحد (%)</Label>
                  </div>
                  <div className="relative">
                    <Input type="number" value={data.defaultProfitRate || 80} onChange={e => onChange({...data, defaultProfitRate: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-2xl text-emerald-600 shadow-inner" />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-200 text-lg">%</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold pr-2 leading-relaxed">يتم تطبيق هذه النسبة على كافة عقود التداول المفتوحة فورياً.</p>
               </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 pt-8 border-t border-gray-50">
               <div className="space-y-3">
                  <div className="flex items-center gap-3 pr-2">
                     <Briefcase className="h-4 w-4 text-blue-600" />
                     <Label className="font-black text-[#002d4d] text-sm">أدنى دخول ($)</Label>
                  </div>
                  <Input type="number" value={data.minTradeAmount || 10} onChange={e => onChange({...data, minTradeAmount: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl shadow-inner" />
               </div>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 pr-2">
                     <ShieldCheck className="h-4 w-4 text-emerald-600" />
                     <Label className="font-black text-[#002d4d] text-sm">أقصى دخول ($)</Label>
                  </div>
                  <Input type="number" value={data.maxTradeAmount || 5000} onChange={e => onChange({...data, maxTradeAmount: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl shadow-inner" />
               </div>
            </div>

            <Button onClick={onSave} disabled={saving} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98]">
               {saving ? <Loader2 className="animate-spin h-6 w-6" /> : "تثبيت الضوابط المحدثة"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-8">
         <div className="p-8 bg-[#002d4d] rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-1000"><Activity className="h-32 w-32" /></div>
            <div className="relative z-10 space-y-6">
               <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner"><Target className="h-7 w-7 text-[#f9a885]" /></div>
               <div className="space-y-2">
                  <h4 className="text-xl font-black">حوكمة النبض</h4>
                  <p className="text-[12px] font-bold text-blue-100/60 leading-[2.2]">تؤثر هذه الضوابط على كافة العمليات اللحظية؛ ضمان التوازن بين العائد المرتفع واستقرار السيولة هو أولوية هذا النظام.</p>
               </div>
            </div>
         </div>

         <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 space-y-6 shadow-inner">
            <h4 className="font-black text-[11px] text-[#002d4d] uppercase tracking-widest px-2">تنشيط المكونات</h4>
            <div className="space-y-3">
               {[
                 { label: 'الذكاء الاصطناعي (NAMIX AI)', id: 'aiEnabled', color: 'bg-blue-500' },
                 { label: 'محرك التحليل الفني', id: 'chartsEnabled', color: 'bg-emerald-500' }
               ].map(opt => (
                 <div key={opt.id} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-black text-[#002d4d]">{opt.label}</span>
                    <Switch checked={!!data[opt.id]} onCheckedChange={val => onChange({...data, [opt.id]: val})} className={cn("data-[state=checked]:"+opt.color)} />
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
