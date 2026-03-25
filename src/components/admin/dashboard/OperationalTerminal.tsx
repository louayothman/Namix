
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, ChevronRight, ArrowRightLeft, ZapOff, ChevronDown } from "lucide-react";
import Link from "next/link";
import { parseISO, differenceInMilliseconds } from "date-fns";

interface OperationalTerminalProps {
  activeInvestments: any[];
  now: Date;
}

export function OperationalTerminal({ activeInvestments, now }: OperationalTerminalProps) {
  const [visibleCount, setVisibleCount] = useState(10);

  const displayedInvestments = activeInvestments?.slice(0, visibleCount) || [];
  const hasMore = activeInvestments?.length > visibleCount;

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-50 p-8 gap-6">
        <div className="space-y-1">
          <CardTitle className="text-lg font-black text-[#002d4d] flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Activity className="h-5 w-5" />
            </div>
            العقود التشغيلية النشطة (Live Engine)
          </CardTitle>
          <CardDescription className="font-bold text-[9px] text-gray-400 uppercase tracking-widest">Real-time Asset Monitoring Terminal</CardDescription>
        </div>
        <div className="flex items-center gap-3">
           <Badge className="bg-[#002d4d] text-white font-black text-[9px] rounded-full px-5 py-1.5 border-none shadow-md">{activeInvestments?.length || 0} عقود نشطة</Badge>
           <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-[9px] font-black text-blue-600 hover:bg-blue-50 rounded-full px-4">إدارة كافة المستثمرين <ChevronRight className="mr-1 h-3 w-3" /></Button>
           </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-none">
              <TableHead className="pr-8 py-6 text-[9px] font-black uppercase text-gray-400 tracking-widest">المستثمر</TableHead>
              <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest">رأس المال</TableHead>
              <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest">خطة التشغيل</TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase text-gray-400 tracking-widest">الربح التراكمي (Live)</TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase text-gray-400 tracking-widest">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedInvestments.map((inv) => {
              const start = parseISO(inv.startTime);
              const end = parseISO(inv.endTime);
              const totalMs = differenceInMilliseconds(end, start);
              const elapsedMs = differenceInMilliseconds(now, start);
              const progress = Math.min(Math.max(elapsedMs / totalMs, 0), 1);
              const liveProfit = progress * (inv.expectedProfit || 0);

              return (
                <TableRow key={inv.id} className="hover:bg-gray-50/30 transition-all border-gray-50 group">
                  <TableCell className="pr-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] font-black text-[#002d4d] shadow-inner group-hover:bg-white transition-all">
                        {inv.userName?.[0] || 'U'}
                      </div>
                      <div className="space-y-0 text-right">
                        <span className="font-black text-xs text-[#002d4d] block">{inv.userName || 'مستثمر'}</span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase">ID: {inv.userId.slice(-6)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-xs text-emerald-600 tabular-nums">${inv.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-2.5 py-0.5 rounded-lg shadow-sm">{inv.planTitle}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                     <span className="font-black text-emerald-500 text-xs tabular-nums">
                       +${liveProfit.toFixed(4)}
                     </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/users/${inv.userId}`}>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-300 hover:text-[#002d4d] hover:bg-gray-100 rounded-lg transition-all">
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {(!activeInvestments || activeInvestments.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <ZapOff className="h-8 w-8 text-[#002d4d]" />
                    <p className="text-[10px] font-black uppercase tracking-widest">لا توجد عمليات نشطة حالياً</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {hasMore && (
          <div className="p-8 border-t border-gray-50 flex justify-center bg-gray-50/20">
             <Button 
               onClick={loadMore} 
               variant="ghost" 
               className="h-12 px-10 rounded-full bg-white border border-gray-100 text-[#002d4d] font-black text-[10px] shadow-sm hover:shadow-md transition-all active:scale-95 group"
             >
                <ChevronDown className="ml-2 h-4 w-4 text-blue-500 transition-transform group-hover:translate-y-0.5" />
                عرض المزيد من العقود الاستثمارية
             </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
