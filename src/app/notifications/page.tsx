
"use client";

import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy, doc, writeBatch } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { Bell, Clock, Info, AlertCircle, CheckCircle2, Loader2, Check, ExternalLink, ChevronRight, Sparkles, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<any>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
  }, []);

  const notificationsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "notifications"),
      where("userId", "==", localUser.id),
      orderBy("createdAt", "desc")
    );
  }, [db, localUser?.id]);

  const { data: notifications, isLoading, error } = useCollection(notificationsQuery);

  const markAllAsRead = async () => {
    if (!notifications || !localUser?.id) return;
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach(n => batch.update(doc(db, "notifications", n.id), { isRead: true }));
    await batch.commit();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
      case 'warning': return <AlertCircle className="h-6 w-6 text-orange-500" />;
      case 'error': return <AlertCircle className="h-6 w-6 text-red-500" />;
      default: return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-24 font-body">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-[0.3em]"><Sparkles className="h-3 w-3" />Communication Hub Protocol</div>
            <h1 className="text-3xl font-black text-[#002d4d]">مركز التنبيهات</h1>
            <p className="text-muted-foreground font-bold text-[10px]">تابع آخر التحديثات والرسائل الإدارية على حسابك.</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-14 w-14 border border-gray-50 transition-all hover:shadow-md">
            <ChevronRight className="h-6 w-6 text-[#002d4d]" />
          </Button>
        </div>

        <div className="flex justify-between items-center px-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inbox Inventory</p>
          {notifications && notifications.some(n => !n.isRead) && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-10 rounded-full text-[10px] font-black text-[#002d4d] bg-white border border-gray-100 px-6">
              <Check className="ml-2 h-4 w-4" /> قراءة الكل
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-[40px] border-none bg-red-50 text-red-900 p-8 shadow-sm">
            <AlertCircle className="h-6 w-6" />
            <AlertTitle className="font-black text-sm">خطأ في جلب البيانات</AlertTitle>
            <AlertDescription className="text-[10px] font-bold mt-2 leading-relaxed">
              {error.message.includes("https://") && (
                <a href={"https://" + error.message.split("https://")[1].split(" ")[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2">
                  <ExternalLink className="h-3 w-3" /> اضغط هنا لإنشاء الفهرس المطلوب
                </a>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري مسح صندوق الوارد...</p>
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <Card key={n.id} className={cn("border-none shadow-sm rounded-[40px] overflow-hidden transition-all group hover:shadow-md", !n.isRead ? "bg-white ring-2 ring-blue-50" : "bg-white/60 opacity-80")}>
                <CardContent className="p-8 flex items-start gap-6">
                  <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-inner", !n.isRead ? "bg-blue-50" : "bg-gray-100")}>{getIcon(n.type)}</div>
                  <div className="flex-1 space-y-2 pt-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-black text-[#002d4d] text-base leading-tight break-all">{n.title}</h3>
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest shrink-0">
                        <Clock className="h-3 w-3" />
                        {n.createdAt && formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ar })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-loose font-bold pr-1 break-all whitespace-pre-wrap">{n.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !error && (
            <div className="text-center py-40 bg-white/40 rounded-[56px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-8">
              <MessageSquare className="h-12 w-12 text-gray-200" />
              <p className="text-[10px] text-gray-200 font-bold">لا توجد تنبيهات جديدة في الوقت الحالي.</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
