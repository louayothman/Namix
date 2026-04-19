
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { History, Clock, Users, Mail, Bell, Globe, Activity, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";

/**
 * @fileOverview سجل التدقيق التاريخي v1.0
 * مكون مستقل لعرض أرشيف حملات البث الإدارية.
 */

interface BroadcastHistoryLedgerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BroadcastHistoryLedger({ open, onOpenChange }: BroadcastHistoryLedgerProps) {
  const db = useFirestore();
  const logsQuery = useMemoFirebase(() => query(collection(db, "broadcast_logs"), orderBy("createdAt", "desc"), limit(20)), [db]);
  const { data: logs, isLoading } = useCollection(logsQuery);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[48px] border-none shadow-2xl p-0 max-w-[600px] w-[95vw] overflow-hidden font-body text-right outline-none bg-white flex flex-col max-h-[85vh]" dir="rtl">
        <div className="bg-[#002d4d] p-8 text-white relative shrink-0">
           <div className="absolute top-0 right-0 p-6 opacity-[0.05] -rotate-12 pointer-events-none"><History size={160} /></div>
           <div className="flex items-center gap-5 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                 <History className="h-7 w-7 text-[#f9a885]" />
              </div>
              <div className="space-y-0.5">
                 <DialogTitle className="text-xl font-black">سجل حملات البث</DialogTitle>
                 <p className="text-[9px] font-black text-blue-200/40 uppercase tracking-[0.3em]">Institutional Broadcast Archive</p>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 scrollbar-none">
           {isLoading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin h-8 w-8 text-[#002d4d]" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Archives...</p>
             </div>
           ) : logs && logs.length > 0 ? (
             logs.map((log) => (
               <div key={log.id} className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-4 transition-all hover:shadow-md group">
                  <div className="flex items-start justify-between">
                     <div className="space-y-1">
                        <h4 className="font-black text-sm text-[#002d4d]">{log.title}</h4>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
                              <Clock className="h-3 w-3" />
                              {log.createdAt && format(new Date(log.createdAt), "dd MMM, HH:mm", { locale: ar })}
                           </div>
                           <Badge variant="outline" className={cn(
                             "text-[7px] font-black border-none px-2 py-0.5 rounded-md shadow-inner",
                             log.channel === 'both' ? "bg-purple-50 text-purple-600" :
                             log.channel === 'email' ? "bg-orange-50 text-orange-600" :
                             "bg-blue-50 text-blue-600"
                           )}>
                             {log.channel?.toUpperCase()} CHANNEL
                           </Badge>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-xl">
                        <Users className="h-3 w-3 text-gray-300" />
                        <span className="text-[11px] font-black text-[#002d4d] tabular-nums">{log.recipientCount}</span>
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 leading-relaxed line-clamp-2 pr-1">{log.message}</p>
               </div>
             ))
           ) : (
             <div className="py-32 text-center opacity-20 flex flex-col items-center gap-4">
                <Activity size={48} />
                <p className="text-xs font-black uppercase tracking-widest">لا يوجد سجلات في الأرشيف</p>
             </div>
           )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3 opacity-20 shrink-0">
           <Globe size={12} />
           <p className="text-[8px] font-black uppercase tracking-widest text-[#002d4d]">Namix Audit System v1.0</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
