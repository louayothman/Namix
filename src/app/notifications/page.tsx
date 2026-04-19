
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Bell, 
  Clock, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Check, 
  ChevronLeft, 
  ChevronDown, 
  MailOpen,
  Inbox,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, doc, writeBatch, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview صفحة الإشعارات المحدثة v3.0 - Elegant Full-Width Edition
 * تم نقل زر العودة لليسار، وتحويل الأيقونات لعناصر خلفية فخمة، وتوسيع البطاقات.
 */

export default function NotificationsPage() {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(10);
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
      orderBy("createdAt", "desc"),
      limit(visibleCount)
    );
  }, [db, localUser?.id, visibleCount]);

  const { data: notifications, isLoading, error } = useCollection(notificationsQuery);

  const markAllAsRead = async () => {
    if (!notifications || !localUser?.id) return;
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach(n => batch.update(doc(db, "notifications", n.id), { isRead: true }));
    await batch.commit();
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'success': return { icon: CheckCircle2, text: "text-emerald-500" };
      case 'warning': return { icon: AlertCircle, text: "text-orange-500" };
      case 'error': return { icon: AlertCircle, text: "text-red-500" };
      default: return { icon: Info, text: "text-blue-500" };
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto space-y-12 px-4 md:px-10 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Header - Back button on the LEFT */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#002d4d] font-black text-[10px] uppercase tracking-widest justify-start">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
               Communication Ledger
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">التنبيهات والرسائل</h1>
          </div>
          
          <div className="flex items-center gap-4">
             {notifications && notifications.some(n => !n.isRead) && (
               <Button 
                 onClick={markAllAsRead}
                 variant="ghost" 
                 className="h-12 rounded-full bg-white border border-gray-100 px-6 font-black text-[10px] text-[#002d4d] hover:bg-gray-50 transition-all shadow-sm hidden md:flex"
               >
                 <MailOpen className="ml-2 h-4 w-4 text-blue-500" />
                 قراءة الكل
               </Button>
             )}
             <Button 
               onClick={() => router.back()} 
               variant="ghost" 
               size="icon" 
               className="rounded-2xl bg-white shadow-sm h-12 w-12 border border-gray-100 active:scale-95 transition-all"
             >
               <ChevronLeft className="h-6 w-6 text-[#002d4d]" />
             </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-[40px] border-none bg-red-50 text-red-900 p-8 shadow-xl animate-in zoom-in-95">
            <div className="flex items-start gap-5">
               <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
               <div className="space-y-2">
                  <AlertTitle className="font-black text-lg">مطلوب إنشاء فهرس للبيانات</AlertTitle>
                  <AlertDescription className="text-[11px] font-bold opacity-80 leading-relaxed">
                    يرجى إنشاء الفهرس المطلوب في قاعدة البيانات لضمان جلب التنبيهات.
                  </AlertDescription>
                  <div className="pt-4">
                    {error.message.includes("https://") && (
                      <a 
                        href={"https://" + error.message.split("https://")[1].split(" ")[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#002d4d] text-white px-6 py-3 rounded-full font-black text-[9px]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        إنشاء الفهرس الآن
                      </a>
                    )}
                  </div>
               </div>
            </div>
          </Alert>
        )}

        <div className="space-y-6">
          {isLoading && visibleCount === 10 ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">تحديث القائمة...</p>
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {notifications.map((n, i) => {
                  const config = getIconConfig(n.type);
                  return (
                    <motion.div 
                      key={n.id} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className={cn(
                        "border-none shadow-sm rounded-[44px] md:rounded-[56px] overflow-hidden transition-all duration-700 group relative bg-white",
                        !n.isRead && "ring-2 ring-blue-50/50"
                      )}>
                        
                        {/* Huge Background Icon */}
                        <div className={cn(
                          "absolute top-0 right-0 p-10 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-0",
                          config.text
                        )}>
                          <config.icon className="h-48 w-48 md:h-64 md:w-64" />
                        </div>

                        {/* Status Line for unread */}
                        {!n.isRead && (
                          <div className="absolute top-0 right-0 h-full w-2 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                        )}
                        
                        <CardContent className="p-8 md:p-14 relative z-10">
                          <div className="space-y-6">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-2">
                                   <h3 className="font-black text-[#002d4d] text-lg md:text-2xl tracking-tight transition-colors group-hover:text-blue-600">{n.title}</h3>
                                   <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                      <Clock className="h-3.5 w-3.5 text-[#f9a885]" />
                                      {n.createdAt && formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ar })}
                                   </div>
                                </div>
                                {!n.isRead && (
                                  <Badge className="bg-blue-500 text-white border-none font-black text-[8px] px-4 py-1.5 rounded-full shadow-lg shadow-blue-900/20 animate-pulse self-start">تنبيه جديد</Badge>
                                )}
                             </div>
                             
                             <p className="text-[13px] md:text-base text-gray-500 leading-[2.2] font-bold text-right max-w-5xl">
                                {n.message}
                             </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {notifications.length >= visibleCount && (
                <div className="flex justify-center pt-10">
                  <Button 
                    onClick={handleShowMore} 
                    disabled={isLoading}
                    className="h-16 px-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-2xl active:scale-95 transition-all group"
                  >
                    {isLoading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : (
                      <>
                        عرض المزيد من الرسائل
                        <ChevronDown className="mr-3 h-5 w-5 group-hover:translate-y-1 transition-transform text-[#f9a885]" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : !error && (
            <div className="text-center py-48 bg-white/40 rounded-[64px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-8 opacity-40">
              <div className="h-24 w-24 bg-gray-50 rounded-[48px] flex items-center justify-center shadow-inner">
                <Inbox className="h-12 w-12 text-gray-200" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-[#002d4d] uppercase tracking-widest">صندوق الوارد فارغ</p>
                <p className="text-sm font-bold text-gray-400">لا توجد رسائل إدارية جديدة في حسابك حالياً.</p>
              </div>
              <Button onClick={() => router.push('/home')} variant="ghost" className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-50 rounded-full px-8 h-12 transition-all">العودة للرئيسية</Button>
            </div>
          )}
        </div>

        {/* Brand Footer Signature */}
        <div className="flex flex-col items-center gap-4 pt-24 opacity-10 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em] text-center">Namix Communication Node</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
