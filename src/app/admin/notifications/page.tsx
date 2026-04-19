
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
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { 
  Send, 
  Users, 
  User, 
  Bell, 
  Loader2, 
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
  History,
  Target
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";

// المكونات المستقلة المضافة حديثاً
import { EmailTemplateForge } from "@/components/admin/notifications/EmailTemplateForge";
import { BroadcastHistoryLedger } from "@/components/admin/notifications/BroadcastHistoryLedger";

/**
 * @fileOverview مركز إدارة البث والاتصال الإداري v11.0
 * تم دمج نظام القوالب البريدية وسجل البث المستقل لضمان احترافية الإدارة.
 */

type TargetType = 'all' | 'new' | 'inactive' | 'active' | 'pending_withdraw' | 'pending_deposit' | 'single';
type BroadcastChannel = 'app' | 'email' | 'both';

const BROADCAST_TEMPLATES = [
  { id: 'terms', label: "تحديث الشروط والأحكام", title: "تعديل في شروط الاستخدام", message: "نحيطكم علماً بأنه تم إجراء تحديثات على بنود شروط استخدام المنصة. يرجى مراجعة الوثيقة المحدثة في صفحة الشروط والأحكام لضمان الاطلاع على السياسات الجديدة." },
  { id: 'privacy', label: "تعديل سياسة الخصوصية", title: "تحديث سياسة حماية البيانات", message: "التزاماً منا بأعلى معايير الخصوصية، قمنا بتعزيز سياسة حماية البيانات الشخصية. تم تحسين آليات التشفير لضمان سرية حساباتكم واستثماراتكم." },
  { id: 'guide', label: "دليل الاستخدام الشامل", title: "دليل الميزات الجديدة للمنصة", message: "نضع بين يديك دليل الاستخدام المحدث الذي يشرح آليات التداول، إدارة المحفظة، وخطوات السحب والإيداع. ابدأ رحلتك الآن باطلاع كامل على كافة الأدوات المتاحة." },
  { id: 'security', label: "تحديث أمني", title: "تنبيه أمني: تعزيز حماية الحساب", message: "لضمان أمان حسابك، ننصح بتفعيل رمز PIN وتحديث كلمة المرور بشكل دوري. نظام الأمان لدينا يعمل على مدار الساعة لحماية استثماراتك." },
  { id: 'new_plan', label: "إطلاق منتج استثماري", title: "فرصة جديدة: إدراج خطة استثمارية بعائد مرتفع", message: "يسرنا إبلاغكم بإطلاق خطة استثمارية جديدة في قسم الاستثمار. تتميز هذه الخطة بعائد تنافسي ودورة عمل مرنة. يمكنك البدء الآن عبر لوحة التحكم." },
  { id: 'bonus', label: "مكافأة شحن حصرية", title: "عرض خاص: احصل على مكافأة بنسبة 15% على إيداعك القادم", message: "لفترة محدودة، يمكنك الحصول على رصيد إضافي عند شحن محفظتك. سيتم إضافة المكافأة فورياً إلى رصيدك المتاح لدعم نمو استثماراتك." },
];

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<TargetType>('all');
  const [channel, setChannel] = useState<BroadcastChannel>('app');
  const [singleUserId, setSingleUserId] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // بيانات الرسالة
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error"
  });

  // خيارات القالب البريدي
  const [templateOptions, setTemplateOptions] = useState({
    primaryColor: "#002d4d",
    textColor: "#445566",
    buttonText: "",
    buttonLink: "",
    footerText: "هذا البريد مرسل إليك بصفتك مستثمراً مسجلاً في منصة ناميكس."
  });

  const db = useFirestore();
  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users, isLoading: loadingUsers } = useCollection(usersQuery);

  const [pendingStats, setPendingStats] = useState({ deposits: new Set<string>(), withdrawals: new Set<string>() });

  useEffect(() => {
    const fetchPendingData = async () => {
      const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("status", "==", "pending")));
      const withSnap = await getDocs(query(collection(db, "withdraw_requests"), where("status", "==", "pending")));
      setPendingStats({
        deposits: new Set(depSnap.docs.map(d => d.data().userId)),
        withdrawals: new Set(withSnap.docs.map(d => d.data().userId))
      });
    };
    fetchPendingData();
  }, [db]);

  const targetUsersList = useMemo(() => {
    if (!users) return [];
    if (target === 'single') return users.filter(u => u.id === singleUserId);
    if (target === 'all') return users;
    
    if (target === 'new') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return users.filter(u => new Date(u.createdAt) > weekAgo);
    }
    
    if (target === 'active') return users.filter(u => (u.activeInvestmentsTotal || 0) > 0);
    if (target === 'inactive') return users.filter(u => (u.activeInvestmentsTotal || 0) === 0);
    if (target === 'pending_deposit') return users.filter(u => pendingStats.deposits.has(u.id));
    if (target === 'pending_withdraw') return users.filter(u => pendingStats.withdrawals.has(u.id));
    
    return [];
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
      toast({ variant: "destructive", title: "خطأ", description: "يرجى تعبئة العنوان والمحتوى لبدء الإرسال." });
      return;
    }

    if (targetUsersList.length === 0) {
      toast({ variant: "destructive", title: "خطأ", description: "لا يوجد مستخدمون مستهدفون في هذه الفئة." });
      return;
    }

    setLoading(true);
    try {
      // 1. توثيق جلسة البث في سجلات النظام
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target,
        channel,
        recipientCount: targetUsersList.length,
        templateOptions: channel !== 'app' ? templateOptions : null,
        createdAt: new Date().toISOString()
      });

      // 2. محرك البث المتوازي (Parallel Broadcast Engine)
      const sendOps = targetUsersList.map(async (u) => {
        // قناة إشعارات التطبيق
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
        
        // قناة البريد الإلكتروني
        if ((channel === 'email' || channel === 'both') && u.email) {
          await sendBroadcastEmail(u.email, formData.title, formData.message, templateOptions);
        }
      });

      await Promise.all(sendOps);
      
      toast({ title: "اكتمل الإرسال بنجاح", description: `تم بث الرسالة لـ ${targetUsersList.length} مستخدم عبر القنوات المختارة.` });
      setFormData({ title: "", message: "", type: "info" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "فشل الإرسال", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell isAdmin>
      <div className="max-w-[1600px] mx-auto space-y-10 px-6 pt-10 pb-24 font-body">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Messaging Control Hub
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">مركز البث والاتصال</h1>
            <p className="text-muted-foreground font-bold text-xs">إرسال التنبيهات الموجهة عبر المحفظة والبريد الإلكتروني بهوية مخصصة.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50/50 p-2 rounded-full border border-gray-100 shadow-inner">
             <div className="px-6 py-2">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">المستهدفون حالياً</p>
                <p className="text-lg font-black text-blue-600 tabular-nums">{targetUsersList.length} مستخدم</p>
             </div>
             <div className="h-10 w-px bg-gray-200" />
             <Button 
               onClick={() => setIsHistoryOpen(true)}
               variant="ghost" 
               className="h-12 rounded-full text-gray-400 hover:text-[#002d4d] font-black text-[10px] px-6"
             >
                <History className="ml-2 h-4 w-4" /> سجل البث
             </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-sm rounded-[56px] overflow-hidden bg-white group transition-all hover:shadow-xl">
              <CardHeader className="bg-gray-50/50 p-10 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-white rounded-[24px] flex items-center justify-center shadow-inner text-blue-600">
                      <Send className="h-7 w-7" />
                    </div>
                    <div className="text-right">
                      <CardTitle className="text-xl font-black text-[#002d4d]">إعداد حملة الإشعارات</CardTitle>
                      <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] px-4 py-1.5 rounded-full shadow-inner tracking-widest">
                         READY FOR BROADCAST
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
                      <SelectContent className="rounded-[28px] border-none shadow-2xl text-right" dir="rtl">
                        <SelectItem value="all" className="font-bold py-3"><div className="flex items-center gap-3"><Users className="h-4 w-4" /> جميع المستخدمين</div></SelectItem>
                        <SelectItem value="new" className="font-bold py-3"><div className="flex items-center gap-3"><Sparkles className="h-4 w-4" /> المستخدمين الجدد</div></SelectItem>
                        <SelectItem value="active" className="font-bold py-3"><div className="flex items-center gap-3"><UserCheck className="h-4 w-4" /> المستخدمين النشطين</div></SelectItem>
                        <SelectItem value="inactive" className="font-bold py-3"><div className="flex items-center gap-3"><UserMinus className="h-4 w-4" /> المستخدمين الخاملين</div></SelectItem>
                        <SelectItem value="pending_deposit" className="font-bold py-3"><div className="flex items-center gap-3"><ArrowUpRight className="h-4 w-4" /> إيداعات معلقة</div></SelectItem>
                        <SelectItem value="pending_withdraw" className="font-bold py-3"><div className="flex items-center gap-3"><Wallet className="h-4 w-4" /> سحوبات معلقة</div></SelectItem>
                        <SelectItem value="single" className="font-bold py-3"><div className="flex items-center gap-3"><User className="h-4 w-4" /> مستخدم فردي</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">قناة الإرسال</Label>
                    <Select value={channel} onValueChange={(val: any) => setChannel(val)}>
                      <SelectTrigger className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-sm shadow-inner px-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[28px] border-none shadow-2xl text-right" dir="rtl">
                        <SelectItem value="app" className="font-bold py-3"><div className="flex items-center gap-3 text-blue-600"><Bell className="h-4 w-4" /> إشعار التطبيق فقط</div></SelectItem>
                        <SelectItem value="email" className="font-bold py-3"><div className="flex items-center gap-3 text-orange-600"><Mail className="h-4 w-4" /> بريد إلكتروني فقط</div></SelectItem>
                        <SelectItem value="both" className="font-bold py-3"><div className="flex items-center gap-3 text-purple-600"><Globe className="h-4 w-4" /> إرسال شامل (تطبيق + بريد)</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">مستوى الأهمية</Label>
                    <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
                      <SelectTrigger className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-sm shadow-inner px-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[28px] border-none shadow-2xl text-right" dir="rtl">
                        <SelectItem value="info" className="font-bold py-3"><div className="flex items-center gap-3 text-blue-600"><Info className="h-4 w-4" /> إرشادي</div></SelectItem>
                        <SelectItem value="success" className="font-bold py-3"><div className="flex items-center gap-3 text-emerald-600"><CheckCircle2 className="h-4 w-4" /> إيجابي</div></SelectItem>
                        <SelectItem value="warning" className="font-bold py-3"><div className="flex items-center gap-3 text-orange-600"><Zap className="h-4 w-4" /> تحذيري</div></SelectItem>
                        <SelectItem value="error" className="font-bold py-3"><div className="flex items-center gap-3 text-red-600"><Target className="h-4 w-4" /> حرج</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {target === 'single' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">اختيار المستخدم</Label>
                    <Select value={singleUserId} onValueChange={setSingleUserId}>
                      <SelectTrigger className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-sm shadow-inner px-8">
                        <SelectValue placeholder="ابحث بالاسم أو الرقم..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-[28px] border-none shadow-2xl max-h-[300px] text-right" dir="rtl">
                        {users?.map(u => (
                          <SelectItem key={u.id} value={u.id} className="font-bold py-3 text-right">
                            {u.displayName} ({u.phoneNumber}) - ID: {u.id?.slice(-6)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">عنوان الرسالة</Label>
                  <div className="relative">
                    <Input 
                      placeholder="مثال: تحديث هام لنظام السحب" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-base shadow-inner px-10 text-right focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
                    />
                    <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-100" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-black text-[11px] text-[#002d4d] pr-4 uppercase tracking-widest">محتوى الرسالة</Label>
                  <div className="relative">
                    <Textarea 
                      placeholder="اكتب تفاصيل الإشعار بأسلوب رسمي ومباشر..."
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
                  className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group"
                >
                  {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                    <div className="flex items-center gap-4">
                      <span>إرسال الإشعارات الآن</span>
                      <Send className="h-6 w-6 text-[#f9a885] rotate-180 transition-transform group-hover:-translate-x-2" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* مفاعل تخصيص القوالب البريدية - يظهر فقط عند اختيار قناة البريد */}
            {(channel === 'email' || channel === 'both') && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <EmailTemplateForge 
                  options={templateOptions}
                  onChange={setTemplateOptions}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-10">
            <Card className="border-none shadow-sm rounded-[48px] bg-[#002d4d] text-white overflow-hidden relative group p-10 space-y-8 text-right">
               <div className="absolute top-0 left-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                  <Target className="h-48 w-48" />
               </div>
               <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:bg-white/20 transition-all mr-auto md:mr-0">
                  <Zap className="h-8 w-8 text-[#f9a885]" />
               </div>
               <div className="space-y-2 relative z-10">
                  <h3 className="text-2xl font-black">حوكمة البث</h3>
                  <p className="text-[13px] text-white/60 leading-[2.2] font-bold">
                    الإرسال عبر البريد الإلكتروني يضمن توثيق القرارات الإدارية، بينما تضمن إشعارات التطبيق التفاعل اللحظي. يستخدم نظامنا بروتوكول Resend لضمان وصول الرسائل للعلبة الواردة.
                  </p>
               </div>
               <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">Resend SMTP Logic</span>
                  <div className="flex items-center gap-2">
                     <Mail className="h-3.5 w-3.5 text-orange-400" />
                     <span className="text-[9px] font-black text-orange-400">Node Verified</span>
                  </div>
               </div>
            </Card>

            <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white group text-right">
              <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                <CardTitle className="text-sm font-black flex items-center gap-3 text-[#002d4d] justify-end">
                  إحصائيات الفئة المختارة
                  <Activity className="h-4 w-4 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {[
                  { label: "المستهدفون حالياً", count: targetUsersList.length, color: "bg-blue-500" },
                  { label: "يمتلكون بريداً مسجلاً", count: targetUsersList.filter(u => !!u.email).length, color: "bg-emerald-500" },
                  { label: "إجمالي القاعدة", count: users?.length || 0, color: "bg-[#002d4d]" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md group/stat">
                    <span className="font-black text-[#002d4d] text-xl tabular-nums">{stat.count}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{stat.label}</span>
                      <div className={cn("h-2.5 w-2.5 rounded-full", stat.color)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BroadcastHistoryLedger 
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </Shell>
  );
}
