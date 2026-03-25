
"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  setDoc,
  getDocs,
  limit
} from "firebase/firestore";
import { Headset, Send, Loader2, Sparkles, UserCircle, CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";

interface SupportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportSheet({ open, onOpenChange }: SupportSheetProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setUser(JSON.parse(session));
  }, []);

  useEffect(() => {
    if (!user?.id || !open) return;

    const findTicket = async () => {
      const q = query(
        collection(db, "support_tickets"), 
        where("userId", "==", user.id),
        orderBy("updatedAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        setTicketId(snap.docs[0].id);
      } else {
        const newTicketRef = doc(collection(db, "support_tickets"));
        await setDoc(newTicketRef, {
          userId: user.id || "",
          userName: user.displayName || "مستثمر",
          userPhone: user.phoneNumber || "N/A",
          status: "open",
          lastMessage: "بدأ المحادثة",
          lastSender: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setTicketId(newTicketRef.id);
      }
    };

    findTicket();
  }, [user, db, open]);

  useEffect(() => {
    if (!ticketId) return;

    const q = query(
      collection(db, "support_tickets", ticketId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [ticketId, db]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !ticketId || sending) return;

    setSending(true);
    const msgText = inputText;
    setInputText("");

    try {
      await addDoc(collection(db, "support_tickets", ticketId, "messages"), {
        text: msgText,
        senderId: user.id,
        senderRole: "user",
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, "support_tickets", ticketId), {
        lastMessage: msgText,
        lastSender: "user",
        updatedAt: new Date().toISOString(),
        status: "open"
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[48px] px-0 py-10 border-none bg-white shadow-2xl flex flex-col overflow-hidden">
        <SheetHeader className="px-8 text-right shrink-0">
          <div className="flex items-center gap-3 mb-1">
             <div className="h-12 w-12 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner relative group">
                <Headset className="h-6 w-6 relative z-10 transition-transform group-hover:rotate-12" />
             </div>
             <div className="space-y-0">
               <SheetTitle className="text-2xl font-black text-[#002d4d]">الدعم الفني المباشر</SheetTitle>
               <div className="flex items-center gap-2 text-[#f9a885] font-black text-[8px] uppercase tracking-[0.2em]">
                  <Sparkles className="h-2.5 w-2.5" />
                  Real-time Support Protocol
               </div>
             </div>
          </div>
          <SheetDescription className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.1em] pr-4">
            نحن هنا لمساعدتك في أي استفسار حول منصة ناميكس.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-none bg-gray-50/30">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#002d4d]" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">تأمين الاتصال...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
               <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <Headset className="h-10 w-10 text-gray-400" />
               </div>
               <p className="text-xs font-bold text-gray-400">ابدأ المحادثة الآن، فريقنا متاح للرد عليك.</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderRole === "user";
              return (
                <div key={msg.id} className={cn("flex flex-col", isMe ? "items-start" : "items-end")}>
                  <div className={cn(
                    "max-w-[85%] p-5 rounded-[28px] text-[13px] font-bold shadow-sm relative break-all",
                    isMe 
                      ? "bg-white text-[#002d4d] rounded-tr-lg border border-gray-100" 
                      : "bg-[#002d4d] text-white rounded-tl-lg"
                  )}>
                    {msg.text}
                    <div className={cn(
                      "flex items-center gap-1.5 mt-2 text-[8px] font-black uppercase tracking-tighter",
                      isMe ? "text-gray-300" : "text-white/40"
                    )}>
                      {msg.createdAt && formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ar })}
                      {!isMe && <CheckCheck className="h-2.5 w-2.5" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-8 bg-white border-t border-gray-50 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <Input 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="h-14 rounded-full bg-gray-50 border-none font-bold text-sm shadow-inner px-8 pr-14 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim() || sending}
              size="icon" 
              className="absolute left-2 h-10 w-10 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white shadow-lg active:scale-90 transition-all"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rotate-180" />}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
