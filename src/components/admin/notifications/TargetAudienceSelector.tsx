
"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Zap, TrendingUp, Award, UserMinus, ShieldCheck, Mail, Wallet, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface TargetAudienceSelectorProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const AUDIENCE_OPTIONS = [
  { id: 'all', label: 'جميع المسجلين', icon: Users, color: 'text-blue-500' },
  { id: 'active_investors', label: 'المستثمرون النشطون (لديهم عقود)', icon: Zap, color: 'text-[#f9a885]' },
  { id: 'new_users', label: 'المسجلون الجدد (آخر 7 أيام)', icon: TrendingUp, color: 'text-emerald-500' },
  { id: 'whales', label: 'كبار المستثمرين (إيداع > 5000$)', icon: Wallet, color: 'text-purple-500' },
  { id: 'tier_bronze', label: 'رتبة المستوى البرونزي', icon: Award, color: 'text-orange-400' },
  { id: 'tier_silver', label: 'رتبة الفئة الفضية', icon: Award, color: 'text-gray-400' },
  { id: 'tier_gold', label: 'رتبة العضوية الذهبية', icon: Award, color: 'text-yellow-500' },
  { id: 'tier_diamond', label: 'رتبة الصك الماسي', icon: Award, color: 'text-blue-600' },
  { id: 'zero_balance', label: 'مستخدمون برصيد صفر', icon: UserX, color: 'text-red-400' },
  { id: 'no_investments', label: 'مستخدمون لم يفعّلوا عقوداً', icon: UserMinus, color: 'text-gray-500' },
  { id: 'admins', label: 'الطاقم الإداري فقط', icon: ShieldCheck, color: 'text-[#002d4d]' },
];

export function TargetAudienceSelector({ value, onChange, className }: TargetAudienceSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">تحديد الفئة المستهدفة (12 خياراً)</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black text-xs px-8 shadow-inner text-right">
          <SelectValue placeholder="اختر الفئة المراد استهدافها..." />
        </SelectTrigger>
        <SelectContent className="rounded-[28px] border-none shadow-2xl p-2 min-w-[300px]" dir="rtl">
          {AUDIENCE_OPTIONS.map((opt) => (
            <SelectItem key={opt.id} value={opt.id} className="rounded-xl py-3 cursor-pointer">
              <div className="flex items-center gap-3 justify-end text-right">
                <span className="font-bold text-xs">{opt.label}</span>
                <opt.icon className={cn("h-4 w-4", opt.color)} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
