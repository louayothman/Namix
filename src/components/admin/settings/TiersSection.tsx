
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, PlusCircle, Trash2, ShieldHalf, Gift, Coins, TrendingUp, Briefcase, Users, Wallet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TiersSectionProps {
  tiers: any[];
  onChange: (newTiers: any[]) => void;
  onSave: () => void;
  saving: boolean;
}

export function TiersSection({ tiers, onChange, onSave, saving }: TiersSectionProps) {
  const addTier = () => {
    onChange([...tiers, { 
      id: Date.now().toString(), name: "رتبة جديدة", color: "blue", minBalance: 1000, 
      minTotalProfits: 500, minInvites: 0, minHistoricalInvest: 0, rewardAmount: 100, 
      isInsured: false, badgeLabel: "ELITE" 
    }]);
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
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
         <div className="space-y-1">
           <h2 className="text-2xl font-black text-[#002d4d] flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <Award className="h-6 w-6" />
              </div>
              بروتوكول تصنيف المستثمرين ونظام النخبة
           </h2>
         </div>
         <Button onClick={addTier} className="rounded-full h-14 px-8 bg-blue-600 text-white font-black text-xs shadow-xl">
           <PlusCircle className="ml-2 h-5 w-5" /> تعريف رتبة جديدة
         </Button>
      </div>

      <div className="grid gap-10">
        {tiers.map((tier, i) => (
          <Card key={tier.id} className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden relative group">
            <div className={cn("absolute top-0 right-0 w-3 h-full", `bg-${tier.color || 'blue'}-500`)} />
            <CardContent className="p-12 space-y-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className={cn("h-20 w-20 rounded-[32px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", `bg-${tier.color || 'blue'}-50 text-${tier.color || 'blue'}-600`)}>
                    <Award className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <Input value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} className="h-12 w-64 rounded-xl border-none bg-gray-50 font-black text-xl text-[#002d4d]" />
                    <Select value={tier.color} onValueChange={val => updateTier(i, 'color', val)}>
                      <SelectTrigger className="h-8 w-32 rounded-full border-none font-black text-[9px] shadow-md px-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="emerald">Emerald</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[28px]">
                  <Switch checked={!!tier.isInsured} onCheckedChange={val => updateTier(i, 'isInsured', val)} className="data-[state=checked]:bg-emerald-500" />
                  <Button size="icon" variant="ghost" className="h-12 w-12 text-red-400" onClick={() => removeTier(i)}>
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-4">
                {[
                  { label: "الرصيد المطلوي", key: "minBalance", icon: Wallet },
                  { label: "أرباح محققة", key: "minTotalProfits", icon: TrendingUp },
                  { label: "إجمالي استثمار", key: "minHistoricalInvest", icon: Briefcase },
                  { label: "دعوات مؤكدة", key: "minInvites", icon: Users },
                ].map((field) => (
                  <div key={field.key} className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <field.icon className="h-3 w-3" />
                      <span className="text-[9px] font-black uppercase">{field.label}</span>
                    </div>
                    <Input type="number" value={tier[field.key] ?? ""} onChange={e => updateTier(i, field.key, Number(e.target.value))} className="h-12 rounded-xl border-none font-black text-center" />
                  </div>
                ))}
              </div>

              <div className="p-8 bg-blue-50/30 rounded-[40px] border border-blue-100/50 flex items-center justify-between gap-8">
                 <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-blue-600">
                       <Gift className="h-7 w-7" />
                    </div>
                    <h4 className="font-black text-lg text-[#002d4d]">مكافأة بلوغ الرتبة</h4>
                 </div>
                 <Input type="number" value={tier.rewardAmount ?? ""} onChange={e => updateTier(i, 'rewardAmount', Number(e.target.value))} className="h-16 w-64 rounded-[24px] bg-white border-none font-black text-center text-3xl text-blue-600 shadow-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-blue-600 text-white font-black text-xl shadow-2xl">
        {saving ? <Loader2 className="animate-spin h-8 w-8" /> : "اعتماد ترقيات النظام الجديدة"}
      </Button>
    </div>
  );
}
