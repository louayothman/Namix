
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Archive, 
  ChevronLeft, 
  CheckCheck, 
  Send, 
  Loader2, 
  Sparkles, 
  MessageSquare,
  KeyRound,
  ShieldAlert
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";

interface ChatTerminalProps {
  selectedTicketId: string | null;
  selectedTicket: any;
  messages: any[];
  inputText: string;
  onInputChange: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
  onCloseTicket: (id: string) => void;
  onDeselect: () => void;
  onOpenReset?: (userId: string) => void;
  sending: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function ChatTerminal({
  selectedTicketId,
  selectedTicket,
  messages,
  inputText,
  onInputChange,
  onSend,
  onCloseTicket,
  onDeselect,
  onOpenReset,
  sending,
  scrollRef
}: ChatTerminalProps) {
  if (!selectedTicketId) {
    return (
      <Card className="lg:col-span-9 border-none shadow-sm rounded-[48px] bg-white overflow-hidden flex flex-col relative group transition-all hover:shadow-xl">
        <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-gray-50/30">
          <div className="relative">
            <div className="h-40 w-40 rounded-[56px] bg-white flex items-center justify-center shadow-inner relative z-10">
               <MessageSquare className="h-20 w-20 text-gray-100" />
            </div>
            <div className="absolute -top-4 -right-4 h-16 w-16 bg-blue-50 rounded-full animate-bounce delay-75 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 bg-emerald-50 rounded-full animate-bounce blur-2xl" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-black uppercase tracking-[0.5em] text-[#002d4d] opacity-20">Support Ready Mode</p>
            <p className="text-[10px] font-bold text-gray-300 uppercase">يرجى تحديد تذكرة من القائمة الجانبية لبدء البروتوكول</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-9 border-none shadow-sm rounded-[48px] bg-white overflow-hidden flex flex-col relative group transition-all hover:shadow-xl">
      {/* Active Session Header */}
      <CardHeader className="bg-gray-50/80 p-8 border-b border-gray-100 flex flex-row items-center justify-between shrink-0 backdrop-blur-md text-right" dir="rtl">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-[28px] bg-white flex items-center justify-center shadow-sm border border-white relative group/avatar">
            <User className="h-8 w-8 text-blue-500" />
            {selectedTicket?.status !== 'closed' && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl font-black text-[#002d4d]">{selectedTicket?.userName}</CardTitle>
              <Badge className={cn(
                "font-black text-[9px] rounded-lg border-none px-3 py-1 shadow-sm",
                selectedTicket?.status === 'closed' ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-600"
              )}>
                {selectedTicket?.status === 'closed' ? 'SESSION ARCHIVED' : 'ACTIVE SESSION'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <Phone className="h-3 w-3 text-blue-400" />
                <span dir="ltr">{selectedTicket?.userPhone}</span>
              </div>
              <div className="h-3 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                <Calendar className="h-3 w-3 text-emerald-400" />
                <span>بدأت: {selectedTicket?.createdAt && format(new Date(selectedTicket.createdAt), "dd MMM, HH:mm", { locale: ar })}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {onOpenReset && (
            <Button 
              variant="outline" 
              onClick={() => onOpenReset(selectedTicket.userId)}
              className="h-12 rounded-full text-[10px] font-black text-blue-600 border-blue-100 bg-white hover:bg-blue-50 px-6 shadow-sm active:scale-95 transition-all"
            >
              <KeyRound className="ml-2 h-4 w-4" /> إعادة تعيين الأمان
            </Button>
          )}
          
          <div className="h-8 w-px bg-gray-200 mx-1" />

          {selectedTicket?.status !== 'closed' ? (
            <Button 
              variant="ghost" 
              onClick={() => onCloseTicket(selectedTicketId)}
              className="h-12 rounded-full text-[11px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-6 shadow-sm border border-emerald-100/50 transition-all active:scale-95"
            >
              <CheckCircle2 className="ml-2 h-4 w-4" /> إكمال وإغلاق التذكرة
            </Button>
          ) : (
            <Badge className="h-12 rounded-full bg-gray-100 text-gray-400 border-none font-black px-6 flex items-center gap-2">
              <Archive className="h-4 w-4" /> تذكرة مغلقة
            </Badge>
          )}
          
          <Button variant="ghost" size="icon" onClick={onDeselect} className="rounded-full h-12 w-12 text-gray-300 hover:bg-gray-100 transition-all">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-none bg-gradient-to-b from-gray-50/50 to-white/20">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
             <ShieldAlert className="h-12 w-12 text-[#002d4d]" />
             <p className="text-xs font-black uppercase tracking-widest">بدء تدوين المحادثة...</p>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isMe = msg.senderRole === "admin";
          const showDate = idx === 0 || new Date(msg.createdAt).getTime() - new Date(messages[idx-1].createdAt).getTime() > 1800000;

          return (
            <div key={msg.id} className="space-y-4">
              {showDate && (
                <div className="flex justify-center my-8">
                  <span className="px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[8px] font-black text-gray-300 uppercase tracking-widest shadow-sm">
                    {format(new Date(msg.createdAt), "EEEE, dd MMMM", { locale: ar })}
                  </span>
                </div>
              )}
              <div className={cn("flex flex-col", isMe ? "items-start" : "items-end")}>
                <div className={cn(
                  "max-w-[65%] p-7 rounded-[40px] text-[14px] font-bold shadow-sm relative group/msg transition-all hover:shadow-md text-right break-all",
                  isMe 
                    ? "bg-[#002d4d] text-white rounded-tr-lg shadow-blue-900/10" 
                    : "bg-white text-[#002d4d] rounded-tl-lg border border-gray-100"
                )}>
                  {msg.text}
                  <div className={cn(
                    "flex items-center gap-2 mt-4 text-[9px] font-black uppercase tracking-tighter opacity-40 group-hover/msg:opacity-80 transition-opacity",
                    isMe ? "text-white" : "text-gray-400"
                  )}>
                    {msg.createdAt && format(new Date(msg.createdAt), "HH:mm", { locale: ar })}
                    {isMe && <CheckCheck className="h-3 w-3 text-[#f9a885]" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Response Terminal */}
      <div className={cn(
        "p-10 bg-white border-t border-gray-50 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]",
        selectedTicket?.status === 'closed' && "pointer-events-none opacity-50 grayscale"
      )}>
        <form onSubmit={onSend} className="relative flex items-center gap-4 max-w-[1200px] mx-auto">
          <div className="flex-1 relative">
            <Input 
              value={inputText}
              onChange={e => onInputChange(e.target.value)}
              placeholder={selectedTicket?.status === 'closed' ? "هذه المحادثة مؤرشفة" : "اكتب الرد الإداري المعتمد هنا..."}
              disabled={selectedTicket?.status === 'closed'}
              className="h-20 rounded-[32px] bg-gray-50 border-none font-bold text-base shadow-inner px-10 pr-16 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all text-right"
            />
            <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
          </div>
          <Button 
            type="submit" 
            disabled={!inputText.trim() || sending || selectedTicket?.status === 'closed'}
            className="h-20 px-10 rounded-[32px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl shadow-blue-100 active:scale-95 transition-all group"
          >
            {sending ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <>
                إرسال الرد
                <Send className="mr-3 h-6 w-6 rotate-180 transition-transform group-hover:-translate-x-1" />
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
