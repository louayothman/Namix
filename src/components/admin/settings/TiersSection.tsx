
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, PlusCircle, Trash2, Gift, Coins, TrendingUp, Briefcase, Users, Wallet, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بروتوكول حوكمة الرتب v12.0
 * تم تحديث القوالب الافتراضية لتكون أكثر تدرجاً ومنطقية بناءً على رغبة المستخدم.
 */

interface TiersSectionProps {
  tiers: any[];
  onChange: (newTiers: any[]) => void;
  onSave: () => void;
  saving: boolean;
}

const DEFAULT_TIERS = [
  { id: 't1', name: " Starter - بروتوكول البداية", color: "blue", minBalance: 0, minTotalProfits: 0, minInvites: 0, minHistoricalInvest: 0, rewardAmount: 0, badgeLabel: "ROOKIE" },
  { id: 't2', name: "Bronze - المستوى البرونزي", color: "orange", minBalance: 500, minTotalProfits: 100, minInvites: 5, minHistoricalInvest: 250, rewardAmount: 25, badgeLabel: "BRONZE" },
  { id: 't3', name: "Silver - الفئة الفضية", color: "gray", minBalance: 2500, minTotalProfits: 1000, minInvites: 15, minHistoricalInvest: 1500, rewardAmount: 100, badgeLabel: "SILVER" },
  { id: 't4', name: "Gold - العضوية الذهبية", color: "yellow", minBalance: 10000, minTotalProfits: 5000, minInvites: 30, minHistoricalInvest: 7500, rewardAmount: 500, badgeLabel: "GOLD" },
  { id: 't5', name: "Platinum - رتبة البلاتينيوم", color: "emerald", minBalance: 50000, minTotalProfits: 25000, minInvites: 50, minHistoricalInvest: 35000, rewardAmount: 2500, badgeLabel: "ELITE" },
  { id: 't6', name: "Diamond - صك السيادة الماسي", color: "blue", minBalance: 250000, minTotalProfits: 100000, minInvites: 100, minHistoricalInvest: 150000, rewardAmount: 10000, badgeLabel: "DIAMOND" },
];

export function TiersSection({ tiers, onChange, onSave, saving }: TiersSectionProps) {
  const addTier = () => {
    onChange([...tiers, { 
      id: Date.now().toString(), name: "رتبة جديدة", color: "blue", minBalance: 1000, 
      minTotalProfits: 500, minInvites: 0, minHistoricalInvest: 0, rewardAmount: 100, 
      badgeLabel: "ELITE" 
    }]);
  };

  const applyDefaultTemplate = () => {
    if (confirm("سيتم استبدال كافة الرتب الحالية بالقالب الافتراضي المطور. هل تود المتابعة؟")) {
      onChange(DEFAULT_TIERS);
    }
  };

  const updateTier = (idx: number, field: string, val: any) => {
    const updated = [...tiers];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const removeTier = (idx: number) => {
    onChange(tiers.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-700 font-body text-right" dir="rtl">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 border-b border-gray-100 pb-8">
         <div className="space-y-1">
           <h2 className="text-3xl font-black text-[#002d4d] flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <Award className="h-8 w-8" />
              </div>
              حوكمة الرتب والنخبة
           </h2>
           <p className="text-gray-400 font-bold text-xs">تحديد مسارات الترقي التلقائي والمكافآت النقدية المرافقة لها.</p>
         </div>
         <div className="flex items-center gap-3">
            <Button onClick={applyDefaultTemplate} variant="ghost" className="h-14 px-8 rounded-full bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-[#002d4d] hover:text-white transition-all">
               <Sparkles className="ml-2 h-4 w-4" /> قالب ناميكس المتدرج
            </Button>
            <Button onClick={addTier} className="rounded-full h-14 px-10 bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl transition-all active:scale-95">
              <PlusCircle className="ml-2 h-5 w-5 text-[#f9a885]" /> تعريف رتبة مخصصة
            </Button>
         </div>
      </div>

      <div className="grid gap-10">
        {tiers.map((tier, i) => (
          <Card key={tier.id} className="border-none shadow-sm rounded-[56px] bg-white overflow-hidden relative group transition-all hover:shadow-2xl border border-gray-50">
            <div className={cn("absolute top-0 right-0 w-2.5 h-full opacity-60", 
              tier.color === 'blue' ? "bg-blue-500" : 
              tier.color === 'emerald' ? "bg-emerald-500" : 
              tier.color === 'orange' ? "bg-orange-500" :
              tier.color === 'yellow' ? "bg-yellow-400" : "bg-gray-400"
            )} />
            
            <CardContent className="p-10 md:p-14 space-y-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "h-20 w-20 rounded-[32px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-700", 
                    tier.color === 'blue' ? "bg-blue-50 text-blue-600" : 
                    tier.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : 
                    tier.color === 'orange' ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-gray-400"
                  )}>
                    <Award className="h-10 w-10" />
                  </div>
                  <div className="space-y-3">
                    <Input 
                      value={tier.name} 
                      onChange={e => updateTier(i, 'name', e.target.value)} 
                      className="h-14 w-80 rounded-2xl border-none bg-gray-50 font-black text-2xl text-[#002d4d] shadow-inner text-right pr-6" 
                    />
                    <div className="flex items-center gap-3">
                       <Select value={tier.color} onValueChange={val => updateTier(i, 'color', val)}>
                          <SelectTrigger className="h-9 w-32 rounded-xl border border-gray-100 bg-white font-black text-[9px] shadow-sm px-4">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl">
                             <SelectItem value="blue">Blue Spectrum</SelectItem>
                             <SelectItem value="emerald">Emerald Node</SelectItem>
                             <SelectItem value="orange">Bronze Pulse</SelectItem>
                             <SelectItem value="yellow">Golden Core</SelectItem>
                             <SelectItem value="gray">Silver Logic</SelectItem>
                          </SelectContent>
                       </Select>
                       <Input 
                        placeholder="Badge Label (e.g. GOLD)" 
                        value={tier.badgeLabel} 
                        onChange={e => updateTier(i, 'badgeLabel', e.target.value.toUpperCase())}
                        className="h-9 w-32 rounded-xl bg-gray-100 border-none font-black text-[9px] text-center uppercase"
                       />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <Button size="icon" variant="ghost" className="h-14 w-14 rounded-2xl bg-red-50 text-red-400 hover:bg-red-100 transition-all shadow-sm" onClick={() => removeTier(i)}>
                      <Trash2 className="h-6 w-6" />
                   </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-4">
                {[
                  { label: "الرصيد المطلوب", key: "minBalance", icon: Wallet, c: "text-blue-500" },
                  { label: "أرباح محققة", key: "minTotalProfits", icon: TrendingUp, c: "text-emerald-500" },
                  { label: "حجم التداول", key: "minHistoricalInvest", icon: Briefcase, c: "text-orange-500" },
                  { label: "دعوات الشركاء", key: "minInvites", icon: Users, c: "text-purple-500" },
                ].map((field) => (
                  <div key={field.key} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-4">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <field.icon className={cn("h-3.5 w-3.5", field.c)} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{field.label}</span>
                    </div>
                    <Input 
                      type="number" 
                      value={tier[field.key] ?? ""} 
                      onChange={e => updateTier(i, field.key, Number(e.target.value))} 
                      className="h-12 rounded-xl border-none bg-white font-black text-center text-lg shadow-sm" 
                    />
                  </div>
                ))}
              </div>

              <div className="p-10 bg-emerald-600 rounded-[48px] text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12"><Gift size={160} /></div>
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 rounded-[32px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                       <Coins className="h-10 w-10 text-[#f9a885]" />
                    </div>
                    <div className="text-right">
                       <h4 className="text-2xl font-black">مكافأة الاستحقاق المالية</h4>
                       <p className="text-[11px] font-bold text-emerald-100/60 leading-relaxed max-w-sm">يتم حقن هذا المبلغ في المحفظة الجارية للمستثمر آلياً وفورياً بمجرد بلوغه هذه الرتبة.</p>
                    </div>
                 </div>
                 <div className="relative z-10">
                    <Input 
                      type="number" 
                      value={tier.rewardAmount ?? ""} 
                      onChange={e => updateTier(i, 'rewardAmount', Number(e.target.value))} 
                      className="h-20 w-64 rounded-[32px] bg-white border-none font-black text-center text-5xl text-emerald-600 shadow-2xl" 
                    />
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-10 flex flex-col items-center gap-8">
         <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6 max-w-2xl text-right">
            <ShieldCheck className="h-8 w-8 text-blue-600 shrink-0 mt-1" />
            <p className="text-[12px] font-bold text-blue-800/70 leading-[2.2]">
               ملاحظة هامة: نظام الرتب يعمل بنظام "التوافق الكلي"؛ لن تتم ترقية المستثمر إلا إذا استوفى **كافة** الشروط المحددة للرتبة. سيظهر للمستثمر في واجهته النقص في كل معيار لدفعه نحو النمو.
            </p>
         </div>

         <Button onClick={onSave} disabled={saving} className="w-full max-w-xl h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl active:scale-[0.98] transition-all group">
           {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
             <div className="flex items-center gap-4">
                <span>تثبيت ونشر ميثاق الرتب الجديد</span>
                <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
             </div>
           )}
         </Button>
      </div>
    </div>
  );
}
