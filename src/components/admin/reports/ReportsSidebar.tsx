"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CircleDollarSign, Clock, AlertCircle, History, Wallet, Activity } from "lucide-react";
import Link from "next/link";

interface ReportsSidebarProps {
  stats: any;
}

export function ReportsSidebar({ stats }: ReportsSidebarProps) {
  const summaryItems = [
    { label: "متوسط إيداع المستخدم", val: stats.totalDepositsValue / (stats.userCount || 1), icon: Wallet, color: "text-blue-500" },
    { label: "نسبة أرباح التداول", val: (stats.tradeProfits / (stats.investProfits + stats.tradeProfits || 1)) * 100, icon: Activity, color: "text-emerald-500", suffix: "%" },
    { label: "الالتزام المستقبلي", val: stats.futureDueProfits, icon: Clock, color: "text-orange-500" }
  ];

  return (
    <div className="space-y-10 text-right" dir="rtl">
      {/* Sovereign Fund Card */}
      <Card className="border-none shadow-sm rounded-[48px] bg-emerald-600 text-white overflow-hidden relative group p-10 space-y-8">
         <div className="absolute top-0 left-0 p-8 opacity-[0.1] pointer-events-none group-hover:scale-125 transition-transform duration-1000"><ShieldCheck className="h-48 w-48" /></div>
         <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:bg-white/20 transition-all mx-auto md:mr-0">
            <CircleDollarSign className="h-8 w-8 text-[#f9a885]" />
         </div>
         <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-black">صندوق السيادة (Treasury)</h3>
            <p className="text-[13px] text-emerald-100 font-bold leading-[2]">
               يمثل هذا المبلغ السيولة الصافية المتبقية في المنصة بعد خصم كافة السحوبات المنفذة، ويُستخدم كاحتياطي لتغطية أرصدة المستخدمين والنمو المستقبلي.
            </p>
         </div>
         <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1">Treasury Active Liquidity</p>
            <h4 className="text-4xl font-black tabular-nums tracking-tighter">${(stats.totalDepositsValue - stats.totalWithdrawalsValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
         </div>
      </Card>

      {/* Manual Audit Card */}
      <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white group">
         <CardHeader className="bg-orange-50/50 p-8 border-b border-gray-100">
            <CardTitle className="text-sm font-black flex items-center gap-3 text-orange-600 justify-end">
               إيداعات قيد المراجعة اليدوية
               <Clock className="h-4 w-4" />
            </CardTitle>
         </CardHeader>
         <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between">
               <div className="text-right">
                  <p className="text-[2xl] font-black text-orange-500 tabular-nums">${stats.pendingDepositsValue.toLocaleString()}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase">القيمة الإجمالية</p>
               </div>
               <div className="text-left">
                  <p className="text-3xl font-black text-[#002d4d] tabular-nums">{stats.pendingDepositsCount}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase">مجموع الطلبات</p>
               </div>
            </div>
            <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-4">
               <AlertCircle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
               <p className="text-[10px] font-bold text-gray-500 leading-relaxed">يتطلب بروتوكول الأمان مراجعة هذه الطلبات يدوياً لمطابقتها مع سجلات التحويل الرقمية.</p>
            </div>
            <Link href="/admin/deposits" className="block">
              <Button className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-[10px] shadow-lg active:scale-95 transition-all">التوجه لمركز الإيداع</Button>
            </Link>
         </CardContent>
      </Card>

      {/* Intelligence Summary */}
      <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white group">
         <CardHeader className="p-8 border-b border-gray-100">
            <CardTitle className="text-sm font-black flex items-center gap-3 text-blue-500 justify-end">
               ملخص الاستخبارات المالية
               <History className="h-4 w-4" />
            </CardTitle>
         </CardHeader>
         <CardContent className="p-8 space-y-4">
            {summaryItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md group/stat">
                 <span className="font-black text-[#002d4d] text-sm tabular-nums">
                    {item.suffix === '%' ? '' : '$'}{item.val.toLocaleString(undefined, { maximumFractionDigits: 1 })}{item.suffix || ''}
                 </span>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</span>
                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm"><item.icon size={14} className={item.color} /></div>
                 </div>
              </div>
            ))}
         </CardContent>
      </Card>
    </div>
  );
}
