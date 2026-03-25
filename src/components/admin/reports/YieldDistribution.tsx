"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Award, Sparkles, Clock, PieChart as PieChartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

interface YieldDistributionProps {
  stats: any;
}

export function YieldDistribution({ stats }: YieldDistributionProps) {
  const yieldItems = [
    { label: "أرباح التداول الفوري", val: stats.tradeProfits, color: "bg-blue-500", icon: Activity },
    { label: "أرباح العقود المنتهية", val: stats.investProfits, color: "bg-emerald-500", icon: Award },
    { label: "مكافآت الرتب والشركاء", val: stats.totalRewards, color: "bg-[#f9a885]", icon: Sparkles },
    { label: "أرباح مستحقة (عقود نشطة)", val: stats.futureDueProfits, color: "bg-orange-500", icon: Clock }
  ];

  const chartData = [
    { name: 'تداول', val: stats.tradeProfits },
    { name: 'عقود', val: stats.investProfits },
    { name: 'مكافآت', val: stats.totalRewards },
    { name: 'نشطة', val: stats.futureDueProfits },
  ];

  const totalDistributed = stats.tradeProfits + stats.investProfits + stats.totalRewards;

  return (
    <Card className="border-none shadow-sm rounded-[56px] bg-white overflow-hidden">
      <CardHeader className="p-10 border-b border-gray-50 flex flex-row items-center justify-between text-right" dir="rtl">
        <div className="space-y-1">
           <CardTitle className="text-xl font-black text-[#002d4d] flex items-center gap-3 justify-end">
              تحليل توزيع الأرباح (Yield Spectrum)
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner"><Activity size={20} /></div>
           </CardTitle>
           <p className="text-[10px] font-bold text-gray-400">تفصيل الأرباح المصروفة والمستحقة حسب مصدرها التشغيلي.</p>
        </div>
        <Badge className="bg-blue-50 text-blue-600 font-black text-[9px] px-4 py-1.5 rounded-full border-none">SYSTEM LIABILITIES</Badge>
      </CardHeader>
      <CardContent className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-8 text-right" dir="rtl">
              <div className="space-y-6">
                 {yieldItems.map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center px-2">
                         <div className="flex items-center gap-3">
                            <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shadow-sm", item.color.replace('bg-', 'bg-opacity-10 bg-'))}>
                               <item.icon size={14} className={item.color.replace('bg-', 'text-')} />
                            </div>
                            <span className="text-[11px] font-black text-[#002d4d]">{item.label}</span>
                         </div>
                         <span className="text-sm font-black text-[#002d4d] tabular-nums">${item.val.toLocaleString()}</span>
                      </div>
                      <Progress value={(item.val / (totalDistributed + stats.futureDueProfits || 1)) * 100} className={cn("h-1.5 bg-gray-50", "[&>div]:"+item.color)} />
                   </div>
                 ))}
              </div>

              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner flex flex-col items-center text-center gap-4">
                 <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600"><PieChartIcon size={28} /></div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Yield Distributed</p>
                    <h4 className="text-3xl font-black text-[#002d4d] tabular-nums tracking-tighter">${totalDistributed.toLocaleString()}</h4>
                 </div>
              </div>
           </div>

           <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontFamily: 'Tajawal', fontWeight: 900 }}
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    />
                    <Bar dataKey="val" radius={[12, 12, 12, 12]} barSize={40}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f9a885', '#f59e0b'][index]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
