
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { History, Clock, Send, Zap, TrendingUp, TrendingDown, Activity, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview سجل تاريخ البث لـ تلغرام v1.0
 */

export function SignalHistory() {
  const db = useFirestore();
  const logsQuery = useMemoFirebase(() => query(collection(db, "telegram_broadcast_logs"), orderBy("createdAt", "desc"), limit(50)), [db]);
  const { data: logs, isLoading } = useCollection(logsQuery);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right" dir="rtl">
       <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white">
          <CardContent className="p-0">
             <Table>
               <TableHeader>
                 <TableRow className="bg-gray-50/50 border-none">
                   <TableHead className="pr-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">الأصل المالي</TableHead>
                   <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">التوصية</TableHead>
                   <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">درجة الثقة</TableHead>
                   <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">البوتات المستلمة</TableHead>
                   <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">التوقيت</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {isLoading ? (
                   <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-200" /></TableCell></TableRow>
                 ) : logs && logs.length > 0 ? (
                   logs.map(log => (
                     <TableRow key={log.id} className="hover:bg-gray-50/30 border-gray-50 group">
                        <TableCell className="pr-10 py-5">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                                 <Activity size={18} />
                              </div>
                              <span className="font-black text-sm text-[#002d4d]">{log.symbolCode}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge className={cn(
                             "font-black text-[9px] border-none px-4 py-1.5 rounded-full shadow-inner",
                             log.decision === 'BUY' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                           )}>
                              {log.decision === 'BUY' ? 'LONG / شراء' : 'SHORT / بيع'}
                           </Badge>
                        </TableCell>
                        <TableCell><span className="font-black text-sm text-blue-600 tabular-nums">%{log.confidence}</span></TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <Send size={12} className="text-gray-300" />
                              <span className="text-[11px] font-black text-[#002d4d]">{log.botCount} Bots</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col text-right">
                              <span className="text-[10px] font-black text-gray-400 flex items-center gap-2">
                                 <Clock size={12} /> {log.createdAt && format(new Date(log.createdAt), "dd MMM, HH:mm", { locale: ar })}
                              </span>
                           </div>
                        </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow><TableCell colSpan={5} className="text-center py-32 opacity-20 flex flex-col items-center gap-4"><History size={64}/><p className="text-xs font-black uppercase">لا توجد سجلات بث</p></TableCell></TableRow>
                 )}
               </TableBody>
             </Table>
          </CardContent>
       </Card>
    </div>
  );
}
