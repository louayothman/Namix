
"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  setDoc,
  getDocs,
  limit
} from "firebase/firestore";
import { Headset, Send, Loader2, Sparkles, UserCircle, CheckCheck, Clock, UserCheck, ShieldAlert } from "lucide-react";
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
  
  // State for session/guest identification
  const [user, setUser] = useState<any>(null);
  const [guestData, setGuestData] = useState({ name: "", phone: "" });
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      setUser(JSON.parse(session));
      setIsGuestMode(false);
      setIsIdentified(true);
    } else {
      setIsGuestMode(true);
      setIsIdentified(false);
    }
  }, [open]);

  useEffect(() => {
    if (!isIdentified || !open) return;

    const findTicket = async () => {
      setLoading(true);
      const targetUserId = user?.id || `guest_${Date.now()}`;
      
      const q = query(
        collection(db, "support_tickets"), 
        where("userId", "==", targetUserId),
        orderBy("updatedAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        setTicketId(snap.docs[0].id);
      } else {
        const newTicketRef = doc(collection(db, "support_tickets"));
        const name = user?.displayName || guestData.name || "زائر";
        const phone = user?.phoneNumber || guestData.phone || "N/A";
        
        await setDoc(newTicketRef, {
          userId: targetUserId,
          userName: name,
          userPhone: phone,
          status: "open",
          isGuest: isGuestMode,
          lastMessage: "بدأ المحادثة",
          lastSender: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setTicketId(newTicketRef.id);
      }
    };

    findTicket();
  }, [user, db, open, isIdentified, guestData, isGuestMode]);

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

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestData.name.trim() && guestData.phone.trim()) {
      setIsIdentified(true);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !ticketId || sending) return;

    setSending(true);
    const msgText = inputText;
    setInputText("");

    try {
      await addDoc(collection(db, "support_tickets", ticketId, "messages"), {
        text: msgText,
        senderId: user?.id || "guest",
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
            {isGuestMode ? "يرجى التعريف عن نفسك لبدء جلسة دعم آمنة." : "نحن هنا لمساعدتك في أي استفسار حول منصة ناميكس."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-none bg-gray-50/30 relative">
          {!isIdentified && isGuestMode ? (
            <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <div className="text-center space-y-2">
                  <div className="h-20 w-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                     <UserCheck className="h-10 w-10 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-black text-[#002d4d]">مرحباً بك في ناميكس</h4>
                  <p className="text-[11px] font-bold text-gray-400 leading-relaxed px-4">أدخل بياناتك الأساسية لنتمكن من توثيق محادثتك في صندوق الوارد الإداري.</p>
               </div>
               
               <form onSubmit={handleIdentify} className="w-full space-y-4">
                  <div className="space-y-1.5">
                     <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">الاسم الكامل</Label>
                     <Input 
                       placeholder="أدخل اسمك الكريم..." 
                       value={guestData.name} 
                       onChange={e => setGuestData({...guestData, name: e.target.value})}
                       className="h-12 rounded-2xl bg-white border-none font-black text-xs shadow-sm px-6 text-right"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">رقم الهاتف</Label>
                     <Input 
                       placeholder="مثال: 00966..." 
                       value={guestData.phone} 
                       onChange={e => setGuestData({...guestData, phone: e.target.value})}
                       className="h-12 rounded-2xl bg-white border-none font-black text-xs shadow-sm px-6 text-left"
                       dir="ltr"
                     />
                  </div>
                  <Button type="submit" disabled={!guestData.name || !guestData.phone} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95 transition-all">
                     تفعيل جلسة الدعم
                  </Button>
               </form>
               <div className="flex items-center gap-2 opacity-20">
                  <ShieldAlert size={10} />
                  <p className="text-[7px] font-black uppercase tracking-widest">End-to-End Encryption Enabled</p>
               </div>
            </div>
          ) : loading ? (
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
            <>
              {messages.map((msg, i) => {
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
              })}
              <div ref={scrollRef} />
            </>
          )}
        </div>

        <div className={cn("p-8 bg-white border-t border-gray-50 shrink-0", !isIdentified && "pointer-events-none opacity-20")}>
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
