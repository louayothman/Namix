
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Zap, Share2, Gift, ChevronLeft } from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GrowthSectionProps {
  dbUser: any;
  onOpenVouchers: () => void;
  onToggleSuccess: (val: boolean) => void;
}

export function GrowthSection({ dbUser, onOpenVouchers, onToggleSuccess }: GrowthSectionProps) {
  const db = useFirestore();

  const handleToggleAutoInvest = async (val: boolean) => {
    if (!dbUser?.id) return;
    try {
      await updateDoc(doc(db, "users", dbUser.id), { isAutoInvestEnabled: val });
      onToggleSuccess(val);
    } catch (e) {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-6">
        <div className="h-1 w-1 rounded-full bg-blue-500" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مركز النمو والسيادة</p>
      </div>

      <Card className="border-none shadow-sm rounded-[40px] bg-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <Zap className="h-40 w-40 text-blue-600" />
        </div>
        
        <CardContent className="p-0 divide-y divide-gray-50 relative z-10">
          {/* Auto Invest Toggle */}
          <div className="p-8 flex items-center justify-between">
            <div className="text-right">
              <p className="font-black text-base text-[#002d4d]">النمو التلقائي (Auto-Invest)</p>
              <p className="text-[10px] text-gray-400 font-bold">أتمتة إعادة استثمار الأرباح لتعظيم العائد.</p>
            </div>
            {/* Forced LTR for the toggle direction as requested */}
            <div dir="ltr">
              <Switch 
                checked={!!dbUser?.isAutoInvestEnabled} 
                onCheckedChange={handleToggleAutoInvest}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          {/* Partners Hub */}
          <Link href="/ambassador" className="block p-8 hover:bg-gray-50/50 transition-all group/item">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="font-black text-base text-[#002d4d] group-hover/item:text-blue-600 transition-colors">مركز الشركاء والسفراء</p>
                <p className="text-[10px] text-gray-400 font-bold">إدارة شبكة الإحالات وعمولات الصدارة.</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover/item:bg-[#002d4d] group-hover/item:text-[#f9a885] transition-all">
                <ChevronLeft className="h-5 w-5" />
              </div>
            </div>
          </Link>

          {/* Vouchers Dialog Trigger */}
          <button onClick={onOpenVouchers} className="w-full text-right p-8 hover:bg-gray-50/50 transition-all group/item outline-none">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="font-black text-base text-[#002d4d] group-hover/item:text-emerald-600 transition-colors">الصكوك والهدايا</p>
                <p className="text-[10px] text-gray-400 font-bold">إصدار أو استلام قسائم رصيد فاخرة.</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all">
                <ChevronLeft className="h-5 w-5" />
              </div>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
