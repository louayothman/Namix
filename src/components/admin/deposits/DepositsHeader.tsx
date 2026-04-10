
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Wallet, Sparkles, LayoutGrid } from "lucide-react";

interface DepositsHeaderProps {
  activeView: string;
  onBack: () => void;
}

export function DepositsHeader({ activeView, onBack }: DepositsHeaderProps) {
  const getTitle = () => {
    switch(activeView) {
      case 'api': return "ضبط بروتوكولات API";
      case 'portals': return "هندسة بوابات الدفع";
      case 'ledger': return "سجل العمليات والتدقيق";
      default: return "إدارة تدفقات الخزينة";
    }
  };

  const getSubTitle = () => {
    switch(activeView) {
      case 'api': return "معايرة مفاتيح الربط الدولية (NOWPayments & Binance).";
      case 'portals': return "تخصيص محافظ الاستلام وتعليمات الشحن اللحظي.";
      case 'ledger': return "مراجعة وتأكيد إيداعات المستثمرين عبر الشبكة.";
      default: return "المركز السيادي الموحد لإدارة دخول الأموال والأتمتة.";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
      <div className="space-y-2 text-right">
        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Treasury Control Center
        </div>
        <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">{getTitle()}</h1>
        <p className="text-muted-foreground font-bold text-xs">{getSubTitle()}</p>
      </div>
      
      {activeView !== 'menu' && (
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="rounded-full h-14 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md font-black text-[11px] text-[#002d4d] gap-3 group"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          العودة للقائمة الرئيسية
        </Button>
      )}
    </div>
  );
}
