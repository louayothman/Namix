
"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerPortal,
  DrawerOverlay
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { 
  ChevronUp, 
  ChevronLeft,
  Sparkles,
  Loader2,
  Layers,
  Zap,
  Wallet,
  Cpu,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WithdrawSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenDeposit?: () => void;
}

const NamixDotsIcon = () => (
  <div className="grid grid-cols-2 gap-1 scale-110">
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
  </div>
);

export function WithdrawSheet({ open, onOpenChange, onOpenDeposit }: WithdrawSheetProps) {
  const router = useRouter();
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [checkingRules, setCheckingRules] = useState(true);
  const [ruleError, setRuleError] = useState<{ message: string, title: string, icon: any, action?: 'setup-pin' | 'setup-profile' | 'deposit' } | null>(null);

  const categoriesQuery = useMemoFirebase(() => query(collection(db, "withdraw_methods"), where("isActive", "==", true)), [db]);
  const { data: categories, isLoading: loadingCats } = useCollection(categoriesQuery);

  const rulesRef = useMemoFirebase(() => doc(db, "system_settings", "withdrawal_rules"), [db]);
  const { data: rules } = useDoc(rulesRef);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session && open) {
      const parsed = JSON.parse(session);
      const userRef = doc(db, "users", parsed.id);
      const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) setDbUser({ ...snap.data(), id: snap.id });
      });
      return () => unsub();
    }
  }, [open, db]);

  useEffect(() => {
    if (open && dbUser && rules) checkRules(dbUser.id);
  }, [open, dbUser, rules]);

  const checkRules = async (userId: string) => {
    setCheckingRules(true);
    setRuleError(null);
    try {
      const u = dbUser;
      
      if (!u?.securityPin) { 
        setRuleError({ title: "تأمين الحساب مطلوب", message: "لإتمام عمليات السحب، يتطلب النظام وجود رمز PIN نشط لتأمين محفظتك الشخصية.", icon: Lock, action: 'setup-pin' }); 
        return; 
      }

      if (rules?.requireVerificationToWithdraw && !u?.isVerified) {
        setRuleError({ title: "توثيق الهوية الرقمية", message: "يرجى استكمال بيانات هويتك وتوثيق الحساب لتفعيل محرك الصرف اللحظي.", icon: ShieldCheck, action: 'setup-profile' });
        return;
      }

      const bonusAmount = u?.welcomeBonus || 0;
      const currentBalance = u?.totalBalance || 0;
      const withdrawableMax = Math.max(0, currentBalance - bonusAmount);

      if (currentBalance < (rules?.minAccountBalance || 0)) { 
        setRuleError({ title: "تعزيز الملاءة المالية", message: `الرصيد الحالي ($${currentBalance.toLocaleString()}) دون الحد الأدنى المطلوب للبقاء في الحساب لضمان استقرار العمليات.`, icon: Wallet, action: 'deposit' }); 
        return; 
      }

      if (withdrawableMax < (rules?.minWithdrawalAmount || 10)) {
        setRuleError({ 
          title: "حماية رأس المال التشغيلي", 
          message: `عذراً، الرصيد الممنوح كحوافز ترحيبية ($${bonusAmount}) مخصص حصراً لعمليات الاستثمار والنمو. يمكنك سحب الأرباح المحققة أو مبالغ الإيداع الشخصي بمجرد تجاوزها الحد الأدنى المسموح به.`, 
          icon: ShieldAlert, 
          action: 'deposit' 
        });
        return;
      }

      const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("userId", "==", userId), where("status", "==", "approved")));
      const totalDeposited = depSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
      if (totalDeposited < (rules?.minTotalDeposits || 0)) {
        setRuleError({ 
          title: "توثيق محفظة الاستلام", 
          message: `لغايات أمنية ومنعاً لعمليات الاحتيال، يتطلب النظام إجراء عملية إيداع توثيقية واحدة على الأقل ( Verification Deposit ) بقيمة $${rules?.minTotalDeposits} لربط عنوان محفظتك بنظام ناميكس المعتمد وتنشيط بوابة الخروج.`, 
          icon: ArrowUpRight, 
          action: 'deposit' 
        });
        return;
      }

    } catch (e) {
      console.error(e);
    } finally {
      setCheckingRules(false);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    onOpenChange(false);
    router.push(`/withdraw/${categoryId}`);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { 
      setRuleError(null);
    }, 300);
  };

  const handleActionClick = () => {
    if (!ruleError) return;
    const action = ruleError.action;
    handleClose();

    if (action === 'deposit') {
      if (onOpenDeposit) onOpenDeposit();
      else router.push('/home');
    } else if (action === 'setup-pin' || action === 'setup-profile') {
      router.push('/settings');
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 h-[80vh] outline-none flex flex-col bg-white rounded-t-[44px] border-none shadow-2xl z-[1001] font-body" dir="rtl">
          
          <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-4">
            <div className="flex items-center gap-4 text-right">
               <div className="h-11 w-11 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl">
                  <ChevronUp size={28} strokeWidth={3} />
               </div>
               <div className="space-y-0">
                 <DrawerTitle className="text-xl font-black text-[#002d4d]">إرسال الأموال</DrawerTitle>
                 <p className="text-gray-400 font-black text-[8px] uppercase tracking-widest mt-1">Capital Outflow Gateway</p>
               </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none">
            {checkingRules || loadingCats ? (
              <div className="h-full flex flex-col items-center justify-center py-20 gap-6">
                 <Loader2 className="h-10 w-10 animate-spin text-[#002d4d] opacity-20" />
                 <p className="text-[10px] font-black text-gray-300 uppercase animate-pulse">فحص بروتوكولات الأمان...</p>
              </div>
            ) : ruleError ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right">
                <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-orange-500">
                       {ruleError.icon && <ruleError.icon size={28} />}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-lg font-black text-[#002d4d] leading-none">{ruleError.title}</h4>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">إجراء أمان مطلوب</p>
                    </div>
                  </div>
                  <p className="text-[12px] font-bold leading-[2.2] text-gray-500 pr-2">{ruleError.message}</p>
                </div>

                <div className="flex flex-col gap-3">
                   {ruleError.action && (
                     <Button 
                       onClick={handleActionClick} 
                       className="h-16 rounded-full bg-[#002d4d] text-[#f9a885] font-black text-base shadow-xl active:scale-95 transition-all"
                     >
                        استكمال المتطلبات الآن
                     </Button>
                   )}
                   <button onClick={handleClose} className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-[#002d4d] transition-colors py-4">إغلاق النافذة</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-base font-black text-[#002d4d]">حدد مسار الصرف</h3>
                   <Badge variant="outline" className="bg-orange-50 text-orange-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">Outflow Channels</Badge>
                </div>

                <div className="grid gap-4">
                  {categories?.map((cat) => (
                    <button 
                      key={cat.id} 
                      onClick={() => handleSelectCategory(cat.id)} 
                      className="w-full p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center gap-6 text-right group active:scale-[0.99] relative overflow-hidden"
                    >
                      <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner transition-all shrink-0">
                        {cat.type === 'binance' ? <Cpu size={28} className="text-[#002d4d]" /> : 
                         cat.type === 'nowpayments' ? <Zap size={28} className="text-[#002d4d]" /> :
                         cat.type === 'internal' ? <NamixDotsIcon /> :
                         <Wallet size={28} className="text-[#002d4d]" />}
                      </div>
                      <div className="flex-1 space-y-1">
                         <p className="font-black text-base text-[#002d4d] group-hover:text-blue-600 transition-colors">{cat.name}</p>
                         <p className="text-[10px] font-bold text-gray-400 leading-relaxed line-clamp-2">{cat.description || "استخدم هذا المسار لسحب رصيدك بذكاء وأمان."}</p>
                      </div>
                      <ChevronLeft className="h-5 w-5 text-gray-200 group-hover:text-[#002d4d] transition-all shrink-0 rotate-180" />
                    </button>
                  ))}
                  
                  {categories?.length === 0 && (
                    <div className="py-20 text-center opacity-20 border-2 border-dashed border-gray-100 rounded-[48px] flex flex-col items-center gap-4">
                       <Layers size={40} />
                       <p className="text-[10px] font-black uppercase">لا توجد مسارات صرف نشطة</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
