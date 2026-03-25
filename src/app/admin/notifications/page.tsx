
"use client";

import { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { 
  Send, 
  Users, 
  User, 
  Bell, 
  Loader2, 
  Target, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  Info, 
  ShieldCheck, 
  ArrowUpRight,
  UserCheck,
  UserMinus,
  Wallet,
  Activity,
  ChevronLeft,
  CheckCircle2,
  Mail,
  Globe,
  Wand2,
  Lock,
  Gavel,
  History,
  FileText,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";

type TargetType = 'all' | 'new' | 'inactive' | 'active' | 'pending_withdraw' | 'pending_deposit' | 'single';
type BroadcastChannel = 'app' | 'email' | 'both';

const BROADCAST_TEMPLATES = [
  { id: 'terms', label: "تحديث الشروط والأحكام", title: "تحديث هام في ميثاق الاستخدام والشروط", message: "نحيطكم علماً بأنه تم إجراء تحديثات جوهرية على بنود الشروط والأحكام الخاصة بمنصة ناميكس لضمان حماية أكبر لأصولكم. يرجى مراجعة الوثيقة المحدثة في صفحة الميثاق القانوني." },
  { id: 'privacy', label: "تعديل سياسة الخصوصية", title: "تحديث بروتوكول حماية البيانات والخصوصية", message: "التزاماً منا بأعلى معايير الشفافية، قمنا بتعزيز سياسة الخصوصية لناميكس. تم تحسين آليات التشفير وتداول البيانات لضمان خصوصية مطلقة لاستثماراتكم." },
  { id: 'guide', label: "دليل الاستخدام الشامل", title: "دليلك الاستراتيجي للنجاح في منصة ناميكس", message: "أهلاً بك في عالم الاستثمار الذكي. نضع بين يديك دليل الاستخدام المحدث الذي يشرح آليات تفعيل العقود، إدارة المحفظة، وبروتوكولات السحب والإيداع. ابدأ رحلتك الآن بوعي كامل." },
  { id: 'security', label: "بروتوكول الأمان الحيوي", title: "تنبيه أمني: تعزيز حماية حسابك الشخصي", message: "لضمان سيادتك الكاملة على أصولك، ننصح بتفعيل رمز PIN للخزنة وتحديث كلمة المرور بشكل دوري. بروتوكول ناميكس للأمان يعمل على مدار الساعة لحمايتك." },
  { id: 'new_plan', label: "إطلاق عقد استثماري جديد", title: "فرصة استراتيجية: إدراج بروتوكول استثماري بعائد مرتفع", message: "يسرنا إبلاغكم بإطلاق خطة استثمارية جديدة في مختبر الأصول. تتميز هذه الخطة بعائد تنافسي ودورة عمل مرنة. سارع بحجز مكانك في الاكتتاب الجديد." },
  { id: 'bonus', label: "مكافأة شحن حصرية", title: "عرض سيولة: احصل على مكافأة %15 على إيداعك القادم", message: "لفترة محدودة، قمنا بتنشيط بروتوكول حوافز التدفق. احصل على رصيد إضافي فوري عند شحن محفظتك للمساهمة في دعم نمو أصولك العالمية." },
  { id: 'maintenance', label: "صيانة النظام المجدولة", title: "إشعار تقني: صيانة دورية لمحرك العمليات", message: "سنقوم بإجراء صيانة تقنية دورية لتعزيز أداء المنصة يوم غد. قد تواجه بعض التأخيرات البسيطة في تنفيذ الطلبات لفترة قصيرة. نشكر ثقتكم." },
  { id: 'vault', label: "رفع أرباح الخزنة (Vault)", title: "أخبار إيجابية: زيادة نسبة عائد الرصيد الخامل", message: "قررت الإدارة رفع نسبة العائد السنوي (APY) في الخزنة. الآن، أموالك غير المستثمرة تنمو بمعدل أسرع بمجرد بقائها في محفظتك الجارية." },
  { id: 'partnership', label: "توسيع برنامج الشركاء", title: "كن سفيراً لناميكس: رفع عمولات الشبكة", message: "قمنا بتطوير بروتوكول الشراكة ليمنحك عوائد أضخم. ادعُ شركاء جدد واستفد من نظام العمولات المطور الذي يكافئ ريادتك في نمو الشبكة." },
  { id: 'welcome', label: "ترحيب بالمستثمر الجديد", title: "أهلاً بك في النخبة: انطلاق رحلتك مع ناميكس", message: "يسرنا انضمامك لقاعدة مستثمري ناميكس العالمية. محفظتك الآن جاهزة لتفعيل العقود الاستثمارية وبدء توليد العوائد الرقمية بذكاء وأمان." },
  { id: 'withdrawal', label: "تحديث بوابات السحب", title: "إشعار مالي: إضافة قنوات سحب سيولة جديدة", message: "استجابة لطلب المستثمرين، قمنا بإدراج بوابات سحب جديدة تضمن سرعة وصول الأرباح لمحفظتك. تفقد قائمة البوابات في صفحة السحب." },
  { id: 'holiday', label: "تهنئة بمناسبة الأعياد", title: "ناميكس تتمنى لكم أعياداً سعيدة ونمواً دائماً", message: "بمناسبة حلول الأعياد، نتقدم إليكم بأطيب التهاني. نعدكم بمواصلة الابتكار لتطوير أصولكم المالية وتقديم أفضل تجربة استثمارية عالمية." },
  { id: 'summit', label: "دعوة لقمة المستثمرين", title: "دعوة حصرية: ندوة ناميكس للآفاق الاستثمارية القادمة", message: "ندعوكم لحضور جلستنا الرقمية القادمة لمناقشة استراتيجيات النمو في العام الجديد. كن جزءاً من صناع القرار في عالم الاقتصاد الرقمي." },
  { id: 'urgent', label: "تنبيه عاجل", title: "إشعار إداري عاجل من القيادة المركزية", message: "يرجى الانتباه إلى التعليمات الجديدة بخصوص توثيق الحسابات. يتطلب بروتوكول الامتثال إكمال بياناتك لضمان استمرار عمليات السحب دون توقف." },
];

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<TargetType>('all');
  const [channel, setChannel] = useState<BroadcastChannel>('app');
  const [singleUserId, setSingleUserId] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error"
  });

  const db = useFirestore();
  
  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users, isLoading: loadingUsers } = useCollection(usersQuery);

  const logsQuery = useMemoFirebase(() => query(collection(db, "broadcast_logs"), orderBy("createdAt", "desc")), [db]);
  const { data: broadcastLogs, isLoading: loadingLogs } = useCollection(logsQuery);

  const [pendingStats, setPendingStats] = useState({ deposits: 0, withdrawals: 0 });

  useEffect(() => {
    const fetchPendingCounts = async () => {
      const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("status", "==", "pending")));
      const withSnap = await getDocs(query(collection(db, "withdraw_requests"), where("status", "==", "pending")));
      setPendingStats({
        deposits: new Set(depSnap.docs.map(d => d.data().userId)).size,
        withdrawals: new Set(withSnap.docs.map(d => d.data().userId)).size
      });
    };
    fetchPendingCounts();
  }, [db]);

  const targetRecipientCount = useMemo(() => {
    if (!users) return 0;
    if (target === 'all') return users.length;
    if (target === 'single') return singleUserId ? 1 : 0;
    
    if (target === 'new') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return users.filter(u => new Date(u.createdAt) > weekAgo).length;
    }
    if (target === 'active') return users.filter(u => (u.activeInvestmentsTotal || 0) > 0).length;
    if (target === 'inactive') return users.filter(u => (u.activeInvestmentsTotal || 0) === 0).length;
    if (target === 'pending_deposit') return pendingStats.deposits;
    if (target === 'pending_withdraw') return pendingStats.withdrawals;
    
    return 0;
  }, [target, users, singleUserId, pendingStats]);

  const handleApplyTemplate = (templateId: string) => {
    const template = BROADCAST_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        title: template.title,
        message: template.message
      });
    }
  };

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      toast({ variant: "destructive", title: "خطأ في البروتوكول", description: "يرجى تعبئة العنوان والمحتوى لبدء البث." });
      return;
    }

    setLoading(true);
    try {
      let targetUsers: any[] = [];

      if (target === 'single') {
        if (!singleUserId) throw new Error("يرجى تحديد المستهدف الفردي.");
        const userDoc = users?.find(u => u.id === singleUserId);
        if (userDoc) targetUsers = [userDoc];
      } else {
        const snap = await getDocs(collection(db, "users"));
        const allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));

        if (target === 'all') {
          targetUsers = allUsers;
        } else if (target === 'new') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          targetUsers = allUsers.filter(u => new Date(u.createdAt) > weekAgo);
        } else if (target === 'inactive') {
          targetUsers = allUsers.filter(u => (u.activeInvestmentsTotal || 0) === 0);
        } else if (target === 'active') {
          targetUsers = allUsers.filter(u => (u.activeInvestmentsTotal || 0) > 0);
        } else if (target === 'pending_deposit') {
          const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("status", "==", "pending")));
          const uids = Array.from(new Set(depSnap.docs.map(d => d.data().userId)));
          targetUsers = allUsers.filter(u => uids.includes(u.id));
        } else if (target === 'pending_withdraw') {
          const withSnap = await getDocs(query(collection(db, "withdraw_requests"), where("status", "==", "pending")));
          const uids = Array.from(new Set(withSnap.docs.map(d => d.data().userId)));
          targetUsers = allUsers.filter(u => uids.includes(u.id));
        }
      }

      if (targetUsers.length === 0) throw new Error("القاعدة المستهدفة فارغة حالياً.");

      // 1. Log the broadcast session
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target,
        channel,
        recipientCount: targetUsers.length,
        createdAt: new Date().toISOString()
      });

      // 2. Execute Broadcast
      const sendOps = targetUsers.map(async (u) => {
        // App Notification
        if (channel === 'app' || channel === 'both') {
          await addDoc(collection(db, "notifications"), {
            userId: u.id,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
        // Email Notification
        if ((channel === 'email' || channel === 'both') && u.email) {
          await sendBroadcastEmail(u.email, formData.title, formData.message);
        }
      });

      await Promise.all(sendOps);
      
      toast({ title: "اكتمل البث بنجاح", description: `تم بث الرسالة لـ ${targetUsers.length} مستثمر عبر القنوات المختارة.` });
      setFormData({ title: "", message: "", type: "info" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "فشل بروتوكول البث", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const getTargetLabel = (t: string) => {
    switch(t) {
      case 'all': return 'جميع المستثمرين';
      case 'new': return 'المستثمرين الجدد';
      case 'active': return 'النشطين';
      case 'inactive': return 'الخاملين';
      case 'pending_deposit': return 'إيداعات معلقة';
      case 'pending_withdraw': return 'سحوبات معلقة';
      case 'single': return 'مستهدف فردي';
      default: return t;
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-24 font-body">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Sovereign Omni-channel Broadcast Hub
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">مركز البث والاتصال المتعدد</h1>
            <p className="text-muted-foreground font-bold text-xs">إدارة التنبيهات الموجهة وبث الرسائل الإدارية عبر الإشعارات والبريد الإلكتروني.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-full border border-gray-100 shadow-inner">
             <div className="px-6 py-2">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">المستهدفون حالياً</p>
                <p className="text-lg font-black text-blue-600 tabular-nums">{targetRecipientCount} مستثمر</p>
             </div>
             <div className="h-10 w-px bg-gray-200" />
             <Button 
               onClick={() => setIsHistoryOpen(true)}
               variant="ghost" 
               className="h-12 rounded-full text-gray-400 hover:text-[#002d4d] font-black text-[10px] px-6"
             >
                <History className="ml-2 h-4 w-4" /> سجل البث التاريخي
             </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* Main Configuration Panel */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-sm rounded-[56px] overflow-hidden bg-white group transition-all hover:shadow-xl">
              <CardHeader className="bg-gray-50/50 p-10 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-white rounded-[24px] flex items-center justify-center shadow-inner text-blue-600">
                      <Send className="h-7 w-7" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-[#002d4d]">هندسة حملة الإشعارات</CardTitle>
                      <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] px-4 py-1.5 rounded-full shadow-inner tracking-widest">
                        ACTIVE PROTOCOL
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-2xl flex items-center gap-2 border border-gray-100 pr-4">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Wand2 className="h-3 w-3 text-blue-500" /> قوالب جاهزة:
                       </span>
                       <Select onValueChange={handleApplyTemplate}>
                          <SelectTrigger className="h-9 w-48 rounded-xl bg-gray-50 border-none font-black text-[10px] shadow-sm px-4">
                             <SelectValue placeholder="اختر قالباً..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                             {BROADCAST_TEMPLATES.map(t => (
                               <SelectItem key={t.id} value={t.id} className="font-bold text-right py-2.5">
                                  {t.label}
                               </SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">الفئة المستهدفة</Label>
                    <Select value={target} onValueChange={(val: any) => setTarget(val)}>
                      <SelectTrigger className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-sm shadow-inner px-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[28px] border-none shadow-2xl">
                        <SelectItem value="all" className="font-bold py-3"><div className="flex items-center gap-3"><Users className="h-4 w-4" /> جميع المستثمرين</div></SelectItem>
                        <SelectItem value="new" className="font-bold py-3"><div className="flex items-center gap-3"><Sparkles className="h-4 w-4" /> المستثمرين الجدد</div></SelectItem>
                        <SelectItem value="active" className="font-bold py-3"><div className="flex items-center gap-3"><UserCheck className="h-4 w-4" /> المستثمرين النشطين</div></SelectItem>
                        <SelectItem value="inactive" className="font-bold py-3"><div className="flex items-center gap-3"><UserMinus className="h-4 w-4" /> المستثمرين الخاملين</div></SelectItem>
                        <SelectItem value="pending_deposit" className="font-bold py-3"><div className="flex items-center gap-3"><ArrowUpRight className="h-4 w-4" /> إيداعات معلقة</div></SelectItem>
                        <SelectItem value="pending_withdraw" className="font-bold py-3"><div className="flex items-center gap-3"><Wallet className="h-4 w-4" /> سحوبات معلقة</div></SelectItem>
                        <SelectItem value="single" className="font-bold py-3"><div className="flex items-center gap-3"><User className="h-4 w-4" /> مستهدف فردي</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">قناة البث</Label>
                    <Select value={channel} onValueChange={(val: any) => setChannel(val)}>
                      <SelectTrigger className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-sm shadow-inner px-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[28px] border-none shadow-2xl">
                        <SelectItem value="app" className="font-bold py-3"><div className="flex items-center gap-3 text-blue-600"><Bell className="h-4 w-4" /> إشعار التطبيق فقط</div></SelectItem>
                        <SelectItem value="email" className="font-bold py-3"><div className="flex items-center gap-3 text-orange-600"><Mail className="h-4 w-4" /> بريد إلكتروني فقط</div></SelectItem>
                        <SelectItem value="both" className="font-bold py-3"><div className="flex items-center gap-3 text-purple-600"><Globe className="h-4 w-4" /> بث شامل (تطبيق + بريد)</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">بروتوكول الأهمية</Label>
                    <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
                      <SelectTrigger className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-sm shadow-inner px-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[28px] border-none shadow-2xl">
                        <SelectItem value="info" className="font-bold py-3"><div className="flex items-center gap-3 text-blue-600"><Info className="h-4 w-4" /> إرشادي (Standard)</div></SelectItem>
                        <SelectItem value="success" className="font-bold py-3"><div className="flex items-center gap-3 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> إيجابي (Operational)</div></SelectItem>
                        <SelectItem value="warning" className="font-bold py-3"><div className="flex items-center gap-3 text-orange-600"><Zap className="h-4 w-4" /> تحذيري (Alert)</div></SelectItem>
                        <SelectItem value="error" className="font-bold py-3"><div className="flex items-center gap-3 text-red-600"><Target className="h-4 w-4" /> حرج (Emergency)</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {target === 'single' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">اختيار المستهدف الفردي</Label>
                    <Select value={singleUserId} onValueChange={setSingleUserId}>
                      <SelectTrigger className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-sm shadow-inner px-8">
                        <SelectValue placeholder="ابحث عن مستثمر بالاسم أو الرقم..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-[28px] border-none shadow-2xl max-h-[300px]">
                        {users?.map(u => (
                          <SelectItem key={u.id} value={u.id} className="font-bold py-3">
                            {u.displayName} ({u.phoneNumber}) - ID: {u.id?.slice(-6)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">عنوان الرسالة الاستراتيجي</Label>
                  <div className="relative">
                    <Input 
                      placeholder="مثال: تحديث أمني هام لنظام السحب الرقمي" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-base shadow-inner px-10 text-right focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
                    />
                    <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-100" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">محتوى البث المعتمد</Label>
                  <div className="relative">
                    <Textarea 
                      placeholder="اكتب تفاصيل الإشعار بأسلوب ناميكس الرسمي والمباشر..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="min-h-[200px] rounded-[40px] bg-gray-50 border-none font-bold text-sm shadow-inner p-10 leading-loose text-right focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
                    />
                    <MessageSquare className="absolute left-8 bottom-8 h-8 w-8 text-gray-100" />
                  </div>
                </div>

                <Button 
                  onClick={handleSend} 
                  disabled={loading}
                  className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98] group"
                >
                  {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                    <div className="flex items-center gap-4">
                      <span>إطلاق بروتوكول البث اللحظي</span>
                      <Send className="h-6 w-6 text-[#f9a885] rotate-180 transition-transform group-hover:-translate-x-2" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Intelligence & Preview Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Strategy Insight Card */}
            <Card className="border-none shadow-sm rounded-[48px] bg-[#002d4d] text-white overflow-hidden relative group p-10 space-y-8">
               <div className="absolute top-0 left-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                  <Target className="h-48 w-48" />
               </div>
               <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
                  <Zap className="h-8 w-8 text-[#f9a885]" />
               </div>
               <div className="space-y-2 relative z-10">
                  <h3 className="text-2xl font-black">ذكاء البث المتعدد</h3>
                  <p className="text-[13px] text-white/60 leading-[2.2] font-bold">
                    البث عبر البريد الإلكتروني يضمن توثيق القرارات الإدارية، بينما تضمن إشعارات التطبيق التفاعل اللحظي. استخدم "البث الشامل" للمواثيق القانونية والعروض الحصرية.
                  </p>
               </div>
               <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">Resend API Active</span>
                  <div className="flex items-center gap-2">
                     <Mail className="h-3.5 w-3.5 text-orange-400" />
                     <span className="text-[9px] font-black text-orange-400">SMTP Verified</span>
                  </div>
               </div>
            </Card>

            {/* Recipients Analysis Card */}
            <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white group">
              <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                <CardTitle className="text-sm font-black flex items-center gap-3 text-[#002d4d]">
                  <Activity className="h-4 w-4 text-blue-500" />
                  استخبارات القواعد المستهدفة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {[
                  { label: "المستثمرون النشطون", count: users?.filter(u => (u.activeInvestmentsTotal || 0) > 0).length || 0, color: "bg-emerald-500" },
                  { label: "المستثمرون الجدد (7د)", count: users?.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length || 0, color: "bg-blue-500" },
                  { label: "عمليات معلقة", count: pendingStats.deposits + pendingStats.withdrawals, color: "bg-orange-500" },
                  { label: "إجمالي القاعدة السيادية", count: users?.length || 0, color: "bg-[#002d4d]" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md group/stat">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-2.5 w-2.5 rounded-full transition-all group-hover/stat:scale-125", stat.color)} />
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{stat.label}</span>
                    </div>
                    <span className="font-black text-[#002d4d] text-xl tabular-nums">{stat.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live Preview Simulation */}
            <div className="p-10 bg-gray-50/50 rounded-[48px] border border-dashed border-gray-200 space-y-6">
               <div className="flex items-center justify-between px-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Logic Preview</p>
                  <div className="flex items-center gap-2">
                     <Badge className="bg-blue-100 text-blue-600 border-none text-[7px] px-2 py-0.5 rounded-full">{channel.toUpperCase()}</Badge>
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
               </div>
               
               <div className="space-y-4">
                  {/* App Notification Preview */}
                  <div className="p-6 bg-white rounded-[32px] shadow-lg space-y-3 border border-gray-100 scale-95 opacity-80 blur-[0.5px]">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                         "h-8 w-8 rounded-xl flex items-center justify-center shadow-inner",
                         formData.type === 'info' ? "bg-blue-50 text-blue-600" :
                         formData.type === 'success' ? "bg-emerald-50 text-emerald-600" :
                         formData.type === 'warning' ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                       )}>
                          <Bell className="h-4 w-4" />
                       </div>
                       <span className="font-black text-xs text-[#002d4d] truncate">{formData.title || "عنوان الإشعار..."}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed line-clamp-2">{formData.message || "محتوى الرسالة كما سيظهر للمستثمر..."}</p>
                  </div>

                  {/* Email Preview Mock */}
                  {(channel === 'email' || channel === 'both') && (
                    <div className="p-6 bg-[#fcfdfe] rounded-[32px] border border-blue-100 border-dashed space-y-3 animate-in fade-in slide-in-from-top-2">
                       <div className="flex items-center gap-2 border-b border-blue-50 pb-2">
                          <Mail className="h-3 w-3 text-blue-400" />
                          <span className="text-[8px] font-black text-blue-400 uppercase">Resend Template Interface</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-[#002d4d]">{formData.title}</p>
                          <p className="text-[9px] text-gray-400 font-medium leading-relaxed line-clamp-3 italic">"${formData.message}"</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>

        {/* System Branding Footer */}
        <div className="flex flex-col items-center gap-4 pt-10 opacity-20">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.6em]">Communication Protocol v5.0.1</p>
           <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>

      </div>

      {/* Broadcast History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[900px] overflow-hidden font-body text-right" dir="rtl">
          <div className="bg-[#002d4d] p-10 text-white relative shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none">
                <History className="h-40 w-40" />
             </div>
             <div className="flex items-center gap-6 relative z-10">
                <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                   <History className="h-8 w-8 text-[#f9a885]" />
                </div>
                <div className="space-y-0.5">
                   <DialogTitle className="text-2xl font-black">سجل البث التاريخي</DialogTitle>
                   <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Campaign Archive Repository</p>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 bg-white max-h-[60vh] scrollbar-none">
            {loadingLogs ? (
              <div className="py-32 text-center flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning Archive Nodes...</p>
              </div>
            ) : broadcastLogs && broadcastLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                    <TableHead className="pr-10 py-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">عنوان الحملة</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">الفئة المستهدفة</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">القناة</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">المستلمون</TableHead>
                    <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">توقيت الإطلاق</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {broadcastLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50/30 transition-all border-gray-50 group">
                      <TableCell className="pr-10 py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-[16px] flex items-center justify-center shadow-inner",
                            log.type === 'info' ? "bg-blue-50 text-blue-600" :
                            log.type === 'success' ? "bg-emerald-50 text-emerald-600" :
                            log.type === 'warning' ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                          )}>
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-black text-xs text-[#002d4d] block max-w-[200px] truncate">{log.title}</span>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">NODE ID: {log.id.slice(-8).toUpperCase()}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-lg text-[8px] font-black border-blue-50 bg-blue-50/30 text-blue-600 px-2.5 py-1">
                          {getTargetLabel(log.target)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {(log.channel === 'app' || log.channel === 'both') && <Bell className="h-3 w-3 text-blue-400" />}
                          {(log.channel === 'email' || log.channel === 'both') && <Mail className="h-3 w-3 text-orange-400" />}
                          <span className="text-[9px] font-black text-gray-400 uppercase">{log.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Users className="h-3.5 w-3.5 text-gray-300" />
                           <span className="font-black text-xs text-[#002d4d] tabular-nums">{log.recipientCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-right">
                           <span className="text-[10px] text-gray-500 font-bold">{log.createdAt && format(new Date(log.createdAt), "dd MMM yyyy", { locale: ar })}</span>
                           <div className="flex items-center gap-1 justify-end">
                              <Clock className="h-2.5 w-2.5 text-gray-300" />
                              <span className="text-[8px] text-gray-300 font-bold">{log.createdAt && format(new Date(log.createdAt), "HH:mm", { locale: ar })}</span>
                           </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-24 text-center opacity-20 flex flex-col items-center gap-4">
                 <FileText className="h-16 w-16 text-[#002d4d]" />
                 <p className="text-xs font-black uppercase tracking-widest">الأرشيف فارغ حالياً</p>
              </div>
            )}
          </div>

          <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-center shrink-0">
             <Button onClick={() => setIsHistoryOpen(false)} className="px-12 h-14 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95">إغلاق الأرشيف</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
