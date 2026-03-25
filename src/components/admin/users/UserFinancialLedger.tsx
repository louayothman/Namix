
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, Briefcase, Clock, Hash, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";

interface UserFinancialLedgerProps {
  type: 'deposit' | 'withdraw' | 'investment';
  data: any[];
}

export function UserFinancialLedger({ type, data }: UserFinancialLedgerProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-32 bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
         <Clock className="h-10 w-10 text-gray-200" />
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No transaction records found in this node</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
            <TableHead className="pr-10 py-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">البيان</TableHead>
            <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">القيمة المالية</TableHead>
            <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">المرجع الرقمي</TableHead>
            <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">التوقيت الزمني</TableHead>
            <TableHead className="text-center text-[9px] font-black uppercase text-gray-400 tracking-widest">حالة العملية</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/30 transition-all border-gray-50 group/row">
              <TableCell className="pr-10 py-5">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-[16px] flex items-center justify-center shadow-inner",
                    type === 'deposit' ? "bg-emerald-50 text-emerald-600" :
                    type === 'withdraw' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600"
                  )}>
                    {type === 'deposit' ? <ArrowUpCircle size={18} /> : 
                     type === 'withdraw' ? <ArrowDownCircle size={18} className="rotate-180" /> : <Briefcase size={18} />}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-black text-xs text-[#002d4d] block">
                      {type === 'deposit' ? item.methodName :
                       type === 'withdraw' ? item.methodName : item.planTitle}
                    </span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">NODE TRANS: {item.id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={cn(
                  "font-black text-sm tabular-nums",
                  type === 'deposit' ? "text-emerald-600" :
                  type === 'withdraw' ? "text-red-600" : "text-[#002d4d]"
                )}>
                  {type === 'withdraw' ? '-' : '+'}${item.amount?.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                {item.transactionId ? (
                  <span className="text-[9px] font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-500 border border-gray-200/50 block max-w-[120px] break-all">{item.transactionId}</span>
                ) : (
                  <span className="text-[9px] text-gray-300 italic">No Ref Code</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-right">
                   <span className="text-[10px] text-gray-500 font-bold">{item.createdAt && format(new Date(item.createdAt), "dd MMM yyyy", { locale: ar })}</span>
                   <span className="text-[8px] text-gray-300 font-bold">{item.createdAt && format(new Date(item.createdAt), "HH:mm", { locale: ar })}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Badge className={cn(
                    "font-black text-[8px] border-none px-4 py-1.5 rounded-full shadow-inner tracking-widest",
                    item.status === 'pending' || item.status === 'active' ? "bg-orange-50 text-orange-600" : 
                    item.status === 'approved' || item.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {item.status === 'pending' ? 'قيد التدقيق' : 
                     item.status === 'active' ? 'قيد التشغيل' :
                     item.status === 'approved' ? 'مكتملة' : 
                     item.status === 'completed' ? 'عقد منتهي' : 'مرفوضة'}
                  </Badge>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
