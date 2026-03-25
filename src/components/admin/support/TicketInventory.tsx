
"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Clock, Loader2, Inbox, Archive, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";

interface TicketInventoryProps {
  tickets: any[];
  isLoading: boolean;
  selectedTicketId: string | null;
  onSelectTicket: (id: string) => void;
}

export function TicketInventory({ 
  tickets, 
  isLoading, 
  selectedTicketId, 
  onSelectTicket 
}: TicketInventoryProps) {
  return (
    <Card className="lg:col-span-3 border-none shadow-sm rounded-[48px] bg-white overflow-hidden flex flex-col group transition-all hover:shadow-xl">
      <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100 flex flex-row items-center justify-between text-right" dir="rtl">
        <CardTitle className="text-sm font-black text-[#002d4d] flex items-center gap-2">
          <span>صندوق الوارد</span>
          <Badge className="bg-[#002d4d] text-white font-black text-[9px] px-2.5 rounded-lg border-none shadow-sm">
            {tickets?.length || 0}
          </Badge>
        </CardTitle>
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-gray-400">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none bg-gray-50/20">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Syncing Inbox...</p>
          </div>
        ) : tickets?.length > 0 ? (
          tickets.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => onSelectTicket(ticket.id)}
              className={cn(
                "w-full p-5 rounded-[32px] text-right transition-all flex flex-col gap-3 relative group/item active:scale-[0.98]",
                selectedTicketId === ticket.id 
                  ? "bg-[#002d4d] text-white shadow-2xl scale-[1.02] z-10" 
                  : "bg-white hover:bg-gray-50 border border-gray-100/50 shadow-sm",
                ticket.status === 'closed' && "opacity-60 saturate-0"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-11 w-11 rounded-[18px] flex items-center justify-center shadow-inner transition-all",
                    selectedTicketId === ticket.id ? "bg-white/10" : "bg-blue-50"
                  )}>
                    <User className={cn("h-5 w-5", selectedTicketId === ticket.id ? "text-[#f9a885]" : "text-blue-500")} />
                  </div>
                  <div className="text-right">
                    <p className={cn("font-black text-xs", selectedTicketId === ticket.id ? "text-white" : "text-[#002d4d]")}>{ticket.userName}</p>
                    <p className={cn("text-[8px] font-bold opacity-60", selectedTicketId === ticket.id ? "text-white" : "text-gray-400")}>{ticket.userPhone}</p>
                  </div>
                </div>
                {ticket.status === 'open' && (
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                )}
                {ticket.status === 'closed' && (
                  <Archive className="h-3 w-3 text-gray-300" />
                )}
              </div>
              
              <div className="pr-1">
                <p className={cn(
                  "text-[10px] font-bold truncate leading-relaxed",
                  selectedTicketId === ticket.id ? "text-white/70" : "text-gray-500"
                )}>
                  {ticket.lastMessage}
                </p>
              </div>

              <div className={cn(
                "flex items-center gap-1.5 text-[7px] font-black uppercase tracking-widest mt-1 justify-end",
                selectedTicketId === ticket.id ? "text-white/30" : "text-gray-300"
              )}>
                <Clock className="h-2.5 w-2.5" />
                {ticket.updatedAt && formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true, locale: ar })}
                <div className="h-1 w-1 rounded-full bg-current opacity-20 mx-1" />
                <span className={cn(
                  "px-1.5 py-0.5 rounded-md",
                  selectedTicketId === ticket.id ? "bg-white/10" : "bg-gray-100"
                )}>
                  {ticket.status === 'open' ? 'جديد' : ticket.status === 'pending' ? 'انتظار' : 'مغلق'}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-4 opacity-20">
             <Inbox className="h-12 w-12 text-[#002d4d]" />
             <p className="text-[10px] font-black uppercase tracking-widest">لا توجد تذاكر في هذا النطاق</p>
          </div>
        )}
      </div>
    </Card>
  );
}
