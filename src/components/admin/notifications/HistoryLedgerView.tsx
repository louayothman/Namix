
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { History, Clock, Users, Mail, Bell, Globe, Activity, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function HistoryLedgerView() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const logsQuery = useMemoFirebase(() => query(collection(db, "broadcast_logs"), orderBy("createdAt", "desc"), limit(50)), [db]);
  const { data: logs, isLoading } = useCollection(logsQuery);

  const filtered = logs?.filter(l => l.title?.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right font-body" dir="rtl">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
         <div className="relative w-full max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input 
              placeholder="ابحث في سجل العناوين..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-12 rounded-full bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs" 
            />
         </div>
         <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[10px] px-6 py-2 rounded-full shadow-inner tracking-widest uppercase">
            {filtered.length} RECORDS FOUND
         </Badge>
      </div>

      <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-none hover:bg-gray-50/50">
                <TableHead className="pr-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">عنوان الحملة</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">القناة</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">المستلمين</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">توقيت البث</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-32"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-200" /></TableCell></TableRow>
              ) : filtered.length > 0 ? (
                filtered.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50/30 transition-all border-gray-50 group">
                    <TableCell className="pr-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#002d4d] shadow-inner group-hover:bg-white transition-all">
                             <Activity size={18} />
                          </div>
                          <div className="text-right">
                             <p className="font-black text-sm text-[#002d4d]">{log.title}</p>
                             <p className="text-[9px] font-bold text-gray-400 truncate max-w-[200px]">{log.message}</p>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className={cn(
                         "text-[8px] font-black border-none px-3 py-1 rounded-md shadow-inner",
                         log.channel === 'both' ? "bg-purple-50 text-purple-600" :
                         log.channel === 'email' ? "bg-orange-50 text-orange-600" :
                         "bg-blue-50 text-blue-600"
                       )}>
                         {log.channel === 'both' ? 'GLOBAL' : log.channel?.toUpperCase()} CHANNEL
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <Users size={12} className="text-gray-300" />
                          <span className="text-sm font-black text-[#002d4d] tabular-nums">{log.recipientCount}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col text-right">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400">
                             <Clock size={12} />
                             {log.createdAt && format(new Date(log.createdAt), "dd MMM yyyy", { locale: ar })}
                          </div>
                          <span className="text-[8px] font-bold text-gray-300 mr-4.5">{log.createdAt && format(new Date(log.createdAt), "HH:mm", { locale: ar })}</span>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-48 opacity-20 flex flex-col items-center gap-4">
                     <History size={48} className="mx-auto" />
                     <p className="text-xs font-black uppercase tracking-widest">لا توجد سجلات تاريخية</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
