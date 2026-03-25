
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc 
} from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

// Modular Components
import { SupportHeader } from "@/components/admin/support/SupportHeader";
import { TicketInventory } from "@/components/admin/support/TicketInventory";
import { ChatTerminal } from "@/components/admin/support/ChatTerminal";
import { CredentialResetDialog } from "@/components/admin/users/CredentialResetDialog";

type FilterStatus = 'active' | 'closed' | 'all';

export default function AdminSupportPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active');
  
  // User Reset Intelligence States
  const [resetUser, setResetUser] = useState<any>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [processingReset, setProcessingReset] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();

  const ticketsQuery = useMemoFirebase(() => query(collection(db, "support_tickets"), orderBy("updatedAt", "desc")), [db]);
  const { data: allTickets, isLoading: loadingTickets } = useCollection(ticketsQuery);

  useEffect(() => {
    if (!selectedTicketId) return;

    const q = query(
      collection(db, "support_tickets", selectedTicketId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [selectedTicketId, db]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedTicketId || sending) return;

    setSending(true);
    const msgText = inputText;
    setInputText("");

    try {
      await addDoc(collection(db, "support_tickets", selectedTicketId, "messages"), {
        text: msgText,
        senderId: "admin",
        senderRole: "admin",
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, "support_tickets", selectedTicketId), {
        lastMessage: msgText,
        lastSender: "admin",
        updatedAt: new Date().toISOString(),
        status: "pending"
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      await updateDoc(doc(db, "support_tickets", id), { 
        status: "closed", 
        updatedAt: new Date().toISOString() 
      });
      toast({ title: "تم إغلاق التذكرة", description: "تم نقل المحادثة إلى سجل الأرشيف بنجاح." });
      setSelectedTicketId(null);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في الإغلاق" });
    }
  };

  const handleOpenReset = async (userId: string) => {
    try {
      const snap = await onSnapshot(doc(db, "users", userId), (docSnap) => {
        if (docSnap.exists()) {
          setResetUser({ id: docSnap.id, ...docSnap.data() });
          setIsResetOpen(true);
        }
      });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل استرجاع بيانات المستثمر" });
    }
  };

  const handleResetCredential = async (type: 'password' | 'pin', newValue: string) => {
    if (!resetUser || processingReset) return;
    setProcessingReset(true);
    try {
      const updateData: any = { updatedAt: new Date().toISOString() };
      if (type === 'password') updateData.password = newValue;
      else updateData.securityPin = newValue;

      await updateDoc(doc(db, "users", resetUser.id), updateData);
      toast({ 
        title: "اكتمل بروتوكول الأمان", 
        description: `تم تحديث ${type === 'password' ? 'كلمة المرور' : 'رمز PIN'} بنجاح.` 
      });
      setIsResetOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "فشل التحديث الأمني" });
    } finally {
      setProcessingReset(false);
    }
  };

  const filteredTickets = useMemo(() => {
    if (!allTickets) return [];
    return allTickets.filter(t => {
      const matchesSearch = t.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.userPhone?.includes(searchQuery);
      
      if (filterStatus === 'active') return matchesSearch && t.status !== 'closed';
      if (filterStatus === 'closed') return matchesSearch && t.status === 'closed';
      return matchesSearch;
    });
  }, [allTickets, searchQuery, filterStatus]);

  const selectedTicket = allTickets?.find(t => t.id === selectedTicketId);

  return (
    <Shell isAdmin>
      <div className="max-w-[1800px] mx-auto space-y-6 px-6 pt-6 pb-6 flex flex-col h-[calc(100vh-120px)] font-body">
        
        <SupportHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
          
          <TicketInventory 
            tickets={filteredTickets}
            isLoading={loadingTickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
          />

          <ChatTerminal 
            selectedTicketId={selectedTicketId}
            selectedTicket={selectedTicket}
            messages={messages}
            inputText={inputText}
            onInputChange={setInputText}
            onSend={handleSendReply}
            onCloseTicket={handleCloseTicket}
            onDeselect={() => setSelectedTicketId(null)}
            onOpenReset={handleOpenReset}
            sending={sending}
            scrollRef={scrollRef}
          />

        </div>
      </div>

      <CredentialResetDialog 
        open={isResetOpen}
        onOpenChange={setIsResetOpen}
        user={resetUser}
        onConfirm={handleResetCredential}
        processing={processingReset}
      />
    </Shell>
  );
}
