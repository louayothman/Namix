
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
  ChevronRight, 
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
 * @fileOverview صفحة مركز التنبيهات v2.0 - Elegant Responsive Edition
 * تم إعادة هندسة الواجهة لتكون أكثر فخامة وانسيابية على كافة الأجهزة.
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
      case 'success': return { icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-500" };
      case 'warning': return { icon: AlertCircle, bg: "bg-orange-50", text: "text-orange-500" };
      case 'error': return { icon: AlertCircle, bg: "bg-red-50", text: "text-red-500" };
      default: return { icon: Info, bg: "bg-blue-50", text: "text-blue-500" };
    }
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <Shell>
      <div className="max-w-3xl mx-auto space-y-8 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Modern Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.3em] justify-start">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
               Communication Ledger Node
            </div>
            <h1 className="text-3xl font-black text-[#002d4d] tracking-tight">مركز التنبيهات</h1>
            <p className="text-muted-foreground font-bold text-[10px]">مراجعة كافة الرسائل الإدارية وتحديثات الحساب المعتمدة.</p>
          </div>
          
          <div className="flex items-center gap-3">
             {notifications && notifications.some(n => !n.isRead) && (
               <Button 
                 onClick={markAllAsRead}
                 variant="ghost" 
                 className="h-11 rounded-full bg-white border border-gray-100 px-6 font-black text-[10px] text-[#002d4d] hover:bg-gray-50 transition-all shadow-sm group"
               >
                 <MailOpen className="ml-2 h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                 قراءة الكل
               </Button>
             )}
             <Button 
               onClick={() => router.back()} 
               variant="ghost" 
               size="icon" 
               className="rounded-2xl bg-white shadow-sm h-11 w-11 border border-gray-50 active:scale-95 transition-all"
             >
               <ChevronRight className="h-5 w-5 text-[#002d4d]" />
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
                    يرجى إنشاء الفهرس المطلوب في Firebase Console لضمان جلب التنبيهات بشكل صحيح.
                  </AlertDescription>
                  <div className="pt-4">
                    {error.message.includes("https://") && (
                      <a 
                        href={"https://" + error.message.split("https://")[1].split(" ")[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#002d4d] text-[#f9a885] px-6 py-3 rounded-full font-black text-[9px] shadow-lg"
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

        <div className="space-y-4">
          {isLoading && visibleCount === 10 ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">جاري جرد الرسائل...</p>
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
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className={cn(
                        "border-none shadow-sm rounded-[40px] overflow-hidden transition-all duration-500 group relative",
                        !n.isRead ? "bg-white ring-2 ring-blue-50/50" : "bg-white/40 opacity-70 saturate-[0.8]"
                      )}>
                        {/* Status Glow for unread */}
                        {!n.isRead && (
                          <div className="absolute top-0 right-0 h-full w-1.5 bg-blue-500" />
                        )}
                        
                        <CardContent className="p-6 md:p-8 flex items-start gap-6">
                          <div className={cn(
                            "h-14 w-14 rounded-[22px] flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110 duration-500",
                            config.bg
                          )}>
                            <config.icon className={cn("h-6 w-6", config.text)} />
                          </div>
                          
                          <div className="flex-1 min-w-0 pt-1 space-y-2">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className="font-black text-[#002d4d] text-base md:text-lg leading-tight group-hover:text-blue-600 transition-colors truncate">{n.title}</h3>
                                <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest shrink-0 bg-gray-50 px-2.5 py-1 rounded-lg">
                                   <Clock className="h-3 w-3" />
                                   {n.createdAt && formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ar })}
                                </div>
                             </div>
                             <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed font-bold max-w-2xl">
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
                    className="h-14 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-2xl active:scale-95 transition-all group"
                  >
                    {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : (
                      <>
                        عرض رسائل سابقة
                        <ChevronDown className="mr-2 h-4 w-4 group-hover:translate-y-1 transition-transform text-[#f9a885]" />
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
                <p className="text-xl font-black text-[#002d4d] uppercase tracking-widest">No New Alerts</p>
                <p className="text-sm font-bold text-gray-400">صندوق الوارد الخاص بك فارغ حالياً.</p>
              </div>
              <Button onClick={() => router.push('/home')} variant="ghost" className="text-blue-500 font-black text-[10px] uppercase tracking-widest">العودة للرئيسية</Button>
            </div>
          )}
        </div>

        {/* Brand Footer */}
        <div className="flex flex-col items-center gap-4 pt-20 opacity-20 select-none">
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
