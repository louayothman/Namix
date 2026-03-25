
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Coins, Plus, Trash2, Zap, Sparkles, Loader2, Gift, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VaultBonusSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function VaultBonusSection({ data, onChange, onSave, saving }: VaultBonusSectionProps) {
  const addBonusTier = () => {
    const tiers = data.depositBonuses || [];
    onChange({
      ...data,
      depositBonuses: [...tiers, { min: 100, max: 1000, percent: 5 }]
    });
  };

  const updateBonusTier = (idx: number, field: string, val: any) => {
    const tiers = [...(data.depositBonuses || [])];
    tiers[idx] = { ...tiers[idx], [field]: val };
    onChange({ ...data, depositBonuses: tiers });
  };

  const removeBonusTier = (idx: number) => {
    const tiers = (data.depositBonuses || []).filter((_: any, i: number) => i !== idx);
    onChange({ ...data, depositBonuses: tiers });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-yellow-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-yellow-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <Coins className="h-6 w-6" />
            </div>
            بروتوكول تحفيز السيولة والخزنة (Vault)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          
          {/* VAULT INTEREST CONFIG */}
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="p-10 bg-gray-50 rounded-[48px] space-y-8 border border-gray-100 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <Label className="font-black text-[#002d4d] text-base">أرباح الرصيد الخامل (Vault APY)</Label>
                </div>
                <Switch 
                  checked={!!data.isVaultEnabled} 
                  onCheckedChange={val => onChange({...data, isVaultEnabled: val})}
                  className="data-[state=checked]:bg-yellow-500"
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4">نسبة الربح السنوي الموزعة (%)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={data.vaultAPY ?? ""} 
                    onChange={e => onChange({...data, vaultAPY: Number(e.target.value)})}
                    className="h-16 rounded-[24px] bg-white border-none font-black text-center text-3xl text-yellow-600 shadow-md"
                  />
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-gray-200 text-xl">%</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold text-center leading-relaxed">
                  يتم توزيع هذه الأرباح تلقائياً على الأرصدة غير المستثمرة في المحفظة الجارية.
                </p>
              </div>
            </div>

            <div className="p-8 bg-blue-50/30 rounded-[40px] border border-blue-100/50 flex items-start gap-5">
               <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
               </div>
               <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-black text-[#002d4d]">استراتيجية تدوير السيولة</p>
                  <p className="text-[10px] text-blue-800/60 font-bold leading-relaxed">
                    تفعيل أرباح الخزنة يقلل من خروج السيولة (Withdrawals) ويشجع المستثمرين على الاحتفاظ بأرصدتهم داخل المنصة.
                  </p>
               </div>
            </div>
          </div>

          <div className="h-px bg-gray-50 mx-4" />

          {/* DEPOSIT BONUSES - MULTIPLIER ENGINE */}
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-1 text-right">
                <h3 className="text-2xl font-black text-[#002d4d] flex items-center gap-3">
                  <Gift className="h-7 w-7 text-emerald-500" />
                  مضاعفات حوافز الإيداع (Bonus Protocol)
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Incentive Multiplier Configuration</p>
              </div>
              <Button onClick={addBonusTier} className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] h-11 px-8 shadow-lg active:scale-95">
                <Plus className="ml-2 h-4 w-4 text-[#f9a885]" /> إضافة شريحة مكافأة
              </Button>
            </div>

            <div className="grid gap-6">
              {data.depositBonuses?.map((tier: any, idx: number) => (
                <div key={idx} className="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative group transition-all hover:bg-white hover:shadow-xl">
                  <button onClick={() => removeBonusTier(idx)} className="absolute top-6 left-6 h-9 w-9 rounded-xl bg-white text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-sm">
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-5 shrink-0">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Tier Multiplier</p>
                      <p className="text-sm font-black text-[#002d4d]">شريحة الإيداع #{idx + 1}</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-3 gap-6 w-full">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">أقل مبلغ ($)</Label>
                      <Input type="number" value={tier.min} onChange={e => updateBonusTier(idx, 'min', Number(e.target.value))} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-inner" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">أقصى مبلغ ($)</Label>
                      <Input type="number" value={tier.max} onChange={e => updateBonusTier(idx, 'max', Number(e.target.value))} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-inner" placeholder="∞" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black text-emerald-600 uppercase pr-4">المكافأة (%)</Label>
                      <div className="relative">
                        <Input type="number" value={tier.percent} onChange={e => updateBonusTier(idx, 'percent', Number(e.target.value))} className="h-12 rounded-xl bg-emerald-50 border-none font-black text-center text-emerald-600 shadow-inner" />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-200">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!data.depositBonuses || data.depositBonuses.length === 0) && (
                <div className="py-20 text-center flex flex-col items-center gap-4 opacity-20 border-2 border-dashed border-gray-100 rounded-[48px]">
                   <Gift className="h-16 w-16 text-[#002d4d]" />
                   <p className="text-xs font-black uppercase tracking-[0.5em]">لا توجد مضاعفات شحن نشطة حالياً</p>
                </div>
              )}
            </div>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all hover:bg-[#001d33] active:scale-[0.98] group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>اعتماد بروتوكول حوافز التدفق</span>
                <Coins className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
