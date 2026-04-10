
"use client";

import { 
  Clock, Landmark, Wallet, Coins, Share2, Award, Activity, Edit2, Gavel, ArrowRight, LucideIcon, UserPlus, ShieldCheck, Gift, Cpu, Layout, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function SettingsMenu({ onSelect }: { onSelect: (id: string) => void }) {
  const menuItems: MenuItem[] = [
    { id: 'landing_page', title: "صفحة الهبوط", desc: "تعديل النصوص الترحيبية وروابط التواصل", icon: Layout, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 'connectivity', title: "توصيلات الأسواق", desc: "ربط Binance و Twelve Data للأتمتة", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 'onboarding', title: "رصيد الترحيب", desc: "إدارة الحوافز النقدية للمستثمرين الجدد", icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 'insurance', title: "صندوق التأمين", desc: "حوكمة وحماية رؤوس أموال المنصة", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: 'withdraw_logic', title: "قوانين السحب", desc: "إدارة قيود وفترات انتظار سحب الأموال", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 'voucher_logic', title: "قوانين القسائم", desc: "شروط إصدار وتفعيل صكوك الهدايا", icon: Gift, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: 'withdraw_methods', title: "بوابات السحب", desc: "تخصيص قنوات صرف الأرباح للمستثمرين", icon: Landmark, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 'deposit_logic', title: "بوابات الإيداع", desc: "تخصيص محافظ الاستلام وتعليمات الشحن", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: 'vault_bonus', title: "الخزنة والمكافآت", desc: "إعداد أرباح الرصيد الخامل ومكافآت الشحن", icon: Coins, color: "text-yellow-600", bg: "bg-yellow-50" },
    { id: 'partnership', title: "نظام الشركاء", desc: "نظام العمولات ونمو الشبكة الاستراتيجي", icon: Share2, color: "text-[#f9a885]", bg: "bg-orange-50" },
    { id: 'tiers', title: "نظام الرتب", desc: "تعريف مستويات المستثمرين والمكافآت", icon: Award, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 'marketing', title: "التسويق والظهور", desc: "التحكم في العدادات الحية وشريط الأنباء", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
    { id: 'content', title: "إدارة المحتوى", desc: "تعديل صفحة عن المنصة والأسئلة الشائعة", icon: Edit2, color: "text-[#002d4d]", bg: "bg-gray-100" },
    { id: 'legal', title: "الميثاق القانوني", desc: "تحديث الشروط والأحكام وسياسة الخصوصية", icon: Gavel, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in zoom-in-95 duration-700">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="p-10 bg-white rounded-[56px] border border-gray-50 shadow-sm text-right flex flex-col gap-8 transition-all hover:shadow-2xl hover:-translate-y-2 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
             <item.icon className="h-40 w-40" />
          </div>
          <div className={cn("h-20 w-20 rounded-[28px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110", item.bg, item.color)}>
            <item.icon className="h-10 w-10" />
          </div>
          <div className="space-y-3 relative z-10">
            <h3 className="text-2xl font-black text-[#002d4d]">{item.title}</h3>
            <p className="text-[13px] text-gray-400 font-bold leading-relaxed">{item.desc}</p>
          </div>
          <div className="pt-4 flex justify-end">
             <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-sm">
                <ArrowRight className="h-6 w-6" />
             </div>
          </div>
        </button>
      ))}
    </div>
  );
}
