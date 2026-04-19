
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
  ChevronLeft, 
  ChevronDown, 
  MailOpen,
  Mail,
  Inbox,
  ExternalLink
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, doc, writeBatch, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview صفحة الإشعارات المحدثة v4.0 - Minimalist Identity Edition
 * تم دمج أزرار العودة والقراءة في كبسولة واحدة، وتصغير أحجام العناصر للموبايل.
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

  const hasUnread = notifications ? notifications.some(n => !n.isRead) : false;

  const markAllAsRead = async () => {
    if (!notifications || !localUser?.id || !hasUnread) return;
    const unread = notifications.filter(n => !n.isRead);
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
    <Shell hideMobileNav>
      <div className="max-w-[1400px] mx-auto space-y-8 px-5 md:px-10 pt-8 pb-32 font-body text-right" dir="rtl">
        
        {/* Header - Compact Capsule Controls */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="space-y-0.5 text-right">
            <h1 className="text-xl md:text-3xl font-black text-[#002d4d] tracking-tight">التنبيهات</h1>
            <div className="flex items-center gap-1.5 opacity-40">
               <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">Communication Feed</span>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-50/50 p-1 rounded-2xl border border-gray-100 shadow-inner">
             <button 
               onClick={markAllAsRead}
               disabled={!hasUnread}
               className={cn(
                 "h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                 hasUnread ? "text-blue-600 hover:bg-blue-50" : "text-gray-300 cursor-default"
               )}
               title="قراءة الكل"
             >
               {hasUnread ? <Mail size={18} /> : <MailOpen size={18} />}
             </button>
             <div className="h-6 w-px bg-gray-200 mx-1" />
             <button 
               onClick={() => router.back()} 
               className="h-10 w-10 rounded-xl flex items-center justify-center text-[#002d4d] hover:bg-gray-100 active:scale-90 transition-all"
             >
               <ChevronLeft size={20} />
             </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-[32px] border-none bg-red-50 text-red-900 p-6 shadow-sm animate-in zoom-in-95">
            <div className="flex items-start gap-4">
               <AlertCircle size={20} className="text-red-500 shrink-0" />
               <div className="space-y-1">
                  <AlertTitle className="font-black text-sm">مطلوب إنشاء فهرس</AlertTitle>
                  <AlertDescription className="text-[10px] font-bold opacity-80 leading-relaxed">
                    يرجى إنشاء الفهرس المطلوب في قاعدة البيانات لضمان جلب التنبيهات التاريخية.
                  </AlertDescription>
                  {error.message.includes("https://") && (
                    <a 
                      href={"https://" + error.message.split("https://")[1].split(" ")[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase underline mt-2"
                    >
                      <ExternalLink size={12} /> إنشاء الفهرس الآن
                    </a>
                  )}
               </div>
            </div>
          </Alert>
        )}

        <div className="space-y-4">
          {isLoading && visibleCount === 10 ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-100" />
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">تزامن البيانات...</p>
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {notifications.map((n, i) => {
                  const config = getIconConfig(n.type);
                  return (
                    <motion.div 
                      key={n.id} 
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.03 }}
                    >
                      <Card className={cn(
                        "border-none shadow-sm rounded-[32px] md:rounded-[44px] overflow-hidden transition-all duration-500 group relative bg-white",
                        !n.isRead && "border-r-[4px] border-r-blue-500"
                      )}>
                        
                        {/* Huge Background Icon */}
                        <div className={cn(
                          "absolute top-0 right-0 p-6 opacity-[0.02] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-0",
                          config.text
                        )}>
                          <config.icon className="h-32 w-32 md:h-56 md:w-56" />
                        </div>
                        
                        <CardContent className="p-6 md:p-10 relative z-10">
                          <div className="space-y-4">
                             <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                   <h3 className="font-black text-[#002d4d] text-sm md:text-xl tracking-tight transition-colors group-hover:text-blue-600">{n.title}</h3>
                                   <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest">
                                      <Clock size={10} className="text-[#f9a885]" />
                                      {n.createdAt && formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ar })}
                                   </div>
                                </div>
                                {!n.isRead && (
                                  <Badge className="bg-blue-500 text-white border-none font-black text-[7px] px-2.5 py-0.5 rounded-lg shadow-sm animate-pulse shrink-0">جديد</Badge>
                                )}
                             </div>
                             
                             <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed font-bold text-right max-w-5xl">
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
                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={handleShowMore} 
                    disabled={isLoading}
                    variant="ghost"
                    className="h-12 px-10 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-[#002d4d] font-black text-[10px] shadow-sm active:scale-95 transition-all group"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <>
                        عرض المزيد
                        <ChevronDown className="mr-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : !error && (
            <div className="text-center py-48 bg-white/40 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6 opacity-40">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                <Inbox size={32} className="text-gray-200" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black text-[#002d4d] uppercase tracking-widest">لا توجد رسائل</p>
                <p className="text-[10px] font-bold text-gray-400">صندوق الوارد الخاص بك فارغ حالياً.</p>
              </div>
              <Button onClick={() => router.push('/home')} variant="ghost" className="text-blue-500 font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 rounded-full px-8 h-10 transition-all">العودة للرئيسية</Button>
            </div>
          )}
        </div>

        {/* Brand Footer Signature */}
        <div className="flex flex-col items-center gap-3 pt-20 opacity-10 select-none">
           <p className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.6em] text-center">Namix Communication Node</p>
           <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
